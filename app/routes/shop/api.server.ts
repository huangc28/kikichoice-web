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
  slug: string;
}

export interface ProductsApiResponse {
  data: {
    products: ApiProduct[];
  };
}

// Add interface for variant API response
export interface ProductVariantsApiResponse {
  data: {
    variants: Array<{
      name: string;
      sku: string;
      stock_count: number;
      image_url: string;
      price: number;
      uuid: string;
    }>;
  };
  errors: null;
}

export interface ProductVariant {
  name: string;
  sku: string;
  stock_count: number;
  image_url: string;
  price: number;
  uuid: string;
}

export interface Product {
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
  category?: string;
  hasVariant: boolean;
}

// Transform API product to our Product interface
export function transformApiProduct(apiProduct: ApiProduct): Product {
  return{
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
    category: apiProduct.category || undefined,
    hasVariant: apiProduct.has_variant,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const env = getClientEnv();
  const apiUrl = env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not configured');
  }

  const response = await fetch(`${apiUrl}/v1/products`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data: ProductsApiResponse = await response.json();
  return data.data.products.map(transformApiProduct);
}

// Add function to fetch product variants (server-side)
export async function fetchProductVariants(uuid: string): Promise<ProductVariant[]> {
  const env = getClientEnv();
  const apiUrl = env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not configured');
  }

  const response = await fetch(`${apiUrl}/v1/products/${uuid}/variants`);

  if (!response.ok) {
    throw new Error(`Failed to fetch variants: ${response.status} ${response.statusText}`);
  }

  const data: ProductVariantsApiResponse = await response.json();
  return data.data.variants;
}
