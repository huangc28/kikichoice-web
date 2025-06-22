import { useState } from 'react';
import { Link } from '@remix-run/react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart } from 'lucide-react';

import logoUrl from '@/assets/logo.png';

export const Header = () => {
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-blue-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logoUrl}
                alt="kikichoice logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">kikichoice</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-500 transition-colors">
                首頁
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-blue-500 transition-colors">
                商店
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-500 transition-colors">
                關於我們
              </Link>
              <Link to="/wishlist" className="text-gray-700 hover:text-blue-500 transition-colors">
                願望清單
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
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
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Mobile Menu */}
          <nav className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 md:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  首頁
                </Link>
                <Link
                  to="/shop"
                  className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  商店
                </Link>
                <Link
                  to="/about"
                  className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  關於我們
                </Link>
                <Link
                  to="/wishlist"
                  className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  願望清單
                </Link>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
};
