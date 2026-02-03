import { prisma } from '@/lib/db';

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@stitch.com' },
    });
    console.log('Admin user found:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
