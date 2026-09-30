import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, Heart, User as UserIcon, Globe, ShieldCheck, 
  Menu, X, Palette, Navigation, Minimize2, Maximize2, ChevronDown,
  Sparkles, Check, LogOut, PackageCheck, Layers
} from 'lucide-react';
import { Language, User, ColorTheme } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  currentUser: User | null;
  onLogout: () => void;
  activitiesCount?: number;
  currentTheme: ColorTheme;
  onOpenThemeSelector: () => void;
  onOpenOrderTracker?: () => void;
  isHeroMinimized?: boolean;
  onToggleMinimizeHero?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenAdmin,
  currentUser,
  onLogout,
  activitiesCount = 0,
  currentTheme,
  onOpenThemeSelector,
  onOpenOrderTracker,
  isHeroMinimized = true,
  onToggleMinimizeHero
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[currentLang].nav;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* 1. BRAND LOGO (Left) */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group" 
            onClick={() => scrollTo('home')}
            title="Fofo GreenGrocer Hub Rwanda"
          >
            <div className="w-9 h-9 rounded-xl bg-theme-primary flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-stone-900 tracking-tight font-serif">Fofo</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  GreenGrocer
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium leading-none hidden sm:inline">
                Kigali · Organic Farm Direct
              </span>
            </div>
          </div>

          {/* 2. PRIMARY NAV LINKS (Center - Clear & Balanced) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => scrollTo('home')}
              className="px-3 py-1.5 rounded-lg text-stone-700 hover:text-emerald-800 hover:bg-stone-100 font-semibold text-xs xl:text-sm transition-all cursor-pointer"
            >
              {t.home || 'Home'}
            </button>
            <button
              onClick={() => scrollTo('shop')}
              className="px-3 py-1.5 rounded-lg text-stone-700 hover:text-emerald-800 hover:bg-stone-100 font-semibold text-xs xl:text-sm transition-all cursor-pointer"
            >
              {t.shop}
            </button>
            <button
              onClick={() => scrollTo('baskets')}
              className="px-3 py-1.5 rounded-lg text-stone-700 hover:text-emerald-800 hover:bg-stone-100 font-semibold text-xs xl:text-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Recipe Baskets</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase">
                Kits
              </span>
            </button>
            <button
              onClick={() => scrollTo('delivery')}
              className="px-3 py-1.5 rounded-lg text-stone-700 hover:text-emerald-800 hover:bg-stone-100 font-semibold text-xs xl:text-sm transition-all cursor-pointer"
            >
              {t.delivery}
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="px-3 py-1.5 rounded-lg text-stone-700 hover:text-emerald-800 hover:bg-stone-100 font-semibold text-xs xl:text-sm transition-all cursor-pointer"
            >
              {t.about}
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-3 py-1.5 rounded-lg text-stone-700 hover:text-emerald-800 hover:bg-stone-100 font-semibold text-xs xl:text-sm transition-all cursor-pointer"
            >
              {t.contact}
            </button>
          </nav>

          {/* 3. UTILITY & CONTROLS (Right - Structured, Clear, Never Crowded) */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* 100% Minimized / Full Banner Toggle Button */}
            {onToggleMinimizeHero && (
              <button
                onClick={onToggleMinimizeHero}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  isHeroMinimized
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
                title={isHeroMinimized ? "Banner is minimized (100% clear store view). Click to expand visual banner." : "Click to minimize banner 100% and view store directly"}
              >
                {isHeroMinimized ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline">Expand Banner</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-stone-500" />
                    <span className="hidden sm:inline">Compact View</span>
                  </>
                )}
              </button>
            )}

            {/* Track Order Radar Pill */}
            {onOpenOrderTracker && (
              <button
                onClick={onOpenOrderTracker}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all shadow-2xs group cursor-pointer"
                title="Track active delivery order & live Kigali GPS radar"
              >
                <Navigation className="w-3.5 h-3.5 text-theme-primary transition-transform group-hover:scale-110" />
                <span className="hidden xl:inline">Track Order</span>
              </button>
            )}

            {/* Language Selector (Clean Pill) */}
            <div className="relative flex items-center bg-stone-100/90 rounded-xl px-2 py-1.5 border border-stone-200 text-xs">
              <Globe className="w-3.5 h-3.5 text-stone-500 mr-1 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-stone-800 font-bold outline-hidden cursor-pointer uppercase text-xs pr-0.5"
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="rw">RW</option>
                <option value="fr">FR</option>
                <option value="es">ES</option>
                <option value="ar">AR</option>
              </select>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Wishlist"
              title="Saved produce in wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Basket Button (Clear, High-Contrast) */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 bg-theme-primary hover:opacity-95 active:scale-98 text-white px-3 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              aria-label="Shopping Cart"
              title="Open shopping cart drawer"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{t.cart}</span>
              <span className="bg-white/25 text-white text-xs font-black px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {cartCount}
              </span>
            </button>

            {/* User Account / Admin Capsule with Luxury Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-1.5 p-1 sm:px-2 rounded-xl border transition-all cursor-pointer ${
                    currentUser.role === 'admin'
                      ? 'border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-950 shadow-2xs'
                      : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                  title={currentUser.role === 'admin' ? "Administrator account menu" : "Customer account menu"}
                >
                  <div className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs text-white ${
                    currentUser.role === 'admin' ? 'bg-amber-600' : 'bg-emerald-700'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-stone-900 leading-tight truncate max-w-20">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {currentUser.role === 'admin' && (
                      <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest leading-none">
                        👑 Admin
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-stone-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                  <span>{t.signIn}</span>
                </button>
              )}

              {/* Luxury Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* User Profile Header */}
                  <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/60">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-stone-900">{currentUser.name}</p>
                      {currentUser.role === 'admin' && (
                        <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-black tracking-wider uppercase">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">{currentUser.email}</p>
                  </div>

                  {/* Actions in Dropdown */}
                  <div className="p-1 space-y-0.5">
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 font-bold flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-700" />
                          <span>Check All System Actions</span>
                        </span>
                        <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">
                          {activitiesCount}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenThemeSelector();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Palette className="w-4 h-4 text-emerald-700" />
                      <span>Color Theme Palette</span>
                    </button>

                    {onToggleMinimizeHero && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onToggleMinimizeHero();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 font-semibold flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {isHeroMinimized ? <Maximize2 className="w-4 h-4 text-emerald-600" /> : <Minimize2 className="w-4 h-4 text-stone-500" />}
                          <span>{isHeroMinimized ? 'Expand Full Banner' : 'Minimize Store Banner (100%)'}</span>
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {isHeroMinimized ? 'Slim' : 'Full'}
                        </span>
                      </button>
                    )}

                    {onOpenOrderTracker && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenOrderTracker();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Navigation className="w-4 h-4 text-theme-primary" />
                        <span>Live Kigali Order Tracker</span>
                      </button>
                    )}
                  </div>

                  {/* Sign Out */}
                  <div className="pt-1 mt-1 border-t border-stone-100 px-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE DRAWER (Clean & Full Feature) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          
          {/* Quick 100% Minimized Toggle on Mobile */}
          {onToggleMinimizeHero && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleMinimizeHero();
              }}
              className="w-full p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-900 font-bold text-xs flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {isHeroMinimized ? <Maximize2 className="w-4 h-4 text-emerald-700" /> : <Minimize2 className="w-4 h-4 text-emerald-700" />}
                <span>{isHeroMinimized ? 'Expand Homepage Banner' : '100% Minimized (Show Store)'}</span>
              </span>
              <span className="text-[10px] bg-white border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-md uppercase font-black">
                {isHeroMinimized ? 'Active' : 'Toggle'}
              </span>
            </button>
          )}

          <div className="space-y-1 pt-1">
            <button
              onClick={() => scrollTo('home')}
              className="block w-full text-left px-3 py-2 rounded-lg font-bold text-stone-800 hover:bg-stone-100 text-sm"
            >
              {t.home || 'Home'}
            </button>
            <button
              onClick={() => scrollTo('shop')}
              className="block w-full text-left px-3 py-2 rounded-lg font-bold text-stone-800 hover:bg-stone-100 text-sm"
            >
              {t.shop}
            </button>
            <button
              onClick={() => scrollTo('baskets')}
              className="w-full text-left px-3 py-2 rounded-lg font-bold text-stone-800 hover:bg-stone-100 text-sm flex items-center justify-between"
            >
              <span>Recipe Baskets & Meal Kits</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                New
              </span>
            </button>
            <button
              onClick={() => scrollTo('delivery')}
              className="block w-full text-left px-3 py-2 rounded-lg font-bold text-stone-800 hover:bg-stone-100 text-sm"
            >
              {t.delivery}
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="block w-full text-left px-3 py-2 rounded-lg font-bold text-stone-800 hover:bg-stone-100 text-sm"
            >
              {t.about}
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="block w-full text-left px-3 py-2 rounded-lg font-bold text-stone-800 hover:bg-stone-100 text-sm"
            >
              {t.contact}
            </button>
          </div>

          {/* Quick Utility Actions in Mobile */}
          <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
            {onOpenOrderTracker && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenOrderTracker(); }}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-xs text-stone-800 flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-theme-primary" />
                <span>Track Order</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenThemeSelector(); }}
              className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-xs text-stone-800 flex items-center justify-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-700" />
              <span>Theme Colors</span>
            </button>
          </div>

          {/* Auth in Mobile Drawer */}
          <div className="pt-2">
            {currentUser ? (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-xs text-stone-900">{currentUser.name}</p>
                  <p className="text-[10px] text-stone-500 uppercase font-black tracking-wider text-amber-700">
                    {currentUser.role}
                  </p>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full py-2.5 text-center font-bold text-white bg-theme-primary rounded-xl text-xs shadow-xs"
              >
                {t.signIn}
              </button>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
