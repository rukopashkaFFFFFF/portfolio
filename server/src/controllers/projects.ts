import { Request, Response } from 'express';
import prisma from '../prisma';
import { PreviewType } from '@prisma/client';

type BodyRecord = Record<string, unknown>;

export async function listProjects(req: Request, res: Response): Promise<void> {
  const { category, search, page = '1', limit = '12' } = req.query;
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = { visible: true };

  if (category && category !== 'all') {
    where.category = category;
  }

  if (search) {
    const q = (search as string).toLowerCase();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { tags: { has: q } },
    ];
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
  const body = req.body as BodyRecord;
  const { title, description, category, tags, coverImage, screenshots, liveUrl, previewType, isComplexSystem, order } = body;

  if (!title || !description || !category) {
    res.status(400).json({ error: 'Заполните обязательные поля: title, description, category' });
    return;
  }

  const project = await prisma.project.create({
    data: {
      title: title as string,
      description: description as string,
      category: category as string,
      tags: (tags as string[]) || [],
      coverImage: (coverImage as string) || '',
      screenshots: (screenshots as string[]) || [],
      liveUrl: (liveUrl as string) || null,
      previewType: (previewType as PreviewType) || PreviewType.NONE,
      isComplexSystem: Boolean(isComplexSystem),
      order: (order as number) || 0,
    },
  });

  res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const data = req.body as BodyRecord;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'Проект не найден' });
    return;
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: (data.title as string) ?? existing.title,
      description: (data.description as string) ?? existing.description,
      category: (data.category as string) ?? existing.category,
      tags: (data.tags as string[]) ?? existing.tags,
      coverImage: (data.coverImage as string) ?? existing.coverImage,
      screenshots: (data.screenshots as string[]) ?? existing.screenshots,
      liveUrl: data.liveUrl !== undefined ? (data.liveUrl as string) : existing.liveUrl,
      previewType: (data.previewType as PreviewType) ?? existing.previewType,
      staticBundlePath: data.staticBundlePath !== undefined ? (data.staticBundlePath as string) : existing.staticBundlePath,
      isComplexSystem: data.isComplexSystem !== undefined ? Boolean(data.isComplexSystem) : existing.isComplexSystem,
      order: (data.order as number) ?? existing.order,
      visible: data.visible !== undefined ? Boolean(data.visible) : existing.visible,
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

  await prisma.project.delete({ where: { id } });
  res.json({ message: 'Проект удалён' });
}

export async function updateProjectOrder(req: Request, res: Response): Promise<void> {
  const { items } = req.body as { items: { id: string; order: number }[] };

  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'Ожидается массив { id, order }' });
    return;
  }

  await Promise.all(
    items.map((item) =>
      prisma.project.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );

  res.json({ message: 'Порядок обновлён' });
}
