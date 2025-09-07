'use client'
import EditModal from '../componentes/editModal';
import AddProductModal from '../componentes/AddProductModal';
import Image from 'next/image';
import { fetchProductsWithImages } from "../lib/FetchProducts";
import { useEffect, useState } from "react";
import { ProductWithImages } from "../lib/types";

export default function AdminPage() {
    const limit = 100;
    const skip = 0;
    const [products, setProducts] = useState<ProductWithImages[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleLogOut = async () => {
        const res = await fetch(`/api/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
            if (typeof window !== "undefined") {
                window.location.assign("/admin/login");
            }
        }
    };
  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };
    useEffect(() => {
        const fetchData = async () => {
            const products = await fetchProductsWithImages(skip, limit);
            setProducts(products);
        };
        fetchData();
    }, []);
  return (
    <div className="flex flex-col items-center min-h-screen py-2">
        <div className="relative w-full flex flex-col items-center border-b border-stone-300 mb-6 pb-4">
            <h1 className="text-4xl font-bold mb-4 pt-5">Admin Dashboard</h1>
            <p className="text-lg">Welcome to the admin panel</p>
            <button type='button' onClick={() => handleAddProduct()} className="cursor-pointer absolute top-4 right-24 p-2 border-2 border-red-700 text-black rounded-full">Añadir producto</button>
            <button type="button" onClick={() => handleLogOut()} className="cursor-pointer absolute top-4 right-4 p-2 border-2 border-black text-black rounded-full">Logout</button>
        </div>
    <div className="min-h-screen ">
      <div className="container flex flex-col items-center">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto justify-items-center py-10 w-full">
            {products.map((p) => {
              const maxDescLength = 60;
              const desc = p.description?.length > maxDescLength
                ? p.description.slice(0, maxDescLength) + "..."
                : p.description;
              return (
                <div
                  key={p.id}
                  className="group transition-all duration-300 border border-stone-200 bg-white hover:bg-stone-50 rounded-xl flex flex-col items-center p-5 w-full max-w-sm shadow-sm hover:shadow-md"
                >
                  <Image
                    src={p.images[0].image_url}
                    alt={p.name}
                    width={320}
                    height={240}
                    className="w-full object-cover rounded-lg mb-4 group-hover:brightness-95 h-60 max-h-60"
                  />
                  <h2 className="text-xl md:text-2xl font-semibold text-stone-800 mb-1 text-center">{p.name}</h2>
                  <span className="text-sm text-stone-600 text-center px-2 mb-2">{desc}</span>
                  <p className="text-base font-medium text-[var(--coffee-brown)] mb-4">{p.price_per_kg} {p.currency} / kg</p>
                  <span className="mt-auto">
                    <span onClick={() => { setSelectedProduct(p); setIsEditModalOpen(true); }} className="inline-flex items-center px-5 py-2 rounded-md border border-stone-300 text-stone-700 bg-white hover:bg-stone-100 transition-colors cursor-pointer">Editar</span>
                  </span>
                </div>
              );
            })}
        </ul>
      </div>
    </div>
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={(updated) => {
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(created) => {
            setProducts((prev) => [created, ...prev]);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
