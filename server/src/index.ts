import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import prisma from './prisma';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import uploadRoutes from './routes/upload';
import healthRoutes from './routes/health';
import contactsRoutes from './routes/contacts';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const uploadsPath = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'));
fs.mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));

const VALID_PROJECT_ID = /^[a-zA-Z0-9_-]{1,64}$/;

app.use('/preview/:projectId', (req, res, next) => {
  const projectId = req.params.projectId;
  if (!VALID_PROJECT_ID.test(projectId)) {
    res.status(400).json({ error: 'Invalid project ID' });
    return;
  }
  const resolvedDir = path.resolve(uploadsPath, 'bundles', projectId);
  const bundleRoot = path.resolve(uploadsPath, 'bundles');
  if (!resolvedDir.startsWith(bundleRoot + path.sep) && resolvedDir !== bundleRoot) {
    res.status(400).json({ error: 'Path traversal blocked' });
    return;
  }
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  express.static(resolvedDir, {
    index: 'index.html',
    dotfiles: 'deny',
  })(req, res, next);
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contacts', contactsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint не найден' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
}

function shutdown() {
  console.log('Shutting down...');
  prisma.$disconnect().then(() => process.exit(0));
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

main();