'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button'; // Assuming we have this
import { useState } from 'react';
import { updateOrderStatus } from '@/lib/actions';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface OrderDetailsModalProps {
    order: any; // Ideally typed with Prisma includes
    isOpen: boolean;
    onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusToConfirm, setStatusToConfirm] = useState<string | null>(null);

    if (!order) return null;

    const handleStatusClick = (newStatus: string) => {
        setStatusToConfirm(newStatus);
    };

    const confirmStatusChange = async () => {
        if (statusToConfirm) {
            setIsUpdating(true);
            await updateOrderStatus(order.id, statusToConfirm);
            setIsUpdating(false);
            setStatusToConfirm(null);
            onClose();
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('es-AR', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`Orden #${order.id.slice(-8)}`}>
                <div className="flex flex-col gap-6">

                    {/* Customer Info */}
                    <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Detalles del Comprador</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block">Nombre</span>
                                <span className="font-semibold text-gray-900">{order.user.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Email</span>
                                <span className="font-semibold text-gray-900">{order.user.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Teléfono</span>
                                <span className="font-semibold text-gray-900">
                                    {order.user.phoneNumber || 'No registrado'}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Fecha</span>
                                <span className="font-semibold text-gray-900">{formatDate(order.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Productos</h4>
                        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center p-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-900">{item.quantity}x</span>
                                        <span>{item.product.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">${item.price.toLocaleString('es-AR')}</span>
                                </div>
                            ))}
                            <div className="p-3 bg-gray-50 flex justify-between items-center font-bold text-gray-900">
                                <span>Total</span>
                                <span className="text-lg">${order.total.toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Actions */}
                    <div className="mt-2">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Gestionar Estado</h4>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                disabled={isUpdating || order.status === 'PENDING'}
                                onClick={() => handleStatusClick('PENDING')}
                                variant={order.status === 'PENDING' ? 'default' : 'outline'}
                                className={`flex-1 ${order.status === 'PENDING' ? 'bg-yellow-500 hover:bg-yellow-600 border-transparent text-white' : ''}`}
                            >
                                Pendiente
                            </Button>
                            <Button
                                disabled={isUpdating || order.status === 'COMPLETED'}
                                onClick={() => handleStatusClick('COMPLETED')}
                                variant={order.status === 'COMPLETED' ? 'default' : 'outline'}
                                className={`flex-1 ${order.status === 'COMPLETED' ? 'bg-green-600 hover:bg-green-700 border-transparent text-white' : ''}`}
                            >
                                Completado
                            </Button>
                            <Button
                                disabled={isUpdating || order.status === 'CANCELLED'}
                                onClick={() => handleStatusClick('CANCELLED')}
                                variant={order.status === 'CANCELLED' ? 'default' : 'outline'}
                                className={`flex-1 ${order.status === 'CANCELLED' ? 'bg-red-600 hover:bg-red-700 border-transparent text-white' : ''}`}
                            >
                                Cancelado
                            </Button>
                        </div>
                    </div>

                </div>
            </Modal>

            <ConfirmModal
                isOpen={!!statusToConfirm}
                onClose={() => setStatusToConfirm(null)}
                onConfirm={confirmStatusChange}
                title="Confirmar cambio de estado"
                description={`¿Estás seguro que deseas cambiar el estado de la orden a ${statusToConfirm === 'PENDING' ? 'Pendiente' : statusToConfirm === 'COMPLETED' ? 'Completado' : 'Cancelado'}?`}
                isLoading={isUpdating}
            />
        </>
    );
}
