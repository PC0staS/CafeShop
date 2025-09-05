// app/products/page.tsx
import { fetchProductsWithImages } from "../lib/FetchProducts";
import Navbar from "../componentes/Navbar";
import Image from "next/image";
import Link from "next/link";


// ISR: regenerar cada 60 segundos
export const revalidate = 60;


const limit = 10;

export default async function ProductsPage({ searchParams }: { searchParams?: { skip?: string } }) {
  // Obtener skip desde los parámetros de la URL
  const skip = Number(searchParams?.skip) || 0;
  // Fetch en servidor
  const products = await fetchProductsWithImages(skip, limit);
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-30 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-[var(--coffee-brown)]">Nuestro catálogo de cafés</h1>
        <h2 className="text-lg md:text-xl text-stone-600 mt-3">Descubre nuestros productos</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto justify-items-center py-10 w-full">
            {products.map((p) => {
              const maxDescLength = 60;
              const desc = p.description?.length > maxDescLength
                ? p.description.slice(0, maxDescLength) + "..."
                : p.description;
              return (
                <Link
                  key={p.id}
                  className="group transition-all duration-300 border border-stone-200 bg-white hover:bg-stone-50 rounded-xl flex flex-col items-center p-5 w-full max-w-sm shadow-sm hover:shadow-md"
                  href={`/products/${p.id}`}
                >
                  <Image
                    src={p.images[0].image_url}
                    alt={p.name}
                    width={320}
                    height={240}
                    className="w-full object-cover rounded-lg mb-4 group-hover:brightness-95"
                    transition-name={`product-image-${p.id}`}
                  />
                  <h2 className="text-xl md:text-2xl font-semibold text-stone-800 mb-1 text-center">{p.name}</h2>
                  <span className="text-sm text-stone-600 text-center px-2 mb-2">{desc}</span>
                  <p className="text-base font-medium text-[var(--coffee-brown)] mb-4">{p.price_per_kg} € / kg</p>
                  <span className="mt-auto">
                    <span className="inline-flex items-center px-5 py-2 rounded-md border border-stone-300 text-stone-700 bg-white hover:bg-stone-100 transition-colors">Ver más</span>
                  </span>
                </Link>
              );
            })}
        </ul>
      </div>
    <div className="flex justify-center items-center mt-6 pb-12">
      <form action="" method="GET" className="flex gap-4">
        {skip > 0 && (
          <button
            type="submit"
            name="skip"
            value={Math.max(skip - limit, 0)}
            className="px-4 py-2 rounded-md border border-stone-300 text-stone-700 bg-white hover:bg-stone-100 transition-colors"
          >
            ← Anterior
          </button>
        )}
        {products.length >= limit && (
          <button
            type="submit"
            name="skip"
            value={skip + limit}
            className="px-4 py-2 rounded-md border border-stone-300 text-stone-700 bg-white hover:bg-stone-100 transition-colors"
          >
            Siguiente →
          </button>
        )}
      </form>
    </div>
    </div>
  );
}
