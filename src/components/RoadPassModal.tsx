import React from 'react';
import { PlayerProfile } from '../types/game';
import { sound } from '../utils/audio';

interface RoadPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onClaimTier: (tier: number) => void;
}

export const RoadPassModal: React.FC<RoadPassModalProps> = ({
  isOpen,
  onClose,
  profile,
  onClaimTier,
}) => {
  if (!isOpen) return null;

  const TIERS = [
    { tier: 13, reward: '500 Gold Coins', type: 'coins', claimed: true },
    { tier: 14, reward: 'Tier 14: Chrome Exhaust Tips', type: 'part', claimed: true },
    { tier: 15, reward: 'Tier 15: Neon Wheel Trail', type: 'trail', claimed: false },
    { tier: 16, reward: '25 Blue Gems', type: 'gems', claimed: false },
    { tier: 17, reward: 'Sun Yellow Pearl Finish', type: 'paint', claimed: false },
    { tier: 18, reward: 'Turbo Jet Delta Spoiler', type: 'kart', claimed: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-xl bg-[#0d1b36] rounded-3xl border-2 border-[#1d2946] shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#121f3b] border-b border-[#1d2946] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#ff5355]/20 flex items-center justify-center text-[#ff5355]">
              <span className="material-symbols-outlined text-[24px]">stars</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">ROAD PASS: TIER {profile.roadPassTier}</h2>
              <span className="text-xs text-[#ffce4e] font-black uppercase">Season 1: Turbo Island Rewards</span>
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

        {/* List of Tiers */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 no-scrollbar">
          {TIERS.map((item) => (
            <div
              key={item.tier}
              className={`p-3.5 rounded-2xl flex items-center justify-between border shadow-sm ${
                item.tier <= profile.roadPassTier
                  ? 'bg-[#1d2946] border-[#ffce4e]/50'
                  : 'bg-[#121f3b] border-[#1d2946] opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    item.tier <= profile.roadPassTier
                      ? 'bg-[#ffce4e] text-[#3e2e00] shadow-md'
                      : 'bg-[#010d29] text-[#b4c5ff]'
                  }`}
                >
                  {item.tier}
                </div>
                <div>
                  <h4 className="font-black text-sm text-white uppercase">{item.reward}</h4>
                  <span className="text-[10px] text-[#b4c5ff] font-bold">
                    {item.tier <= profile.roadPassTier ? 'Unlocked Milestone' : `Requires ${item.tier - profile.roadPassTier} more tier level`}
                  </span>
                </div>
              </div>

              {item.claimed ? (
                <span className="px-3 py-1 bg-[#10b981] text-white text-[10px] font-black uppercase rounded-full">
                  Claimed
                </span>
              ) : item.tier <= profile.roadPassTier ? (
                <button
                  onClick={() => {
                    sound.playCoin();
                    onClaimTier(item.tier);
                  }}
                  className="px-4 py-1.5 bg-[#ff5355] text-white text-xs font-black uppercase rounded-full shadow-[0_2px_0_#5c000a] active:scale-95 transition-all"
                >
                  Claim!
                </button>
              ) : (
                <span className="material-symbols-outlined text-[#ac8886] text-[18px]">lock</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
