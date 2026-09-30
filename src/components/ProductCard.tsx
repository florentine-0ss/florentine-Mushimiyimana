import React from 'react';
import { Star, Heart, Plus, Minus, Eye, Check, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  cartQuantity: number;
  onUpdateCartQuantity: (productId: number, quantity: number) => void;
  onQuickView: (product: Product) => void;
  onOpenFarmPassport?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  cartQuantity,
  onUpdateCartQuantity,
  onQuickView,
  onOpenFarmPassport,
}) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col">
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs ${
              product.badge === 'Fresh'
                ? 'bg-emerald-600 text-white'
                : product.badge === 'Limited Time'
                ? 'bg-amber-500 text-stone-950'
                : product.badge === 'Organic'
                ? 'bg-teal-700 text-white'
                : 'bg-rose-600 text-white'
            }`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-xs ${
              isInWishlist
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          <button
            onClick={() => onQuickView(product)}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-emerald-700 flex items-center justify-center backdrop-blur-md transition-colors shadow-xs"
            aria-label="Quick View"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Harvested freshness note */}
        {product.harvested && (
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-stone-900/60 backdrop-blur-xs text-[10px] text-stone-200 truncate">
            {product.harvested}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1 truncate">
            <span>{product.spec}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.origin.split(',')[0]}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-stone-900 text-base group-hover:text-emerald-800 transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="ml-1 text-xs font-bold text-stone-800">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-stone-400">({product.reviewsCount})</span>
            {onOpenFarmPassport ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFarmPassport(product);
                }}
                className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold ml-auto flex items-center gap-1 hover:underline cursor-pointer"
                title="View Rwandan Farm Passport & RSB Cert"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Farm Passport</span>
              </button>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold ml-auto">Certified Bio</span>
            )}
          </div>
        </div>

        {/* Footer: Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-extrabold text-stone-900 tracking-tight">
              {product.price.toLocaleString()} <span className="text-xs font-semibold text-stone-500">FRW</span>
            </div>
            {product.oldPrice && (
              <div className="text-xs text-stone-400 line-through">
                {product.oldPrice.toLocaleString()} FRW
              </div>
            )}
          </div>

          {/* Add / Quantity Controller */}
          {cartQuantity > 0 ? (
            <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg p-0.5">
              <button
                onClick={() => onUpdateCartQuantity(product.id, cartQuantity - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-stone-800 hover:bg-stone-200 transition-colors shadow-2xs"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-xs text-stone-900">
                {cartQuantity}
              </span>
              <button
                onClick={() => onUpdateCartQuantity(product.id, cartQuantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-theme-primary text-white hover:opacity-90 transition-colors shadow-2xs"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product, 1)}
              className="flex items-center gap-1.5 bg-theme-primary hover:opacity-90 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
