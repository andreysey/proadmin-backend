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
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'andreyseynew@gmail.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Andrii',
      lastName: 'Butsvin',
      image: 'https://github.com/andreysey.png',
    },
    create: {
      email: 'andreyseynew@gmail.com',
      username: 'andriibutsvin',
      password: hashedPassword,
      firstName: 'Andrii',
      lastName: 'Butsvin',
      role: 'ADMIN',
      image: 'https://github.com/andreysey.png',
    },
  });

  console.log({ admin });
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
