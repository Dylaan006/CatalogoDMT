'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { deleteProduct } from '@/lib/actions';

interface DeleteProductButtonProps {
    productId: string;
    productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await deleteProduct(productId);
        setIsDeleting(false);
        setIsConfirmOpen(false);
    };

    return (
        <>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsConfirmOpen(true)}
                className="h-8 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 shadow-none"
            >
                Eliminar
            </Button>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar producto"
                description={`¿Estás seguro que deseas eliminar el producto "${productName}"? Esta acción no se puede deshacer.`}
                isLoading={isDeleting}
            />
        </>
    );
}
