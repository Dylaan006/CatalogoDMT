'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-gray-400">Sin Imagen</span>
            </div>
        );
    }

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            {/* Main Image Container */}
            <div className="relative w-full aspect-square bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center group">
                <img
                    src={images[selectedIndex]}
                    alt={`${productName} - Imagen ${selectedIndex + 1}`}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Navigation Arrows (only if > 1 image) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Imagen anterior"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Siguiente imagen"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedIndex(idx)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all shadow-sm",
                                        idx === selectedIndex ? "bg-gray-900 w-4" : "bg-gray-300 hover:bg-gray-400"
                                    )}
                                    aria-label={`Ir a imagen ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails (only if > 1 image) */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                                "relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden bg-white",
                                idx === selectedIndex ? "border-gray-900 ring-2 ring-gray-900/10" : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
