import React, { useState } from 'react';
import { 
  X, Search, Truck, CheckCircle2, Clock, MapPin, Phone, 
  ShieldCheck, Thermometer, Navigation, ArrowLeft, Bike,
  PackageCheck, Sparkles, MessageSquare
} from 'lucide-react';
import { Order, Language } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentLang: Language;
  initialOrderId?: string | null;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentLang,
  initialOrderId
}) => {
  const [searchCode, setSearchCode] = useState(initialOrderId || (orders.length > 0 ? orders[0].id : 'FGG-8842'));
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (initialOrderId) {
      return orders.find((o) => o.id === initialOrderId) || orders[0] || null;
    }
    return orders[0] || null;
  });
  const [callSimulated, setCallSimulated] = useState(false);
  const [noteSent, setNoteSent] = useState(false);

  // Sync when initialOrderId changes
  React.useEffect(() => {
    if (initialOrderId) {
      setSearchCode(initialOrderId);
      const match = orders.find((o) => o.id === initialOrderId);
      if (match) setActiveOrder(match);
    }
  }, [initialOrderId, orders]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchCode.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === clean);
    if (found) {
      setActiveOrder(found);
    } else {
      // Fallback demo order if custom ID entered
      const demoOrder: Order = {
        id: clean,
        customerName: 'Kigali Fresh Customer',
        phone: '+250 788 123 456',
        items: orders[0]?.items || [],
        subtotal: 18500,
        discount: 1500,
        deliveryFee: 0,
        total: 17000,
        paymentMethod: 'mtn',
        address: 'KG 9 Ave, Nyarutarama',
        district: 'Gasabo',
        status: 'Out for Delivery',
        createdAt: '07:15 AM',
        courierName: 'Jean-Claude Hakizimana',
        courierPhone: '+250 788 441 290',
        courierVehicle: 'Green Cargo E-Bike #04',
        estimatedMinutes: 20,
        temperatureCelsius: 2.8
      };
      setActiveOrder(demoOrder);
    }
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Preparing': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 2;
    }
  };

  const currentStep = activeOrder ? getStatusStep(activeOrder.status) : 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-theme-primary animate-pulse" />
                <h2 className="text-base sm:text-lg font-bold text-stone-900">
                  Live Rwandan Delivery Radar
                </h2>
              </div>
              <p className="text-xs text-stone-500">Real-time GPS tracking & cold-chain monitoring across Kigali</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Order Switcher Pills */}
        <div className="p-4 sm:px-6 bg-stone-100/70 border-b border-stone-200/80">
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Order Code (e.g. FGG-8842, FGG-7712)..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm border border-stone-300 bg-white font-mono focus:outline-emerald-600"
              />
            </div>
            <button
              type="submit"
              className="bg-theme-primary hover:opacity-95 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              Locate Order
            </button>
          </form>

          {/* Quick Order Sample Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-stone-500 font-semibold whitespace-nowrap">Quick Test Orders:</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setSearchCode(ord.id);
                  setActiveOrder(ord);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeOrder?.id === ord.id
                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
              >
                {ord.id} • {ord.status}
              </button>
            ))}
          </div>
        </div>

        {activeOrder ? (
          <div className="p-5 sm:p-6 space-y-6">
            
            {/* Top Order Status Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-900 text-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{activeOrder.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeOrder.status}
                  </span>
                </div>
                <h3 className="text-lg font-black mt-1">
                  {activeOrder.status === 'Delivered' 
                    ? 'Delivered to Doorstep' 
                    : activeOrder.status === 'Out for Delivery'
                    ? `Arriving in ~${activeOrder.estimatedMinutes || 20} minutes`
                    : 'Sanitized & Packing at Kigali Cold Hub'}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Destination: {activeOrder.address}, {activeOrder.district}
                </p>
              </div>

              {/* Temperature Telemetry Pill */}
              <div className="bg-stone-800/90 border border-stone-700 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
                <Thermometer className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block leading-tight">Cold-Chain Sensor</span>
                  <span className="text-xs font-black text-emerald-400">
                    {activeOrder.temperatureCelsius || 2.8}°C • Certified Fresh
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-4">
                Delivery Timeline Progress
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                
                {/* Step 1 */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  currentStep >= 1 ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h5 className="font-bold text-xs">Farm QC Passed</h5>
                  <p className="text-[10px] text-stone-500 mt-0.5">Harvested & tested at cooperative</p>
                </div>

                {/* Step 2 */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  currentStep >= 2 ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                    {currentStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-emerald-700 animate-spin" />}
                  </div>
                  <h5 className="font-bold text-xs">Sanitized & Packed</h5>
                  <p className="text-[10px] text-stone-500 mt-0.5">Kigali Central Cold-Hub</p>
                </div>

                {/* Step 3 */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  currentStep >= 3 ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 ring-2 ring-emerald-500/30' : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-theme-primary text-white flex items-center justify-center text-xs font-bold">3</span>
                    {currentStep === 3 ? <Bike className="w-4 h-4 text-theme-primary animate-bounce" /> : currentStep > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : null}
                  </div>
                  <h5 className="font-bold text-xs">Courier En Route</h5>
                  <p className="text-[10px] text-stone-500 mt-0.5">Eco Cargo E-Bike #04</p>
                </div>

                {/* Step 4 */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  currentStep === 4 ? 'bg-emerald-100 border-emerald-400 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold">4</span>
                    {currentStep === 4 && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <h5 className="font-bold text-xs">Safe Handover</h5>
                  <p className="text-[10px] text-stone-500 mt-0.5">Contactless delivery</p>
                </div>

              </div>
            </div>

            {/* Interactive Visual Radar Map of Kigali */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                    Live Dispatch Route Radar • Kigali Hub
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 font-mono">
                  Dist: 3.4 km • Est. 18m
                </span>
              </div>

              {/* Kigali Map Simulation Visual SVG */}
              <div className="h-44 sm:h-52 w-full bg-emerald-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-900">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                
                {/* Kigali Topography Curves */}
                <svg className="absolute inset-0 w-full h-full text-emerald-800/40" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path d="M 0 100 Q 100 40 200 110 T 400 80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 0 140 Q 150 180 300 120 T 400 150" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M 60 160 C 140 120, 220 140, 320 60" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                </svg>

                {/* Hub Point (Kimironko) */}
                <div className="absolute left-[15%] top-[70%] -translate-x-1/2 -translate-y-1/2 text-center z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
                    HQ
                  </div>
                  <span className="text-[10px] font-bold text-emerald-200 mt-1 block drop-shadow-xs">Kimironko Hub</span>
                </div>

                {/* Courier Moving Marker */}
                <div className="absolute left-[55%] top-[45%] -translate-x-1/2 -translate-y-1/2 text-center z-20 animate-pulse">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-900 border-2 border-white shadow-xl flex items-center justify-center font-bold text-xs">
                      🚲
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border border-white animate-ping" />
                  </div>
                  <span className="text-[10px] font-black text-amber-300 mt-1 block drop-shadow-md">
                    {activeOrder.courierName || 'Courier Bike'}
                  </span>
                </div>

                {/* Customer Destination Marker */}
                <div className="absolute right-[18%] top-[25%] -translate-x-1/2 -translate-y-1/2 text-center z-10">
                  <div className="w-6 h-6 rounded-full bg-rose-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-rose-200 mt-1 block drop-shadow-xs">
                    {activeOrder.customerName}
                  </span>
                </div>

              </div>

              {/* Courier Contact Card */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-sm">
                    {activeOrder.courierName ? activeOrder.courierName.charAt(0) : 'J'}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">{activeOrder.courierName || 'Jean-Claude Hakizimana'}</p>
                    <p className="text-[11px] text-stone-500">Eco Cargo Courier • {activeOrder.courierPhone || '+250 788 441 290'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setCallSimulated(true);
                      setTimeout(() => setCallSimulated(false), 3000);
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{callSimulated ? 'Calling Courier...' : 'Call Courier'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNoteSent(true);
                      setTimeout(() => setNoteSent(false), 3000);
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{noteSent ? 'Note Sent!' : 'Send Gate Note'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Produce Items Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="font-bold text-stone-800 uppercase tracking-wider block mb-2 text-[11px]">
                Items in This Delivery Box:
              </span>
              <div className="space-y-1.5">
                {activeOrder.items.map((it) => (
                  <div key={it.product.id} className="flex justify-between items-center text-stone-700">
                    <span>{it.quantity}x {it.product.name} ({it.product.spec})</span>
                    <span className="font-bold text-stone-900">{(it.product.price * it.quantity).toLocaleString()} FRW</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-stone-200 mt-2 flex justify-between font-black text-stone-900">
                <span>Total Paid:</span>
                <span className="text-theme-primary">{activeOrder.total.toLocaleString()} FRW</span>
              </div>
            </div>

            {/* Bottom Return Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Produce Market</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-stone-500 text-sm">No order selected or found.</p>
          </div>
        )}

      </div>
    </div>
  );
};
