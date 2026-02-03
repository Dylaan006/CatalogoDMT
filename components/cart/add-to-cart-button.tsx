'use client';

import { useCartStore } from '@/lib/cart-store';
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AddToCartButtonProps {
    product: Product;
    fullWidth?: boolean;
}

export function AddToCartButton({ product, fullWidth }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a link
        e.stopPropagation();
        addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <Button
            onClick={handleAdd}
            className={`${fullWidth ? 'w-full' : ''} bg-gray-900 text-white hover:bg-gray-800 transition-all font-bold gap-2`}
        >
            <span className="material-symbols-outlined text-[20px]">
                {isAdded ? 'check' : 'add_shopping_cart'}
            </span>
            {isAdded ? 'Agregado' : 'Agregar'}
        </Button>
    );
}
