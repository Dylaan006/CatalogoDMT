
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'carinaedith.villalba@gmail.com'
    const password = 'DYMOTHOM'
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN'
        },
        create: {
            email,
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log(`Admin user created/updated: ${email}`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
