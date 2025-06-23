
import React, { createContext, useContext, useState } from 'react';

type Language = 'zh-TW' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  'zh-TW': {
    // Navigation
    'nav.home': '首頁',
    'nav.shop': '商店',
    'nav.about': '關於我們',
    'nav.cart': '購物車',
    'nav.wishlist': '願望清單',

    // Homepage
    'home.headline': '為高齡寵物精心挑選的用品',
    'home.subheadline': '來自四隻老毛孩家庭的溫暖推薦',
    'home.featured': '熱賣商品',
    'home.meet_pets': '認識我們的毛孩',
    'home.newsletter': '訂閱電子報',
    'home.newsletter.placeholder': '輸入您的電子郵件',
    'home.newsletter.button': '訂閱',

    // Shop
    'shop.title': '商店',
    'shop.search': '搜尋商品',
    'shop.filter.category': '分類',
    'shop.filter.price': '價格',
    'shop.add_to_cart': '加入購物車',
    'shop.add_to_wishlist': '加入願望清單',
    'shop.out_of_stock': '缺貨',
    'shop.in_stock': '有庫存',

    // Cart
    'cart.title': '購物車',
    'cart.empty': '購物車是空的',
    'cart.checkout': '結帳',
    'cart.quantity': '數量',
    'cart.total': '總計',

    // Wishlist
    'wishlist.title': '願望清單',
    'wishlist.submit_request': '提交商品需求',
    'wishlist.product_name': '商品名稱',
    'wishlist.description': '描述',
    'wishlist.submit': '提交',

    // About
    'about.title': '關於我們',
    'about.story': '我們的故事',

    // Common
    'common.loading': '載入中...',
    'common.price': '價格',
    'common.currency': 'TWD',
  },
  'en': {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.about': 'About',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',

    // Homepage
    'home.headline': 'Carefully Curated Senior Pet Supplies',
    'home.subheadline': 'Recommended with love from a family of four elderly pets',
    'home.featured': 'Featured Products',
    'home.meet_pets': 'Meet Our Pets',
    'home.newsletter': 'Newsletter',
    'home.newsletter.placeholder': 'Enter your email',
    'home.newsletter.button': 'Subscribe',

    // Shop
    'shop.title': 'Shop',
    'shop.search': 'Search products',
    'shop.filter.category': 'Category',
    'shop.filter.price': 'Price',
    'shop.add_to_cart': 'Add to Cart',
    'shop.add_to_wishlist': 'Add to Wishlist',
    'shop.out_of_stock': 'Out of Stock',
    'shop.in_stock': 'In Stock',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'cart.quantity': 'Quantity',
    'cart.total': 'Total',

    // Wishlist
    'wishlist.title': 'Wishlist',
    'wishlist.submit_request': 'Submit Product Request',
    'wishlist.product_name': 'Product Name',
    'wishlist.description': 'Description',
    'wishlist.submit': 'Submit',

    // About
    'about.title': 'About Us',
    'about.story': 'Our Story',

    // Common
    'common.loading': 'Loading...',
    'common.price': 'Price',
    'common.currency': 'USD',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh-TW');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
