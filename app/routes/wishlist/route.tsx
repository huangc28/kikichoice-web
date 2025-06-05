import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Wishlist = () => {
  const { t } = useLanguage();
  const { items, addWishlistRequest } = useWishlist();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [requestedBy, setRequestedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWishlistRequest({
      name: productName,
      description,
      requestedBy,
    });
    setProductName('');
    setDescription('');
    setRequestedBy('');
    // Add toast notification here
  };

  // Mock popular wishlist items
  const popularWishlistItems = [
      { name: '高齡犬輪椅', count: 12 },
  { name: '貓咪升降餵食器', count: 8 },
  { name: '寵物按摩器', count: 6 },
  { name: '溫控水碗', count: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('wishlist.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Request Form */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                {t('wishlist.submit_request')}
              </CardTitle>
              <p className="text-gray-600">
                告訴我們您希望看到什麼商品，我們會考慮進貨！
                <br />
                Tell us what products you'd like to see, and we'll consider stocking them!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="productName">{t('wishlist.product_name')}</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    placeholder="例如：高齡犬輪椅"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('wishlist.description')}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="請描述您需要的功能或特色"
                    rows={3}
                    className="border-blue-300 focus:border-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="requestedBy">您的名字</Label>
                  <Input
                    id="requestedBy"
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                    required
                    placeholder="請輸入您的名字"
                    className="border-blue-300 focus:border-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
                >
                  {t('wishlist.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Popular Requests */}
          <div className="space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  熱門需求
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularWishlistItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-green-50 rounded-lg border border-green-100">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm text-blue-600 font-semibold">
                        {item.count} 次請求
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            {items.length > 0 && (
              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    您的請求
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.slice(0, 5).map((item) => (
                      <div key={item.id} className="p-3 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          提交於：{item.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
