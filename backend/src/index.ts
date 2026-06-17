import app from './app';
import { logger } from './utils/logger';

const PORT = process.env['PORT'] || 3001;

app.listen(PORT, () => {
  logger.info('server.start', { port: Number(PORT) });
});
