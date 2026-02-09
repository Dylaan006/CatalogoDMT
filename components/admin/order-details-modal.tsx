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
                                        <span>{item.productName || item.product?.name || 'Producto Eliminado'}</span>
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

                        {order.user && order.user.phoneNumber && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <Button
                                    asChild
                                    className="w-full bg-black hover:bg-gray-800 text-white font-bold h-12 rounded-xl shadow-sm transition-all hover:shadow-md border-transparent"
                                >
                                    <a
                                        href={`https://wa.me/${order.user.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.user.name} tenemos tu orden #${order.id.slice(-8)} confirmas la compra?`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                        Contactar por WhatsApp
                                    </a>
                                </Button>
                            </div>
                        )}
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
