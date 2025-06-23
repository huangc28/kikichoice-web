import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUser, SignInButton } from '@clerk/remix';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Truck, CreditCard, CheckCircle } from 'lucide-react';

type CheckoutStep = 'cart' | 'identity' | 'contact' | 'delivery' | 'payment' | 'confirmation';

const Checkout = () => {
  const { items, getTotalPrice, clearCart, isLoading, error } = useCart();
  const { isSignedIn, user } = useUser();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [formData, setFormData] = useState({
    email: user?.emailAddresses[0]?.emailAddress || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phoneNumbers[0]?.phoneNumber || '',
    address: '',
    city: '',
    postalCode: '',
    shippingMethod: 'home-delivery',
    paymentMethod: 'line-pay',
    notes: '',
    discountCode: '',
  });

  // Convert items object to array for easier iteration
  const itemsArray = Object.values(items);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStepComplete = (step: CheckoutStep) => {
    const stepOrder: CheckoutStep[] = ['cart', 'identity', 'contact', 'delivery', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const handleCheckoutStart = () => {
    if (isSignedIn) {
      setCurrentStep('contact');
    } else {
      setCurrentStep('identity');
    }
  };

  const handleAuthComplete = () => {
    setShowAuthModal(false);
    setCurrentStep('contact');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', { formData, items: itemsArray, total: getTotalPrice() });
    clearCart();
    setCurrentStep('confirmation');
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">載入中...</p>
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
            <h1 className="text-3xl font-bold text-red-600 mb-4">錯誤</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              重新載入
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (itemsArray.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">購物車是空的</h1>
            <p className="text-gray-600 mb-8">請先添加商品到購物車</p>
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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { key: 'cart', label: '購物車', icon: '🛒' },
              { key: 'identity', label: '身份確認', icon: '👤' },
              { key: 'contact', label: '聯絡資訊', icon: '📝' },
              { key: 'delivery', label: '配送方式', icon: '🚚' },
              { key: 'payment', label: '付款方式', icon: '💳' },
              { key: 'confirmation', label: '完成', icon: '✅' },
            ].map((step, index) => {
              const stepOrder: CheckoutStep[] = ['cart', 'identity', 'contact', 'delivery', 'payment', 'confirmation'];
              const currentIndex = stepOrder.indexOf(currentStep);
              const stepIndex = stepOrder.indexOf(step.key as CheckoutStep);
              const isActive = stepIndex === currentIndex;
              const isCompleted = stepIndex < currentIndex;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                    isActive ? 'bg-orange-500 text-white' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? '✓' : step.icon}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-orange-600' :
                    isCompleted ? 'text-green-600' :
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 5 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      stepIndex < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 0: Cart Review */}
        {currentStep === 'cart' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🛒</span>
                <span>購物車確認</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {itemsArray.map((item) => (
                <div key={item.uuid} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">數量: {item.quantity}</p>
                    <p className="font-bold text-orange-600">
                      NT$ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>總計</span>
                <span className="text-orange-600">NT$ {getTotalPrice().toLocaleString()}</span>
              </div>
              
              <Button 
                onClick={handleCheckoutStart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12"
              >
                開始結帳
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Identity */}
        {currentStep === 'identity' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>身份確認</span>
              </CardTitle>
              <p className="text-gray-600">請登入或註冊以繼續結帳</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  登入以享受更快速的結帳體驗和訂單追蹤
                </p>
                
                <div className="space-y-3">
                  <SignInButton mode="modal" redirectUrl="/checkout">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      使用 LINE 登入
                    </Button>
                  </SignInButton>
                  
                  <SignInButton mode="modal" redirectUrl="/checkout">
                    <Button variant="outline" className="w-full">
                      使用電子郵件登入
                    </Button>
                  </SignInButton>
                </div>
                
                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-2 text-sm text-gray-500">或</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep('contact')}
                  className="w-full"
                >
                  以訪客身份繼續
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Contact + Shipping */}
        {currentStep === 'contact' && (
          <form onSubmit={(e) => { e.preventDefault(); handleStepComplete('contact'); }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>聯絡資訊與配送地址</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">聯絡資訊</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">名字 *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">姓氏 *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">電子郵件 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      disabled={isSignedIn}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">電話 *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      placeholder="09XX-XXX-XXX"
                    />
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">配送地址</h3>
                  <div>
                    <Label htmlFor="address">地址 *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      placeholder="街道地址"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">城市 *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">郵遞區號 *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  繼續到配送方式
                </Button>
              </CardContent>
            </Card>
          </form>
        )}

        {/* Step 3: Delivery Method */}
        {currentStep === 'delivery' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>配送方式</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.shippingMethod}
                onValueChange={(value) => handleInputChange('shippingMethod', value)}
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="home-delivery" id="home-delivery" />
                  <Label htmlFor="home-delivery" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">宅配到府</span>
                        <p className="text-sm text-gray-600">週二 25 六月 - NT$60</p>
                      </div>
                      <Badge>推薦</Badge>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="seven-eleven" id="seven-eleven" />
                  <Label htmlFor="seven-eleven" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">7-11 取貨</span>
                        <p className="text-sm text-gray-600">週一 24 六月 - 免費</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <Button 
                onClick={() => handleStepComplete('delivery')}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                繼續到付款方式
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Payment */}
        {currentStep === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>付款方式</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="line-pay" id="line-pay" />
                  <Label htmlFor="line-pay" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-bold">
                        L
                      </div>
                      <span className="font-medium">LINE Pay</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">
                        銀
                      </div>
                      <span className="font-medium">銀行匯款</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>商品小計</span>
                  <span>NT$ {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>運費</span>
                  <span>NT$ {shippingCost}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>總計</span>
                  <span className="text-orange-600">NT$ {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600 h-12"
              >
                確認訂單並付款
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 'confirmation' && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <span>訂單確認</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">感謝您的訂購！</h2>
                <p className="text-gray-600">您的訂單已成功提交</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-2">
                  <p className="font-medium">訂單編號: #KC{Date.now().toString().slice(-6)}</p>
                  <p className="text-sm text-gray-600">
                    預計送達: {formData.shippingMethod === 'home-delivery' ? '週二 25 六月' : '週一 24 六月'}
                  </p>
                </div>
              </div>

              {!isSignedIn && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">您的 kikichoice 帳戶已準備就緒</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    我們已為您建立帳戶，您可以追蹤訂單並享受更快速的結帳體驗
                  </p>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                      立即登入
                    </Button>
                  </SignInButton>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  繼續購物
                </Button>
                {isSignedIn && (
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/orders'}
                    className="w-full"
                  >
                    查看我的訂單
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl="/checkout"
      />

      <Footer />
    </div>
  );
};

export default Checkout;