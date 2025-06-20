import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Link } from '@remix-run/react';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: {
    uuid: string;
    name: string;
    sku: string;
    price: number;
    originalPrice?: number;
    image: string;
    stockCount: number;
    variants?: Array<{
      name: string;
      sku: string;
      stock_count: number;
      image_url: string;
      price: number;
    }>;
  } | null;
}

export function CartDrawer({ isOpen, onClose, selectedProduct }: CartDrawerProps) {
  const { items, addItem, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { t } = useLanguage();
  
  // State for product selection
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Reset state when drawer opens with new product
  useEffect(() => {
    if (selectedProduct) {
      setSelectedVariant(null);
      setQuantity(1);
    }
  }, [selectedProduct]);

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    const variant = selectedProduct.variants?.[selectedVariant || 0];
    const productToAdd = {
      name: selectedProduct.name,
      sku: variant?.sku || selectedProduct.sku,
      quantity,
      price: variant?.price || selectedProduct.price,
      image: variant?.image_url || selectedProduct.image,
      stock: variant?.stock_count || selectedProduct.stockCount,
    };

    await addItem(selectedProduct.uuid, productToAdd);
    
    // Reset form after adding
    setSelectedVariant(null);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxStock = selectedProduct?.variants?.[selectedVariant || 0]?.stock_count || selectedProduct?.stockCount || 0;
    const validQuantity = Math.max(1, Math.min(newQuantity, maxStock));
    setQuantity(validQuantity);
  };

  const getCurrentStock = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.variants?.[selectedVariant || 0]?.stock_count || selectedProduct.stockCount;
  };

  const getCurrentPrice = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.variants?.[selectedVariant || 0]?.price || selectedProduct.price;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            購物車
          </SheetTitle>
          <SheetDescription>
            {selectedProduct ? '選擇商品規格和數量' : '查看購物車內容'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Product Selection Section */}
          {selectedProduct && (
            <div className="space-y-6 pb-6 border-b">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-orange-600">
                      NT$ {getCurrentPrice().toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        NT$ {selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Badge variant={getCurrentStock() > 0 ? "default" : "secondary"} className={getCurrentStock() > 0 ? "bg-green-500" : ""}>
                    {getCurrentStock() > 0 ? `庫存 ${getCurrentStock()}` : '缺貨'}
                  </Badge>
                </div>
              </div>

              {/* Variants Selection */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">選擇規格</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedProduct.variants.map((variant, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedVariant(index)}
                        className={`border rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                          selectedVariant === index
                            ? 'border-orange-500 bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={variant.image_url}
                            alt={variant.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 text-sm">
                              {variant.name}
                            </h5>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm font-bold text-orange-600">
                                NT$ {variant.price.toLocaleString()}
                              </p>
                              <Badge
                                variant={variant.stock_count > 0 ? "default" : "secondary"}
                                className={`text-xs ${variant.stock_count > 0 ? "bg-green-500" : ""}`}
                              >
                                {variant.stock_count > 0 ? `庫存 ${variant.stock_count}` : '缺貨'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">數量</h4>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 h-10 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    min="1"
                    max={getCurrentStock()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= getCurrentStock()}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    (最多 {getCurrentStock()} 件)
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={getCurrentStock() === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full h-12"
              >
                加入購物車 - NT$ {(getCurrentPrice() * quantity).toLocaleString()}
              </Button>
            </div>
          )}

          {/* Cart Items Section */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                購物車商品 ({getTotalItems()})
              </h3>
              {Object.keys(items).length > 0 && (
                <Link to="/cart" onClick={onClose}>
                  <Button variant="outline" size="sm">
                    查看購物車
                  </Button>
                </Link>
              )}
            </div>

            {Object.keys(items).length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">購物車是空的</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(items).map(([productUuid, item]) => (
                  <div key={productUuid} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">
                          數量: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-orange-600">
                          NT$ {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(productUuid)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Total and Checkout */}
        {Object.keys(items).length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">總計</span>
              <span className="text-xl font-bold text-orange-600">
                NT$ {getTotalPrice().toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/cart" onClick={onClose}>
                <Button variant="outline" className="w-full rounded-full">
                  查看購物車
                </Button>
              </Link>
              <Link to="/checkout" onClick={onClose}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                  立即結帳
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}