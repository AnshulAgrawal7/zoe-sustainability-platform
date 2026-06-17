// Minimal structured (JSON-line) logger — no external dependency (Future_Work
// §3.6). Each call emits one JSON object so logs are machine-parseable by a host
// log drain. Silenced under NODE_ENV=test to keep the test output clean.
type Level = 'info' | 'warn' | 'error';

const SILENT = process.env['NODE_ENV'] === 'test';

function emit(level: Level, msg: string, fields?: Record<string, unknown>): void {
  if (SILENT) return;
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    msg,
    ...fields,
  });
  // Errors/warnings to stderr, info to stdout (12-factor friendly).
  if (level === 'info') process.stdout.write(line + '\n');
  else process.stderr.write(line + '\n');
}

export const logger = {
  info: (msg: string, fields?: Record<string, unknown>) => emit('info', msg, fields),
  warn: (msg: string, fields?: Record<string, unknown>) => emit('warn', msg, fields),
  error: (msg: string, fields?: Record<string, unknown>) => emit('error', msg, fields),
};
