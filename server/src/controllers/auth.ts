import { Request, Response } from 'express';
import prisma from '../prisma';
import { comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Укажите имя пользователя и пароль' });
    return;
  }

  if (typeof username !== 'string' || username.length > 50 || typeof password !== 'string' || password.length > 128) {
    res.status(400).json({ error: 'Некорректные данные' });
    return;
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    return;
  }

  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    return;
  }

  const accessToken = generateAccessToken(admin.id, admin.username);
  const refreshToken = generateRefreshToken(admin.id, admin.username);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  res.json({ accessToken, admin: { id: admin.id, username: admin.username } });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401).json({ error: 'Refresh token отсутствует' });
    return;
  }

  try {
    const payload = verifyRefreshToken(token);
    const admin = await prisma.admin.findUnique({ where: { id: payload.adminId } });
    if (!admin) {
      res.status(401).json({ error: 'Администратор не найден' });
      return;
    }

    const accessToken = generateAccessToken(admin.id, admin.username);
    const refreshToken = generateRefreshToken(admin.id, admin.username);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: 'Недействительный refresh token' });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ message: 'Выход выполнен' });
}