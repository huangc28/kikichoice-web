import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('cart.title')}
            </h1>
            <p className="text-gray-600 mb-8">{t('cart.empty')}</p>
            <Link to="/shop">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
                {t('nav.shop')}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('cart.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-orange-600 mb-2">
                        NT$ {item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{t('cart.quantity')}:</span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 mb-2">
                        NT$ {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        移除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  訂單摘要
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>小計</span>
                    <span>NT$ {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>運費</span>
                    <span>NT$ 60</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>{t('cart.total')}</span>
                    <span>NT$ {(getTotalPrice() + 60).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/checkout" className="block">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                      {t('cart.checkout')}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
                  >
                    清空購物車
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
