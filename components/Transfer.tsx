import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import { MemberProfile, AppView, NotificationFunc } from '../types';

interface TransferProps {
  user: MemberProfile;
  onNavigate: (view: AppView) => void;
  showNotification: NotificationFunc;
  onUpdatePoints: (amount: number, type: 'subtract') => void;
}

const Transfer: React.FC<TransferProps> = ({ user, onNavigate, showNotification, onUpdatePoints }) => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'processing'>('input');

  const handleVerify = () => {
      if (!recipientId || recipientId.length < 5) {
          showNotification("Invalid Member ID", "error");
          return;
      }
      
      const transferAmount = parseInt(amount.replace(/\D/g, ''));
      if (isNaN(transferAmount) || transferAmount <= 0) {
           showNotification("Please enter a valid amount", "error");
           return;
      }

      if (transferAmount > user.points.available) {
           showNotification("Insufficient points balance", "error");
           return;
      }

      setStep('confirm');
  };

  const handleTransfer = () => {
    setStep('processing');
    const transferAmount = parseInt(amount.replace(/\D/g, ''));

    setTimeout(() => {
        onUpdatePoints(transferAmount, 'subtract');
        showNotification(`Successfully transferred ${transferAmount} points!`, 'success');
        onNavigate(AppView.DASHBOARD);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-navy-950 pt-safe pb-32 overflow-y-auto no-scrollbar">
       <div className="px-6 py-4 flex items-center space-x-4 sticky top-0 bg-slate-50/90 dark:bg-navy-950/90 backdrop-blur z-20">
        <button 
            onClick={() => step === 'input' ? onNavigate(AppView.DASHBOARD) : setStep('input')}
            className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200 transition-colors"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif font-bold text-navy-900 dark:text-white">Transfer Points</h1>
      </div>

      <div className="px-6 mt-4">
        {step === 'input' && (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start text-blue-800 dark:text-blue-300">
                    <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                    <p className="text-sm">Transfers are immediate and irreversible. Ensure the recipient Member ID is correct.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recipient Member ID</label>
                    <input 
                        type="text" 
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        placeholder="e.g. DVC-XXXXX"
                        className="w-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-2xl px-5 py-4 text-navy-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount (Points)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="w-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-2xl px-5 py-4 text-navy-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            Available: {user.points.available}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleVerify}
                    className="w-full bg-navy-900 dark:bg-amber-500 text-white font-bold py-4 rounded-2xl shadow-lg mt-4 active:scale-95 transition-transform"
                >
                    Review Transfer
                </button>
            </div>
        )}

        {(step === 'confirm' || step === 'processing') && (
             <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-center space-x-4 my-8">
                     <div className="text-center">
                         <div className="w-16 h-16 bg-navy-100 dark:bg-navy-800 rounded-full flex items-center justify-center text-navy-900 dark:text-white font-bold mx-auto mb-2">
                            YOU
                         </div>
                     </div>
                     <ArrowRight className="text-slate-300" />
                     <div className="text-center">
                         <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-2">
                            <UserCheck />
                         </div>
                     </div>
                </div>

                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400">Transferring</p>
                    <h2 className="text-4xl font-bold text-navy-900 dark:text-white my-2">{amount} pts</h2>
                    <p className="text-slate-500 dark:text-slate-400">to <span className="text-navy-900 dark:text-white font-bold">{recipientId}</span></p>
                </div>

                <button 
                    disabled={step === 'processing'}
                    onClick={handleTransfer}
                    className="w-full bg-amber-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                >
                    {step === 'processing' ? <Loader2 className="animate-spin" /> : 'Confirm Transfer'}
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default Transfer;