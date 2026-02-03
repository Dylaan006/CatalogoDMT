import { auth } from '@/auth';
import { getUserOrders } from '@/lib/data';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/auth';

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    // Admin View
    if (session.user.role === 'ADMIN') {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Hola, Administrador</h1>
                            <p className="text-gray-500">Gestiona tu catálogo y órdenes desde aquí.</p>
                        </div>
                        <form
                            action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}
                        >
                            <Button variant="outline" type="submit">Cerrar Sesión</Button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 transition-all hover:shadow-md">
                            <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-900">
                                <span className="material-symbols-outlined text-3xl">dashboard</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Panel de Control</h2>
                                <p className="text-gray-500 text-sm mt-1">Accede al dashboard completo para gestionar productos.</p>
                            </div>
                            <Button asChild className="w-full mt-2 bg-gray-900 text-white font-bold h-12 rounded-xl hover:bg-gray-800">
                                <Link href="/admin/dashboard">Ir al Dashboard</Link>
                            </Button>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 transition-all hover:shadow-md">
                            <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-900">
                                <span className="material-symbols-outlined text-3xl">receipt_long</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Gestión de Ordenes</h2>
                                <p className="text-gray-500 text-sm mt-1">Revisa y actualiza el estado de las compras de los usuarios.</p>
                            </div>
                            <Button asChild variant="outline" className="w-full mt-2 border-gray-200 font-bold h-12 rounded-xl">
                                <Link href="/admin/ordenes">Ver Ordenes</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // User View (Existing Logic)
    const orders = await getUserOrders(session.user.id);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Hola, {session.user.name}</h1>
                        <p className="text-gray-500">Este es tu historial de compras.</p>
                    </div>
                    <form
                        action={async () => {
                            'use server';
                            await signOut({ redirectTo: '/' });
                        }}
                    >
                        <Button variant="outline" type="submit">Cerrar Sesión</Button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="material-symbols-outlined">receipt_long</span>
                            Mis Pedidos
                        </h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <span className="material-symbols-outlined text-4xl mb-2">shopping_bag</span>
                            <p>Aún no has realizado ningún pedido.</p>
                            <Button asChild className="mt-4" variant="link">
                                <Link href="/">Ir al Catálogo</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Orden #{order.id.slice(-8)}</span>
                                            <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status === 'PENDING' ? 'Pendiente' : order.status}
                                            </span>
                                            <span className="text-xl font-black text-gray-900">${order.total.toLocaleString('es-AR')}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">{item.quantity}x</span>
                                                    <span className="text-gray-700">{item.product.name}</span>
                                                </div>
                                                <span className="text-gray-600">${item.price.toLocaleString('es-AR')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
