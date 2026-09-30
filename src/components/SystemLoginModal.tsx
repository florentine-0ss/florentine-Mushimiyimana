import React, { useState } from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { User } from '../types';

interface SystemLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAuthenticated: (adminUser: User) => void;
}

export const SystemLoginModal: React.FC<SystemLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminAuthenticated
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('fofo2026');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide administrative credentials.');
      return;
    }

    const adminUser: User = {
      id: 'usr-admin-1',
      name: 'Florentine M. (Admin)',
      email: 'florentinemushimiyimana1@gmail.com',
      phone: '+250 788 234 567',
      role: 'admin',
      joinedDate: 'Jan 2024',
      ordersCount: 42
    };

    onAdminAuthenticated(adminUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-100 flex items-start justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Private system access</p>
              <h2 className="text-xl font-bold text-stone-900">Continue with system</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Sign in as an administrator to inspect and manage the Fofo GreenGrocer Hub catalog, orders, and customer accounts.
          </p>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
            >
              Open system dashboard
            </button>
          </div>

          <p className="text-[11px] text-stone-400 text-center">
            Demo credentials pre-filled for instant verification.
          </p>
        </form>

      </div>
    </div>
  );
};
