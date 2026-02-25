import React, { useState } from 'react';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, Lock, Smartphone, ShieldCheck, ChevronRight } from 'lucide-react';
import { MemberProfile, AppView, NotificationFunc } from '../types';

interface BuyPointsProps {
  user: MemberProfile;
  onNavigate: (view: AppView) => void;
  showNotification: NotificationFunc;
  onUpdatePoints: (amount: number, type: 'add') => void;
}

const PACKAGES = [
    { points: 500, price: 5000, label: 'Weekend Getaway' },
    { points: 1000, price: 9500, label: 'Family Adventure' },
    { points: 2500, price: 22000, label: 'Luxury Escape' },
];

const SA_BANKS = [
    { name: 'Capitec', color: 'bg-red-500' },
    { name: 'FNB', color: 'bg-teal-500' },
    { name: 'Standard Bank', color: 'bg-blue-600' },
    { name: 'Absa', color: 'bg-red-700' },
    { name: 'Nedbank', color: 'bg-green-700' },
    { name: 'Tymebank', color: 'bg-yellow-500' }
];

const BuyPoints: React.FC<BuyPointsProps> = ({ user, onNavigate, showNotification, onUpdatePoints }) => {
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft'>('card');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [processingStage, setProcessingStage] = useState<'idle' | 'processing' | '3dsecure' | 'success'>('idle');

  const handleInitiateCheckout = () => {
      if (selectedPkg === null) return;
      setShowPaymentModal(true);
  };

  const handleProcessPayment = () => {
      if (paymentMethod === 'eft' && !selectedBank) {
          showNotification("Please select your bank", "error");
          return;
      }

      setProcessingStage('processing');

      // Simulate Gateway Latency
      setTimeout(() => {
          setProcessingStage('3dsecure'); // Simulate Bank Auth
          
          setTimeout(() => {
             setProcessingStage('success');
             
             // Finalize
             setTimeout(() => {
                const pkg = PACKAGES[selectedPkg!];
                onUpdatePoints(pkg.points, 'add');
                setShowPaymentModal(false);
                setProcessingStage('idle');
                showNotification(`Payment Successful! ${pkg.points} points added.`, 'success');
                onNavigate(AppView.DASHBOARD);
             }, 1500);

          }, 2000);
      }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-navy-950 pt-safe pb-32 overflow-y-auto no-scrollbar relative">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 flex items-center space-x-4 sticky top-0 bg-slate-50/90 dark:bg-navy-950/90 backdrop-blur z-20">
        <button 
            onClick={() => onNavigate(AppView.DASHBOARD)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200 transition-colors"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif font-bold text-navy-900 dark:text-white">Top Up Points</h1>
      </div>

      <div className="px-4 sm:px-6 space-y-6">
        {/* Current Balance */}
        <div className="bg-navy-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Current Balance</p>
            <p className="text-3xl font-bold">{user.points.available.toLocaleString()} pts</p>
        </div>

        <div>
            <h2 className="text-navy-900 dark:text-white font-bold mb-4">Select a Package</h2>
            <div className="space-y-3">
                {PACKAGES.map((pkg, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setSelectedPkg(idx)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                            selectedPkg === idx 
                                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 shadow-md scale-[1.02]' 
                                : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300'
                        }`}
                    >
                        <div className="text-left">
                            <span className="block text-lg font-bold text-navy-900 dark:text-white">{pkg.points} Points</span>
                            <span className="text-xs text-slate-500">{pkg.label}</span>
                        </div>
                        <div className="text-right">
                             <span className="block text-amber-600 dark:text-amber-400 font-bold">R {pkg.price.toLocaleString()}</span>
                             {selectedPkg === idx && <CheckCircle size={16} className="ml-auto mt-1 text-amber-500" />}
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <button 
            disabled={selectedPkg === null}
            onClick={handleInitiateCheckout}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all ${
                selectedPkg === null 
                    ? 'bg-slate-200 dark:bg-navy-800 text-slate-400 cursor-not-allowed' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 active:scale-95'
            }`}
        >
            Proceed to Payment
        </button>
      </div>

      {/* --- SOUTH AFRICAN PAYMENT GATEWAY MODAL --- */}
      {showPaymentModal && selectedPkg !== null && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
              <div className="bg-white dark:bg-navy-900 w-full sm:w-[90%] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90%] animate-in slide-in-from-bottom-10 duration-300">
                  
                  {/* Gateway Header */}
                  <div className="bg-slate-100 dark:bg-navy-950 px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-navy-800">
                      <div className="flex items-center space-x-2">
                          <ShieldCheck size={18} className="text-green-500" />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Secure Checkout</span>
                      </div>
                      <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-red-500">Close</button>
                  </div>

                  {/* Processing Views */}
                  {processingStage === 'idle' ? (
                      <div className="p-6 flex-1 overflow-y-auto">
                           <div className="text-center mb-6">
                               <p className="text-slate-500 dark:text-slate-400 text-sm">Total Amount</p>
                               <p className="text-3xl font-bold text-navy-900 dark:text-white">R {PACKAGES[selectedPkg].price.toLocaleString()}</p>
                           </div>

                           {/* Method Tabs */}
                           <div className="flex p-1 bg-slate-100 dark:bg-navy-950 rounded-xl mb-6">
                               <button 
                                   onClick={() => setPaymentMethod('card')}
                                   className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all ${paymentMethod === 'card' ? 'bg-white dark:bg-navy-800 shadow-sm text-navy-900 dark:text-white' : 'text-slate-400'}`}
                               >
                                   <CreditCard size={16} />
                                   <span>Card</span>
                               </button>
                               <button 
                                   onClick={() => setPaymentMethod('eft')}
                                   className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all ${paymentMethod === 'eft' ? 'bg-white dark:bg-navy-800 shadow-sm text-navy-900 dark:text-white' : 'text-slate-400'}`}
                               >
                                   <Smartphone size={16} />
                                   <span>Instant EFT</span>
                               </button>
                           </div>

                           {/* CARD FORM */}
                           {paymentMethod === 'card' && (
                               <div className="space-y-4">
                                   <div className="space-y-2">
                                       <label className="text-xs font-bold text-slate-500 uppercase">Card Number</label>
                                       <div className="relative">
                                           <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl px-4 py-3 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                           <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                       </div>
                                   </div>
                                   <div className="flex space-x-4">
                                       <div className="flex-1 space-y-2">
                                           <label className="text-xs font-bold text-slate-500 uppercase">Expiry</label>
                                           <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl px-4 py-3 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                       </div>
                                       <div className="flex-1 space-y-2">
                                           <label className="text-xs font-bold text-slate-500 uppercase">CVV</label>
                                           <input type="text" placeholder="123" className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl px-4 py-3 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                       </div>
                                   </div>
                               </div>
                           )}

                           {/* EFT FORM */}
                           {paymentMethod === 'eft' && (
                               <div className="space-y-3">
                                   <p className="text-xs text-slate-500 mb-2">Select your bank to log in securely:</p>
                                   <div className="grid grid-cols-2 gap-3">
                                       {SA_BANKS.map(bank => (
                                           <button 
                                               key={bank.name}
                                               onClick={() => setSelectedBank(bank.name)}
                                               className={`p-3 rounded-xl border flex items-center space-x-2 transition-all ${selectedBank === bank.name ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-500' : 'border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800'}`}
                                           >
                                               <div className={`w-3 h-3 rounded-full ${bank.color}`}></div>
                                               <span className="text-sm font-medium text-navy-900 dark:text-white">{bank.name}</span>
                                           </button>
                                       ))}
                                   </div>
                               </div>
                           )}
                      </div>
                  ) : (
                      // PROCESSING STATE
                      <div className="p-12 flex flex-col items-center justify-center h-80 text-center">
                          {processingStage === 'processing' && (
                              <>
                                <Loader2 size={48} className="text-amber-500 animate-spin mb-4" />
                                <h3 className="text-xl font-bold text-navy-900 dark:text-white">Processing Transaction...</h3>
                                <p className="text-slate-500 text-sm mt-2">Connecting to Banking Switch</p>
                              </>
                          )}
                          {processingStage === '3dsecure' && (
                              <div className="animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 dark:text-white">Verifying Payment</h3>
                                <p className="text-slate-500 text-sm mt-2">Please approve the notification on your banking app.</p>
                              </div>
                          )}
                          {processingStage === 'success' && (
                               <div className="animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-xl">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-navy-900 dark:text-white">Payment Approved</h3>
                                    <p className="text-slate-500 text-sm mt-2">Redirecting you back...</p>
                                </div>
                          )}
                      </div>
                  )}

                  {/* Footer Actions */}
                  {processingStage === 'idle' && (
                      <div className="p-6 bg-slate-50 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800">
                           <button 
                                onClick={handleProcessPayment}
                                className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center hover:bg-amber-600 transition-colors"
                           >
                               <span>Pay R {PACKAGES[selectedPkg].price.toLocaleString()}</span>
                               <ChevronRight size={20} className="ml-1" />
                           </button>
                           <div className="flex justify-center items-center space-x-4 mt-4 opacity-50 grayscale">
                               {/* Logos simulation */}
                               <div className="h-4 w-8 bg-slate-400 rounded"></div>
                               <div className="h-4 w-8 bg-slate-400 rounded"></div>
                               <div className="h-4 w-8 bg-slate-400 rounded"></div>
                               <span className="text-[10px] text-slate-500">Secured by SA Gateway</span>
                           </div>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default BuyPoints;