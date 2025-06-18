import { getApiUrl } from '@/lib/env.client';
import { getClientEnv } from '@/lib/env.server';

// API Response Types
export interface ApiProduct {
  uuid: string;
  sku: string;
  name: string;
  price: number;
  original_price: number | null;
  category: string | null;
  stock_count: number;
  specs: any;
  created_at: string | null;
  updated_at: string | null;
  ready_for_sale: boolean;
  full_desc: string | null;
  reserved_count: number;
  short_desc: string;
  primary_image_url: string;
  has_variant: boolean;
  variant_count: number;
}

export interface ProductsApiResponse {
  data: {
    products: ApiProduct[];
  };
}

// Product interface (matching ProductCard component)
export interface Product {
  uuid: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  description?: string;
  category?: string;
}

// Transform API product to our Product interface
export function transformApiProduct(apiProduct: ApiProduct): Product {
  return {
    uuid: apiProduct.uuid,
    name: apiProduct.name,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price || undefined,
    image: apiProduct.primary_image_url,
    inStock: apiProduct.stock_count > 0 && apiProduct.ready_for_sale,
    description: apiProduct.short_desc || undefined,
    category: apiProduct.category || undefined,
  };
}

// Server-side API call (for loaders)
export async function fetchProducts(apiUrl: string): Promise<Product[]> {
  try {
    const response = await fetch(`${apiUrl}/v1/products`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: ProductsApiResponse = await response.json();
    return data.data.products.map(transformApiProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Client-side API call (for components)
export async function fetchProductsClient(): Promise<Product[]> {
  const apiUrl = getApiUrl();
  return fetchProducts(apiUrl);
}

// Server-side loader helper
export async function fetchProductsForLoader(): Promise<Product[]> {
  const env = getClientEnv();
  const apiUrl = env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not configured');
  }

  return fetchProducts(apiUrl);
}