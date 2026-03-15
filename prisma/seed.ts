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

  // Generate 300 test users
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const roles = ['USER', 'ADMIN', 'MODERATOR'];
  
  console.log('Seeding 300 users...');
  
  for (let i = 1; i <= 300; i++) {
    const role = roles[i % roles.length];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${i}`;
    const email = `${username}@example.com`;
    
    // Random date within last 30 days, definitely in the past
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const createdAt = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));

    const user = await prisma.user.upsert({
      where: { email },
      update: { createdAt },
      create: {
        email,
        username,
        password: commonPassword,
        firstName,
        lastName,
        role: role as any,
        image: `https://i.pravatar.cc/150?u=${email}`,
        createdAt,
      },
    });

    // Also seed activity log for registrations
    await prisma.activityLog.create({
      data: {
        type: 'user_signup',
        title: 'New user registered',
        description: `${firstName} ${lastName} (@${username}) joined the platform`,
        userId: user.id,
        createdAt,
      },
    });

    if (i % 50 === 0) console.log(`Seeded ${i} users...`);
  }

  console.log('Successfully seeded 300 test users and activity logs.');
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
