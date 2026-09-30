import React, { useState } from 'react';
import { 
  X, CheckCircle, CreditCard, Smartphone, Truck, ShieldCheck, 
  Printer, ArrowLeft, ChevronRight, MapPin, Phone, User as UserIcon,
  RotateCcw, Sparkles, Navigation
} from 'lucide-react';
import { CartItem, Language, Order, PaymentMethod } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { RWANDA_LOCATIONS } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentLang: Language;
  discountAmount: number;
  initialPaymentMethod: PaymentMethod;
  onOrderComplete: (order: Order) => void;
  onReturnToCart?: () => void;
  onOpenOrderTracker?: (orderId: string) => void;
}

type CheckoutStep = 'details' | 'payment' | 'processing' | 'confirmed';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentLang,
  discountAmount,
  initialPaymentMethod,
  onOrderComplete,
  onReturnToCart,
  onOpenOrderTracker
}) => {
  const t = TRANSLATIONS[currentLang].checkout;
  const [step, setStep] = useState<CheckoutStep>('details');
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+250');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Gasabo');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 25000 || subtotal === 0 ? 0 : 2000;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Please enter the recipient full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setValidationError('Please enter a valid mobile number (e.g. 788 123 456)');
      return;
    }
    if (!address.trim()) {
      setValidationError('Please provide a specific street, landmark, or house address in Kigali');
      return;
    }
    setValidationError(null);
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    setStep('processing');

    const newOrder: Order = {
      id: `FGG-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name.trim(),
      phone: `${countryCode} ${phone.trim()}`,
      items: [...items],
      subtotal,
      discount: discountAmount,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      address: address.trim(),
      district,
      status: 'Preparing',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      courierName: 'Jean-Claude Hakizimana',
      courierPhone: '+250 788 441 290',
      courierVehicle: 'Green Cargo E-Bike #04',
      estimatedMinutes: 25,
      temperatureCelsius: 2.8
    };

    setTimeout(() => {
      setConfirmedOrder(newOrder);
      onOrderComplete(newOrder);
      setStep('confirmed');
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReturnToCart = () => {
    if (onReturnToCart) {
      onReturnToCart();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Top Navigation & Return Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            {step === 'details' && (
              <button
                type="button"
                onClick={handleReturnToCart}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 transition-all shadow-2xs group cursor-pointer"
                title="Return to shopping cart"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-stone-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>Return to Cart</span>
              </button>
            )}

            {step === 'payment' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-300 transition-all shadow-2xs group cursor-pointer"
                  title="Return to delivery address details"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-stone-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Return to Address</span>
                </button>
                <button
                  type="button"
                  onClick={handleReturnToCart}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-200 transition-all shadow-2xs group cursor-pointer"
                  title="Return to shopping cart"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  <span>Return to Cart</span>
                </button>
              </div>
            )}

            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                {step === 'details' && 'Step 1: Delivery Details'}
                {step === 'payment' && 'Step 2: Choose Payment'}
                {step === 'processing' && 'Authorizing Payment...'}
                {step === 'confirmed' && 'Order Confirmed!'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {step === 'details' && 'Where should we deliver your fresh harvest?'}
                {step === 'payment' && 'Instant Rwandan MoMo push or Visa/Mastercard'}
                {step === 'processing' && 'Connecting to Rwandan payment gateway'}
                {step === 'confirmed' && 'Thank you for supporting Rwandan farmers'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step !== 'processing' && step !== 'confirmed' && (
              <button
                type="button"
                onClick={handleReturnToCart}
                className="hidden sm:inline-flex text-xs text-stone-500 hover:text-stone-800 underline mr-2 cursor-pointer"
              >
                Edit Cart
              </button>
            )}
            {step !== 'processing' && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
                title="Close checkout"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Step Indicator Breadcrumbs */}
        {step !== 'processing' && step !== 'confirmed' && (
          <div className="px-6 py-2.5 bg-stone-100/70 border-b border-stone-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                step === 'details' ? 'bg-theme-primary text-white' : 'bg-emerald-700 text-white'
              }`}>
                1
              </span>
              <span className={step === 'details' ? 'font-bold text-stone-900' : 'text-stone-600'}>
                Delivery Destination
              </span>
              
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 mx-1" />

              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                step === 'payment' ? 'bg-theme-primary text-white' : 'bg-stone-300 text-stone-700'
              }`}>
                2
              </span>
              <span className={step === 'payment' ? 'font-bold text-stone-900' : 'text-stone-500'}>
                Payment & Authorization
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold">
              <span>{items.reduce((acc, it) => acc + it.quantity, 0)} items</span>
              <span>•</span>
              <span className="text-theme-primary font-bold">{grandTotal.toLocaleString()} FRW</span>
            </div>
          </div>
        )}

        {/* STEP 1: RECIPIENT & ADDRESS DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="p-5 sm:p-6 space-y-5">
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {validationError}
              </div>
            )}

            {/* Recipient Details */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <UserIcon className="w-4 h-4 text-theme-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Recipient Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Divine Uwase"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number (MoMo / Delivery SMS) *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-stone-100 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-bold text-stone-700 cursor-pointer"
                    >
                      <option value="+250">RW +250</option>
                      <option value="+254">KE +254</option>
                      <option value="+256">UG +256</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="788 123 456"
                      className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2 mb-2.5">
                <MapPin className="w-4 h-4 text-theme-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Delivery Destination
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    District / Region *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 bg-white cursor-pointer"
                  >
                    {RWANDA_LOCATIONS.map((loc) => (
                      <option key={loc.district} value={loc.district}>
                        {loc.district} ({loc.fee === 0 || subtotal >= 25000 ? 'Free Delivery' : `${loc.fee.toLocaleString()} FRW`})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Specific Street / Landmark / House *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. KG 14 Ave, House 24, Kibagabaga"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="mt-2.5">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional delivery notes: gate color, landmark, preferred hour (e.g. 'Leave with security')"
                  className="w-full text-xs px-3.5 py-2 border border-stone-200 rounded-lg text-stone-600 bg-stone-50"
                />
              </div>
            </div>

            {/* Navigation & Return Actions Bar */}
            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50/80 p-3.5 rounded-2xl">
              <button
                type="button"
                onClick={handleReturnToCart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-stone-500" />
                <span>Return to Cart (Modify Items)</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">Total</span>
                  <p className="text-base font-black text-theme-primary leading-none">
                    {grandTotal.toLocaleString()} FRW
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-theme-primary hover:opacity-95 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </form>
        )}

        {/* STEP 2: PAYMENT METHOD & REVIEW */}
        {step === 'payment' && (
          <div className="p-5 sm:p-6 space-y-5">
            
            {/* Quick Return Navigation Ribbon */}
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Need to adjust your address or grocery items?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
                  <span>Return to Address</span>
                </button>
                <button
                  type="button"
                  onClick={handleReturnToCart}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                  <span>Return to Cart</span>
                </button>
              </div>
            </div>

            {/* Delivery Recap Card with Return Link */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-theme-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-stone-500">Delivering to:</span>
                  <p className="font-bold text-stone-900">{name} • {countryCode} {phone}</p>
                  <p className="text-stone-600 text-[11px]">{address}, {district}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs font-bold text-theme-primary hover:underline px-2.5 py-1 rounded-lg bg-white border border-stone-200 shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            {/* Choose Payment Method */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Select Payment Method
                </h3>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Instant Verification
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mtn')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'mtn'
                      ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-400 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-amber-600 mb-2" />
                  <div>
                    <span className="block font-bold text-xs text-stone-900">MTN MoMo</span>
                    <span className="text-[10px] text-stone-500">*182# prompt</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('airtel')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'airtel'
                      ? 'border-red-500 bg-red-50/90 ring-2 ring-red-400 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-red-600 mb-2" />
                  <div>
                    <span className="block font-bold text-xs text-stone-900">Airtel Money</span>
                    <span className="text-[10px] text-stone-500">*500# prompt</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-700 mb-2" />
                  <div>
                    <span className="block font-bold text-xs text-stone-900">Bank Card</span>
                    <span className="text-[10px] text-stone-500">Visa / Master</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-stone-700 bg-stone-100 ring-2 ring-stone-600 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <Truck className="w-5 h-5 text-stone-700 mb-2" />
                  <div>
                    <span className="block font-bold text-xs text-stone-900">Cash on Arrival</span>
                    <span className="text-[10px] text-stone-500">To courier</span>
                  </div>
                </button>
              </div>

              {/* MoMo Helper Box */}
              {(paymentMethod === 'mtn' || paymentMethod === 'airtel') && (
                <div className="mt-3 p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      Interactive Push Prompt:
                    </p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Upon clicking authorize, an instant {paymentMethod === 'mtn' ? 'MTN Mobile Money (*182#)' : 'Airtel Money (*500#)'} request for <strong>{grandTotal.toLocaleString()} FRW</strong> will prompt on <strong>{countryCode} {phone}</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-stone-100 rounded-2xl space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Produce Items Subtotal:</span>
                <span className="font-semibold text-stone-800">{subtotal.toLocaleString()} FRW</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Special Voucher Discount:</span>
                  <span>-{discountAmount.toLocaleString()} FRW</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Transport ({district}):</span>
                <span>{deliveryFee === 0 ? 'FREE (Orders over 25,000 FRW)' : `${deliveryFee.toLocaleString()} FRW`}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
                <span>Grand Total:</span>
                <span className="text-theme-primary text-base">{grandTotal.toLocaleString()} FRW</span>
              </div>
            </div>

            {/* Action Buttons: Prominent Return and Confirm */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-stone-300 bg-white hover:bg-stone-100 active:scale-98 text-stone-800 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer"
                  title="Return to Step 1 to change recipient name, phone or address"
                >
                  <ArrowLeft className="w-4 h-4 text-stone-700" />
                  <span>Return to Address</span>
                </button>

                <button
                  type="button"
                  onClick={handleReturnToCart}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  title="Return to shopping cart to edit quantities or items"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                  <span>Return to Cart</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmPayment}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-theme-primary hover:opacity-95 active:scale-98 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Pay {grandTotal.toLocaleString()} FRW</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: PROCESSING SIMULATION */}
        {step === 'processing' && (
          <div className="p-10 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-stone-900">Authorizing Rwandan Payment...</h3>
              <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto">
                {paymentMethod === 'mtn' || paymentMethod === 'airtel'
                  ? `Prompting ${paymentMethod.toUpperCase()} Mobile Money on ${countryCode} ${phone}. Enter your MoMo PIN to authorize ${grandTotal.toLocaleString()} FRW.`
                  : 'Validating encrypted payment credentials and checking stock reserve...'}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              <span>Safe & Secure Rwandan Transaction</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-stone-900 text-xs font-bold hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
                <span>Cancel & Return to Payment Options</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED RECEIPT */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-stone-900">{t.orderSuccess}</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">{t.orderSuccessDesc}</p>
            </div>

            {/* Official Receipt Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                <div>
                  <span className="text-stone-500">{t.orderId}</span>
                  <p className="font-extrabold text-stone-900 text-sm">{confirmedOrder.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-stone-500">Order Placed</span>
                  <p className="font-semibold text-stone-800">{confirmedOrder.createdAt}</p>
                </div>
              </div>

              <div>
                <span className="text-stone-500 block mb-1">Delivering to</span>
                <p className="font-bold text-stone-900">{confirmedOrder.customerName} ({confirmedOrder.phone})</p>
                <p className="text-stone-600">{confirmedOrder.address}, {confirmedOrder.district}</p>
              </div>

              {/* Items Summary */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200">
                {confirmedOrder.items.map((it) => (
                  <div key={it.product.id} className="flex justify-between text-stone-700">
                    <span>{it.quantity}x {it.product.name} ({it.product.spec})</span>
                    <span className="font-semibold">{(it.product.price * it.quantity).toLocaleString()} FRW</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-stone-200 space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>{confirmedOrder.subtotal.toLocaleString()} FRW</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-{confirmedOrder.discount.toLocaleString()} FRW</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery:</span>
                  <span>{confirmedOrder.deliveryFee === 0 ? 'FREE' : `${confirmedOrder.deliveryFee.toLocaleString()} FRW`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
                  <span>Total Paid ({confirmedOrder.paymentMethod.toUpperCase()}):</span>
                  <span className="text-theme-primary">{confirmedOrder.total.toLocaleString()} FRW</span>
                </div>
              </div>
            </div>

            {/* Live Courier Dispatch Highlight */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  🚲
                </div>
                <div>
                  <p className="font-bold text-emerald-950">Assigned: {confirmedOrder.courierName}</p>
                  <p className="text-[11px] text-emerald-700">Vehicle: {confirmedOrder.courierVehicle} • ETA ~25 mins</p>
                </div>
              </div>

              {onOpenOrderTracker && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOrderTracker(confirmedOrder.id);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Track Live</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-theme-primary hover:opacity-95 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                <span>Return to Fresh Grocer</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
