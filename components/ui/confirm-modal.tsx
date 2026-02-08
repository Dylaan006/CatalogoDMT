'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isLoading = false
}: ConfirmModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className="space-y-4">
                <p className="text-gray-500">{description}</p>
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="border-gray-200 text-gray-700 font-bold"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-gray-900 text-white font-bold hover:bg-gray-800"
                    >
                        {isLoading ? 'Confirmando...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
