import React, { useState } from 'react';
import { X, Star, Heart, Plus, Minus, ShoppingCart, MapPin, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenFarmPassport?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenFarmPassport
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-stone-100 min-h-[300px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right: Info & Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Origin Tag */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{product.origin}</span>
              </div>

              <h2 className="text-2xl font-bold text-stone-900 leading-tight">
                {product.name}
              </h2>

              <p className="text-xs text-stone-500 mt-1">
                Farmed by <strong className="text-stone-800">{product.farmer}</strong>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 text-sm font-bold text-stone-800">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-500">{product.reviewsCount} customer reviews</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-black text-stone-900">
                  {product.price.toLocaleString()} FRW
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {product.oldPrice.toLocaleString()} FRW
                  </span>
                )}
                <span className="text-xs font-medium text-stone-500">/ {product.spec}</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-stone-600 text-xs sm:text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Quick Specs Grid */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs border-t border-b border-stone-100 py-3">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Certified Organic</span>
                </div>
                {product.calories && (
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{product.calories}</span>
                  </div>
                )}
                {product.harvested && (
                  <div className="col-span-2 text-stone-500 text-[11px]">
                    Freshness: <span className="font-semibold text-emerald-800">{product.harvested}</span>
                  </div>
                )}
              </div>

              {onOpenFarmPassport && (
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFarmPassport(product);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Inspect Rwandan Farm Passport & Soil Credentials</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Basket button */}
                <button
                  onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Basket ({ (product.price * quantity).toLocaleString() } FRW)</span>
                </button>

                {/* Wishlist button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                    isInWishlist
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-600' : ''}`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
