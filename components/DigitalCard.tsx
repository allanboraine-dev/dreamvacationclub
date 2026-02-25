import React from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';
import { MemberProfile } from '../types';

interface DigitalCardProps {
  user: MemberProfile;
}

const DigitalCard: React.FC<DigitalCardProps> = ({ user }) => {
  return (
    <div className="flex flex-col h-full bg-navy-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <h2 className="text-white font-serif text-2xl mb-8">Member Access</h2>
        
        {/* The Card */}
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            {/* Holographic strip effect */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500"></div>

            <div className="mt-4 mb-6 bg-white p-4 rounded-2xl">
                 <QrCode size={160} className="text-navy-900" />
            </div>

            <h3 className="text-white text-xl font-bold font-serif mb-1">{user.firstName} {user.lastName}</h3>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-6">{user.membershipTier} Member</p>

            <div className="w-full border-t border-white/10 pt-4 flex justify-between text-xs text-slate-300">
                <div className="text-left">
                    <span className="block opacity-50 uppercase tracking-wider">Member ID</span>
                    <span className="font-mono">{user.id}</span>
                </div>
                <div className="text-right">
                    <span className="block opacity-50 uppercase tracking-wider">Valid Thru</span>
                    <span className="font-mono">{user.points.expiryDate}</span>
                </div>
            </div>
        </div>

        <div className="mt-8 flex items-center text-slate-400 text-sm">
            <ShieldCheck size={16} className="mr-2 text-green-400" />
            <span>Identity Verified via RSA ID</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;