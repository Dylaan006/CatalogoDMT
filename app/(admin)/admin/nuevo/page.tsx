import { createProduct } from '@/lib/actions';
import { ProductForm } from '@/components/product/product-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewProductPage() {
    return (
        <div className="py-10 px-6 lg:px-40">
            <div className="mb-8">
                <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-gray-600 text-gray-500">
                    <Link href="/admin/dashboard" className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Volver al Dashboard
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Nuevo Producto</h1>
            </div>
            <ProductForm action={createProduct} />
        </div>
    );
}
