import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import { CustomerReview, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ReviewsSectionProps {
  currentLang: Language;
  reviews: CustomerReview[];
  onAddReview: (review: Omit<CustomerReview, 'id' | 'date' | 'verified'>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  currentLang,
  reviews,
  onAddReview,
}) => {
  const t = TRANSLATIONS[currentLang].reviews;
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    onAddReview({
      name: name.trim(),
      location: location.trim() || 'Kigali, Rwanda',
      rating,
      comment: comment.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80`
    });

    setName('');
    setLocation('');
    setComment('');
    setRating(5);
    setModalOpen(false);
  };

  return (
    <section className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {t.title}
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-emerald-800 border border-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-emerald-700" />
            <span>{t.shareExp}</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`}
                    />
                  ))}
                </div>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author info */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div className="truncate">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-stone-900 text-xs truncate">{rev.name}</p>
                    {rev.verified && (
                      <span title="Verified Customer" className="inline-flex">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">{rev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 mb-1">Share Your Fresh Grocery Review</h3>
            <p className="text-xs text-stone-500 mb-4">Tell us about the quality, flavor, or delivery in Rwanda.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marie Claire Mukamana"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Location in Rwanda</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kicukiro, Kigali"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">{rating} out of 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Experience</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe produce freshness, delivery speed, or customer support..."
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  {t.submitBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
