import { useState } from 'react';
import { Link } from '@remix-run/react';
import { useCart } from '@/contexts/CartContext';
import { useUser, useClerk } from '@clerk/remix';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/auth';

import logoUrl from '@/assets/logo.png';

export const Header = () => {
  const { getTotalItems } = useCart();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Add debug logging to console
  console.log('Header auth state:', {
    isLoaded,
    isSignedIn,
    userId: user?.id,
    timestamp: new Date().toISOString()
  });

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' });
  };

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
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartDrawerOpen(true)}
            >
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

            {/* Authentication */}
            {!isLoaded ? (
              // Show loading spinner while Clerk initializes
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.firstName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    登出
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

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

              {/* Mobile Auth Section */}
              <div className="border-t pt-2 mt-2">
                {isSignedIn ? (
                  <div className="px-3 py-2 text-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt={user.firstName || 'User'}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-sm">
                          {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        登出
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors rounded-md hover:bg-gray-50 w-full text-left"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    登入 / 註冊
                  </button>
                )}
              </div>
              </div>
            </div>
          </nav>
        </>
        )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        selectedProduct={null}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signin"
      />
    </>
  );
};