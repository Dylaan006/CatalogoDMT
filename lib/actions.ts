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
        throw new Error('Debes iniciar sesión para realizar un pedido.');
    }

    if (!cartItems || cartItems.length === 0) {
        throw new Error('El carrito está vacío.');
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
    price: z.coerce.number(), // Coerce to handle string input from form
    category: z.string(),
});

import fs from 'node:fs/promises';
import path from 'node:path';

// ... (existing imports)

async function saveImages(formData: FormData): Promise<string[]> {
    const files = formData.getAll('images') as File[];
    const savedPaths: string[] = [];

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore if exists
    }

    for (const file of files) {
        if (file.size > 0 && file.name !== 'undefined') {
            const buffer = Buffer.from(await file.arrayBuffer());
            // Sanitize filename
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
    // Validate fields...
    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
    });

    if (!validatedFields.success) {
        return { success: false, error: 'Campos inválidos' };
    }

    const { name, description, price, category } = validatedFields.data;

    // Handle images
    let imageUrls = await saveImages(formData);

    // Fallback if no images
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
        },
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true, redirectUrl: '/admin/dashboard' };
}

export async function updateProduct(id: string, formData: FormData) {
    const session = await auth();

    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
    });

    if (!validatedFields.success) {
        return { success: false, error: 'Campos inválidos' };
    }

    const { name, description, price, category } = validatedFields.data;

    const newImages = await saveImages(formData);
    let imagesJSON;

    if (newImages.length > 0) {
        imagesJSON = JSON.stringify(newImages);
    } else {
        // Keep existing if no new images
        // We don't need to pass 'images' to update if we want to keep existing.
        // But if we want to explicitly support "no change", we just omit it from data.
    }

    const data: any = {
        name,
        description,
        price,
        category,
    };

    if (imagesJSON) {
        data.images = imagesJSON;
    }

    await prisma.product.update({
        where: { id },
        data,
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath(`/admin/editar/${id}`);

    return { success: true, redirectUrl: '/admin/dashboard' };
}

export async function deleteProduct(id: string) {
    const session = await auth();

    await prisma.product.delete({
        where: { id },
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
}
