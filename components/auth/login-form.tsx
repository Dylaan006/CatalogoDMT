'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/auth-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LoginForm() {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <form action={dispatch} className="flex flex-col gap-4">
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
                {errorMessage && (
                    <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                )}
            </div>
            <Button className="w-full bg-gray-900 text-white font-bold h-12 hover:bg-gray-800" aria-disabled={isPending}>
                {isPending ? 'Ingresando...' : 'Ingresar'}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
                ¿No tienes cuenta? <Link href="/register" className="font-bold text-gray-900 hover:underline">Regístrate</Link>
            </p>
        </form>
    );
}
