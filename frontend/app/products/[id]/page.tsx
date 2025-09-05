import Navbar from "@/app/componentes/Navbar";
import { fetchProduct } from "@/app/lib/FetchProducts";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60; // ISR: cada 60 segundos

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <p className="text-stone-700">Producto no encontrado</p>
          <Link href="/products" className="inline-block mt-4 text-stone-700 hover:text-stone-900">← Volver al catálogo</Link>
        </main>
      </div>
    );
  }

  const mainImage = product.images?.find((img) => img.is_main) ?? product.images?.[0];
  const imageUrl = mainImage?.image_url || "/coffee_image.png";
  const imageAlt = mainImage?.alt_text || product.name;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="container mx-auto px-4 py-10 pt-30">
        <Link href="/products" className="text-sm text-stone-600 hover:text-stone-800">← Volver al catálogo</Link>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Imagen principal */}
          <div className="bg-white border border-stone-200 rounded-xl p-2 shadow-sm">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={900}
              height={700}
              className="w-full h-auto object-cover rounded-lg"
              priority
              transition-name={`product-image-${product.id}`}
            />
          </div>

          {/* Detalles del producto */}
          <section>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-stone-900">{product.name}</h1>
            <p className="mt-2 text-stone-600">
              {product.brand} • {product.origin} • Tueste: {product.roast_level}
            </p>
            <p className="mt-5 text-2xl font-medium text-[var(--coffee-brown)]">{product.price_per_kg} {product.currency} / kg</p>

            <p className="mt-6 text-stone-700 leading-relaxed">{product.description}</p>

            <div className="mt-8 flex gap-3">
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
