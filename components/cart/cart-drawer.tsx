'use client';

import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createOrder } from '@/lib/actions'; // Need to implement this

export function CartDrawer() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Simple toggle for now, can be replaced with a global UI store or context if needed
    // ideally, we'd export a way to open this from the header.
    // For now, let's assume we render a button IN the header that toggles a state passed down, 
    // or use a simple event/global state.
    // To keep it simple without adding more libs, I'll allow this component to manage its own open state 
    // via a trigger button rendered here, or I can make it controlled.
    // Let's go with a global event listener or just modify this to accepting props? 
    // Actually, let's put the trigger INSIDE this component for now and render it in the header.

    if (!isClient) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <span className="material-symbols-outlined">shopping_cart</span>
                {items.length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        {items.length}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={() => setIsOpen(false)} />
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Tu Cesta</h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                                <span className="material-symbols-outlined text-4xl">shopping_basket</span>
                                <p>Tu cesta está vacía</p>
                                <button onClick={() => setIsOpen(false)} className="text-gray-900 font-bold hover:underline">
                                    Volver al catálogo
                                </button>
                            </div>
                        ) : (
                            items.map((item) => {
                                const images = JSON.parse(item.product.images) as string[];
                                const image = images[0] || '/placeholder.png';
                                return (
                                    <div key={item.product.id} className="flex gap-4">
                                        <div className="h-20 w-20 relative border border-gray-200 rounded-lg overflow-hidden shrink-0">
                                            <Image src={image} alt={item.product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{item.product.name}</h3>
                                                <button onClick={() => removeItem(item.product.id)} className="text-gray-400 hover:text-red-500">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex items-center border border-gray-200 rounded-md">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                        className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 text-sm font-medium text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="font-bold text-gray-900 text-sm">
                                                    ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">Total</span>
                                <span className="text-xl font-black text-gray-900">${total.toLocaleString('es-AR')}</span>
                            </div>
                            <Button asChild className="w-full bg-gray-900 text-white font-bold h-12 hover:bg-gray-800 shadow-lg shadow-gray-900/10" onClick={() => setIsOpen(false)}>
                                <Link href="/checkout">
                                    Iniciar Compra
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
