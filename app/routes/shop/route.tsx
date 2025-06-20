import { useState, useMemo } from 'react';
import { useParams, useLoaderData, useNavigate } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@vercel/remix';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { fetchProducts, type Product } from './api';

// Remix Loader - Fetch products from API
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

// Dynamic categories based on products + static fallbacks
const getCategories = (products: Product[]) => {
  const dynamicCategories = products
    .filter((product): product is Product => product != null)
    .map(product => product.category)
    .filter((category, index, self) => category && self.indexOf(category) === index)
    .map(category => ({ value: category!, label: category! }));

  return [
    { value: 'all', label: '全部商品' },
    ...dynamicCategories,
    // Fallback categories if no dynamic ones
    ...(dynamicCategories.length === 0 ? [
      { value: 'supplements', label: '保健品' },
      { value: 'food', label: '食品' },
      { value: 'bedding', label: '寢具' },
      { value: 'comfort', label: '舒適用品' },
      { value: 'safety', label: '安全用品' },
    ] : [])
  ];
};

const Shop = () => {
  const { category } = useParams();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [priceRange, setPriceRange] = useState('all');

  // Ensure products is always an array of Product
  const products = (loaderData.products || []) as Product[];
  const error = loaderData.error;

  const categories = useMemo(() => getCategories(products), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product): product is Product => product != null);

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
  }, [products, selectedCategory, searchTerm, priceRange]);

  const handleAddToCart = async (product: Product) => {
    await addItem(product.uuid, {
      name: product.name,
      sku: product.sku,
      quantity: 1,
      price: product.price,
      image: product.image,
      stock: product.inStock ? 999 : 0, // Default high stock for in-stock items
    });
  };

  const handleBuyNow = async (product: Product) => {
    await addItem(product.uuid, {
      name: product.name,
      sku: product.sku,
      quantity: 1,
      price: product.price,
      image: product.image,
      stock: product.inStock ? 999 : 0, // Default high stock for in-stock items
    });
    navigate('/cart');
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
              key={product.uuid}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleBuyNow}
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
