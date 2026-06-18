// Transactional e-mail abstraction (Future_Work §7.1).
//
// The platform has NO external mail provider yet (a community decision + a
// provider account with DKIM/SPF is required — see Future_Work §7, 👤). To make
// every mail-dependent flow (password reset 2.1, e-mail verification 2.2, status
// updates to anonymous submitters 7.2, RSVP confirmation 7.3) fully buildable and
// testable WITHOUT that account, all mail goes through this thin transport layer:
//
//   - console transport  (default): logs the message — including any action link
//     — as a structured log line instead of sending. Lets an operator copy the
//     reset/verify link from the logs during a demo, and makes the wiring
//     observable end-to-end.
//   - memory transport   (NODE_ENV=test): captures messages in an array so the
//     integration tests can assert what *would* have been sent.
//   - noop transport      (MAIL_TRANSPORT=noop): drops everything silently.
//
// To go live the municipality only adds a real provider transport here (e.g.
// Postmark/SES/Brevo via SMTP) selected by MAIL_TRANSPORT=smtp + credentials —
// no call site changes. That single seam is the entire §7.1 integration point.

import { logger } from '../utils/logger';

export interface OutgoingMail {
  to: string;
  subject: string;
  text: string;
  /** Optional HTML alternative. The stub transports only need `text`. */
  html?: string;
  /** Machine-readable category for logs/metrics (e.g. "password-reset"). */
  kind?: string;
}

export interface MailTransport {
  readonly name: string;
  send(mail: OutgoingMail): Promise<void>;
}

// --- Transports ------------------------------------------------------------

const consoleTransport: MailTransport = {
  name: 'console',
  async send(mail) {
    // Deliberately log the full body so the action link is recoverable from the
    // host log drain while there is no real provider. Never logs a password.
    logger.info('mail.dispatch (stub: not actually sent)', {
      transport: 'console',
      to: mail.to,
      kind: mail.kind,
      subject: mail.subject,
      body: mail.text,
    });
  },
};

const noopTransport: MailTransport = {
  name: 'noop',
  async send() {
    /* intentionally drops the message */
  },
};

// In-memory transport for the test suite. Not used outside NODE_ENV=test.
const sent: OutgoingMail[] = [];
const memoryTransport: MailTransport = {
  name: 'memory',
  async send(mail) {
    sent.push(mail);
  },
};

/** Test helper: every message captured by the memory transport, oldest first. */
export function getSentMails(): readonly OutgoingMail[] {
  return sent;
}

/** Test helper: clear the captured-mail buffer (call in a test `beforeEach`). */
export function clearSentMails(): void {
  sent.length = 0;
}

function selectTransport(): MailTransport {
  const configured = (process.env['MAIL_TRANSPORT'] || '').toLowerCase();
  if (configured === 'noop') return noopTransport;
  if (configured === 'memory') return memoryTransport;
  if (process.env['NODE_ENV'] === 'test') return memoryTransport;
  // Default while no provider is wired: log instead of send. A future `smtp`
  // (or provider) transport plugs in right here, gated on MAIL_TRANSPORT.
  return consoleTransport;
}

let transport = selectTransport();

/** Test helper: re-evaluate the transport after mutating env (rarely needed). */
export function resetTransport(): void {
  transport = selectTransport();
}

// --- Link/base-url helpers -------------------------------------------------

/**
 * Public base URL of the frontend, used to build action links in e-mails.
 * Falls back to the configured CORS origin, then localhost for dev.
 */
export function appBaseUrl(): string {
  const base =
    process.env['APP_BASE_URL'] ||
    process.env['CORS_ORIGIN'] ||
    'http://localhost:5173';
  return base.replace(/\/+$/, '');
}

// --- Low-level send --------------------------------------------------------

/**
 * Send (or stub-send) a message. Best-effort by default: a transport failure is
 * logged but never thrown, so a mail hiccup cannot break the user-facing request
 * (e.g. a status change still succeeds even if the notification mail fails).
 */
export async function sendMail(mail: OutgoingMail): Promise<void> {
  try {
    await transport.send(mail);
  } catch (err) {
    logger.error('mail.dispatch failed', {
      transport: transport.name,
      kind: mail.kind,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// --- High-level templates --------------------------------------------------
// Plain-text, locale-agnostic-but-friendly bodies. Kept intentionally simple
// (no HTML templating dependency); a real provider integration can enrich these.

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const link = `${appBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  await sendMail({
    to,
    kind: 'password-reset',
    subject: 'Reset your ZOE password',
    text:
      `We received a request to reset the password for your ZOE account.\n\n` +
      `Reset your password here (valid for 60 minutes):\n${link}\n\n` +
      `If you did not request this, you can safely ignore this e-mail.`,
  });
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const link = `${appBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  await sendMail({
    to,
    kind: 'email-verification',
    subject: 'Confirm your ZOE e-mail address',
    text:
      `Welcome to ZOE! Please confirm your e-mail address to finish setting up your account.\n\n` +
      `Confirm here (valid for 24 hours):\n${link}\n\n` +
      `If you did not create a ZOE account, you can ignore this e-mail.`,
  });
}

interface SubmissionStatusMail {
  to: string;
  /** Human label of what was reviewed, e.g. "idea", "report", "event proposal". */
  kindLabel: string;
  title: string;
  status: string;
  note?: string | null;
}

export async function sendSubmissionStatusEmail(input: SubmissionStatusMail): Promise<void> {
  const noteLine = input.note?.trim()
    ? `\nNote from the team:\n${input.note.trim()}\n`
    : '';
  await sendMail({
    to: input.to,
    kind: 'submission-status',
    subject: `Update on your ${input.kindLabel}: ${input.title}`,
    text:
      `The status of your ${input.kindLabel} "${input.title}" was updated to: ${input.status}.\n` +
      noteLine +
      `\nThank you for contributing to ZOE — Gemeinde Nord-Korfu.`,
  });
}

interface RsvpConfirmationMail {
  to: string;
  name?: string | null;
  eventTitle: string;
  eventDate: Date;
  location?: string | null;
}

export async function sendRsvpConfirmationEmail(input: RsvpConfirmationMail): Promise<void> {
  const greeting = input.name?.trim() ? `Hi ${input.name.trim()},\n\n` : '';
  const when = input.eventDate.toISOString().slice(0, 16).replace('T', ' ');
  const where = input.location?.trim() ? `\nLocation: ${input.location.trim()}` : '';
  await sendMail({
    to: input.to,
    kind: 'rsvp-confirmation',
    subject: `You're registered: ${input.eventTitle}`,
    text:
      `${greeting}Your registration for "${input.eventTitle}" is confirmed.\n` +
      `When: ${when} (UTC)${where}\n\n` +
      `See you there! — ZOE, Gemeinde Nord-Korfu.`,
  });
}
