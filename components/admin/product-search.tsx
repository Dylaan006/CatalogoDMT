'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function ProductSearch() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`/admin/productos?${params.toString()}`);
    }, 300);

    return (
        <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
            </span>
            <input
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full md:w-64 transition-all"
                placeholder="Buscar por nombre o código..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    );
}
