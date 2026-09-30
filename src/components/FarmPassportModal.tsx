import React, { useState } from 'react';
import { 
  X, ShieldCheck, MapPin, Mountain, Sprout, Droplets, 
  Award, Heart, Sparkles, Smartphone, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { Product, FarmPassport, Language } from '../types';
import { FARM_PASSPORTS } from '../data/mockData';

interface FarmPassportModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const FarmPassportModal: React.FC<FarmPassportModalProps> = ({
  product,
  isOpen,
  onClose,
  currentLang
}) => {
  const [tipSuccess, setTipSuccess] = useState(false);
  const [isTipping, setIsTipping] = useState(false);

  if (!isOpen || !product) return null;

  // Find passport or generate fallback
  const passport: FarmPassport = FARM_PASSPORTS[product.id] || {
    productId: product.id,
    cooperativeName: `${product.origin.split(',')[0]} Agricultural Cooperative`,
    district: product.origin,
    elevation: '1,720 meters above sea level',
    soilType: 'Volcanic andosol with rich organic micro-nutrients',
    leadFarmer: product.farmer,
    harvestTime: product.harvested || 'Fresh today at sunrise',
    batchNumber: `RW-FGG-2026-09-${product.id}04`,
    rsbCertification: 'RSB / ORG / 2026-9041 (Certified Organic)',
    pesticideFree: true,
    waterSource: 'Highland mountain spring & solar catchment',
    farmerStory: `Dedicated smallholder members sustainably cultivate ${product.name.toLowerCase()} without chemical pesticides, relying on crop rotation and volcanic soil biodiversity.`
  };

  const handleSendFarmerTip = () => {
    setIsTipping(true);
    setTimeout(() => {
      setIsTipping(false);
      setTipSuccess(true);
      setTimeout(() => setTipSuccess(false), 4500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header with Return Button */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h2 className="text-base sm:text-lg font-black text-stone-900">
                  Rwandan Farm-to-Fork Passport
                </h2>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Batch #{passport.batchNumber} • RSB Verified
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Crop Summary Banner */}
        <div className="p-6 bg-linear-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white flex flex-col sm:flex-row items-center gap-5">
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/20 shadow-xl shrink-0"
          />
          <div className="text-center sm:text-left flex-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
              100% Pure Organic Verified
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">{product.name}</h3>
            <p className="text-xs text-stone-300 mt-0.5">{passport.cooperativeName}</p>
            <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{passport.district}</span>
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">

          {/* Geological & Agricultural Metrics Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
              Terroir & Environmental Credentials
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <Mountain className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Elevation</span>
                <span className="text-xs font-bold text-stone-900">{passport.elevation}</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <Sprout className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Soil Condition</span>
                <span className="text-xs font-bold text-stone-900 truncate block" title={passport.soilType}>
                  {passport.soilType.split(' ')[0]} Volcanic
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <Droplets className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Water Source</span>
                <span className="text-xs font-bold text-stone-900 truncate block">Mountain Stream</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <Award className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">RSB Organic Seal</span>
                <span className="text-xs font-bold text-emerald-800">Grade A Certified</span>
              </div>

            </div>
          </div>

          {/* Farmer Spotlight Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {passport.leadFarmer.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-stone-900">
                    Lead Farmer: {passport.leadFarmer}
                  </h5>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    {passport.cooperativeName}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-300">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Fair Trade Guaranteed
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed italic">
              "{passport.farmerStory}"
            </p>

            <div className="pt-2 border-t border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-[11px] text-stone-600">
                <strong>Harvest Timestamp:</strong> {passport.harvestTime}
              </div>

              {/* Direct Farmer Tip via MoMo */}
              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSendFarmerTip}
                  disabled={isTipping || tipSuccess}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-700 fill-rose-700" />
                  <span>
                    {isTipping 
                      ? 'Prompting MoMo 500 FRW...' 
                      : tipSuccess 
                      ? '✓ 500 FRW Bonus Sent to Farmer!' 
                      : 'Tip Farmer 500 FRW via MoMo'}
                  </span>
                </button>
              </div>
            </div>

            {tipSuccess && (
              <div className="p-2.5 bg-emerald-100/90 rounded-xl border border-emerald-300 text-xs text-emerald-950 font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Murakoze cyane! Your 500 FRW farmer appreciation tip went directly to {passport.leadFarmer}'s MTN Mobile Money wallet.</span>
              </div>
            )}
          </div>

          {/* Rwanda Standards Board Official Guarantee Note */}
          <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">100% Rwandan Food Safety Guarantee</p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Every produce crate delivered by Fofo GreenGrocer Hub is inspected at our Kigali cold facility for crispness, chemical-free purity, and cold-chain integrity before handover.
              </p>
            </div>
          </div>

          {/* Return Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Catalog</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
