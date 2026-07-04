import { Request, Response } from 'express';
import prisma from '../prisma';
import { PreviewType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const ALLOWED_CATEGORIES = ['ecommerce', 'landing', 'crm', 'corporate'];
const MAX_TITLE = 200;
const MAX_DESC = 2000;
const MAX_TAGS = 20;

const uploadsDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'));

type BodyRecord = Record<string, unknown>;

function cleanUploadPath(url: string): string {
  return url.replace(/^\/uploads\//, '');
}

function safeFileDelete(filePath: string) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch { /* ignore */ }
}

function validateAndSanitize(body: BodyRecord) {
  const title = typeof body.title === 'string' ? body.title.slice(0, MAX_TITLE).trim() : '';
  const description = typeof body.description === 'string' ? body.description.slice(0, MAX_DESC).trim() : '';
  const category = typeof body.category === 'string' ? body.category.trim().toLowerCase() : '';
  const tags = Array.isArray(body.tags)
    ? body.tags.slice(0, MAX_TAGS).filter((t: unknown): t is string => typeof t === 'string' && t.length <= 50)
    : [];
  const coverImage = typeof body.coverImage === 'string' ? body.coverImage.trim() : '';
  const screenshots = Array.isArray(body.screenshots)
    ? body.screenshots.filter((s: unknown): s is string => typeof s === 'string')
    : [];
  const liveUrl = typeof body.liveUrl === 'string' && body.liveUrl.trim()
    ? body.liveUrl.trim()
    : null;
  if (liveUrl && !/^https?:\/\//.test(liveUrl)) {
    return { error: 'liveUrl должен начинаться с http:// или https://' };
  }
  const previewType = typeof body.previewType === 'string' &&
    ['IFRAME', 'SCREENSHOT', 'STATIC_BUNDLE', 'NONE'].includes(body.previewType)
    ? (body.previewType as PreviewType)
    : PreviewType.NONE;
  const isComplexSystem = Boolean(body.isComplexSystem);
  const visible = body.visible !== undefined ? Boolean(body.visible) : true;
  const staticBundlePath = typeof body.staticBundlePath === 'string' ? body.staticBundlePath : undefined;
  const order = typeof body.order === 'number' ? Math.max(0, Math.floor(body.order)) : undefined;

  return { title, description, category: ALLOWED_CATEGORIES.includes(category) ? category : 'landing', tags, coverImage, screenshots, liveUrl, previewType, isComplexSystem, visible, staticBundlePath, order };
}

export async function listProjects(req: Request, res: Response): Promise<void> {
  const { category, search, page = '1', limit = '12', admin } = req.query;
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const isAdmin = admin === 'true';

  const where: Record<string, unknown> = {};

  if (!isAdmin) {
    where.visible = true;
  }

  if (category && category !== 'all' && ALLOWED_CATEGORIES.includes(category as string)) {
    where.category = category;
  }

  if (search) {
    const q = (search as string).slice(0, 100).toLowerCase();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
    if (q.length >= 2) {
      (where.OR as unknown[]).push({ tags: { has: q } });
    }
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { order: 'asc' },
      skip,
      take: limitNum,
    }),
    prisma.project.count({ where }),
  ]);

  res.json({
    projects,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

export async function getProject(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project || (!project.visible && !req.admin)) {
    res.status(404).json({ error: 'Проект не найден' });
    return;
  }

  res.json(project);
}

export async function createProject(req: Request, res: Response): Promise<void> {
  const sanitized = validateAndSanitize(req.body as BodyRecord);

  if ('error' in sanitized) {
    res.status(400).json({ error: sanitized.error });
    return;
  }

  if (!sanitized.title || !sanitized.description) {
    res.status(400).json({ error: 'Заполните обязательные поля: title, description' });
    return;
  }

  const project = await prisma.project.create({
    data: {
      title: sanitized.title,
      description: sanitized.description,
      category: sanitized.category,
      tags: sanitized.tags,
      coverImage: sanitized.coverImage,
      screenshots: sanitized.screenshots,
      liveUrl: sanitized.liveUrl,
      previewType: sanitized.previewType,
      isComplexSystem: sanitized.isComplexSystem,
      visible: sanitized.visible,
      staticBundlePath: sanitized.staticBundlePath,
      order: sanitized.order ?? 0,
    },
  });

  res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const sanitized = validateAndSanitize(req.body as BodyRecord);

  if ('error' in sanitized) {
    res.status(400).json({ error: sanitized.error });
    return;
  }

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Проект не найден' });
    return;
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: sanitized.title || existing.title,
      description: sanitized.description || existing.description,
      category: sanitized.category || existing.category,
      tags: sanitized.tags.length > 0 ? sanitized.tags : existing.tags,
      coverImage: sanitized.coverImage || existing.coverImage,
      screenshots: sanitized.screenshots.length > 0 ? sanitized.screenshots : existing.screenshots,
      liveUrl: sanitized.liveUrl !== undefined ? sanitized.liveUrl : existing.liveUrl,
      previewType: sanitized.previewType,
      staticBundlePath: sanitized.staticBundlePath !== undefined ? sanitized.staticBundlePath : existing.staticBundlePath,
      isComplexSystem: sanitized.isComplexSystem,
      order: sanitized.order ?? existing.order,
      visible: sanitized.visible !== undefined ? sanitized.visible : existing.visible,
    },
  });

  res.json(project);
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Проект не найден' });
    return;
  }

  if (existing.staticBundlePath) {
    const bundleDir = path.resolve(uploadsDir, existing.staticBundlePath);
    try { fs.rmSync(bundleDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }

  if (existing.coverImage) {
    safeFileDelete(path.resolve(uploadsDir, cleanUploadPath(existing.coverImage)));
  }
  for (const s of existing.screenshots) {
    safeFileDelete(path.resolve(uploadsDir, cleanUploadPath(s)));
  }

  await prisma.project.delete({ where: { id } });
  res.json({ message: 'Проект удалён' });
}

export async function updateProjectOrder(req: Request, res: Response): Promise<void> {
  const { items } = req.body as { items?: { id: string; order: number }[] };

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Ожидается массив { id, order }' });
    return;
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.project.update({
        where: { id: item.id },
        data: { order: Math.max(0, Math.floor(item.order)) },
      })
    )
  );

  res.json({ message: 'Порядок обновлён' });
}