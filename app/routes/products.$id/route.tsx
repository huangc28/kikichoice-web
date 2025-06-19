import { useState } from 'react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, Link, useNavigation } from '@remix-run/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { fetchProductDetail } from './api.js';

// Extract UUID from slug-uuid format
function extractUuidFromParam(param: string): string {
  const parts = param.split('-');
  const uuid = parts[parts.length-1];
  return uuid;
}
// Remix Loader
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    throw new Response('Product ID is required', { status: 400 });
  }

  try {
    const uuid = extractUuidFromParam(id);
    const product = await fetchProductDetail(uuid);
    return json({ product, error: null });
  } catch (error) {
    if (error instanceof Response) {
      throw error; // Re-throw Response errors (like 404)
    }

    console.error('Error fetching product:', error);
    return json({
      product: null,
      error: error instanceof Error ? error.message : 'Failed to load product'
    }, { status: 500 });
  }
}

// Loading Skeleton Components
function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 text-sm mb-8">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          <span>/</span>
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          <span>/</span>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div>
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-6"></div>

            {/* Features Skeleton */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>

            {/* Add to Cart Skeleton */}
            <div className="flex gap-3 mb-8">
              <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Specifications Skeleton */}
            <div className="border rounded-lg p-4">
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-3"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between mb-2">
                  <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Main Component
export default function ProductDetail() {
  const { product, error } = useLoaderData<typeof loader>();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const navigation = useNavigation();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Show loading skeleton while navigating
  if (navigation.state === 'loading') {
    return <ProductDetailSkeleton />;
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'Product not found' ? '商品未找到 / Product Not Found' : '載入錯誤 / Loading Error'}
            </h1>
            {error && (
              <p className="text-gray-600 mb-6">{error}</p>
            )}
            <Link to="/shop">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                返回商店 / Back to Shop
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.uuid,
        name: product.name,
        price: product.price,
        image: product.primaryImage,
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-orange-500">首頁 / Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-orange-500">{t('nav.shop')}</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name.split(' / ')[0]}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              {product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg bg-gray-100"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-orange-600">
                    NT$ {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      NT$ {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.inStock ? (
                  <Badge variant="default" className="bg-green-500">
                    {t('shop.in_stock')} ({product.stockCount})
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    {t('shop.out_of_stock')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 mb-2">{product.shortDescription}</p>
            </div>

            {/* Product Variants Section - Moved above quantity */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  商品規格 / Product Variants
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:border-orange-300 transition-colors">
                      <div className="flex items-center space-x-3">
                        <img
                          src={variant.image_url}
                          alt={variant.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {variant.name}
                          </h4>
                          <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm font-bold text-orange-600">
                              NT$ {variant.price.toLocaleString()}
                            </p>
                            <Badge 
                              variant={variant.stock_count > 0 ? "default" : "secondary"} 
                              className={`text-xs ${variant.stock_count > 0 ? "bg-green-500" : ""}`}
                            >
                              {variant.stock_count > 0 ? `庫存 ${variant.stock_count}` : '缺貨'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-700">數量 / Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 p-0"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12"
                >
                  {t('shop.add_to_cart')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-full h-12"
                >
                  {t('shop.add_to_wishlist')}
                </Button>
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    商品規格 / Specifications
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Product Description Section */}
        {product.fullDescription && (
          <section className="mt-16">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                商品描述 / Product Description
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}