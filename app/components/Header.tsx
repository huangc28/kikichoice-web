
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User, ShoppingCart } from 'lucide-react';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/ece5180a-090e-4d59-b78a-33db321021f0.png" 
              alt="kikichoice logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">kikichoice</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-500 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-500 transition-colors">
              {t('nav.shop')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500 transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-blue-500 transition-colors">
              {t('nav.wishlist')}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setLanguage('zh-TW')}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  language === 'zh-TW' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  language === 'en' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Search Icon */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Icon */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-400"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span className={`w-4 h-0.5 bg-gray-600 transform transition ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                <span className={`w-4 h-0.5 bg-gray-600 my-0.5 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-4 h-0.5 bg-gray-600 transform transition ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/shop" 
                className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.shop')}
              </Link>
              <Link 
                to="/about" 
                className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/wishlist" 
                className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.wishlist')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
