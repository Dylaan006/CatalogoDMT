import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.error('Usage: npm run create-admin <email> <password> <name>');
        process.exit(1);
    }

    const [email, password, name] = args;

    if (!email || !password || !name) {
        console.error('Missing arguments.');
        process.exit(1);
    }

    console.log(`Creating admin user: ${name} (${email})...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                name,
                role: 'ADMIN',
            },
            create: {
                email,
                password: hashedPassword,
                name,
                role: 'ADMIN',
            },
        });
        console.log(`Admin user ${user.email} created/updated successfully.`);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
