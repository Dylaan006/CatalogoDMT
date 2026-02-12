import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { ProductGallery } from '@/components/product/product-gallery';
import { getProductById, getAdminUser } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const [product, admin] = await Promise.all([
        getProductById(params.id),
        getAdminUser()
    ]);

    if (!product) {
        notFound();
    }

    const formattedPrice = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(product.price);

    const whatsAppNumber = admin?.phoneNumber?.replace(/\D/g, '') || '5491112345678';
    const whatsappLink = `https://wa.me/${whatsAppNumber}?text=Hola,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20${encodeURIComponent(product.name)}`;

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
                    {/* Gallery Section */}
                    {/* Using ProductGallery Client Component */}
                    <div className="w-full lg:w-[600px]">
                        {(() => {
                            let images: string[] = [];
                            try {
                                images = JSON.parse(product.images);
                            } catch (e) {
                                images = [];
                            }

                            if (typeof images === 'string') images = [images];
                            if (!Array.isArray(images) || images.length === 0) images = [];
                            if (images.length === 0) images = ['https://placehold.co/600x600/png?text=Sin+Imagen'];

                            return <ProductGallery images={images} productName={product.name} />;
                        })()}
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-col w-full lg:w-[420px] gap-8">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-gray-900 text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em]">{product.name}</h1>
                            <div className="flex flex-col mt-1">
                                <p className="text-3xl font-black text-gray-900">{formattedPrice}</p>
                                {!product.inStock && (
                                    <p className="text-sm font-medium text-red-500 mt-1">Sin Stock</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <AddToCartButton product={product} fullWidth />

                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-3 bg-black text-white rounded-xl h-14 text-lg font-bold hover:bg-gray-800 transition-colors shadow-sm">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
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
                                {(() => {
                                    try {
                                        // @ts-ignore
                                        const specs = product.specifications ? JSON.parse(product.specifications) : {};
                                        return Object.entries(specs).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                                                <span className="text-sm text-gray-500 font-medium">{key}</span>
                                                <span className="text-sm font-semibold text-gray-900">{value as string}</span>
                                            </div>
                                        ));
                                    } catch (e) {
                                        return null;
                                    }
                                })()}
                            </div>
                        </div>

                    </div>
                </div>

                {(() => {
                    try {
                        // @ts-ignore
                        const boxItems = product.boxContent ? JSON.parse(product.boxContent) : [];

                        if (!Array.isArray(boxItems) || boxItems.length === 0) return null;

                        return (
                            <div className="mt-20 py-10 border-t border-gray-200">
                                <h2 className="text-2xl font-bold mb-8 text-gray-900">Contenido</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {boxItems.map((item: string, idx: number) => (
                                        <div key={idx} className="bg-white p-6 rounded-2xl text-center border border-gray-100 transition-all hover:shadow-md flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-3xl text-gray-900">check_circle</span>
                                            <p className="text-sm font-bold text-gray-900">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    } catch (e) {
                        return null;
                    }
                })()}

            </div>
        </div>
    );
}
