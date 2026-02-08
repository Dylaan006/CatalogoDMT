'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export function AlertModal({
    isOpen,
    onClose,
    title,
    description,
}: AlertModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className="space-y-4">
                <p className="text-gray-500">{description}</p>
                <div className="flex justify-end mt-6">
                    <Button
                        onClick={onClose}
                        className="bg-gray-900 text-white font-bold hover:bg-gray-800"
                    >
                        Entendido
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
