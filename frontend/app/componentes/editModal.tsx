"use client";
import { useEffect, useState } from "react";
import { ProductWithImages } from "../lib/types";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithImages | null;
  onSaved?: (updated: ProductWithImages) => void;
};

export default function EditModal({ isOpen, onClose, product, onSaved }: Props) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState<number>(product?.price_per_kg ?? 0);
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [origin, setOrigin] = useState(product?.origin ?? "");
  const [roast, setRoast] = useState(product?.roast_level ?? "");
  const [currency, setCurrency] = useState(product?.currency ?? "EUR");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Imagen: separar el input del preview para evitar errores mientras se escribe
  const [imageUrlInput, setImageUrlInput] = useState(product?.images[0]?.image_url ?? "");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(product?.images[0]?.image_url ?? "");

  useEffect(() => {
    if (isOpen && product) {
      setName(product.name ?? "");
      setDescription(product.description ?? "");
      setPrice(product.price_per_kg ?? 0);
      setBrand(product.brand ?? "");
      setOrigin(product.origin ?? "");
      setRoast(product.roast_level ?? "");
      setCurrency(product.currency ?? "EUR");
      setImageUrlInput(product.images[0]?.image_url ?? "");
      setImagePreviewUrl(product.images[0]?.image_url ?? "");
      setError(null);
    }
  }, [isOpen, product]);

  // Validador básico de URL http/https
  const isValidHttpUrl = (value: string) => {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Debounce para actualizar sólo la previsualización cuando el usuario para de escribir
  useEffect(() => {
    const t = setTimeout(() => {
      if (isValidHttpUrl(imageUrlInput)) {
        setImagePreviewUrl(imageUrlInput);
      } else if (imageUrlInput.trim() === "") {
        // si está vacío, mostramos fallback
        setImagePreviewUrl("");
      } else {
        // no tocar preview hasta que sea válido para evitar errores constantes
      }
    }, 500);
    return () => clearTimeout(t);
  }, [imageUrlInput]);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    if (!product) return;
    const confirmed = confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/admin/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el producto");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const body = {
        name,
        description,
        price_per_kg: price,
        brand,
        origin,
        roast_level: roast,
        currency,
      };
  const res = await fetch(`/admin/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      if (!res.ok) {
        const errPayload = isJson ? await res.json() : { message: await res.text() };
        setError(typeof errPayload === "string" ? errPayload : errPayload?.message || "Error actualizando");
        setSaving(false);
        return;
      }
      const payload = isJson ? await res.json() : { ok: true, data: null };
      const updatedBase = payload?.data && typeof payload.data === "object" ? payload.data : body;
      const updated: ProductWithImages = {
        ...product,
        ...updatedBase,
        images: product.images,
      } as ProductWithImages;
      onSaved?.(updated);
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
        </button>
        <h2 className="text-2xl font-semibold mb-4">Editar producto</h2>
        <div className="flex flex-col gap-4">
          <div>
            {imagePreviewUrl ? (
              <Image
                src={imagePreviewUrl}
                alt={product.name}
                width={640}
                height={360}
                unoptimized
                className="w-full object-cover rounded-lg max-h-72"
              />
            ) : (
              <Image
                src="/logo.webp"
                alt={product.name}
                width={640}
                height={360}
                className="w-full object-cover rounded-lg max-h-72"
              />
            )}
            <input
              type="text"
              placeholder="https://..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="mt-2 border border-stone-300 p-2 rounded w-full"
            />
            {/* Validación ligera solo como hint, sin bloquear */}
            {imageUrlInput && !isValidHttpUrl(imageUrlInput) && (
              <p className="mt-1 text-xs text-stone-500">Introduce una URL válida (http/https). La vista previa se actualiza cuando dejas de escribir.</p>
            )}
          </div>
          <label className="text-sm text-stone-700">Nombre
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
          </label>
          <label className="text-sm text-stone-700">Descripción
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full min-h-24" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-stone-700">Precio/kg
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
            <label className="text-sm text-stone-700">Moneda
              <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm text-stone-700">Marca
              <input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
            <label className="text-sm text-stone-700">Origen
              <input value={origin} onChange={(e) => setOrigin(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full" />
            </label>
            <label className="text-sm text-stone-700">Tueste
              <select value={roast} onChange={(e) => setRoast(e.target.value)} className="mt-1 border border-stone-300 p-2 rounded w-full">
                <option value="">Seleccionar tueste</option>
                <option value="Light">Claro</option>
                <option value="Medium-Light">Medio-Claro</option>
                <option value="Medium">Medio</option>
                <option value="Medium-Dark">Medio-Oscuro</option>
                <option value="Dark">Oscuro</option>
              </select>
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={handleDelete} className="cursor-pointer px-4 py-2 rounded border border-stone-300">Borrar</button>
            <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 rounded border border-stone-300">Cancelar</button>
            <button type="button" disabled={saving} onClick={handleSave} className="cursor-pointer px-4 py-2 rounded bg-stone-900 text-white disabled:opacity-60">
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
