import React from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { ColorTheme } from '../types';

export interface ThemeOption {
  id: ColorTheme;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgPreview: string;
  badge: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'lush-emerald',
    name: 'Lush Organic Emerald',
    tagline: 'Best for farm-fresh greens & Rwandan produce',
    primaryColor: '#047857',
    accentColor: '#d97706',
    bgPreview: 'from-emerald-950 via-emerald-900 to-stone-900',
    badge: 'Recommended'
  },
  {
    id: 'sunlit-terracotta',
    name: 'Sunlit Terracotta & Clay',
    tagline: 'Warm organic soil, fresh carrots & heirloom fruits',
    primaryColor: '#c2410c',
    accentColor: '#15803d',
    bgPreview: 'from-amber-950 via-orange-950 to-stone-950',
    badge: 'Artisanal'
  },
  {
    id: 'ocean-teal',
    name: 'Lake Kivu Fresh Teal',
    tagline: 'Crisp, modern, and rejuvenating organic aesthetic',
    primaryColor: '#0f766e',
    accentColor: '#ea580c',
    bgPreview: 'from-teal-950 via-emerald-950 to-slate-900',
    badge: 'Modern'
  },
  {
    id: 'golden-harvest',
    name: 'Golden Harvest & Amber',
    tagline: 'Sun-ripened grains, natural honey & farm dairy',
    primaryColor: '#b45309',
    accentColor: '#15803d',
    bgPreview: 'from-amber-950 via-yellow-950 to-stone-950',
    badge: 'Gourmet'
  },
  {
    id: 'royal-forest',
    name: 'Nyungwe Royal Forest & Sage',
    tagline: 'Deep botanical prestige & premium wholesale',
    primaryColor: '#1e3a8a',
    accentColor: '#10b981',
    bgPreview: 'from-slate-950 via-blue-950 to-emerald-950',
    badge: 'Prestige'
  }
];

interface ThemeSelectorProps {
  currentTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                Color Palette & Theme
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-stone-500">Pick the best curated color palette for Fofo GreenGrocer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-1">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Color Swatch Disc */}
                  <div className="relative flex items-center">
                    <div
                      className="w-10 h-10 rounded-2xl shadow-inner flex items-center justify-center text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {isSelected && <Check className="w-5 h-5 stroke-[2.5]" />}
                    </div>
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white absolute -bottom-1 -right-1 shadow-xs"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{theme.name}</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {theme.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-snug mt-0.5">{theme.tagline}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isSelected ? 'Active' : 'Apply'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Theme saves dynamically to your session</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
