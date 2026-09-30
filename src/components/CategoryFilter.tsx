import React from 'react';
import { Carrot, Apple, Drumstick, Milk, Wheat, Cookie, LayoutGrid } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CategoryFilterProps {
  currentLang: Language;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  currentLang,
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  const t = TRANSLATIONS[currentLang].categories;

  const categories = [
    { id: 'all', name: t.all, icon: LayoutGrid },
    { id: 'vegetables', name: t.vegetables, icon: Carrot },
    { id: 'fruits', name: t.fruits, icon: Apple },
    { id: 'meat', name: t.meat, icon: Drumstick },
    { id: 'dairy', name: t.dairy, icon: Milk },
    { id: 'grains', name: t.grains, icon: Wheat },
    { id: 'snacks', name: t.snacks, icon: Cookie },
  ];

  return (
    <section className="py-4 bg-stone-50/80 border-b border-stone-200/80 sticky top-16 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Scrollable / Responsive Category Pills */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
              : categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border cursor-pointer select-none ${
                  isSelected
                    ? 'bg-theme-primary text-white border-transparent shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200/90 hover:border-emerald-300 hover:text-emerald-800 hover:bg-stone-50 shadow-2xs'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
                <span>{cat.name}</span>
                <span className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
