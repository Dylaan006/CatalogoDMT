import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create Default Admin
    const email = 'carinaedith.villalba@gmail.com'
    const password = 'DYMOTHOM'
    const phoneNumber = '+5491136511528' // Ajusta este número si es necesario
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            phoneNumber: phoneNumber
        },
        create: {
            email,
            name: 'Admin DMT',
            password: hashedPassword,
            role: 'ADMIN',
            phoneNumber: phoneNumber
        },
    });

    console.log(`Admin user seeded: ${email}`);

    const products = [
        {
            name: 'Stitch Peluche Gigante',
            description: 'Peluche de Stitch de 1 metro de altura, súper suave y abrazable.',
            price: 45000,
            category: 'Peluches',
            images: JSON.stringify(['https://placehold.co/600x400/png?text=Stitch+Peluche']),
        },
        {
            name: 'Taza Stitch 3D',
            description: 'Taza de cerámica con diseño 3D de la cabeza de Stitch.',
            price: 8500,
            category: 'Hogar',
            images: JSON.stringify(['https://placehold.co/600x400/png?text=Taza+Stitch']),
        },
        {
            name: 'Llavero Stitch y Angel',
            description: 'Set de 2 llaveros de Stitch y Angel magnéticos.',
            price: 3200,
            category: 'Accesorios',
            images: JSON.stringify(['https://placehold.co/600x400/png?text=Llaveros']),
        },
    ]

    for (const product of products) {
        await prisma.product.create({
            data: product,
        })
    }

    console.log('Seed data inserted')
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
