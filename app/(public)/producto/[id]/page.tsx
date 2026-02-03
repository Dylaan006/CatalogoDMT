import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { getProductById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    const formattedPrice = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(product.price);

    const whatsappLink = `https://wa.me/5491112345678?text=Hola,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20${encodeURIComponent(product.name)}`;

    return (
        <div className="flex flex-1 justify-center py-8 bg-gray-50 min-h-screen">
            <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 lg:px-10">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-gray-900 transition-colors">Inicio</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.category}</span>
                    <span>/</span>
                    <span className="truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 mt-4">
                    {/* Gallery Section */}
                    <div className="w-full lg:w-[600px] bg-white rounded-2xl aspect-square flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative group">
                        {(() => {
                            let images: string[] = [];
                            try {
                                images = JSON.parse(product.images);
                            } catch (e) {
                                images = [];
                            }

                            if (typeof images === 'string') images = [images];
                            if (!Array.isArray(images) || images.length === 0) images = [];

                            const coverImage = images[0] || 'https://placehold.co/600x600/png?text=Sin+Imagen';

                            return (
                                <img
                                    src={coverImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4"
                                />
                            );
                        })()}
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-col w-full lg:w-[420px] gap-8">
                        <div className="flex flex-col gap-3">
                            <span className="bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-fit">En stock</span>
                            <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">{product.name}</h1>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-3xl font-black text-gray-900">{formattedPrice}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <AddToCartButton product={product} fullWidth />

                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-3 bg-white border border-gray-200 text-gray-900 rounded-xl h-14 text-lg font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[#25D366] text-2xl">chat</span>
                                Consultar por WhatsApp
                            </a>
                            <p className="text-gray-400 text-[12px] text-center px-4">Respuesta instantánea en menos de 15 minutos durante horario comercial.</p>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-bold text-gray-900">Descripción del producto</h3>
                            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-bold text-gray-900">Especificaciones</h3>
                            <div className="grid grid-cols-1 gap-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                                    <span className="text-sm text-gray-500 font-medium">Categoría</span>
                                    <span className="text-sm font-semibold text-gray-900">{product.category}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                                    <span className="text-sm text-gray-500 font-medium">Disponibilidad</span>
                                    <span className="text-sm font-semibold text-gray-900">Inmediata</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-20 py-10 border-t border-gray-200">
                    <h2 className="text-2xl font-bold mb-8 text-gray-900">Contenido de la caja</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl text-center border border-gray-100 transition-all hover:shadow-md flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-gray-900">inventory_2</span>
                            <p className="text-sm font-bold text-gray-900">Producto Original</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl text-center border border-gray-100 transition-all hover:shadow-md flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-gray-900">verified</span>
                            <p className="text-sm font-bold text-gray-900">Garantía</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
