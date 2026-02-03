'use client';

import { useCartStore } from '@/lib/cart-store';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CartCounter() {
    const { items } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Link href="/cart" className="size-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors relative">
                <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
        );
    }

    return (
        <Link href="/cart" className="size-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            {items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                    {items.length}
                </span>
            )}
        </Link>
    );
}
