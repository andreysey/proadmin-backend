import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Create a PostgreSQL Pool with the connection string from environment variables
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Initialize the Prisma adapter for PostgreSQL
    const adapter = new PrismaPg(pool as any);
    
    // 3. Pass the adapter to the PrismaClient constructor (Prisma 7 requirement for direct conns)
    super({ adapter });
  }

  async onModuleInit() {
    // Connect to the database on module initialization
    await this.$connect();
  }

  async onModuleDestroy() {
    // Disconnect from the database when the module is destroyed
    await this.$disconnect();
  }
}