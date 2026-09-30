import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { CartItem, Language, PaymentMethod } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentLang: Language;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: (discountAmount: number, paymentMethod: PaymentMethod) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  currentLang,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  const t = TRANSLATIONS[currentLang].cart;
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('mtn');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const deliveryFee = subtotal >= 25000 || subtotal === 0 ? 0 : 2000;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const freeDeliveryThreshold = 25000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'FOFOPICK' || cleanCode === 'FRESH10') {
      setDiscountPercent(10);
      setPromoMessage('10% Discount applied successfully!');
    } else if (cleanCode === 'KIGALIFRESH' || cleanCode === 'FOFO15') {
      setDiscountPercent(15);
      setPromoMessage('15% Special Discount applied!');
    } else {
      setPromoMessage('Invalid promo code. Try "FOFOPICK"');
      setDiscountPercent(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="font-extrabold text-base text-stone-900">{t.title}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Free Delivery Bar */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs">
              {remainingForFreeDelivery === 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>You've unlocked FREE Kigali delivery!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-stone-700 mb-1 font-medium">
                    <span>Free Kigali Delivery</span>
                    <span>Add <strong>{remainingForFreeDelivery.toLocaleString()} FRW</strong></span>
                  </div>
                  <div className="w-full bg-emerald-200/70 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-800 text-base">{t.empty}</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  {t.emptyDesc}
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-2 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-900 transition-colors"
                >
                  Explore Organic Shop
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-stone-200/90 bg-white hover:border-emerald-300 transition-colors"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 text-xs truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">{item.product.spec}</p>
                      <div className="text-xs font-extrabold text-stone-900 mt-1">
                        {(item.product.price * item.quantity).toLocaleString()} FRW
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={onClearCart}
                  className="text-[11px] text-stone-400 hover:text-rose-600 transition-colors pt-1"
                >
                  Clear all items
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={t.promoCode}
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-stone-300 rounded-lg focus:outline-emerald-600 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.applyPromo}
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[11px] font-medium ${discountPercent > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {promoMessage}
                </p>
              )}

              {/* Price Calculation breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-stone-900">{subtotal.toLocaleString()} FRW</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{t.discount} ({discountPercent}%)</span>
                    <span>-{discountAmount.toLocaleString()} FRW</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.deliveryFee}</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : `${deliveryFee.toLocaleString()} FRW`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>{t.total}</span>
                  <span className="text-base text-emerald-800">{total.toLocaleString()} FRW</span>
                </div>
              </div>

              {/* Payment selector preview */}
              <div>
                <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Fast Payment in Rwanda:
                </p>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('mtn')}
                    className={`py-1.5 px-2 rounded-lg border font-bold text-center transition-colors cursor-pointer ${
                      selectedPayment === 'mtn'
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('airtel')}
                    className={`py-1.5 px-2 rounded-lg border font-bold text-center transition-colors cursor-pointer ${
                      selectedPayment === 'airtel'
                        ? 'border-red-500 bg-red-50 text-red-900'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    Airtel Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('card')}
                    className={`py-1.5 px-2 rounded-lg border font-bold text-center transition-colors cursor-pointer ${
                      selectedPayment === 'card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    Card
                  </button>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => onProceedToCheckout(discountAmount, selectedPayment)}
                className="w-full flex items-center justify-center gap-2 bg-theme-primary hover:opacity-95 active:scale-98 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
              >
                <span>{t.proceed}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-center text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                ← Return to Shopping
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
