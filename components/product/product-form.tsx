'use client';

import { Product } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
    product?: Product;
    action: (formData: FormData) => Promise<any>;
}

export function ProductForm({ product, action }: ProductFormProps) {
    const [images, setImages] = useState<string[]>(product ? JSON.parse(product.images) : []);
    const [isPending, setIsPending] = useState(false);

    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPending(true);
        const formData = new FormData(event.currentTarget);

        try {
            const result = await action(formData);
            if (result && result.success && result.redirectUrl) {
                router.push(result.redirectUrl);
            } else if (result && !result.success) {
                alert(result.error || 'Ocurrió un error al guardar el producto.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error inesperado.');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="w-full max-w-[800px] flex flex-col gap-6 mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-gray-900 text-3xl font-black tracking-tight">{product ? 'Editar Producto' : 'Crear Nuevo Producto'}</h1>
                <p className="text-gray-500 text-base">Complete el formulario a continuación para {product ? 'editar el' : 'agregar un nuevo'} artículo a su catálogo.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">

                    {/* Info Basica */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="material-symbols-outlined text-gray-500">info</span>
                            <h3 className="text-lg font-bold text-gray-900">Información Básica</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-gray-700">Nombre del Producto *</span>
                                <input name="name" defaultValue={product?.name} required placeholder="ej. Stitch Peluche" type="text" className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 h-12 px-4 text-gray-900 placeholder:text-gray-400" />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-gray-700">Categoría *</span>
                                <input name="category" defaultValue={product?.category} required placeholder="ej. Peluches" className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 h-12 px-4 text-gray-900 placeholder:text-gray-400" />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-gray-700">Precio (ARS) *</span>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input name="price" type="number" defaultValue={product?.price} required min="0" step="0.01" placeholder="0.00" className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 h-12 pl-8 pr-4 text-gray-900 placeholder:text-gray-400" />
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Descripcion */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="material-symbols-outlined text-gray-500">description</span>
                            <h3 className="text-lg font-bold text-gray-900">Descripción</h3>
                        </div>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-700">Descripción Completa</span>
                            <textarea name="description" defaultValue={product?.description} required rows={4} className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 p-4 resize-none text-gray-900 placeholder:text-gray-400" placeholder="Descripción detallada..."></textarea>
                        </label>
                    </section>

                    {/* Imagenes */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="material-symbols-outlined text-gray-500">image</span>
                            <h3 className="text-lg font-bold text-gray-900">Imágenes</h3>
                        </div>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center gap-3 bg-gray-50 relative hover:bg-gray-100 transition-colors">
                            <input
                                type="file"
                                name="images"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-900 font-bold text-base">Haga clic para subir o arrastrar archivos</p>
                                <p className="text-gray-500 text-sm">PNG, JPG o WebP</p>
                            </div>
                            <div className="mt-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm text-gray-700 hover:text-gray-900">
                                Seleccionar Archivos
                            </div>
                        </div>

                        {/* Existing Images Preview */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative group">
                                        <div className="w-full h-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url("${img}")` }}></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                    <button type="button" className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-bold hover:bg-white hover:border-gray-300 transition-all order-2 sm:order-1" onClick={() => window.history.back()}>
                        Cancelar
                    </button>
                    <button disabled={isPending} type="submit" className="px-8 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 shadow-lg shadow-gray-900/10 disabled:opacity-50 hover:shadow-gray-900/20 transform hover:-translate-y-0.5">
                        <span className="material-symbols-outlined">save</span>
                        {isPending ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>
            </form>
        </div>
    );
}
