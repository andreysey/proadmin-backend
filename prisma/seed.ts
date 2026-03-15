import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = '12345678';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const commonPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'andreyseynew@gmail.com' },
    update: {
      password: hashedAdminPassword,
      role: 'ADMIN',
      firstName: 'Andrii',
      lastName: 'Butsvin',
      image: 'https://github.com/andreysey.png',
    },
    create: {
      email: 'andreyseynew@gmail.com',
      username: 'andriibutsvin',
      password: hashedAdminPassword,
      firstName: 'Andrii',
      lastName: 'Butsvin',
      role: 'ADMIN',
      image: 'https://github.com/andreysey.png',
    },
  });

  console.log('Admin user ensured:', admin.email);

  // Generate 20 test users
  const roles = ['USER', 'ADMIN', 'MODERATOR'];
  for (let i = 1; i <= 20; i++) {
    const role = roles[i % roles.length];
    const email = `user${i}@example.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username: `user_tester_${i}`,
        password: commonPassword,
        firstName: `TestFirst${i}`,
        lastName: `TestLast${i}`,
        role: role as any,
        image: `https://i.pravatar.cc/150?u=${email}`,
      },
    });
  }

  console.log('Successfully seeded 20 test users.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
