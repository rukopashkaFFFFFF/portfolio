import { Router } from 'express';
import { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { upload, uploadBundle } from '../utils/upload';
import prisma from '../prisma';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import rateLimit from 'express-rate-limit';

const router = Router();

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Слишком много загрузок. Попробуйте позже.' },
});

const MAX_BUNDLE_ENTRIES = 2000;
const MAX_BUNDLE_FILE_SIZE = 10 * 1024 * 1024;
const uploadsRoot = path.resolve(process.env.UPLOAD_DIR || '../uploads');

function isValidProjectId(id: unknown): id is string {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(id);
}

router.post('/', authMiddleware, uploadLimiter, (req: Request, res: Response): void => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка загрузки';
      res.status(400).json({ error: msg });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Файл не выбран' });
      return;
    }

    res.json({
      url: `/uploads/${req.file.filename}`,
      path: req.file.path,
      originalName: req.file.originalname,
    });
  });
});

router.post('/bundle', authMiddleware, uploadLimiter, (req: Request, res: Response): void => {
  uploadBundle.single('bundle')(req, res, (err) => {
    if (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка загрузки';
      res.status(400).json({ error: msg });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Архив не выбран' });
      return;
    }

    const { projectId } = req.body;
    if (!isValidProjectId(projectId)) {
      safeDelete(req.file.path);
      res.status(400).json({ error: 'Некорректный projectId' });
      return;
    }

    const tempPath = req.file.path;
    try {
      const zip = new AdmZip(tempPath);
      const entries = zip.getEntries();

      if (entries.length > MAX_BUNDLE_ENTRIES) {
        safeDelete(tempPath);
        res.status(400).json({ error: `Максимум ${MAX_BUNDLE_ENTRIES} файлов в архиве` });
        return;
      }

      const extractDir = path.resolve(uploadsRoot, 'bundles', projectId);
      const bundleRoot = path.resolve(uploadsRoot, 'bundles');

      if (!extractDir.startsWith(bundleRoot + path.sep) && extractDir !== bundleRoot) {
        safeDelete(tempPath);
        res.status(400).json({ error: 'Path traversal blocked' });
        return;
      }

      for (const entry of entries) {
        const resolved = path.resolve(extractDir, entry.entryName);
        if (!resolved.startsWith(bundleRoot + path.sep) && resolved !== bundleRoot) {
          safeDelete(tempPath);
          res.status(400).json({ error: 'Обнаружен path traversal в архиве' });
          return;
        }
        if (entry.header.size > MAX_BUNDLE_FILE_SIZE) {
          safeDelete(tempPath);
          res.status(400).json({ error: `Файл превышает лимит ${MAX_BUNDLE_FILE_SIZE / 1024 / 1024}MB: ${entry.entryName}` });
          return;
        }
      }

      try { fs.rmSync(extractDir, { recursive: true, force: true }); } catch { /* ok */ }
      zip.extractAllTo(extractDir, true);

      prisma.project.update({
        where: { id: projectId },
        data: { staticBundlePath: `bundles/${projectId}` },
      }).catch(() => { /* update best-effort */ });

      safeDelete(tempPath);

      res.json({
        message: 'Архив распакован',
        bundlePath: `bundles/${projectId}`,
      });
    } catch (zipErr) {
      safeDelete(tempPath);
      res.status(400).json({
        error: 'Ошибка распаковки архива. Убедитесь, что это корректный ZIP-файл.',
      });
    }
  });
});

function safeDelete(filePath: string) {
  try { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch { /* ignore */ }
}

export default router;