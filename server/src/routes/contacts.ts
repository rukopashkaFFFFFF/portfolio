import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Слишком много заявок. Попробуйте позже.' },
});

router.post('/', contactLimiter, (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Заполните имя, email и сообщение' });
    return;
  }
  if (typeof name !== 'string' || name.length > 100) {
    res.status(400).json({ error: 'Некорректное имя' });
    return;
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Некорректный email' });
    return;
  }
  if (typeof message !== 'string' || message.length > 5000) {
    res.status(400).json({ error: 'Сообщение слишком длинное' });
    return;
  }

  console.log(`[CONTACT] ${name} (${email}${phone ? ', ' + phone : ''}): ${message.slice(0, 200)}`);

  res.json({ message: 'Спасибо! Мы свяжемся с вами в ближайшее время.' });
});

export default router;