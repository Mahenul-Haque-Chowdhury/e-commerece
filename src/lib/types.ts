export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  brand: string;
  badges?: Array<"New" | "Sale" | "Best" | "Hot">;
  createdAt: string; // ISO
};

export type CartItem = {
  productId: string;
  quantity: number;
};
