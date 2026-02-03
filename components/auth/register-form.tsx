'use client';

import { useActionState } from 'react';
import { register } from '@/lib/auth-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RegisterForm() {
    const [state, dispatch, isPending] = useActionState(register, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state === 'success') {
            router.push('/login?registered=true');
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900" htmlFor="name">
                    Nombre Completo
                </label>
                <input
                    className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 p-3 text-sm"
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Juan Pérez"
                    required
                    minLength={2}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900" htmlFor="email">
                    Email
                </label>
                <input
                    className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 p-3 text-sm"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900" htmlFor="password">
                    Contraseña
                </label>
                <input
                    className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 p-3 text-sm"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="******"
                    required
                    minLength={6}
                />
            </div>
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {state && state !== 'success' && (
                    <p className="text-sm text-red-500 font-medium">{state}</p>
                )}
            </div>
            <Button className="w-full bg-gray-900 text-white font-bold h-12 hover:bg-gray-800" aria-disabled={isPending}>
                {isPending ? 'Registrando...' : 'Crear Cuenta'}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
                ¿Ya tienes cuenta? <Link href="/login" className="font-bold text-gray-900 hover:underline">Ingresa</Link>
            </p>
        </form>
    );
}
