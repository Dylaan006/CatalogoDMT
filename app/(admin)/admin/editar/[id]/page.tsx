import { updateProduct } from '@/lib/actions';
import { getProductById } from '@/lib/data';
import { ProductForm } from '@/components/product/product-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    const updateProductWithId = updateProduct.bind(null, product.id);

    return (
        <div className="py-10 px-6 lg:px-40">
            <div className="mb-8">
                <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-gray-600 text-gray-500">
                    <Link href="/admin/productos" className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Volver a Productos
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Editar Producto</h1>
            </div>
            <ProductForm product={product} action={updateProductWithId} />
        </div>
    );
}
