import { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@vercel/remix';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { fetchProducts, type Product } from './api.server.js';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const products = await fetchProducts();

    return json({
      products: products as Product[],
      error: null,
    });
  } catch (error) {
    console.error('❌ Failed to fetch products:', error);

    return json({
      products: [] as Product[],
      error: 'Failed to load products from API',
    });
  }
};

const Shop = () => {
  const { t } = useLanguage();
  const loaderData = useLoaderData<typeof loader>();

  // Cart drawer state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedProductForCart, setSelectedProductForCart] = useState<Product | null>(null);

  // Ensure products is always an array of Product
  const products = (loaderData.products || []) as Product[];
  const error = loaderData.error;

  const handleAddToCart = async (product: Product) => {
    // Convert Product to the format expected by CartDrawer
    const productForDrawer = {
      uuid: product.uuid,
      name: product.name,
      sku: product.sku,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      stockCount: product.stockCount,
      hasVariant: product.hasVariant,
      slug: product.slug,
      inStock: product.inStock,
    };

    setSelectedProductForCart(productForDrawer);
    setIsCartDrawerOpen(true);
  };

  const handleCloseCartDrawer = () => {
    setIsCartDrawerOpen(false);
    setSelectedProductForCart(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('shop.title')}
          </h1>

          {/* Error Banner */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.filter((product): product is Product => product != null).map((product) => (
            <ProductCard
              key={product.uuid}
              product={product}
              onAddToCart={handleAddToCart}
              variant="shop"
            />
          ))}
        </div>

        {/* No products found */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">目前沒有商品</p>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={handleCloseCartDrawer}
        selectedProduct={selectedProductForCart}
      />

      <Footer />
    </div>
  );
};

export default Shop;