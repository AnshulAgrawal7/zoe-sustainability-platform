import { describe, it, expect, beforeEach } from 'vitest';
import {
  sendMail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendSubmissionStatusEmail,
  sendRsvpConfirmationEmail,
  getSentMails,
  clearSentMails,
  appBaseUrl,
} from '../services/mailService';

// Under NODE_ENV=test the memory transport is active, so every send is captured.
describe('mailService (memory transport)', () => {
  beforeEach(() => clearSentMails());

  it('captures a raw message', async () => {
    await sendMail({ to: 'a@b.gr', subject: 'Hi', text: 'body', kind: 'test' });
    const mails = getSentMails();
    expect(mails).toHaveLength(1);
    expect(mails[0]?.to).toBe('a@b.gr');
    expect(mails[0]?.kind).toBe('test');
  });

  it('builds a password-reset link with the token', async () => {
    await sendPasswordResetEmail('user@example.com', 'tok-123');
    const mail = getSentMails()[0];
    expect(mail?.kind).toBe('password-reset');
    expect(mail?.text).toContain(`${appBaseUrl()}/reset-password?token=tok-123`);
  });

  it('builds a verification link with the token', async () => {
    await sendVerificationEmail('user@example.com', 'vtok');
    const mail = getSentMails()[0];
    expect(mail?.kind).toBe('email-verification');
    expect(mail?.text).toContain(`/verify-email?token=vtok`);
  });

  it('includes the admin note in a status mail when present', async () => {
    await sendSubmissionStatusEmail({
      to: 'anon@example.com',
      kindLabel: 'idea',
      title: 'More bike lanes',
      status: 'ACCEPTED',
      note: 'Great suggestion!',
    });
    const mail = getSentMails()[0];
    expect(mail?.subject).toContain('More bike lanes');
    expect(mail?.text).toContain('ACCEPTED');
    expect(mail?.text).toContain('Great suggestion!');
  });

  it('confirms an RSVP with event details', async () => {
    await sendRsvpConfirmationEmail({
      to: 'guest@example.com',
      name: 'Maria',
      eventTitle: 'Beach Cleanup',
      eventDate: new Date('2026-07-12T09:00:00Z'),
      location: 'Sidari',
    });
    const mail = getSentMails()[0];
    expect(mail?.kind).toBe('rsvp-confirmation');
    expect(mail?.text).toContain('Beach Cleanup');
    expect(mail?.text).toContain('Sidari');
    expect(mail?.text).toContain('Hi Maria');
  });
});
