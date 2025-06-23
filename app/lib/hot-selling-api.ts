import { getClientEnv } from '@/lib/env.server';

// API Response Types for Hot Selling Products
export interface ApiHotSellingProduct {
  uuid: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  stock_count: number;
  short_desc: string;
  variant_count: number;
  primary_image_url: string;
  has_variant: boolean;
}

export interface HotSellingApiResponse {
  data: {
    products: ApiHotSellingProduct[];
  };
}

// Transform API product to our Product interface
export interface HotSellingProduct {
  uuid: string;
  name: string;
  sku: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  stockCount: number;
  inStock: boolean;
  description?: string;
  hasVariant: boolean;
}

export function transformApiHotSellingProduct(apiProduct: ApiHotSellingProduct): HotSellingProduct {
  return {
    uuid: apiProduct.uuid,
    name: apiProduct.name,
    sku: apiProduct.sku,
    slug: apiProduct.slug,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price || undefined,
    image: apiProduct.primary_image_url,
    stockCount: apiProduct.stock_count,
    inStock: apiProduct.stock_count > 0,
    description: apiProduct.short_desc || undefined,
    hasVariant: apiProduct.has_variant,
  };
}

export async function fetchHotSellingProducts(): Promise<HotSellingProduct[]> {
  const env = getClientEnv();
  const apiUrl = env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not configured');
  }

  const response = await fetch(`${apiUrl}/v1/products/hot-selling`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data: HotSellingApiResponse = await response.json();
  return data.data.products.map(transformApiHotSellingProduct);
}