import React from 'react';
import { sound } from '../utils/audio';

interface MailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimAll: () => void;
}

export const MailboxModal: React.FC<MailboxModalProps> = ({ isOpen, onClose, onClaimAll }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg bg-[#0d1b36] rounded-3xl border-2 border-[#1d2946] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#121f3b] border-b border-[#1d2946] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffce4e] text-[24px]">mail</span>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">DRIVER INBOX</h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#1d2946] text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Message Items */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#1d2946] border border-[#283451] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#ffce4e] font-black uppercase">Grand Prix Championship</span>
              <h4 className="text-sm font-black text-white">Season 1 Launch Gift Pack</h4>
              <p className="text-xs text-[#b4c5ff]">Includes +1,000 Bonus Coins &amp; 10 Blue Gems!</p>
            </div>
            <button
              onClick={() => {
                sound.playCoin();
                onClaimAll();
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#ffce4e] text-[#3e2e00] text-xs font-black uppercase shadow-sm active:scale-95 transition-transform"
            >
              Claim
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#1d2946] border border-[#283451] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#34d399] font-black uppercase">Driftlings HQ</span>
              <h4 className="text-sm font-black text-white">Maintenance Bonus: All Clear</h4>
              <p className="text-xs text-[#b4c5ff]">Sunny Speedway servers running at ultra-low 22ms latency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
