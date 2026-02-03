import { getProducts, getCategories } from '@/lib/data';
import { ProductCard } from '@/components/product/product-card';
import { ProductSort } from '@/components/product/product-sort';
import Link from 'next/link';

export default async function Home(props: {
  searchParams?: Promise<{ query?: string; category?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const category = searchParams?.category || '';
  const sort = searchParams?.sort || '';

  const products = await getProducts(query, category, sort);
  const categories = await getCategories();

  return (
    <main className="flex-1 px-4 lg:px-40 py-8 max-w-[1280px] mx-auto w-full mb-12">
      <div className="flex flex-col gap-6 mb-8">
        <div className="w-full">
          <form className="flex flex-col min-w-40 h-14 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
              <div className="text-gray-400 flex border-none bg-white items-center justify-center pl-5 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                name="query"
                defaultValue={query}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-gray-900 focus:outline-0 focus:ring-0 border-none bg-white focus:border-none h-full placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                placeholder="Buscar productos..."
              />
              {/* Maintain category if set */}
              {category && <input type="hidden" name="category" value={category} />}
              {/* Maintain sort if set */}
              {sort && <input type="hidden" name="sort" value={sort} />}
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-4">
          <div className="flex gap-3 flex-wrap">
            <Link href={`/?query=${query}&sort=${sort}`}>
              <div className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full px-6 transition-all border border-gray-800 ${category === '' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-800 hover:text-white'}`}>
                <p className={`text-sm font-bold leading-normal`}>Todos</p>
              </div>
            </Link>
            {categories.map((cat) => (
              <Link key={cat} href={`/?category=${cat}&query=${query}&sort=${sort}`}>
                <div className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full px-6 transition-all border border-gray-800 ${category === cat ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-800 hover:text-white'}`}>
                  <p className={`text-sm font-bold leading-normal`}>
                    {cat}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <ProductSort />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500">
            No se encontraron productos{query ? ` para "${query}"` : ''}.
          </div>
        )}
      </div>

      {/* Mobile Sticky Button */}
      <div className="md:hidden sticky bottom-6 left-0 right-0 px-4 mt-8 pointer-events-none">
        <a href="https://wa.me/5491112345678" className="pointer-events-auto flex w-full cursor-pointer items-center justify-center rounded-full h-14 bg-accent-gray text-white gap-2 font-bold shadow-2xl">
          <span className="material-symbols-outlined">chat</span>
          <span>Consultar por WhatsApp</span>
        </a>
      </div>
    </main>
  );
}
