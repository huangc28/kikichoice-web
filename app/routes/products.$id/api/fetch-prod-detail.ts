
import { getClientEnv } from '@/lib/env.server';

// API Response Types
export interface ApiProductImage {
  url: string;
  is_primary: boolean;
}

export interface ApiProductSpec {
  name: string;
  value: string;
}

export interface ApiProductVariant {
  name: string;
  sku: string;
  stock_count: number;
  image_url: string;
  price: number;
}

export interface ApiProductDetail {
  data: {
    uuid: string;
    sku: string;
    name: string;
    slug: string;
    price: number;
    original_price: number;
    short_desc: string;
    full_desc: string;
    stock_count: number;
    images: ApiProductImage[];
    specs: ApiProductSpec[];
    variants: ApiProductVariant[];
  }
}

// Component Data Types
export interface ProductDetail {
  uuid: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  fullDescription: string;
  stockCount: number;
  inStock: boolean;
  images: string[];
  primaryImage: string;
  specifications: Record<string, string>;
  variants: ApiProductVariant[];
}


// Transform API response to component data
function transformApiProductDetail(apiProduct: ApiProductDetail): ProductDetail {
  const data = apiProduct.data;
  const specifications: Record<string, string> = {};
  data.specs.forEach(spec => {
    specifications[spec.name] = spec.value;
  });

  // Sort images to put primary first, then get URLs
  const sortedImages = [...data.images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });

  const imageUrls = sortedImages.map(img => img.url);
  const primaryImage = sortedImages.find(img => img.is_primary)?.url || imageUrls[0] || '';

  return {
    uuid: data.uuid,
    sku: data.sku,
    name: data.name,
    slug: data.slug,
    price: data.price,
    originalPrice: data.original_price || undefined,
    shortDescription: data.short_desc,
    fullDescription: data.full_desc,
    stockCount: data.stock_count,
    inStock: data.stock_count > 0,
    images: imageUrls,
    primaryImage,
    specifications,
    variants: data.variants,
  };
}

// API function to fetch product detail
export async function fetchProductDetail(uuid: string): Promise<ProductDetail> {
  const env = getClientEnv();
  const apiUrl = env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not configured');
  }

  const response = await fetch(`${apiUrl}/v1/products/${uuid}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Response('Product not found', { status: 404 });
    }
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const apiProduct: ApiProductDetail = await response.json();

  return transformApiProductDetail(apiProduct);
}

