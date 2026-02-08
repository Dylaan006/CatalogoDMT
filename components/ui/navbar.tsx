import Link from 'next/link';
import { auth } from '@/auth';
import { CartCounter } from '@/components/cart/cart-counter';
import { MobileMenu } from '@/components/ui/mobile-menu';

export async function Navbar() {
    const session = await auth();
    const isLoggedIn = !!session?.user;
    // @ts-ignore
    const isAdmin = session?.user?.role === 'ADMIN';

    return (
        <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-solid border-gray-200 px-4 lg:px-40 py-3">
            <div className="flex items-center justify-between whitespace-nowrap max-w-[1200px] mx-auto w-full">
                <div className="flex items-center gap-2 lg:gap-4 text-gray-900">
                    <MobileMenu isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

                    <Link href="/" className="flex items-center gap-2">
                        <div className="size-6 text-gray-900">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">CatalogPro</h2>
                    </Link>
                </div>

                <div className="flex flex-1 justify-end gap-8 items-center">
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-gray-900 text-sm font-semibold leading-normal hover:text-gray-600">
                            Catálogo
                        </Link>

                        {/* Admin Links */}
                        {isAdmin && (
                            <>
                                <Link href="/admin/productos" className="text-gray-900 text-sm font-semibold leading-normal hover:text-gray-600">
                                    Productos
                                </Link>
                                <Link href="/admin/ordenes" className="text-gray-900 text-sm font-semibold leading-normal hover:text-gray-600">
                                    Órdenes
                                </Link>
                            </>
                        )}

                        {session?.user ? (
                            <Link href="/profile" className="text-gray-900 text-sm font-medium leading-normal hover:text-gray-600 transition-colors">
                                Mi Perfil
                            </Link>
                        ) : (
                            <Link href="/login" className="text-gray-500 text-sm font-medium leading-normal hover:text-gray-900 transition-colors">
                                Ingresar
                            </Link>
                        )}
                    </nav>
                    <div className="flex items-center gap-3">
                        <CartCounter />
                    </div>
                </div>
            </div>
        </header>
    );
}
