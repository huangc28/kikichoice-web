import { useState } from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

import placeholderUrl from '@/assets/placeholder.svg';
import { fetchHotSellingProducts, type HotSellingProduct } from '@/lib/hot-selling-api';

// Loader function to fetch hot selling products
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const hotSellingProducts = await fetchHotSellingProducts();
    return json({
      hotSellingProducts,
      error: null,
    });
  } catch (error) {
    console.error('❌ Failed to fetch hot selling products:', error);

    // Return fallback products if API fails
    const fallbackProducts: HotSellingProduct[] = [
      {
        uuid: '1',
        name: '高齡犬關節保健膠囊',
        sku: 'DOG-JOINT-001',
        slug: 'senior-dog-joint-supplement',
        price: 980,
        originalPrice: 1200,
        image: placeholderUrl,
        stockCount: 10,
        inStock: true,
        hasVariant: false,
      },
      {
        uuid: '2',
        name: '軟質寵物床墊',
        sku: 'PET-BED-001',
        slug: 'soft-pet-mattress',
        price: 1680,
        image: placeholderUrl,
        stockCount: 5,
        inStock: true,
        hasVariant: false,
      },
      {
        uuid: '3',
        name: '易消化高齡貓糧',
        sku: 'CAT-FOOD-001',
        slug: 'senior-cat-food',
        price: 650,
        image: placeholderUrl,
        stockCount: 0,
        inStock: false,
        hasVariant: false,
      },
      {
        uuid: '4',
        name: '溫熱墊',
        sku: 'HEAT-PAD-001',
        slug: 'heating-pad',
        price: 890,
        image: placeholderUrl,
        stockCount: 3,
        inStock: true,
        hasVariant: false,
      },
    ];

    return json({
      hotSellingProducts: fallbackProducts,
      error: 'Failed to load latest products. Showing fallback products.',
    });
  }
};

const pets = [
  {
    name: 'Kiki',
    age: '12歲',
    description: '溫柔的老狗狗，最愛曬太陽',
    image: placeholderUrl,
  },
  {
    name: '西西',
    age: '14歲',
    description: '聰明的老貓咪，很會撒嬌',
    image: placeholderUrl,
  },
  {
    name: '小小',
    age: '10歲',
    description: '活潑的小型犬，精神很好',
    image: placeholderUrl,
  },
  {
    name: '渺渺',
    age: '13歲',
    description: '安靜的老貓，喜歡溫暖的地方',
    image: placeholderUrl,
  },
];

const Index = () => {
  const { t } = useLanguage();
  const loaderData = useLoaderData<typeof loader>();
  const [email, setEmail] = useState('');

  // Cart drawer state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedProductForCart, setSelectedProductForCart] = useState<HotSellingProduct | null>(null);

  const hotSellingProducts = loaderData.hotSellingProducts || [];
  const error = loaderData.error;

  const handleAddToCart = (product: HotSellingProduct) => {
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    // Add toast notification here
  };

  const handleCloseCartDrawer = () => {
    setIsCartDrawerOpen(false);
    setSelectedProductForCart(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-green-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('home.headline')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('home.subheadline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/shop">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full">
                {t('nav.shop')}
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-green-400 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full">
                {t('home.meet_pets')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured')}
            </h2>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-8 max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {hotSellingProducts.map((product) => (
              <ProductCard
                key={product.uuid}
                product={product}
                onAddToCart={handleAddToCart}
                variant="homepage"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Pets */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-50 via-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.meet_pets')}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pets.map((pet, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-2 border-transparent hover:border-blue-200">
                <div className="aspect-square bg-gradient-to-br from-yellow-100 to-green-100">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h3>
                  <p className="text-sm text-blue-600 mb-2">{pet.age}</p>
                  <p className="text-sm text-gray-600">{pet.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('home.newsletter')}
          </h2>
          <p className="text-gray-600 mb-8">
            Get updates on new products and special offers for senior pets
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder={t('home.newsletter.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-full border-blue-300 focus:border-blue-500"
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            >
              {t('home.newsletter.button')}
            </Button>
          </form>
        </div>
      </section>

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

export default Index;