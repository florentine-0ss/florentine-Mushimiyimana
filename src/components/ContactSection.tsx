import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ContactSectionProps {
  currentLang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang].contact;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {t.kicker}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {t.title}
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {t.subtitle}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-medium">Customer Support & WhatsApp</span>
                  <p className="text-sm font-bold text-stone-900">{t.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-medium">Email Inquiries</span>
                  <p className="text-sm font-bold text-stone-900">{t.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-medium">Kigali Hub Location</span>
                  <p className="text-sm font-bold text-stone-900">{t.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-medium">Operating Hours</span>
                  <p className="text-sm font-bold text-stone-900">Mon - Sat: 6:30 AM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Murakoze! Message Received</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for reaching out to Fofo GreenGrocer Hub. Our customer representative will get in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      {t.nameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jean Damascene"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-emerald-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      {t.emailLabel} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. jdamascene@gmail.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      {t.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+250 788 123 456"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-emerald-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Weekly family grocery subscription"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {t.messageLabel} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need or ask any questions..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-emerald-600 shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-theme-primary hover:opacity-95 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.sendBtn}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
