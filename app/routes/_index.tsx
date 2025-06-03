import type { MetaFunction } from '@vercel/remix';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


// Mock data for featured products
const featuredProducts = [
  {
    id: '1',
    name: '高齡犬關節保健膠囊 / Senior Dog Joint Support',
    price: 980,
    originalPrice: 1200,
    image: '/placeholder.svg',
    category: 'supplements',
    inStock: true,
  },
  {
    id: '2',
    name: '軟質寵物床墊 / Orthopedic Pet Bed',
    price: 1680,
    image: '/placeholder.svg',
    category: 'bedding',
    inStock: true,
  },
  {
    id: '3',
    name: '易消化高齡貓糧 / Senior Cat Food',
    price: 650,
    image: '/placeholder.svg',
    category: 'food',
    inStock: false,
  },
  {
    id: '4',
    name: '溫熱墊 / Heating Pad',
    price: 890,
    image: '/placeholder.svg',
    category: 'comfort',
    inStock: true,
  },
];

const pets = [
  {
    name: 'Kiki',
    age: '12歲 / 12 years old',
    description: '溫柔的老狗狗，最愛曬太陽 / Gentle old dog who loves sunbathing',
    image: '/placeholder.svg',
  },
  {
    name: '西西',
    age: '14歲 / 14 years old',
    description: '聰明的老貓咪，很會撒嬌 / Smart old cat who loves cuddles',
    image: '/placeholder.svg',
  },
  {
    name: '小小',
    age: '10歲 / 10 years old',
    description: '活潑的小型犬，精神很好 / Energetic small dog, still very spirited',
    image: '/placeholder.svg',
  },
  {
    name: '渺渺',
    age: '13歲 / 13 years old',
    description: '安靜的老貓，喜歡溫暖的地方 / Quiet old cat who loves warm spots',
    image: '/placeholder.svg',
  },
];

const Index = () => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [email, setEmail] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    // Add toast notification here
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
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
          </div>

          <div className="relative">
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <div className="relative overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="w-full flex-shrink-0 px-2">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-green-100">
                        <div className="aspect-square bg-gradient-to-br from-yellow-100 to-green-100 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {!product.inStock && (
                            <Badge variant="secondary" className="absolute top-2 right-2">
                              {t('shop.out_of_stock')}
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600">
                                NT$ {product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  NT$ {product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
                          >
                            {t('shop.add_to_cart')}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex justify-center items-center mt-4 space-x-4">
                <Button variant="outline" size="icon" onClick={prevSlide} className="border-blue-300 text-blue-500">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex space-x-2">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Button variant="outline" size="icon" onClick={nextSlide} className="border-blue-300 text-blue-500">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-green-100">
                  <div className="aspect-square bg-gradient-to-br from-yellow-100 to-green-100 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!product.inStock && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {t('shop.out_of_stock')}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">
                          NT$ {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            NT$ {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
                    >
                      {t('shop.add_to_cart')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <Footer />
    </div>
  );
};

export default Index;
