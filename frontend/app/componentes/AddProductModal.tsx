"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductWithImages } from "@/app/lib/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (p: ProductWithImages) => void;
};

export default function AddProductModal({ isOpen, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState("EUR");
  const [brand, setBrand] = useState("");
  const [origin, setOrigin] = useState("");
  const [roast, setRoast] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setPrice(0);
      setCurrency("EUR");
      setBrand("");
      setOrigin("");
      setRoast("");
      setImageUrl("");
      setAltText("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        product: {
          name,
          description,
          price_per_kg: price,
          currency,
          brand,
          origin,
          roast_level: roast,
        },
        images: imageUrl
          ? [
              {
                image_url: imageUrl,
                alt_text: altText || name,
                is_main: true,
              },
            ]
          : [],
      };

      const res = await fetch("/admin/api/products/full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const ct = res.headers.get("content-type") || "";
      const isJson = ct.includes("application/json");
      if (!res.ok) {
        const err = isJson ? await res.json() : { message: await res.text() };
        setError((err && (err.error?.message || err.error || err.message)) || "Error creando producto");
        setSaving(false);
        return;
      }
      const data = (isJson ? await res.json() : { ok: true, data: null }) as { ok?: boolean; data?: unknown };
      // intentar extraer forma conocida del backend sin usar any
      let createdRaw: Partial<ProductWithImages> | undefined = undefined;
      if (data && typeof data === "object" && "data" in data) {
        const val = (data as Record<string, unknown>)["data"];
        if (val && typeof val === "object") {
          createdRaw = val as Partial<ProductWithImages>;
        }
      }
      const createdProduct: ProductWithImages = {
        id: (createdRaw?.id as number) ?? Math.floor(Math.random() * 1_000_000),
        name,
        description,
        price_per_kg: price,
        currency,
        brand,
        origin,
        roast_level: roast,
        images:
          (createdRaw?.images as ProductWithImages["images"]) ||
          (imageUrl
            ? [
                {
                  id: Math.floor(Math.random() * 1_000_000),
                  image_url: imageUrl,
                  alt_text: altText || name,
                  is_main: true,
                },
              ]
            : []),
      };
      onCreated(createdProduct);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-stone-500 hover:text-stone-700"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-4">Añadir producto</h2>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-stone-700">Nombre
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
            <label className="text-sm text-stone-700">Precio/kg
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value || "0"))} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
          </div>
          <label className="text-sm text-stone-700">Descripción
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full min-h-24" />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm text-stone-700">Moneda
              <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
            <label className="text-sm text-stone-700">Marca
              <input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
            <label className="text-sm text-stone-700">Origen
              <input value={origin} onChange={(e) => setOrigin(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
          </div>
          <label className="text-sm text-stone-700">Tueste
            <input value={roast} onChange={(e) => setRoast(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
          </label>

          <div className="mt-2">
            <p className="text-sm font-medium text-stone-700">Imagen principal</p>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <label className="text-sm text-stone-700">URL
                <input value={imageUrl} placeholder="https://..." onChange={(e) => setImageUrl(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
              </label>
              <label className="text-sm text-stone-700">Alt
                <input value={altText} onChange={(e) => setAltText(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
              </label>
            </div>
            <div className="mt-2">
              <Image src={imageUrl || "/logo.webp"} alt={altText || name || "preview"} width={640} height={360} unoptimized className="w-full object-cover rounded-lg max-h-60" />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-stone-300">Cancelar</button>
            <button type="button" disabled={saving} onClick={handleCreate} className="px-4 py-2 rounded bg-stone-900 text-white disabled:opacity-60">{saving ? "Creando..." : "Crear"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
