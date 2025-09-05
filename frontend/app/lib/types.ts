export type Product = {
  id: number;
  name: string;
  description: string;
  price_per_kg: number;
  currency: string;
  brand: string;
  origin: string;
  roast_level: string;
};

export type Images = {
  id: number;
  image_url: string;
  alt_text: string;
  is_main: boolean;
}

export type ProductWithImages = Product & {
  images: Images[];
};
