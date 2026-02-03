import Link from 'next/link';
import { Product } from '@prisma/client';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const images = JSON.parse(product.images) as string[];
    const mainImage = images[0] || '/placeholder.png';

    const formattedPrice = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
    }).format(product.price);

    return (
        <Link
            href={`/producto/${product.id}`}
            className="group product-card flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 block"
        >
            <div
                className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover transition-transform duration-500 group-hover:scale-105 bg-gray-100"
                style={{ backgroundImage: `url("${mainImage}")` }}
                role="img"
                aria-label={product.name}
            ></div>

            <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{product.category}</p>
                    <p className="text-gray-900 font-bold">{formattedPrice}</p>
                </div>
                <h3 className="text-gray-900 text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                    {product.description}
                </p>
            </div>
        </Link>
    );
}
