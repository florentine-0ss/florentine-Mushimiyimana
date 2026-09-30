import React, { useState } from 'react';
import { Clock, ShieldCheck, MapPin, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { RWANDA_LOCATIONS } from '../data/mockData';

interface DeliverySectionProps {
  currentLang: Language;
  onShopClick: () => void;
}

export const DeliverySection: React.FC<DeliverySectionProps> = ({ currentLang, onShopClick }) => {
  const t = TRANSLATIONS[currentLang].delivery;
  
  const [selectedDistrict, setSelectedDistrict] = useState(RWANDA_LOCATIONS[0].district);
  const currentDistrictData = RWANDA_LOCATIONS.find(d => d.district === selectedDistrict) || RWANDA_LOCATIONS[0];
  const [selectedSector, setSelectedSector] = useState(currentDistrictData.sectors[0]);

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    const found = RWANDA_LOCATIONS.find(d => d.district === districtName);
    if (found) {
      setSelectedSector(found.sectors[0]);
    }
  };

  return (
    <section id="delivery" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>{t.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-stone-600 text-base">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg mb-2">{t.card1Title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{t.card1Text}</p>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg mb-2">{t.card2Title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{t.card2Text}</p>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg mb-2">{t.card3Title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{t.card3Text}</p>
          </div>
        </div>

        {/* Interactive Delivery Time & Rate Calculator */}
        <div className="bg-gradient-to-br from-emerald-950 to-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Coverage Calculator
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {t.calcTitle}
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                We operate refrigerated delivery motorbikes and vans to maintain farm crispness across Kigali's Gasabo, Kicukiro, and Nyarugenge districts.
              </p>
              
              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{t.freeOffer}</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white text-stone-900 p-6 rounded-2xl shadow-lg border border-stone-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* District selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {t.selectDistrict}
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-stone-900 focus:outline-emerald-600 cursor-pointer"
                  >
                    {RWANDA_LOCATIONS.map((loc) => (
                      <option key={loc.district} value={loc.district}>
                        {loc.district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sector selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {t.selectSector}
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-stone-900 focus:outline-emerald-600 cursor-pointer"
                  >
                    {currentDistrictData.sectors.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Instant Results */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-stone-500 font-semibold">{t.estTime}</div>
                  <div className="text-base font-bold text-emerald-950 mt-0.5">{currentDistrictData.estimatedHours}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-stone-500 font-semibold">{t.deliveryCost}</div>
                  <div className="text-lg font-black text-emerald-800 mt-0.5">
                    {currentDistrictData.fee.toLocaleString()} FRW
                  </div>
                </div>
              </div>

              <button
                onClick={onShopClick}
                className="w-full bg-theme-primary hover:opacity-95 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Order to {selectedSector} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
