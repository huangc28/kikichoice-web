import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@remix-run/react';
import { type Product } from '@/routes/shop/api';

import placeholderUrl from '@/assets/placeholder.svg';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  variant?: 'homepage' | 'shop';
  className?: string;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  variant = 'shop',
  className = ''
}: ProductCardProps) => {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const isHomepage = variant === 'homepage';
  const backgroundClass = isHomepage
    ? 'bg-gradient-to-br from-yellow-100 to-green-100'
    : 'bg-gray-100';

  const borderClass = isHomepage
    ? 'border-green-100'
    : 'bg-white';

  const priceColorClass = isHomepage
    ? 'text-blue-600'
    : 'text-orange-600';

  const buttonColorClass = isHomepage
    ? 'bg-green-500 hover:bg-green-600'
    : 'bg-orange-500 hover:bg-orange-600';

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSource = imageError || !product.image ? placeholderUrl : product.image;

  // Create the product URL with slug and UUID
  const productUrl = `/products/${product.slug}-${product.uuid}`;

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${borderClass} ${className}`}>
      <div className={`aspect-square ${backgroundClass} relative`}>
        <Link to={productUrl}>
          <img
            src={imageSource}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </Link>
        {!product.inStock && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            {t('shop.out_of_stock')}
          </Badge>
        )}
        {product.inStock && !isHomepage && (
          <Badge variant="default" className="absolute top-2 right-2 bg-green-500">
            {t('shop.in_stock')}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <Link to={productUrl}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.description && !isHomepage && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        {
          !product.description && (
            <div className="h-[40px] mb-[10px]"></div>
          )
        }
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${priceColorClass}`}>
              NT$ {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                NT$ {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`w-full ${buttonColorClass} text-white rounded-full`}
          >
            {t('shop.add_to_cart')}
          </Button>
          {onAddToWishlist && !isHomepage && (
            <Button
              onClick={() => onAddToWishlist(product)}
              variant="outline"
              className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 rounded-full"
            >
              直接購買
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};