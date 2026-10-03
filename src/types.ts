export const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type Size = typeof ALL_SIZES[number];

export type ProductAvailability = 'in_stock' | 'sold_out' | 'coming_soon' | 'limited';

export interface Product {
  id: string | number;
  title: string;
  title_ar?: string;
  price: number;
  currency?: string;
  image_url: string;
  images?: string[];
  category: string;
  category_ar?: string;
  sizes: string[];
  width?: number | null;
  height?: number | null;
  description?: string;
  description_ar?: string;
  tags?: string[];
  created_at?: string;
  availability?: ProductAvailability;
}

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
