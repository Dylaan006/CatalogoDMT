'use client';

import { Product } from '@prisma/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertModal } from '@/components/ui/alert-modal';

interface ProductFormProps {
    product?: Product;
    action: (formData: FormData) => Promise<any>;
}

export function ProductForm({ product, action }: ProductFormProps) {
    // Images
    const [existingImages, setExistingImages] = useState<string[]>(product && product.images ? JSON.parse(product.images) : []);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    // Box Content
    // @ts-ignore: Pending Prisma Client regeneration for boxContent type
    const initialBoxContent = product?.boxContent ? JSON.parse(product.boxContent) : [];
    const [boxItems, setBoxItems] = useState<string[]>(Array.isArray(initialBoxContent) ? initialBoxContent : []);
    const [newBoxItem, setNewBoxItem] = useState('');

    // Specifications
    // @ts-ignore: Pending Prisma Client regeneration for specifications type
    const initialSpecs = product?.specifications ? JSON.parse(product.specifications) : {};
    const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
        Object.entries(initialSpecs).map(([key, value]) => ({ key, value: String(value) }))
    );
    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');

    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);

    // Image Handle
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPreviews: string[] = [];
            Array.from(files).forEach(file => {
                newPreviews.push(URL.createObjectURL(file));
            });
            setPreviewImages(newPreviews);
        }
    };

    // Box Content Handle
    const addBoxItem = () => {
        if (newBoxItem.trim()) {
            setBoxItems([...boxItems, newBoxItem.trim()]);
            setNewBoxItem('');
        }
    };

    const removeBoxItem = (index: number) => {
        setBoxItems(boxItems.filter((_, i) => i !== index));
    };

    // Specs Handle
    const addSpec = () => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            setSpecs([...specs, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
            setNewSpecKey('');
            setNewSpecValue('');
        }
    };

    const removeSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPending(true);
        const formData = new FormData(event.currentTarget);

        try {
            const result = await action(formData);
            if (result && result.success && result.redirectUrl) {
                router.push(result.redirectUrl);
            } else if (result && !result.success) {
                setError(result.error || 'Ocurrió un error al guardar el producto.');
            }
        } catch (error) {
            console.error(error);
            setError('Ocurrió un error inesperado.');
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

                    {/* Hidden Inputs for JSON Data */}
                    <input type="hidden" name="boxContent" value={JSON.stringify(boxItems)} />
                    <input type="hidden" name="specifications" value={JSON.stringify(
                        specs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
                    )} />

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

                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-gray-700">Estado</span>
                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors h-12">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        defaultChecked={product ? product.inStock : true}
                                        className="w-5 h-5 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-900 font-medium">En Stock (Disponible para venta)</span>
                                </label>
                            </div>
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

                    {/* Specifications (Dynamic) */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="material-symbols-outlined text-gray-500">tune</span>
                            <h3 className="text-lg font-bold text-gray-900">Especificaciones</h3>
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={newSpecKey}
                                onChange={(e) => setNewSpecKey(e.target.value)}
                                placeholder="Nombre (ej. Material)"
                                className="flex-1 rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 h-10 px-3 text-sm"
                            />
                            <input
                                value={newSpecValue}
                                onChange={(e) => setNewSpecValue(e.target.value)}
                                placeholder="Valor (ej. Algodón)"
                                className="flex-1 rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 h-10 px-3 text-sm"
                            />
                            <button type="button" onClick={addSpec} className="px-4 h-10 bg-gray-900 text-white rounded-lg text-sm font-bold">Agregar</button>
                        </div>

                        {specs.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                {specs.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                        <div className="text-sm">
                                            <span className="font-bold text-gray-700">{item.key}:</span> <span className="text-gray-600">{item.value}</span>
                                        </div>
                                        <button type="button" onClick={() => removeSpec(idx)} className="text-red-500 hover:text-red-700">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Box Content (Dynamic) */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="material-symbols-outlined text-gray-500">package_2</span>
                            <h3 className="text-lg font-bold text-gray-900">Contenido</h3>
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={newBoxItem}
                                onChange={(e) => setNewBoxItem(e.target.value)}
                                placeholder="Item (ej. Manual de usuario)"
                                className="flex-1 rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900 h-10 px-3 text-sm"
                            />
                            <button type="button" onClick={addBoxItem} className="px-4 h-10 bg-gray-900 text-white rounded-lg text-sm font-bold">Agregar</button>
                        </div>

                        {boxItems.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                {boxItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                        <span className="text-sm text-gray-700">{item}</span>
                                        <button type="button" onClick={() => removeBoxItem(idx)} className="text-red-500 hover:text-red-700">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                onChange={handleImageChange}
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

                        {/* Combined Image Previews */}
                        {(existingImages.length > 0 || previewImages.length > 0) && (
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">

                                {/* Existing */}
                                {existingImages.map((img, idx) => (
                                    <div key={`existing-${idx}`} className="aspect-square rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative group">
                                        <div className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs font-bold text-gray-600 z-10">Anterior</div>
                                        <div className="w-full h-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url("${img}")` }}></div>
                                    </div>
                                ))}

                                {/* New Previews */}
                                {previewImages.map((img, idx) => (
                                    <div key={`new-${idx}`} className="aspect-square rounded-lg bg-gray-100 border-2 border-green-500 overflow-hidden relative group">
                                        <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5 z-10">
                                            <span className="material-symbols-outlined text-sm block">check</span>
                                        </div>
                                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
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

            <AlertModal
                isOpen={!!error}
                onClose={() => setError(null)}
                title="Error"
                description={error || ''}
            />
        </div>
    );
}
