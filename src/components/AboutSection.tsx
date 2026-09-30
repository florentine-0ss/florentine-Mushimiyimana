import React, { useState } from 'react';
import { ArrowRight, Users, Sparkles, Sprout, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang].about;
  const [activePartnerModal, setActivePartnerModal] = useState<string | null>(null);

  const partners = [
    {
      name: 'Abakundakurima Organic Coop',
      region: 'Bugesera District, Eastern Province',
      crops: 'Organic Vine Tomatoes, Sweet Peppers, Sun-dried Mangoes',
      desc: 'Over 120 smallholder women farmers utilizing solar irrigation to cultivate chemical-free tomatoes and vegetables.'
    },
    {
      name: 'Volcano Foothills Agro-Group',
      region: 'Musanze, Northern Province',
      crops: 'Crisp Carrots, Highland Potatoes, Broccoli Crowns',
      desc: 'Benefiting from mineral-rich volcanic soil and cool altitudes, producing naturally sweet vegetables.'
    },
    {
      name: 'Savanna Pasture Hen Collective',
      region: 'Nyagatare, Eastern Province',
      crops: 'Free-Range Amber Eggs, Natural Pastured Dairy',
      desc: 'Ethical poultry keepers providing unconfined foraging across wide open savannas with zero antibiotics.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide">
              <Sprout className="w-3.5 h-3.5" />
              <span>{t.kicker}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {t.title}
            </h2>

            <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
              {t.p1}
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {t.p2}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm underline decoration-emerald-500 decoration-2 underline-offset-4"
              >
                <span>Talk to our sourcing team</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-4/3 sm:aspect-square">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                alt="Local farmer harvesting fresh greens in Rwanda"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-semibold text-emerald-300">Direct Farm Partnerships</span>
                <h3 className="font-bold text-lg text-white">Empowering 50+ Local Farm Cooperatives</h3>
              </div>
            </div>
          </div>

        </div>

        {/* Gallery Visual Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-4/3 group">
            <img
              src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80"
              alt="Harvest crates of fresh vegetables"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent flex items-end p-4">
              <p className="text-white text-xs font-semibold">Fresh produce ready for Kigali delivery</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-4/3 group">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
              alt="Local organic market selection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent flex items-end p-4">
              <p className="text-white text-xs font-semibold">Hand-sorted, certified organic greens</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-4/3 group">
            <img
              src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80"
              alt="Fresh vegetables in crates"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent flex items-end p-4">
              <p className="text-white text-xs font-semibold">Sustainable eco-packaging only</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
          <div className="text-center p-3">
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">50+</div>
            <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">{t.stat1}</div>
          </div>
          <div className="text-center p-3 border-l border-stone-100">
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">&lt; 3h</div>
            <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">{t.stat2}</div>
          </div>
          <div className="text-center p-3 border-l border-stone-100">
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">{t.stat3}</div>
          </div>
          <div className="text-center p-3 border-l border-stone-100">
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">6 Days</div>
            <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">{t.stat4}</div>
          </div>
        </div>

        {/* Local Partner Cards */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-stone-900 mb-6">Our Core Cooperative Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-900 text-base">{partner.name}</h4>
                <p className="text-xs font-semibold text-emerald-700 mt-1">{partner.region}</p>
                <p className="text-xs text-stone-500 mt-3 leading-relaxed">{partner.desc}</p>
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-600 font-medium">
                  Primary crops: <span className="text-stone-900 font-semibold">{partner.crops}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
