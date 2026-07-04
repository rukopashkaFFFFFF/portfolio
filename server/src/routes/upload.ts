import { Router } from 'express';
import { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../utils/upload';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const router = Router();

router.post('/', authMiddleware, (req: Request, res: Response): void => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки';
      res.status(400).json({ error: message });
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

router.post('/bundle', authMiddleware, (req: Request, res: Response): void => {
  upload.single('bundle')(req, res, (err) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки';
      res.status(400).json({ error: message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Архив не выбран' });
      return;
    }

    const { projectId } = req.body;
    if (!projectId) {
      res.status(400).json({ error: 'Требуется projectId' });
      return;
    }

    try {
      const zip = new AdmZip(req.file.path);
      const extractDir = path.resolve(process.env.UPLOAD_DIR || '../uploads', 'bundles', projectId);

      if (fs.existsSync(extractDir)) {
        fs.rmSync(extractDir, { recursive: true });
      }

      const entries = zip.getEntries();
      for (const entry of entries) {
        const sanitized = path.normalize(entry.entryName).replace(/^(\.\.(\/|\\))+/g, '');
        if (sanitized.startsWith('..')) {
          res.status(400).json({ error: 'Обнаружен path traversal в архиве' });
          return;
        }
      }

      zip.extractAllTo(extractDir, true);
      fs.unlinkSync(req.file.path);

      res.json({
        message: 'Архив распакован',
        bundlePath: `bundles/${projectId}`,
      });
    } catch (zipErr) {
      res.status(400).json({
        error: 'Ошибка распаковки архива. Убедитесь, что это корректный ZIP-файл.',
      });
    }
  });
});

export default router;
