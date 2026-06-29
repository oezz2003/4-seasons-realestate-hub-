import { config } from 'dotenv';
config();

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log('Admin user already exists. Skipping initial seed.');
        return;
    }

    if (adminPassword === 'password') {
        console.warn('\n⚠️ WARNING: Using default admin password. Please set ADMIN_PASSWORD in environment variables for production! ⚠️\n');
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
        // @ts-ignore - Bypass IDE TS server caching issues with newly generated Prisma fields
        data: {
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
        }
    });

    console.log(`Successfully seeded default admin user:
  - Email: ${admin.email}
  - Password: ${adminPassword === 'password' ? 'password (DEFAULT)' : '[HIDDEN]'}
  `);
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
