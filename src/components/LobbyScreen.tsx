import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { KARTS } from '../constants/gameData';
import { PlayerProfile, AppScreen } from '../types/game';
import { sound } from '../utils/audio';

interface LobbyScreenProps {
  profile: PlayerProfile;
  onStartRace: () => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenShop: () => void;
  onOpenRoadPass: () => void;
  onSelectMode: (mode: 'Grand Prix' | 'Time Trial' | 'Battle Royale') => void;
  onSelectClass: (engineClass: '50cc' | '100cc' | '150cc' | '200cc') => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  profile,
  onStartRace,
  onNavigate,
  onOpenShop,
  onOpenRoadPass,
  onSelectMode,
  onSelectClass,
}) => {
  const [layoutMode, setLayoutMode] = useState<'standard' | 'turbo_island'>('standard');
  const [isPressingRace, setIsPressingRace] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const equippedKart = KARTS.find((k) => k.id === profile.equippedKartId) || KARTS[0];

  const handleRaceClick = () => {
    sound.playBoost();
    setIsPressingRace(true);
    setTimeout(() => {
      setIsPressingRace(false);
      onStartRace();
    }, 200);
  };

  const handleClaimBonus = () => {
    if (!bonusClaimed) {
      sound.playCoin();
      setBonusClaimed(true);
    }
  };

  return (
    <div className="flex flex-col w-full relative select-none pb-24 overflow-x-hidden">
      {/* View Variation Switcher Banner */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-1.5 bg-[#0d1b36]/90 px-3 py-1 rounded-full border border-[#283451] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#ffce4e] animate-ping" />
          <span className="text-[#ffce4e] font-black uppercase tracking-wider">SEASON 1 LIVE</span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            setLayoutMode(layoutMode === 'standard' ? 'turbo_island' : 'standard');
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1d2946] hover:bg-[#283451] text-[#b4c5ff] font-extrabold text-xs active:scale-95 transition-all border border-[#283451] shadow-sm"
          title="Toggle Screen 1 vs Screen 4 View"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          <span>{layoutMode === 'standard' ? 'Switch to Turbo Island View' : 'Switch to Classic Lobby'}</span>
        </button>
      </div>

      {layoutMode === 'standard' ? (
        /* ==================== SCREEN 1: CLASSIC SPEEDWAY LOBBY ==================== */
        <>
          {/* Dynamic Speed Atmosphere & Backdrop Stage */}
          <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center overflow-hidden">
            {/* Cinematic Visual Background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url('${ASSETS.SUNNY_SPEEDWAY_BG}')` }}
            />

            {/* Radial Speed Vignette & Lighting Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04122e] via-transparent to-[#04122e]/40 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffce4e]/15 via-transparent to-[#010d29]/80 pointer-events-none" />

            {/* Centerpiece Stage: Kart Hero */}
            <div className="relative z-10 w-full max-w-xl h-full flex flex-col items-center justify-end pb-4 px-4 sm:px-6">
              {/* Floating +250 BONUS coin floater */}
              <button
                onClick={handleClaimBonus}
                className={`absolute top-6 left-6 sm:left-12 flex items-center gap-1.5 bg-[#1d2946]/95 hover:bg-[#283451] px-3.5 py-1.5 rounded-full shadow-[0_6px_0_#010d29] -rotate-6 transition-transform active:scale-95 cursor-pointer border border-[#ffce4e]/40 ${
                  bonusClaimed ? 'opacity-50 line-through' : 'animate-pulse'
                }`}
              >
                <span className="material-symbols-outlined text-[#ffce4e] text-[20px]">monetization_on</span>
                <span className="font-extrabold text-[#ffce4e] text-xs sm:text-sm tracking-wide">
                  {bonusClaimed ? 'CLAIMED!' : '+250 BONUS'}
                </span>
              </button>

              {/* Flame Turbo Tier Floater */}
              <div className="absolute top-8 right-6 sm:right-12 flex items-center gap-1.5 bg-[#ff5355] px-3.5 py-1.5 rounded-full shadow-[0_6px_0_#5c000a] rotate-6 border border-[#ffdad7]/40">
                <span className="material-symbols-outlined text-[#5c000a] text-[18px]">local_fire_department</span>
                <span className="font-black text-[#5c000a] text-xs tracking-wider uppercase">TURBO TIER 2</span>
              </div>

              {/* Mascot & Kart Hero Visual */}
              <div className="relative w-full max-w-md h-64 flex items-center justify-center">
                <img
                  src={equippedKart.heroImage}
                  alt="Zip Kart Hero"
                  className="w-full h-full object-contain filter drop-shadow-[0_16px_24px_rgba(1,13,41,0.9)] transform hover:scale-105 transition-transform duration-300"
                />
                {/* Kinetic Drift Smoke Particles Simulation Overlay */}
                <div className="absolute -bottom-2 left-6 w-16 h-8 rounded-full bg-[#d9e2ff]/20 blur-md animate-ping" />
                <div className="absolute -bottom-2 right-8 w-20 h-10 rounded-full bg-[#638aff]/30 blur-md animate-pulse" />
              </div>

              {/* Kart Nameplate Floating Plate */}
              <div className="bg-[#283451]/95 backdrop-blur-md px-5 py-1.5 rounded-full shadow-[0_4px_0_#010d29] flex items-center gap-2.5 -mt-3 z-20 border border-[#ffce4e]/30">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffce4e] animate-ping" />
                <span className="font-black text-sm text-[#ffce4e] uppercase tracking-wider">
                  {equippedKart.name}
                </span>
                <span className="bg-[#0d1b36] px-2.5 py-0.5 rounded-full text-[#b4c5ff] font-extrabold text-[10px] uppercase">
                  {equippedKart.subtitle.split('•')[0] || 'Max Acceleration'}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Interactive Control Deck */}
          <div className="w-full px-4 -mt-6 z-30 flex flex-col items-center">
            {/* GIANT ARCADE RACE BUTTON */}
            <div className="relative group w-full max-w-sm">
              {/* Ambient Pulsing Glow Underlay */}
              <div className="absolute -inset-1.5 bg-[#ff5355] rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
              {/* Tactile 3D Slab Base */}
              <button
                id="raceStartBtn"
                onClick={handleRaceClick}
                className={`relative w-full h-20 rounded-full bg-[#ff5355] text-white flex items-center justify-between px-6 overflow-hidden cursor-pointer transition-all duration-100 border-t-2 border-white/40 ${
                  isPressingRace
                    ? 'translate-y-2 shadow-[0_1px_0_#5c000a]'
                    : 'shadow-[0_8px_0_#5c000a] active:translate-y-2 active:shadow-[0_1px_0_#5c000a]'
                }`}
              >
                {/* Gloss Reflection Slash */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-full pointer-events-none" />

                {/* Left Wing Chevron Indicators */}
                <div className="flex items-center -space-x-2 text-[#ffce4e]">
                  <span className="material-symbols-outlined text-[32px] animate-pulse">fast_forward</span>
                  <span
                    className="material-symbols-outlined text-[32px] animate-pulse"
                    style={{ animationDelay: '150ms' }}
                  >
                    fast_forward
                  </span>
                </div>

                {/* Center Typography CTA */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black text-[#ffce4e] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-wide uppercase">
                    RACE!
                  </span>
                  <span className="text-[10px] text-[#ffdad7] font-black uppercase tracking-widest -mt-1">
                    PRESS TO START
                  </span>
                </div>

                {/* Right Wing Flag Icon */}
                <div className="w-12 h-12 rounded-full bg-[#ffce4e] flex items-center justify-center shadow-[0_2px_0_#5a4400]">
                  <span
                    className="material-symbols-outlined text-[#3e2e00] text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    sports_score
                  </span>
                </div>
              </button>
            </div>

            {/* Active Mode Ribbon Selector */}
            <div className="flex items-center gap-1 mt-3 bg-[#1d2946]/95 p-1 rounded-full shadow-[0_4px_0_#010d29] border border-[#283451]">
              {(['Grand Prix', 'Time Trial', 'Battle Royale'] as const).map((mode) => {
                const active = profile.activeMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      sound.playClick();
                      onSelectMode(mode);
                    }}
                    className={`px-3 sm:px-4 py-1.5 rounded-full font-black text-xs uppercase transition-all ${
                      active
                        ? 'bg-[#ffce4e] text-[#3e2e00] shadow-[0_2px_0_#5a4400]'
                        : 'text-[#e5bdba] hover:text-[#d9e2ff]'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* Engine Class Selector (50cc / 100cc / 150cc) */}
            <div className="flex items-center gap-1.5 mt-2 bg-[#0d1b36] px-3 py-1 rounded-full text-xs">
              <span className="text-[#b4c5ff] font-extrabold uppercase text-[10px]">Engine:</span>
              {(['50cc', '100cc', '150cc', '200cc'] as const).map((cc) => (
                <button
                  key={cc}
                  onClick={() => {
                    sound.playClick();
                    onSelectClass(cc);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all ${
                    profile.activeEngineClass === cc
                      ? 'bg-[#638aff] text-white shadow-sm'
                      : 'text-[#d9e2ff]/60 hover:text-white'
                  }`}
                >
                  {cc}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Quick-Access Dashboard (Chunky High-Gloss Bento Pods) */}
          <div className="w-full max-w-4xl mx-auto px-4 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Pod 1: GARAGE */}
            <div
              onClick={() => {
                sound.playClick();
                onNavigate('garage');
              }}
              className="relative bg-[#1d2946] hover:bg-[#283451] rounded-2xl p-3.5 shadow-[0_6px_0_#010d29] flex flex-col justify-between active:translate-y-1 active:shadow-[0_2px_0_#010d29] transition-all cursor-pointer overflow-hidden group border border-[#283451]"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-[#638aff]/30 flex items-center justify-center text-[#b4c5ff]">
                  <span className="material-symbols-outlined text-[24px]">build</span>
                </div>
                <span className="bg-[#ff5355] text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-full shadow-[0_2px_0_#5c000a]">
                  +3 LVL
                </span>
              </div>
              <div className="mt-4">
                <span className="text-sm sm:text-base font-black text-[#d9e2ff] uppercase block group-hover:text-[#ffce4e] transition-colors">
                  GARAGE
                </span>
                <span className="text-xs text-[#b4c5ff] font-bold block truncate">Tune-ups & Paints</span>
              </div>
            </div>

            {/* Pod 2: NITRO SHOP */}
            <div
              onClick={() => {
                sound.playClick();
                onOpenShop();
              }}
              className="relative bg-[#1d2946] hover:bg-[#283451] rounded-2xl p-3.5 shadow-[0_6px_0_#010d29] flex flex-col justify-between active:translate-y-1 active:shadow-[0_2px_0_#010d29] transition-all cursor-pointer overflow-hidden group border border-[#283451]"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-[#ffce4e]/20 flex items-center justify-center text-[#ffce4e]">
                  <span className="material-symbols-outlined text-[24px]">redeem</span>
                </div>
                <span className="bg-[#ffce4e] text-[#3e2e00] font-black text-[10px] uppercase px-2 py-0.5 rounded-full shadow-[0_2px_0_#5a4400] animate-pulse">
                  NEW
                </span>
              </div>
              <div className="mt-4">
                <span className="text-sm sm:text-base font-black text-[#d9e2ff] uppercase block group-hover:text-[#ffce4e] transition-colors">
                  SHOP
                </span>
                <span className="text-xs text-[#b4c5ff] font-bold block truncate">Turbo Crates 50%</span>
              </div>
            </div>

            {/* Pod 3: ROAD PASS */}
            <div
              onClick={() => {
                sound.playClick();
                onOpenRoadPass();
              }}
              className="relative bg-[#1d2946] hover:bg-[#283451] rounded-2xl p-3.5 shadow-[0_6px_0_#010d29] flex flex-col justify-between active:translate-y-1 active:shadow-[0_2px_0_#010d29] transition-all cursor-pointer overflow-hidden group border border-[#283451]"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-[#ffb3af]/20 flex items-center justify-center text-[#ffb3af]">
                  <span className="material-symbols-outlined text-[24px]">stars</span>
                </div>
                <span className="bg-[#010d29] text-[#b4c5ff] font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase border border-[#283451]">
                  TIER 14
                </span>
              </div>
              <div className="mt-4">
                <span className="text-sm sm:text-base font-black text-[#d9e2ff] uppercase block group-hover:text-[#ffce4e] transition-colors">
                  ROAD PASS
                </span>
                <div className="w-full bg-[#010d29] h-2 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#ffce4e] h-full rounded-full w-3/4 shadow-[0_0_6px_#ffce4e]" />
                </div>
              </div>
            </div>

            {/* Pod 4: LIVE EVENTS */}
            <div
              onClick={() => {
                sound.playClick();
                onNavigate('tracks');
              }}
              className="relative bg-[#1d2946] hover:bg-[#283451] rounded-2xl p-3.5 shadow-[0_6px_0_#010d29] flex flex-col justify-between active:translate-y-1 active:shadow-[0_2px_0_#010d29] transition-all cursor-pointer overflow-hidden group border border-[#283451]"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-[#e5b100]/30 flex items-center justify-center text-[#ffce4e]">
                  <span className="material-symbols-outlined text-[24px]">emoji_events</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffce4e] animate-ping" />
              </div>
              <div className="mt-4">
                <span className="text-sm sm:text-base font-black text-[#d9e2ff] uppercase block group-hover:text-[#ffce4e] transition-colors">
                  EVENTS
                </span>
                <span className="text-xs text-[#ffce4e] font-black block truncate">Daily Cup Live!</span>
              </div>
            </div>
          </div>

          {/* Realtime Racers Online Ticker Strip */}
          <div className="w-full max-w-4xl mx-auto px-4 mt-6">
            <div className="bg-[#0d1b36]/90 backdrop-blur-md rounded-2xl p-3 shadow-[0_4px_0_#010d29] flex items-center justify-between border border-[#1d2946]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#283451] flex items-center justify-center text-[#ffce4e] shadow-inner">
                  <span className="material-symbols-outlined text-[20px]">public</span>
                </div>
                <div>
                  <span className="text-xs text-[#d9e2ff] uppercase font-black block leading-none">
                    GLOBAL MATCHMAKING
                  </span>
                  <span className="text-xs text-[#b4c5ff] font-bold">14,892 Racers drifting right now</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1d2946] px-3 py-1 rounded-full text-[#ffce4e] text-xs font-black border border-[#283451]">
                <span className="w-2 h-2 rounded-full bg-[#ffce4e] animate-ping" />
                <span>LATENCY: 22ms</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ==================== SCREEN 4: SEASON 1 TURBO ISLAND VIEW ==================== */
        <div className="w-full max-w-5xl mx-auto px-4 mt-2">
          {/* Main Hero Card with Side Pods & Giant Central Drift */}
          <div className="relative w-full min-h-[480px] rounded-3xl overflow-hidden shadow-2xl bg-[#010d29] border border-[#1d2946]">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${ASSETS.SCENIC_SPEEDWAY_BG}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010d29] via-transparent to-[#010d29]/60" />

            {/* Marquee Badge Title */}
            <div className="relative z-10 pt-4 flex flex-col items-center justify-center">
              <div className="relative -rotate-2">
                <div className="flex items-center gap-2 px-6 py-2 bg-[#1d2946]/95 rounded-full shadow-[0_8px_0_#060B14] border-t border-white/20">
                  <span className="material-symbols-outlined text-[#ffce4e] text-[26px]">sports_score</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#ffce4e] tracking-wider uppercase drop-shadow">
                    DRIFTLINGS
                  </span>
                  <span className="material-symbols-outlined text-[#ff5355] text-[24px]">local_fire_department</span>
                </div>
              </div>
              <div className="-mt-1 px-4 py-0.5 bg-[#ffce4e] text-[#3e2e00] rounded-full shadow-[0_3px_0_#5a4400] flex items-center gap-1 z-20">
                <span className="material-symbols-outlined text-[14px]">stars</span>
                <span className="text-[11px] uppercase tracking-wider font-black">Season 1: Turbo Island</span>
              </div>
            </div>

            {/* Center Kart Hero Visual */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 sm:w-88 h-64 sm:h-72 flex items-center justify-center mt-6">
                <img
                  src={ASSETS.ZIP_TURBO_DRIFT}
                  alt="Zip Turbo Drift"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.65)]"
                />
              </div>
            </div>

            {/* Left Edge: Chunky Jelly Navigation Pods */}
            <div className="absolute left-3 top-20 z-20 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('garage');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#1d2946]/95 text-white shadow-[0_4px_0_#060B14] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
              >
                <div className="relative w-8 h-8 rounded-full bg-[#ffce4e] text-[#3e2e00] flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[18px]">build</span>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ff5355] rounded-full ring-2 ring-[#04122e] animate-ping" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black uppercase text-white leading-tight">Garage</span>
                  <span className="text-[10px] text-[#ffce4e] font-bold">Kart Tuning</span>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenShop();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#1d2946]/95 text-white shadow-[0_4px_0_#060B14] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
              >
                <div className="w-8 h-8 rounded-full bg-[#638aff] text-[#00236b] flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[18px]">redeem</span>
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black uppercase text-white leading-tight">Shop</span>
                    <span className="px-1 py-0.2 bg-[#ff5355] text-white text-[9px] rounded-full font-black uppercase">
                      Hot
                    </span>
                  </div>
                  <span className="text-[10px] text-[#b4c5ff] font-bold">Daily Deals</span>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenRoadPass();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#1d2946]/95 text-white shadow-[0_4px_0_#060B14] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
              >
                <div className="w-8 h-8 rounded-full bg-[#e5b100] text-[#3e2e00] flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[18px]">stars</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black uppercase text-white leading-tight">Pass</span>
                  <span className="text-[10px] text-[#ffce4e] font-bold">Tier 18 / 50</span>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('tracks');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#1d2946]/95 text-white shadow-[0_4px_0_#060B14] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
              >
                <div className="w-8 h-8 rounded-full bg-[#2c3956] text-[#ffce4e] flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black uppercase text-white leading-tight">Events</span>
                  <span className="text-[10px] text-[#b4c5ff] font-bold">Time Attack</span>
                </div>
              </button>
            </div>

            {/* Bottom Dock: Active Mode & Giant RACE CTA */}
            <div className="absolute bottom-4 inset-x-4 z-30 flex flex-wrap items-end justify-between gap-2">
              <div className="flex items-center gap-2.5 bg-[#1d2946]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-[0_4px_0_#060B14] border border-[#283451]">
                <div className="w-9 h-9 rounded-full bg-[#ffce4e] text-[#3e2e00] flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[20px]">emoji_events</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#ffce4e] font-black uppercase tracking-wider">Active Mode</span>
                  <span className="text-xs sm:text-sm font-black text-white leading-tight">
                    {profile.activeMode} • {profile.activeEngineClass}
                  </span>
                  <span className="text-[10px] text-[#b4c5ff]">{profile.activeCup} • Round 3</span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigate('tracks');
                  }}
                  className="w-7 h-7 rounded-full bg-[#0d1b36] flex items-center justify-center text-[#ffce4e] hover:bg-[#04122e]"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </button>
              </div>

              {/* Giant 3D Turbo Red RACE! CTA */}
              <button
                onClick={handleRaceClick}
                className="relative group flex items-center justify-center px-8 py-3.5 rounded-full bg-[#ff5355] text-white shadow-[0_6px_0_#5c000a] active:translate-y-1.5 active:shadow-[0_1px_0_#5c000a] transition-all overflow-hidden cursor-pointer border-t-2 border-white/40"
              >
                <div className="flex items-center gap-2 relative z-10">
                  <span className="material-symbols-outlined text-[28px] text-[#ffce4e] font-black animate-bounce">
                    play_circle
                  </span>
                  <span className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#ffce4e] drop-shadow">
                    RACE!
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-[#ffce4e]">fast_forward</span>
                </div>
              </button>
            </div>
          </div>

          {/* Social Bento Cards Strip */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-3">
            {/* Turbo Toasters Crew */}
            <div className="bg-[#1d2946] rounded-2xl p-3 flex items-center justify-between shadow-[0_4px_0_#060B14] border border-[#283451]">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full bg-[#ffce4e] text-[#3e2e00] flex items-center justify-center font-black">
                  <span className="material-symbols-outlined text-[22px]">group</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] rounded-full ring-2 ring-[#04122e]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-white leading-tight">Turbo Toasters</span>
                  <span className="text-xs text-[#b4c5ff]">Rank #12 • 4/5 Online</span>
                </div>
              </div>
              <button
                onClick={() => sound.playClick()}
                className="px-3 py-1 rounded-full bg-[#0d1b36] hover:bg-[#04122e] text-[#ffce4e] font-black text-xs"
              >
                Rally
              </button>
            </div>

            {/* Daily Challenge */}
            <div className="bg-[#1d2946] rounded-2xl p-3 flex items-center justify-between shadow-[0_4px_0_#060B14] border border-[#283451]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#ff5355] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">whatshot</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-sm text-white leading-tight">Drift King</span>
                    <span className="px-1.5 py-0.2 bg-[#ffce4e] text-[#3e2e00] font-black text-[9px] rounded-full">
                      2x XP
                    </span>
                  </div>
                  <span className="text-xs text-[#e5bdba]">Perform 5 Ultra Drifts</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-[#ffce4e] font-black">3/5</span>
                <div className="w-12 h-1.5 bg-[#010d29] rounded-full overflow-hidden mt-1">
                  <div className="w-3/5 h-full bg-[#ffce4e] rounded-full" />
                </div>
              </div>
            </div>

            {/* Season League */}
            <div className="bg-[#1d2946] rounded-2xl p-3 flex items-center justify-between shadow-[0_4px_0_#060B14] border border-[#283451]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#638aff] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">military_tech</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-white leading-tight">Season League</span>
                  <span className="text-xs text-[#ffce4e]">Diamond III • 2,840 LP</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#b4c5ff] text-xs font-extrabold">
                <span>Top 3%</span>
                <span className="material-symbols-outlined text-[#ffce4e] text-[16px]">trending_up</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
