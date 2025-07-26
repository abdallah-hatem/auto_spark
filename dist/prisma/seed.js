"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
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
//# sourceMappingURL=seed.js.map