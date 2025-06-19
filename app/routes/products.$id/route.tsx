import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import placeholderUrl from '@/assets/placeholder.svg';

// Mock product data - in real app this would come from API
const productData = {
  '1': {
    id: '1',
    name: '高齡犬關節保健膠囊',
    price: 980,
    originalPrice: 1200,
    images: [placeholderUrl, placeholderUrl, placeholderUrl],
    category: 'supplements',
    inStock: true,
    stockCount: 15,
    description: '專為高齡犬設計的關節保健營養品，含有葡萄糖胺、軟骨素等關鍵成分',
    englishDescription: 'Joint health supplement specifically designed for senior dogs, containing key ingredients like glucosamine and chondroitin',
    features: [
      '天然葡萄糖胺',
      '軟骨素硫酸鹽',
      'MSM有機硫',
      '維生素C',
    ],
    specifications: {
      '重量': '120g',
      '數量': '60顆',
      '建議用量': '每日1-2顆',
      '保存期限': '2年',
    },
    reviews: [
      {
        id: 1,
        author: '陳小姐 / Ms. Chen',
        rating: 5,
        comment: '我家的老狗狗吃了一個月後，走路明顯比較有精神！',
        date: '2024-01-15',
      },
      {
        id: 2,
        author: '王先生 / Mr. Wang',
        rating: 4,
        comment: '品質不錯，狗狗很願意吃',
        date: '2024-01-10',
      },
    ],
  },
};

const relatedProducts = [
  {
    id: '2',
    name: '軟質寵物床墊',
    price: 1680,
    image: placeholderUrl,
  },
  {
    id: '4',
    name: '溫熱墊',
    price: 890,
    image: placeholderUrl,
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { addItem } = useCart();

  // Console log the $id parameter to verify it receives the slug-uuid format
  console.log('Product detail page $id parameter:', id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = productData[id as keyof typeof productData];

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">商品未找到 / Product Not Found</h1>
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
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
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
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-lg bg-gray-100"
              />
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
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="text-gray-600">{product.englishDescription}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                主要成分 / Key Ingredients
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

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
          </div>
        </div>

        {/* Product Description Section */}
        <section className="mt-16">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              商品描述
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              {/* Stock Notice */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">
                  📢 **庫存提醒＆預購通知** 📢
                </h3>
                <p className="text-orange-700">
                  親愛的買家您好，由於商品庫存有限，為避免下單後缺貨的情況，建議您 <strong>先私訊賣家詢問庫存狀態</strong>。若商品暫時缺貨，我們也提供 <strong>預購服務</strong>，您可以提前下單，我們會馬上為您備貨！
                </p>
              </div>

              {/* Plain text sections replacing accordion */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">適用對象</h3>
                  <div className="space-y-3">
                    <p>NEUROACT PLUS 神經元修護液適合用於需要神經元及關節保健的犬貓，特別是以下狀況的寵物：</p>
                    <ul className="space-y-2 ml-4">
                      <li>• 有神經系統健康需求的犬貓，幫助保護神經細胞，維持神經系統功能。</li>
                      <li>• 需要脊椎和關節護理的寵物，提供膠原蛋白、軟骨成分和氨基葡萄糖，支持關節健康。</li>
                      <li>• 適用於有神經功能退化、關節不適或活動力下降的犬貓。</li>
                      <li>• 作為日常保健補充品，促進神經與關節的整體健康。</li>
                    </ul>
                    <p>產品中含有維生素B群、葡萄醣胺、MSM、水溶性薑黃素等成分，有助於神經元修復與關節保護，適合需要長期保健的犬貓使用。</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">使用方式</h3>
                  <ul className="space-y-2">
                    <li>• 每天的餵食量建議分為早晚各一次給予，建議持續餵食二週以上。</li>
                    <li>• 可直接口服，或將修護液混合於食物中餵食。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">建議用量</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">小型犬/貓（10公斤以下）</h4>
                      <p className="text-sm text-blue-700">導入期（0~14天）：每日2ml</p>
                      <p className="text-sm text-blue-700">維持期（15天起）：每日1ml</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">中型犬/貓（10-20公斤）</h4>
                      <p className="text-sm text-green-700">導入期：每日4ml</p>
                      <p className="text-sm text-green-700">維持期：每日2ml</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">大型犬（20-40公斤或以上）</h4>
                      <p className="text-sm text-purple-700">導入期：每日6ml</p>
                      <p className="text-sm text-purple-700">維持期：每日3ml</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">包裝附屬</h3>
                  <p>內附滴管，30ml包裝每刻度為0.5ml，60ml包裝請依實際標示使用。</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">保存方式與注意事項</h3>
                  <ul className="space-y-2">
                    <li>• 請保存於乾燥陰涼處，避免陽光直射與高溫，並遠離火源。</li>
                    <li>• 開封後請盡速於保存期限內食用完畢。</li>
                    <li>• 如有沉澱物屬正常現象。</li>
                    <li>• 可依獸醫師建議調整用量。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">主要成分</h3>
                  <p>維生素B群（B1, B2, B6, B12）、葡萄醣胺、甲基硫醯基甲烷（MSM）、水溶性薑黃素、橙皮苷、酵母萃取物、魚胜肽、綠貽貝脂質萃取物、魚油（含EPA、DHA）。</p>
                  <p className="mt-3 text-sm text-gray-600 italic">如需更詳細的個別建議，建議諮詢獸醫師。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            顧客評價 / Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-medium text-gray-900">{review.author}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            相關商品 / Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/product/${relatedProduct.id}`}>
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-orange-600">
                      NT$ {relatedProduct.price.toLocaleString()}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;