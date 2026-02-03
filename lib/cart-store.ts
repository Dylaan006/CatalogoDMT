import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@prisma/client';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.product.id === product.id);

                if (existingItem) {
                    const updatedItems = items.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                    set({ items: updatedItems, total: calculateTotal(updatedItems) });
                } else {
                    const newItems = [...items, { product, quantity: 1 }];
                    set({ items: newItems, total: calculateTotal(newItems) });
                }
            },
            removeItem: (productId) => {
                const items = get().items.filter((item) => item.product.id !== productId);
                set({ items, total: calculateTotal(items) });
            },
            updateQuantity: (productId, quantity) => {
                const items = get().items.map((item) =>
                    item.product.id === productId ? { ...item, quantity } : item
                );
                set({ items, total: calculateTotal(items) });
            },
            clearCart: () => set({ items: [], total: 0 }),
        }),
        {
            name: 'stitch-cart-storage',
        }
    )
);

function calculateTotal(items: CartItem[]) {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}
