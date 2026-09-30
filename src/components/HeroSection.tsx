import React from 'react';
import { ArrowRight, Leaf, Truck, Award, Search, Sparkles, Minimize2, Maximize2, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Language, ColorTheme } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroSectionProps {
  currentLang: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickCategoryClick: (cat: string) => void;
  currentTheme?: ColorTheme;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  searchQuery,
  onSearchChange,
  onQuickCategoryClick,
  currentTheme = 'lush-emerald',
  isMinimized = false,
  onToggleMinimize
}) => {
  const t = TRANSLATIONS[currentLang].hero;

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBaskets = () => {
    const el = document.getElementById('baskets');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. MINIMIZED HOMEPAGE STRIP (Crisp, Ultra-Clear, 100% focused on groceries)
  if (isMinimized) {
    return (
      <section 
        id="home" 
        className="relative bg-emerald-50/70 border-b border-emerald-100 py-3 px-4 transition-all duration-300 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Quick tagline with organic badge */}
          <div className="flex items-center gap-2.5 text-xs text-emerald-950">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="font-extrabold tracking-tight">Kigali Farm Direct:</span>
            <span className="text-emerald-800 hidden sm:inline font-medium">
              100% Certified Rwandan Organic · Musanze & Bugesera Harvest · 1–2h Delivery
            </span>
          </div>

          {/* Compact Inline Search & Expand Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex items-center bg-white rounded-xl px-3 py-1.5 text-stone-900 text-xs shadow-2xs flex-1 sm:w-72 border border-stone-200">
              <Search className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search avocados, tomatoes, honey..."
                className="w-full bg-transparent text-xs text-stone-900 outline-hidden placeholder:text-stone-400 font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')} 
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold px-1 cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={scrollToShop}
              className="px-3.5 py-1.5 bg-theme-primary hover:opacity-95 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-2xs transition-colors cursor-pointer"
            >
              Shop
            </button>

            {onToggleMinimize && (
              <button
                onClick={onToggleMinimize}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold border border-stone-200 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                title="Expand full visual homepage banner"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline">Expand Banner</span>
              </button>
            )}
          </div>

        </div>
      </section>
    );
  }

  // 2. CLEAR, BRIGHT & AIRY HOMEPAGE (Fresh organic farm direct aesthetic)
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-stone-50/40 to-white border-b border-stone-200/80 py-10 sm:py-14 transition-all duration-300">
      
      {/* Background Decorative Organic Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Control Bar with Status & Minimize Action */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-6 border-b border-emerald-100/80 text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>100% Certified Rwandan Organic Grocer</span>
          </div>

          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 shadow-2xs transition-all cursor-pointer"
              title="Minimize banner to keep pure grocery view"
            >
              <Minimize2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Minimize Banner</span>
            </button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clear Typography & Global Search */}
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
              Fresh Organic Harvest, <br />
              <span className="text-theme-primary">Direct From Rwandan Hills</span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base max-w-xl leading-relaxed">
              Harvested at sunrise by local cooperative farmers in Musanze and Bugesera. 
              Certified pesticide-free, delivered chilled to your doorstep across Kigali within 1–2 hours.
            </p>

            {/* Clear Primary Search Input */}
            <div className="max-w-xl pt-1">
              <div className="relative flex items-center bg-white rounded-2xl shadow-md p-1.5 border-2 border-emerald-700/20 focus-within:border-emerald-700 transition-all">
                <Search className="w-5 h-5 text-emerald-700 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search fresh avocados, tree tomatoes, honey, milk, tilapia..."
                  className="w-full bg-transparent px-3 py-2 text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-hidden font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 mr-1 font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={scrollToShop}
                  className="bg-theme-primary hover:opacity-95 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 shadow-sm cursor-pointer"
                >
                  Find Fresh
                </button>
              </div>

              {/* Popular Harvest Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="text-stone-400 font-medium">Quick Picks:</span>
                {['Avocados', 'Vine Tomatoes', 'Free-Range Eggs', 'Nyungwe Honey', 'Lake Kivu Tilapia'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      onSearchChange(term);
                      scrollToShop();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-emerald-800 hover:border-emerald-300 font-semibold text-[11px] transition-colors shadow-2xs cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Call-To-Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToShop}
                className="flex items-center gap-2 bg-theme-primary hover:opacity-95 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Browse 26 Produce Items</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToBaskets}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>View Recipe Meal Kits</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-950 text-white font-extrabold">Save 20%</span>
              </button>
            </div>

            {/* 3 Clear Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-200/80 max-w-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">RSB Certified</p>
                  <p className="text-[10px] text-stone-500">100% Pesticide-Free</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">1–2h Fast Delivery</p>
                  <p className="text-[10px] text-stone-500">Chilled Kigali Couriers</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Fair Farmer Wages</p>
                  <p className="text-[10px] text-stone-500">180+ Local Families</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase (Bright, Crisp Photography) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Product Highlight Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-4/3 sm:aspect-square bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
                  alt="Fresh organic vegetables and fruits from Rwandan farms"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 text-stone-900 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Volcano Foothills · Musanze
                      </span>
                      <h3 className="font-extrabold text-xs sm:text-sm text-stone-900">
                        Daily Organic Harvest Crate
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Freshly picked today at 5:30 AM
                      </p>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-300">
                      100% Bio
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Rwanda Badge */}
              <div className="absolute -top-3 -right-3 bg-amber-400 text-stone-950 px-3 py-2 rounded-2xl shadow-lg border-2 border-white flex flex-col items-center justify-center transform rotate-3">
                <span className="text-sm font-black leading-none">100%</span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-center">Rwanda<br/>Grown</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
