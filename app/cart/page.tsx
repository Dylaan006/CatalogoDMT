'use client';

import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { createOrder } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleCheckout() {
        setIsCheckingOut(true);
        try {
            // Transform items for the server action
            const orderItems = items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }));

            const result = await createOrder(orderItems, total);

            if (result.success) {
                clearCart();
                router.push('/profile');
            } else {
                alert(result.error || 'Error al procesar el pedido. Verifica que hayas iniciado sesión.');
                if (result.error?.includes('iniciar sesión')) {
                    router.push('/login');
                }
            }
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error inesperado.');
        } finally {
            setIsCheckingOut(false);
        }
    }

    if (!mounted) {
        return <div className="min-h-screen"></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-4xl">shopping_cart</span>
                    Tu Carrito
                </h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_bag</span>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-6">Parece que aún no has agregado productos.</p>
                        <Button asChild className="rounded-full bg-gray-900 text-white font-bold px-8 py-3 h-auto hover:bg-gray-800">
                            <Link href="/">Ir al Catálogo</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <div key={item.product.id} className="p-6 flex gap-6 items-center">
                                        <div className="size-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                                            {(() => {
                                                let images: string[] = [];
                                                try {
                                                    images = JSON.parse(item.product.images);
                                                } catch (e) { images = [] }

                                                if (typeof images === 'string') images = [images];
                                                if (!Array.isArray(images) || images.length === 0) images = [];

                                                const coverImage = images[0];

                                                if (coverImage) {
                                                    return <img src={coverImage} alt={item.product.name} className="w-full h-full object-cover" />
                                                } else {
                                                    return (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <span className="material-symbols-outlined">image</span>
                                                        </div>
                                                    )
                                                }
                                            })()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">{item.product.name}</h3>
                                            <p className="text-gray-500 text-sm">Precio unitario: ${item.product.price.toLocaleString('es-AR')}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                className="size-8 flex items-center justify-center rounded-md bg-white shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-4 text-center font-bold text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="size-8 flex items-center justify-center rounded-md bg-white shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="min-w-[100px] text-right">
                                            <p className="font-black text-gray-900 text-lg">${(item.product.price * item.quantity).toLocaleString('es-AR')}</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="size-10 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Eliminar producto"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="text-center sm:text-left">
                                <p className="text-gray-500 text-sm mb-1">Total a Pagar</p>
                                <p className="text-4xl font-black text-gray-900">${total.toLocaleString('es-AR')}</p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Button asChild variant="outline" className="flex-1 sm:flex-none border-gray-200 text-gray-700 font-bold h-12 rounded-full">
                                    <Link href="/">Seguir Comprando</Link>
                                </Button>
                                <Button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="flex-1 sm:flex-none bg-gray-900 text-white font-bold h-12 px-8 rounded-full hover:bg-gray-800 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 transform hover:-translate-y-0.5 transition-all"
                                >
                                    {isCheckingOut ? 'Procesando...' : 'Confirmar Compra'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
