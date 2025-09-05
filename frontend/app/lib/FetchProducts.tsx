import { API_URL } from "@/constants";
import { Images, Product, ProductWithImages } from "./types";

export async function fetchProducts(skip: number, limit: number): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export async function fetchImages(productId: number): Promise<Images[]> {
  const response = await fetch(`${API_URL}/products/${productId}/images`);
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  return response.json();
}

export async function fetchProduct(id: string): Promise<ProductWithImages | null> {
  const response = await fetch(`${API_URL}/products/${id}`);
if (!response.ok) {
    if (response.status === 404) {
        return null;
    }
    throw new Error('Failed to fetch product');
}
  const product = await response.json();
  const images = await fetchImages(product.id);
  return { ...product, images } as ProductWithImages;
}

export async function fetchProductsWithImages(skip: number, limit: number = 10): Promise<ProductWithImages[]> {
  const products = await fetchProducts(skip, limit);
  for (const product of products) {
    if (!product) {
      throw new Error('Product not found');
    }
    const images = await fetchImages(product.id);
    (product as ProductWithImages).images = images;
  }
  return products as ProductWithImages[];
}
