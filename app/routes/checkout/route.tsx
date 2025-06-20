import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const Checkout = () => {
  const { items, getTotalPrice, clearCart, isLoading, error } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    shippingMethod: 'home-delivery',
    paymentMethod: 'credit-card',
    notes: '',
    discountCode: '',
  });

  // Convert items object to array for easier iteration
  const itemsArray = Object.values(items);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', { formData, items: itemsArray, total: getTotalPrice() });
    // Here you would typically send the order to your backend
    clearCart();
    // Redirect to success page or show confirmation
  };

  const shippingCost = formData.shippingMethod === 'home-delivery' ? 60 : 0;
  const totalPrice = getTotalPrice() + shippingCost;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">載入中... / Loading...</h1>
            <p className="text-gray-600">正在載入購物車資料 / Loading cart data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">錯誤 / Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              重新載入 / Reload
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (itemsArray.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">購物車是空的 / Cart is Empty</h1>
            <p className="text-gray-600 mb-8">請先添加商品到購物車 / Please add items to cart first</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">結帳 / Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>聯絡資訊 / Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">電子郵件 / Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">名字 / First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">姓氏 / Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">電話 / Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      placeholder="09XX-XXX-XXX"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>配送資訊 / Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">地址 / Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      placeholder="街道地址 / Street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">城市 / City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">郵遞區號 / Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>配送方式 / Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.shippingMethod}
                    onValueChange={(value) => handleInputChange('shippingMethod', value)}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="home-delivery" id="home-delivery" />
                      <Label htmlFor="home-delivery" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>宅配到府 / Home Delivery</span>
                          <span className="font-medium">NT$ 60</span>
                        </div>
                        <p className="text-sm text-gray-600">3-5個工作天 / 3-5 business days</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="seven-eleven" id="seven-eleven" />
                      <Label htmlFor="seven-eleven" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>7-11 取貨 / 7-11 Pickup</span>
                          <span className="font-medium">免費 / Free</span>
                        </div>
                        <p className="text-sm text-gray-600">2-3個工作天 / 2-3 business days</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>付款方式 / Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="cursor-pointer">
                        信用卡 / Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="line-pay" id="line-pay" />
                      <Label htmlFor="line-pay" className="cursor-pointer">
                        LINE Pay
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>訂單備註 / Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="有特殊需求請在此備註 / Special requests or notes"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>訂單摘要 / Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  {itemsArray.map((item) => (
                    <div key={item.uuid} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          數量: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        NT$ {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  <Separator />

                  {/* Discount Code */}
                  <div className="space-y-2">
                    <Label htmlFor="discountCode">優惠碼 / Discount Code</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="discountCode"
                        value={formData.discountCode}
                        onChange={(e) => handleInputChange('discountCode', e.target.value)}
                        placeholder="輸入優惠碼 / Enter code"
                      />
                      <Button variant="outline" type="button">
                        套用 / Apply
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>小計 / Subtotal</span>
                      <span>NT$ {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>運費 / Shipping</span>
                      <span>NT$ {shippingCost}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>總計 / Total</span>
                      <span>NT$ {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12"
                  >
                    確認訂單 / Place Order
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    點擊確認訂單即表示您同意我們的服務條款
                    <br />
                    By placing your order, you agree to our Terms of Service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
