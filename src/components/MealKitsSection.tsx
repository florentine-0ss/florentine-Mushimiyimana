import React, { useState } from 'react';
import { 
  Sparkles, Clock, Users, ChefHat, Check, ShoppingBag, 
  ArrowRight, BookOpen, X, ShieldCheck 
} from 'lucide-react';
import { MealKit, Product, Language } from '../types';
import { MEAL_KITS } from '../data/mockData';

interface MealKitsSectionProps {
  currentLang: Language;
  products: Product[];
  onAddBundleToCart: (kit: MealKit) => void;
}

export const MealKitsSection: React.FC<MealKitsSectionProps> = ({
  currentLang,
  products,
  onAddBundleToCart
}) => {
  const [selectedKit, setSelectedKit] = useState<MealKit | null>(null);
  const [addedKitId, setAddedKitId] = useState<string | null>(null);

  const handleAddClick = (kit: MealKit) => {
    onAddBundleToCart(kit);
    setAddedKitId(kit.id);
    setTimeout(() => setAddedKitId(null), 2500);
  };

  return (
    <section id="baskets" className="py-16 bg-stone-100/70 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-300">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Chef-Curated Bundles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Rwandan Fresh Harvest Baskets & Kits
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Complete, balanced organic recipe kits sourced fresh from Rwandan hills. Everything you need in one box with up to 20% bundle savings.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Pre-portioned with easy step-by-step recipes</span>
          </div>
        </div>

        {/* 3 Kits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {MEAL_KITS.map((kit) => (
            <div
              key={kit.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Image & Badge Header */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                <img
                  src={kit.image}
                  alt={kit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-theme-primary text-white text-[11px] font-black shadow-md">
                    {kit.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-stone-950 text-[11px] font-black shadow-md">
                    Save {kit.discountPercent}%
                  </span>
                </div>

                {/* Bottom Overlay Title Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base sm:text-lg font-black leading-snug drop-shadow-xs">
                    {kit.name}
                  </h3>
                  <p className="text-[11px] text-stone-200 line-clamp-1 mt-0.5">
                    {kit.tagline}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Specs Pill Bar */}
                <div className="flex items-center gap-3 text-xs text-stone-500 pb-3 border-b border-stone-100">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {kit.prepTime}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    {kit.servings}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {kit.difficulty}
                  </span>
                </div>

                {/* Items Included List */}
                <div className="space-y-1.5 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                    What's in this box:
                  </span>
                  {kit.itemsIncluded.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                      <Check className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                      <span className="truncate">{it}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & Actions */}
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 line-through mr-1.5 font-semibold">
                        {kit.originalPrice.toLocaleString()} FRW
                      </span>
                      <span className="text-xl font-black text-theme-primary">
                        {kit.bundlePrice.toLocaleString()} FRW
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">
                      Bundle Deal
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedKit(kit)}
                      className="px-3 py-2.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      title="View Recipe Steps"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Recipe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddClick(kit)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        addedKitId === kit.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-theme-primary hover:opacity-95 text-white active:scale-98'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{addedKitId === kit.id ? '✓ Added to Cart!' : 'Add Basket to Cart'}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Recipe Steps Modal */}
      {selectedKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            
            <div className="relative h-48 sm:h-56 bg-stone-900 overflow-hidden">
              <img
                src={selectedKit.image}
                alt={selectedKit.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              <button
                onClick={() => setSelectedKit(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                  Chef's Rwandan Recipe Guide
                </span>
                <h3 className="text-xl sm:text-2xl font-black">{selectedKit.name}</h3>
                <p className="text-xs text-stone-300 mt-1">{selectedKit.tagline}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Quick Specs */}
              <div className="flex items-center gap-4 text-xs p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px]">Prep & Cook</span>
                  <span className="font-bold text-stone-800">{selectedKit.prepTime}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Servings</span>
                  <span className="font-bold text-stone-800">{selectedKit.servings}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Nutrition</span>
                  <span className="font-bold text-emerald-800">{selectedKit.nutritionHighlights}</span>
                </div>
              </div>

              {/* Recipe Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                  Step-by-Step Preparation
                </h4>
                <div className="space-y-2.5">
                  {selectedKit.recipeSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                      <span className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-stone-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedKit(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Recipe
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAddClick(selectedKit);
                    setSelectedKit(null);
                  }}
                  className="inline-flex items-center gap-2 bg-theme-primary hover:opacity-95 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Entire Kit for {selectedKit.bundlePrice.toLocaleString()} FRW</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
