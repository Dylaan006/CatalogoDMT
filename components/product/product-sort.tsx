'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function ProductSort() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSort(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('sort', term);
        } else {
            params.delete('sort');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            <span className="hidden sm:inline">Ordenar:</span>
            <select
                className="border-none bg-transparent text-gray-900 font-bold focus:ring-0 cursor-pointer text-sm p-0 pr-8"
                onChange={(e) => handleSort(e.target.value)}
                defaultValue={searchParams.get('sort')?.toString()}
            >
                <option value="">Destacados</option>
                <option value="precio_menor">Menor Precio</option>
                <option value="precio_mayor">Mayor Precio</option>
            </select>
        </div>
    );
}
