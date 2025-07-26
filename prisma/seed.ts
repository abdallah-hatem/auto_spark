import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create initial admin user
  const adminPassword = await bcrypt.hash('admin@123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@carwash.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@carwash.com',
      phone: '01000000000',
      password: adminPassword,
      role: 'ADMIN',
      address: 'Cairo, Egypt',
    },
  });

  console.log('✅ Created admin user:', {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  console.log('🎉 Database seeding completed!');
  console.log('\n📝 Admin Login Credentials:');
  console.log('Email: admin@carwash.com');
  console.log('Password: admin123!');
  console.log('\n⚠️  Please change the admin password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 