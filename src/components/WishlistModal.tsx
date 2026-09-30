import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h2 className="font-extrabold text-base text-stone-900">Your Saved Favorites</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-400">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-800 text-base">No saved favorites yet</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Click the heart icon on any Rwandan fresh fruits, greens, or dairy products to save them for later.
                </p>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-stone-200/90 bg-white hover:border-emerald-300 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 text-xs truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">{product.spec}</p>
                    <div className="text-xs font-black text-stone-900 mt-1">
                      {product.price.toLocaleString()} FRW
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product.id);
                      }}
                      className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-2xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-xs"
            >
              Continue Browsing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
