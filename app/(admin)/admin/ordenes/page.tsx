import { getAllOrders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

    return (
        <div className="py-10 px-6 lg:px-40">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ordenes de Compra</h1>
                    <p className="text-gray-500 mt-1">Gestiona los pedidos realizados por los clientes.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Orden</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Cliente</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Items</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">#{order.id.slice(-6)}</span>
                                        <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-900">{order.user.name}</span>
                                        <span className="text-xs text-gray-500">{order.user.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    ${order.total.toLocaleString('es-AR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            order.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                        }`}>
                                        {order.status === 'PENDING' ? 'Pendiente' : order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex gap-2">
                                                <span className="font-bold">{item.quantity}x</span>
                                                <span className="truncate max-w-[150px]">{item.product.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl text-gray-300">inbox</span>
                                        <p>No hay órdenes registradas.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
