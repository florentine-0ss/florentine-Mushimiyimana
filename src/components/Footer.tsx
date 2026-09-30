import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-theme-primary flex items-center justify-center text-white shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight font-serif">
                Fofo GreenGrocer Hub
              </span>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Connecting Rwandan families with certified organic produce sourced directly from local cooperatives in Musanze, Bugesera, Nyagatare, and Gicumbi.
            </p>

            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-xs font-bold">
                IG
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-xs font-bold">
                FB
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-xs font-bold">
                X
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => scrollTo('home')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('shop')} className="hover:text-emerald-400 transition-colors">
                  Today's Fresh Picks
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="hover:text-emerald-400 transition-colors">
                  About Our Farmers
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('delivery')} className="hover:text-emerald-400 transition-colors">
                  Delivery Coverage
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Customer Support</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => scrollTo('contact')} className="hover:text-emerald-400 transition-colors">
                  Contact Us (Kigali)
                </button>
              </li>
              <li>
                <span className="text-stone-500">Tel: +250 788 234 567</span>
              </li>
              <li>
                <span className="text-stone-500">WhatsApp: +250 788 123 456</span>
              </li>
              <li>
                <span className="text-emerald-400">Freshness Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Weekly Harvest Letter</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Get notified when seasonal berries, Bugesera mangoes, or fresh catches arrive.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed! Use code FOFOPICK for 10% off.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-stone-800 text-white placeholder-stone-500 px-3 py-2 text-xs rounded-xl border border-stone-700 focus:outline-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-theme-primary hover:opacity-90 text-white p-2 rounded-xl transition-colors shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            &copy; {new Date().getFullYear()} Fofo GreenGrocer Hub Rwanda. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 font-medium">Accepted payments:</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-800 text-amber-400 font-bold text-[11px] border border-stone-700">
              MTN MoMo
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-800 text-red-400 font-bold text-[11px] border border-stone-700">
              Airtel Money
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-bold text-[11px] border border-stone-700">
              Visa
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-bold text-[11px] border border-stone-700">
              Mastercard
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
