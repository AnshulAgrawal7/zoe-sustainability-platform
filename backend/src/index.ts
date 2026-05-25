import app from './app';

const PORT = process.env['PORT'] || 3001;

app.listen(PORT, () => {
  console.log(`ZOE Backend running on http://localhost:${PORT}`);
});
