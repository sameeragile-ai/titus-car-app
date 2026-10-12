import React from 'react';
import { PlayerProfile } from '../types/game';
import { sound } from '../utils/audio';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onUpdateBalances: (coinsDiff: number, gemsDiff: number) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateBalances,
}) => {
  if (!isOpen) return null;

  const buyWithCoins = (coinCost: number, gemGain: number) => {
    if (profile.coins >= coinCost) {
      sound.playCoin();
      onUpdateBalances(-coinCost, gemGain);
    } else {
      alert('Not enough coins!');
    }
  };

  const buyWithGems = (gemCost: number, coinGain: number) => {
    if (profile.gems >= gemCost) {
      sound.playCoin();
      onUpdateBalances(coinGain, -gemCost);
    } else {
      alert('Not enough gems!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-2xl bg-[#0d1b36] rounded-3xl border-2 border-[#1d2946] shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#121f3b] border-b border-[#1d2946] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#ffce4e]/20 flex items-center justify-center text-[#ffce4e]">
              <span className="material-symbols-outlined text-[24px]">storefront</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">NITRO ARCADE SHOP</h2>
              <span className="text-xs text-[#ffce4e] font-black uppercase">TURBO CRATES 50% OFF TODAY!</span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#1d2946] hover:bg-[#283451] text-[#d9e2ff] flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 no-scrollbar">
          {/* Featured Deal Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#ff5355] to-[#e5b100] p-4 text-white shadow-[0_6px_0_#5c000a] flex items-center justify-between border-t border-white/40">
            <div className="flex flex-col">
              <span className="bg-[#5c000a] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full self-start">
                HOT SALE 50% OFF
              </span>
              <h3 className="text-lg font-black uppercase mt-1">MYTHIC TURBO CRATE</h3>
              <p className="text-xs text-[#ffdad7] font-bold">Guaranteed Rare / Legend Kart Chassis Parts + 50 Gems!</p>
            </div>
            <button
              onClick={() => buyWithCoins(5000, 50)}
              className="px-5 py-2.5 rounded-full bg-[#ffce4e] text-[#3e2e00] font-black text-xs uppercase shadow-[0_4px_0_#5a4400] active:translate-y-1 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">monetization_on</span>
              <span>5,000</span>
            </button>
          </div>

          {/* Grid of Deals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Deal 1: 10,000 Coins */}
            <div className="bg-[#1d2946] rounded-2xl p-4 border border-[#283451] flex items-center justify-between shadow-[0_4px_0_#010d29]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#ffce4e]/20 flex items-center justify-center text-[#ffce4e]">
                  <span className="material-symbols-outlined text-[24px]">monetization_on</span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-white uppercase">10,000 Coins</h4>
                  <span className="text-xs text-[#b4c5ff]">Bag of Golden Tokens</span>
                </div>
              </div>
              <button
                onClick={() => buyWithGems(40, 10000)}
                className="px-3.5 py-1.5 rounded-full bg-[#638aff] text-white font-black text-xs uppercase shadow-[0_3px_0_#00236b] active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">diamond</span>
                <span>40</span>
              </button>
            </div>

            {/* Deal 2: 25,000 Coins */}
            <div className="bg-[#1d2946] rounded-2xl p-4 border border-[#283451] flex items-center justify-between shadow-[0_4px_0_#010d29]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#ffce4e]/20 flex items-center justify-center text-[#ffce4e]">
                  <span className="material-symbols-outlined text-[24px]">paid</span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-white uppercase">25,000 Coins</h4>
                  <span className="text-xs text-[#b4c5ff]">Vault of Gold (+15% Bonus)</span>
                </div>
              </div>
              <button
                onClick={() => buyWithGems(90, 25000)}
                className="px-3.5 py-1.5 rounded-full bg-[#638aff] text-white font-black text-xs uppercase shadow-[0_3px_0_#00236b] active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">diamond</span>
                <span>90</span>
              </button>
            </div>

            {/* Deal 3: 200 Gems */}
            <div className="bg-[#1d2946] rounded-2xl p-4 border border-[#283451] flex items-center justify-between shadow-[0_4px_0_#010d29]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#638aff]/20 flex items-center justify-center text-[#638aff]">
                  <span className="material-symbols-outlined text-[24px]">diamond</span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-white uppercase">200 Blue Gems</h4>
                  <span className="text-xs text-[#b4c5ff]">Grand Gem Chest</span>
                </div>
              </div>
              <button
                onClick={() => buyWithCoins(15000, 200)}
                className="px-3.5 py-1.5 rounded-full bg-[#ffce4e] text-[#3e2e00] font-black text-xs uppercase shadow-[0_3px_0_#5a4400] active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                <span>15,000</span>
              </button>
            </div>

            {/* Deal 4: VIP Gold Pass Upgrade */}
            <div className="bg-[#1d2946] rounded-2xl p-4 border border-[#283451] flex items-center justify-between shadow-[0_4px_0_#010d29]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#ff5355]/20 flex items-center justify-center text-[#ff5355]">
                  <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-white uppercase">Season 1 Gold Pass</h4>
                  <span className="text-xs text-[#ffce4e] font-bold">Unlocks Royal Cruiser + XP Boost</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#10b981] text-white text-xs font-black rounded-full uppercase">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
