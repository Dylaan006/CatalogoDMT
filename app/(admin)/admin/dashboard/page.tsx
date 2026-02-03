import { getProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { deleteProduct } from '@/lib/actions';
import Image from 'next/image';

export default async function AdminDashboard() {
    const products = await getProducts();

    return (
        <div className="py-10 px-6 lg:px-40">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Productos</h1>
                    <p className="text-gray-500 mt-1">Administra tu catálogo de productos desde aquí.</p>
                </div>
                <Button asChild className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6">
                    <Link href="/admin/nuevo">
                        <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                        Agregar Producto
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Producto</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Categoría</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Precio</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => {
                            const images = JSON.parse(product.images) as string[];
                            const mainImage = images[0] || '/placeholder.png';
                            return (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                <Image src={mainImage} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild variant="outline" size="sm" className="h-8 border-gray-200 hover:bg-gray-100 hover:text-gray-900 text-gray-600">
                                                <Link href={`/admin/editar/${product.id}`}>Editar</Link>
                                            </Button>
                                            <form action={deleteProduct.bind(null, product.id)}>
                                                <Button variant="destructive" size="sm" type="submit" className="h-8 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 shadow-none">Eliminar</Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl text-gray-300">inventory_2</span>
                                        <p>No hay productos cargados en el catálogo.</p>
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
