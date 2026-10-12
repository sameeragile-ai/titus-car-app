import React from 'react';
import { PlayerProfile } from '../types/game';
import { sound } from '../utils/audio';

interface RankingsScreenProps {
  profile: PlayerProfile;
}

export const RankingsScreen: React.FC<RankingsScreenProps> = ({ profile }) => {
  const LEADERBOARD = [
    { rank: 1, name: 'NovaDrifter', lp: '3,420 LP', kart: 'Bolt Racer', crew: 'Apex Predators', isUser: false },
    { rank: 2, name: 'VortexPilot', lp: '3,280 LP', kart: 'Turbo Jet', crew: 'Speed Demons', isUser: false },
    { rank: 3, name: 'Bubbles', lp: '3,150 LP', kart: 'Bubble Buggy', crew: 'Hydro Drifters', isUser: false },
    { rank: 12, name: `${profile.name} (YOU)`, lp: '2,840 LP', kart: 'Bolt Racer', crew: 'Turbo Toasters', isUser: true },
    { rank: 13, name: 'Sprout', lp: '2,780 LP', kart: 'Standard MK-III', crew: 'Seed Racers', isUser: false },
    { rank: 14, name: 'TurboRex', lp: '2,690 LP', kart: 'Monster Kart', crew: 'Heavy Metal', isUser: false },
    { rank: 15, name: 'PixelPilot', lp: '2,540 LP', kart: 'Turbo Jet', crew: 'Retro Arcade', isUser: false },
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-3 pb-24 select-none">
      {/* Top League Ribbon */}
      <div className="bg-[#1d2946] rounded-3xl p-5 border border-[#283451] shadow-[0_6px_0_#010d29] flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#638aff] to-[#00236b] flex items-center justify-center text-white shadow-lg border border-white/20">
            <span className="material-symbols-outlined text-[32px]">military_tech</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white uppercase">Season League: Diamond III</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#ffce4e] text-[#3e2e00] font-black text-[10px] uppercase">
                Top 3%
              </span>
            </div>
            <p className="text-xs text-[#b4c5ff] font-bold">Current Standing: 2,840 League Points • 5 Days Left in Season</p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            alert('Rally signal dispatched to Turbo Toasters crew members!');
          }}
          className="px-5 py-2.5 rounded-full bg-[#ffce4e] text-[#3e2e00] font-black text-xs uppercase shadow-[0_3px_0_#5a4400] active:scale-95 transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span>Rally Crew</span>
        </button>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-[#121f3b] rounded-3xl border border-[#1d2946] overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-[#1d2946] border-b border-[#283451] flex items-center justify-between">
          <span className="text-xs font-black uppercase text-[#ffce4e] tracking-wider">
            GLOBAL TOP DRIFTERS (SEASON 1)
          </span>
          <span className="text-[10px] text-[#b4c5ff] font-bold uppercase">UPDATED LIVE</span>
        </div>

        <div className="divide-y divide-[#1d2946]">
          {LEADERBOARD.map((item) => (
            <div
              key={item.rank}
              className={`px-5 py-3.5 flex items-center justify-between transition-colors ${
                item.isUser ? 'bg-[#ffce4e]/15 border-l-4 border-[#ffce4e]' : 'hover:bg-[#1d2946]/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    item.rank === 1
                      ? 'bg-[#ffce4e] text-[#3e2e00] shadow-[0_0_8px_#ffce4e]'
                      : item.rank === 2
                      ? 'bg-[#d9e2ff] text-[#04122e]'
                      : item.rank === 3
                      ? 'bg-[#e5b100] text-[#3e2e00]'
                      : 'bg-[#283451] text-[#b4c5ff]'
                  }`}
                >
                  {item.rank}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-black ${item.isUser ? 'text-[#ffce4e]' : 'text-white'}`}>
                      {item.name}
                    </span>
                    {item.isUser && (
                      <span className="material-symbols-outlined text-[#ffce4e] text-[14px]">stars</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#b4c5ff] font-bold">
                    {item.crew} • {item.kart}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-[#ffce4e] font-mono tabular-nums">
                  {item.lp}
                </span>
                <span className="material-symbols-outlined text-[#34d399] text-[16px]">arrow_upward</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
