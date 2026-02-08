'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Product } from '@prisma/client';

// --- ORDER ACTION ---

export async function createOrder(cartItems: { productId: string; quantity: number }[], total: number) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return { success: false, error: 'Debes iniciar sesión para realizar un pedido.' };
    }

    if (!cartItems || cartItems.length === 0) {
        return { success: false, error: 'El carrito está vacío.' };
    }

    try {
        const productIds = cartItems.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        let serverTotal = 0;
        const validItems = [];

        for (const item of cartItems) {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                serverTotal += product.price * item.quantity;
                validItems.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price,
                });
            }
        }

        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                total: serverTotal,
                status: 'PENDING',
                items: {
                    create: validItems,
                },
            },
        });

        revalidatePath('/admin/ordenes');
        revalidatePath('/profile');

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: 'Error al procesar el pedido.' };
    }
}

// --- PRODUCT ACTIONS ---

const ProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.coerce.number(),
    category: z.string(),
    boxContent: z.string().optional(),
    specifications: z.string().optional(),
    inStock: z.boolean().optional(),
});

import fs from 'node:fs/promises';
import path from 'node:path';

// ... (existing imports)

async function saveImages(formData: FormData): Promise<string[]> {
    // ... (same as before)
    const files = formData.getAll('images') as File[];
    const savedPaths: string[] = [];

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore
    }

    for (const file of files) {
        if (file.size > 0 && file.name !== 'undefined') {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filepath = path.join(uploadDir, filename);
            await fs.writeFile(filepath, buffer);
            savedPaths.push(`/uploads/${filename}`);
        }
    }
    return savedPaths;
}

export async function createProduct(formData: FormData) {
    const session = await auth();

    const inStock = formData.get('inStock') === 'on';

    // Validate fields
    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        boxContent: formData.get('boxContent'),
        specifications: formData.get('specifications'),
        inStock: inStock
    });

    if (!validatedFields.success) {
        return { success: false, error: 'Campos inválidos' };
    }

    const { name, description, price, category, boxContent, specifications } = validatedFields.data;

    // Handle images
    let imageUrls = await saveImages(formData);

    if (imageUrls.length === 0) {
        imageUrls = ['https://placehold.co/600x400/png?text=' + encodeURIComponent(name)];
    }

    const images = JSON.stringify(imageUrls);

    await prisma.product.create({
        data: {
            name,
            description,
            price,
            category,
            images,
            boxContent: boxContent || '[]',
            specifications: specifications || '{}',
            inStock: inStock
        },
    });

    revalidatePath('/');
    revalidatePath('/admin/productos');
    return { success: true, redirectUrl: '/admin/productos' };
}

export async function updateProduct(id: string, formData: FormData) {
    const session = await auth();

    const inStock = formData.get('inStock') === 'on';

    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        boxContent: formData.get('boxContent'),
        specifications: formData.get('specifications'),
        inStock: inStock,
    });

    if (!validatedFields.success) {
        return { success: false, error: 'Campos inválidos' };
    }

    const { name, description, price, category, boxContent, specifications } = validatedFields.data;

    const newImages = await saveImages(formData);
    let imagesJSON;

    if (newImages.length > 0) {
        imagesJSON = JSON.stringify(newImages);
    }

    const data: any = {
        name,
        description,
        price,
        category,
        boxContent: boxContent || '[]',
        specifications: specifications || '{}',
        inStock: inStock,
    };

    if (imagesJSON) {
        data.images = imagesJSON;
    }

    await prisma.product.update({
        where: { id },
        data,
    });

    revalidatePath('/');
    revalidatePath('/admin/productos');
    revalidatePath(`/admin/editar/${id}`);
    revalidatePath(`/producto/${id}`);

    return { success: true, redirectUrl: '/admin/productos' };
}

// ... existing actions

export async function deleteProduct(id: string) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== 'ADMIN') return;

    await prisma.product.delete({
        where: { id },
    });

    revalidatePath('/');
    revalidatePath('/admin/productos');
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const session = await auth();

    // @ts-ignore
    if (session?.user?.role !== 'ADMIN') {
        throw new Error('No autorizado');
    }

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus },
        });

        revalidatePath('/admin/ordenes');
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Error updating order:', error);
        return { success: false, error: 'Error al actualizar la orden' };
    }
}

export async function toggleProductStock(id: string, inStock: boolean) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== 'ADMIN') {
        throw new Error('No autorizado');
    }

    try {
        await prisma.product.update({
            where: { id },
            data: { inStock },
        });

        revalidatePath('/admin/productos');
        revalidatePath(`/producto/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error toggling stock:', error);
        return { success: false, error: 'Error al cambiar el stock' };
    }
}
