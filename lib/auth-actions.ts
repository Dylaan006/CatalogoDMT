'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirect: false });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales inválidas.';
                default:
                    return 'Algo salió mal.';
            }
        }
        throw error;
    }
    redirect('/');
}

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return 'Campos inválidos. Por favor verifique sus datos.';
    }

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return 'Este correo ya está registrado.';

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        });

        // We can't auto-login easily with server actions + credential provider without a redirect to login
        // Or we could try signIn directly here if we want auto-login
        return 'success';
    } catch (error) {
        console.error('Registration error:', error);
        return 'Error al crear la cuenta.';
    }
}
