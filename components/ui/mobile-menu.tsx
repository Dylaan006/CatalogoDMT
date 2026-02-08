'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
    isLoggedIn: boolean;
    isAdmin?: boolean;
}

export function MobileMenu({ isLoggedIn, isAdmin }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-50 relative"
                aria-label="Menu"
            >
                <div className="w-6 h-6 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">
                        {isOpen ? 'close' : 'menu'}
                    </span>
                </div>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu Content */}
            {isOpen && (
                <div className="fixed top-[65px] left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40 transition-all duration-300 ease-in-out transform origin-top animate-in slide-in-from-top-2 fade-in-20">
                    <nav className="flex flex-col p-4 gap-2 max-h-[calc(100vh-80px)] overflow-y-auto">

                        {isAdmin && (
                            <>
                                <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Administración</div>
                                <Link
                                    href="/admin/productos"
                                    onClick={() => setIsOpen(false)}
                                    className={`p-4 rounded-xl font-bold flex items-center gap-3 transition-colors ${pathname === '/admin/productos' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span className="material-symbols-outlined">inventory_2</span>
                                    Productos
                                </Link>
                                <Link
                                    href="/admin/ordenes"
                                    onClick={() => setIsOpen(false)}
                                    className={`p-4 rounded-xl font-bold flex items-center gap-3 transition-colors ${pathname === '/admin/ordenes' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span className="material-symbols-outlined">list_alt</span>
                                    Órdenes
                                </Link>
                                <div className="h-px bg-gray-100 mx-4 my-2"></div>
                            </>
                        )}

                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className={`p-4 rounded-xl font-bold flex items-center gap-3 transition-colors ${pathname === '/' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <span className="material-symbols-outlined">storefront</span>
                            Catálogo
                        </Link>

                        {isLoggedIn ? (
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className={`p-4 rounded-xl font-bold flex items-center gap-3 transition-colors ${pathname === '/profile' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="material-symbols-outlined">person</span>
                                Mi Perfil
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className={`p-4 rounded-xl font-bold flex items-center gap-3 transition-colors ${pathname === '/login' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="material-symbols-outlined">login</span>
                                Ingresar
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </div>
    );
}
