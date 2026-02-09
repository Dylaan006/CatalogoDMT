import { prisma } from '@/lib/db';
import { Product } from '@prisma/client';

export async function getProducts(query?: string, category?: string, sort?: string) {
    const where: any = {};

    if (query) {
        where.OR = [
            { name: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
            { productCode: { contains: query } },
        ];
    }

    if (category && category !== 'Todos') {
        where.category = category;
    }

    let orderBy: any = { createdAt: 'desc' }; // Default: Newest/Destacados

    if (sort === 'precio_menor') {
        orderBy = { price: 'asc' };
    } else if (sort === 'precio_mayor') {
        orderBy = { price: 'desc' };
    }

    const products = await prisma.product.findMany({
        where,
        orderBy,
    });

    return products;
}

export async function getProductById(id: string) {
    return await prisma.product.findUnique({
        where: { id },
    });
}

export async function getCategories() {
    const products = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category'],
    });
    return products.map((p) => p.category);
}

export async function getUserOrders(userId: string) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        return orders;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user orders.');
    }
}

export async function getAllOrders() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        return orders;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch orders.');
    }
}

export async function getUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        return user;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user profile.');
    }
}
