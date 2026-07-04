import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return password;
}

async function main() {
  const admins = [
    { username: 'pavel' },
    { username: 'sergey' },
    { username: 'kirill' },
  ];

  const passwords: Record<string, string> = {};

  for (const admin of admins) {
    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.admin.upsert({
      where: { username: admin.username },
      update: { passwordHash },
      create: {
        username: admin.username,
        passwordHash,
      },
    });

    passwords[admin.username] = password;
    console.log(`Admin "${admin.username}" created/updated`);
  }

  const passwordsPath = path.join(__dirname, '..', 'INITIAL_PASSWORDS.txt');
  const content = Object.entries(passwords)
    .map(([user, pw]) => `Login: ${user}\nPassword: ${pw}\n`)
    .join('\n');

  fs.writeFileSync(passwordsPath, content);
  console.log(`\nINITIAL PASSWORDS SAVED TO: ${passwordsPath}\nDELETE THIS FILE AFTER SAVING PASSWORDS!\n`);
  for (const [user, pw] of Object.entries(passwords)) {
    console.log(`${user}: ${pw}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());