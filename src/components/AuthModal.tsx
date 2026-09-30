import React, { useState } from 'react';
import { X, Lock, ShieldCheck, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { User, Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onOpenSystemLogin: () => void;
  currentLang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onOpenSystemLogin,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin'>('customer');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+250');
  const [mobileNumber, setMobileNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleIdentityChange = (val: string) => {
    setIdentity(val);
    // Auto-detect admin identity
    const lower = val.toLowerCase().trim();
    if (lower === 'admin' || lower.includes('florentine') || lower.includes('admin@')) {
      setSelectedRole('admin');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim() || !password.trim()) {
      setError('Please provide your username/email and password.');
      return;
    }

    const isAdmin = selectedRole === 'admin' || identity.toLowerCase().includes('admin') || identity.toLowerCase().includes('florentine');

    const loggedUser: User = {
      id: isAdmin ? 'usr-admin-1' : `usr-${Date.now().toString().slice(-4)}`,
      name: isAdmin ? 'Florentine Mushimiyimana (Admin)' : (identity.includes('@') ? identity.split('@')[0] : identity),
      email: isAdmin ? 'florentinemushimiyimana1@gmail.com' : (identity.includes('@') ? identity : `${identity}@fofo.rw`),
      phone: `${countryCode} ${mobileNumber || (isAdmin ? '788 234 567' : '788 123 456')}`,
      role: isAdmin ? 'admin' : 'customer',
      joinedDate: isAdmin ? 'Jan 15, 2024' : 'Today',
      ordersCount: isAdmin ? 42 : 1
    };

    onLogin(loggedUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !identity.trim() || !password.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    const isAdmin = selectedRole === 'admin';

    const registeredUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: fullName.trim() + (isAdmin ? ' (Admin)' : ''),
      email: identity.trim(),
      phone: `${countryCode} ${mobileNumber || '788 123 456'}`,
      role: selectedRole,
      joinedDate: 'Today',
      ordersCount: 0
    };

    onLogin(registeredUser);
    onClose();
  };

  const handleQuickCustomer = () => {
    onLogin({
      id: 'usr-divine',
      name: 'Divine Uwase',
      email: 'divine.uwase@gmail.com',
      phone: '+250 789 112 334',
      role: 'customer',
      joinedDate: 'Feb 2024',
      ordersCount: 18
    });
    onClose();
  };

  const handleQuickAdmin = () => {
    onLogin({
      id: 'usr-admin',
      name: 'Florentine Mushimiyimana (Admin)',
      email: 'florentinemushimiyimana1@gmail.com',
      phone: '+250 788 234 567',
      role: 'admin',
      joinedDate: 'Jan 15, 2024',
      ordersCount: 42
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-100 flex items-start justify-between bg-stone-50/50">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authentication & Role Access</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 mt-1">Fofo GreenGrocer Account</h2>
            <p className="text-xs text-stone-500 mt-0.5">Sign in or register with Customer or Admin role</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              tab === 'login'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              tab === 'register'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Register Account
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Role Selection Box */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl">
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Select Role to Activate:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                  selectedRole === 'customer'
                    ? 'bg-white border-emerald-600 text-emerald-900 shadow-2xs ring-2 ring-emerald-500/20'
                    : 'bg-white/60 border-stone-200 text-stone-600 hover:bg-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedRole === 'customer' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Customer</div>
                  <span className="text-[10px] font-normal text-stone-500 block">Fresh grocery shopping</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  if (!identity) {
                    setIdentity('florentinemushimiyimana1@gmail.com');
                  }
                  if (!password) {
                    setPassword('admin123');
                  }
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-amber-50 border-amber-600 text-amber-950 shadow-2xs ring-2 ring-amber-500/20'
                    : 'bg-white/60 border-stone-200 text-stone-600 hover:bg-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedRole === 'admin' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span>Admin Role</span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-bold">FULL</span>
                  </div>
                  <span className="text-[10px] font-normal text-stone-500 block">Check all system actions</span>
                </div>
              </button>
            </div>

            {selectedRole === 'admin' && (
              <div className="mt-2.5 p-2 bg-amber-100/70 border border-amber-300 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>
                  <strong>Admin Role Active:</strong> Logging in will grant full privileges to inspect all system actions, audit logs, orders, products, and customer records.
                </span>
              </div>
            )}
          </div>

          {/* Form Content */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {selectedRole === 'admin' ? 'Admin Email / Username' : 'Username or Email'}
                </label>
                <input
                  type="text"
                  required
                  value={identity}
                  onChange={(e) => handleIdentityChange(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'florentinemushimiyimana1@gmail.com' : 'Username or email'}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'Enter admin password' : 'Enter your password'}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number (Rwanda / East Africa)
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-stone-100 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-semibold text-stone-700 outline-hidden"
                  >
                    <option value="+250">RW +250</option>
                    <option value="+254">KE +254</option>
                    <option value="+255">TZ +255</option>
                    <option value="+256">UG +256</option>
                  </select>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="78 123 4567"
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full font-bold py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${
                  selectedRole === 'admin'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-800/20'
                }`}
              >
                {selectedRole === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In as Administrator & Audit Actions</span>
                  </>
                ) : (
                  <span>Sign In as Customer</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'Florentine Mushimiyimana' : 'Jane Smith'}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'admin@fofo.rw' : 'you@example.com'}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number *
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-stone-100 border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-semibold text-stone-700 outline-hidden"
                  >
                    <option value="+250">RW +250</option>
                    <option value="+254">KE +254</option>
                    <option value="+255">TZ +255</option>
                    <option value="+256">UG +256</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="78 123 4567"
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full font-bold py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${
                  selectedRole === 'admin'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-800/20'
                }`}
              >
                {selectedRole === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Create Administrator Account</span>
                  </>
                ) : (
                  <span>Create Customer Account</span>
                )}
              </button>
            </form>
          )}

          {/* Quick 1-Click Role Logins */}
          <div className="pt-3 border-t border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <span>Instant 1-Click Logins</span>
              <span>Fast Testing</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 rounded-xl font-bold transition-all text-left flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="block text-[11px] font-black text-amber-900">Login as Admin</span>
                  <span className="text-[10px] text-amber-700 block truncate">Florentine M.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleQuickCustomer}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 rounded-xl font-bold transition-all text-left flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="block text-[11px] font-black text-emerald-900">Login as Customer</span>
                  <span className="text-[10px] text-emerald-700 block truncate">Divine Uwase</span>
                </div>
              </button>
            </div>

            {/* Direct private system access link */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSystemLogin();
              }}
              className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Dedicated System Access Terminal</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
