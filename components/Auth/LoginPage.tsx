
import React, { useState, useEffect } from 'react';
import { Lock, Mail, LogIn, AlertCircle, Info, X, Copy, Check } from 'lucide-react';
import { User } from '../../types';
import { MOCK_USERS } from '../../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(true); // Default true to show on load
  const [copied, setCopied] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // 1. Check Password (Fixed as per spec)
      if (password !== 'younesouakrim') {
        setError('Mot de passe incorrect.');
        setIsLoading(false);
        return;
      }

      // 2. Check User
      const user = MOCK_USERS.find(u => u.email === email);
      if (!user) {
        setError('Utilisateur non trouvé.');
        setIsLoading(false);
        return;
      }

      // 3. Success
      onLogin(user);
    }, 1000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const demoAccounts = [
    { role: 'Administrator', email: 'administrator@pureessence.com' },
    { role: 'QC Manager', email: 'qcmanager@pureessence.com' },
    { role: 'Production Operator', email: 'operator@pureessence.com' },
    { role: 'R&D Staff', email: 'rd@pureessence.com' },
    { role: 'HR / Training', email: 'training@pureessence.com' },
    { role: 'ISO Auditor', email: 'auditor@pureessence.com' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden flex flex-col my-4">
        {/* Header */}
        <div className="p-8 bg-slate-50 border-b border-slate-100 text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
            <span className="text-2xl font-bold text-white">PE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Pure Essence</h1>
          <p className="text-slate-500 text-sm mt-2">Plateforme Qualité & Production Sécurisée</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-6">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Professionnel</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: administrator@pureessence.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mot de Passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={18} /> Se Connecter
                </>
              )}
            </button>
          </form>

          {/* Open Modal Button */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <button 
              onClick={() => setShowDemoModal(true)}
              className="text-emerald-600 hover:text-emerald-700 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 mx-auto hover:underline"
            >
              <Info size={14} /> Voir Identifiants de Démonstration
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">Système sécurisé conforme ISO 9001</p>
        </div>
      </div>

      {/* DEMO CREDENTIALS POP-UP MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Info className="text-emerald-600" size={20} /> Identifiants de Connexion
              </h3>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-emerald-50 p-4 rounded-lg border border-emerald-100 shadow-sm">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">Mot de passe (Commun à tous)</span>
                <div className="flex justify-between items-center">
                  <code className="text-emerald-700 font-mono font-bold text-lg">younesouakrim</code>
                  <button 
                    onClick={() => copyToClipboard('younesouakrim', 'pass')} 
                    className="text-emerald-600 hover:text-emerald-800 p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Copier"
                  >
                    {copied === 'pass' ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase block">Comptes par Rôle</span>
                <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {demoAccounts.map((acc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-emerald-200 transition-colors">
                      <div>
                        <span className="text-slate-800 text-sm font-bold block">{acc.role}</span>
                        <span className="text-slate-500 text-xs font-mono">{acc.email}</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(acc.email, acc.email)} 
                        className="text-slate-400 hover:text-emerald-600 p-1.5 hover:bg-white rounded-md transition-colors"
                        title="Copier Email"
                      >
                        {copied === acc.email ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
