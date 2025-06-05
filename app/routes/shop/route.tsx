import { useState, useMemo } from 'react';
import { useParams } from '@remix-run/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard, type Product } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

import placeholderUrl from '@/assets/placeholder.svg';

// Mock product data
const allProducts: Product[] = [
  {
    id: '1',
    name: '高齡犬關節保健膠囊',
    price: 980,
    originalPrice: 1200,
    image: placeholderUrl,
    category: 'supplements',
    inStock: true,
    description: '專為高齡犬設計的關節保健營養品',
  },
  {
    id: '2',
    name: '軟質寵物床墊',
    price: 1680,
    image: placeholderUrl,
    category: 'bedding',
    inStock: true,
    description: '記憶海綿寵物床墊，舒緩關節壓力',
  },
  {
    id: '3',
    name: '易消化高齡貓糧',
    price: 650,
    image: placeholderUrl,
    category: 'food',
    inStock: false,
    description: '特殊配方，適合高齡貓咪消化系統',
  },
  {
    id: '4',
    name: '溫熱墊',
    price: 890,
    image: placeholderUrl,
    category: 'comfort',
    inStock: true,
    description: '可調溫電熱墊，為老寵物提供溫暖',
  },
  {
    id: '5',
    name: '高齡貓維生素',
    price: 750,
    image: placeholderUrl,
    category: 'supplements',
    inStock: true,
    description: '綜合維生素，支持高齡貓咪健康',
  },
  {
    id: '6',
    name: '防滑地毯',
    price: 450,
    image: placeholderUrl,
    category: 'safety',
    inStock: true,
    description: '防滑地毯，保護寵物行走安全',
  },
];

const categories = [
  { value: 'all', label: '全部商品' },
  { value: 'supplements', label: '保健品' },
  { value: 'food', label: '食品' },
  { value: 'bedding', label: '寢具' },
  { value: 'comfort', label: '舒適用品' },
  { value: 'safety', label: '安全用品' },
];

const Shop = () => {
  const { category } = useParams();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [priceRange, setPriceRange] = useState('all');

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under500':
          filtered = filtered.filter(product => product.price < 500);
          break;
        case '500to1000':
          filtered = filtered.filter(product => product.price >= 500 && product.price < 1000);
          break;
        case 'over1000':
          filtered = filtered.filter(product => product.price >= 1000);
          break;
      }
    }

    return filtered;
  }, [selectedCategory, searchTerm, priceRange]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleAddToWishlist = (product: Product) => {
    // TODO: Implement wishlist functionality
    console.log('Added to wishlist:', product.name);
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

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t('shop.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-64">
                <SelectValue placeholder={t('shop.filter.category')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full lg:w-64">
                <SelectValue placeholder={t('shop.filter.price')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部價格</SelectItem>
                <SelectItem value="under500">NT$500以下</SelectItem>
                <SelectItem value="500to1000">NT$500-1000</SelectItem>
                <SelectItem value="over1000">NT$1000以上</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              variant="shop"
            />
          ))}
        </div>

        {/* No products found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">沒有找到符合條件的商品</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
