import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ASSETS } from '../constants/assets';
import { PlayerProfile, AppScreen } from '../types/game';
import { sound } from '../utils/audio';

interface PodiumScreenProps {
  profile: PlayerProfile;
  raceResult?: {
    placement: number;
    totalTime: string;
    bestLap: string;
    avgSpeed: number;
    driftScore: number;
    coinsCollected: number;
  };
  onRaceAgain: () => void;
  onNextTrack: () => void;
  onNavigate: (screen: AppScreen) => void;
  onClaimRewards: (coins: number, gems: number, xp: number) => void;
}

export const PodiumScreen: React.FC<PodiumScreenProps> = ({
  profile,
  raceResult,
  onRaceAgain,
  onNextTrack,
  onNavigate,
  onClaimRewards,
}) => {
  const hasClaimedRef = useRef(false);

  const totalTime = raceResult?.totalTime || '02:08.41';
  const bestLap = raceResult?.bestLap || '00:41.12';
  const avgSpeed = raceResult?.avgSpeed || 198.4;
  const driftScore = raceResult?.driftScore || 14890;

  // Trigger confetti burst on mount
  useEffect(() => {
    sound.playVictory();

    // Multistage confetti explosion
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ffce4e', '#ff5355', '#638aff'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#ffdf97', '#ffffff', '#ffb3af'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#ffce4e', '#34d399', '#638aff'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    if (!hasClaimedRef.current) {
      hasClaimedRef.current = true;
      onClaimRewards(650, 25, 1200);
    }
  }, []);

  const handleShare = () => {
    sound.playClick();
    if (navigator.share) {
      navigator.share({
        title: 'Driftlings Turbo Arcade',
        text: `I just won 1st Place on Sunny Speedway with a record time of ${totalTime}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Highlight captured! Record Time: ${totalTime} - 1st Place Winner!`);
    }
  };

  return (
    <div className="flex flex-col w-full relative select-none pb-24 overflow-x-hidden min-h-screen">
      {/* Stadium Celebration Fireworks Background Canvas */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen scale-105 filter blur-[0.5px]"
          style={{ backgroundImage: `url('${ASSETS.PODIUM_STADIUM_BG}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04122e] via-[#04122e]/60 to-transparent" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 flex flex-col gap-4 z-10">
        {/* ================= HEADER POD: CUP TITLE & CHAMPION RIBBON ================= */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 bg-[#1d2946]/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-[#ffce4e]/30">
            <span className="material-symbols-outlined text-[#ffce4e] text-[20px] animate-spin" style={{ animationDuration: '6s' }}>
              sports_score
            </span>
            <span className="font-black text-xs sm:text-sm uppercase text-[#ffce4e] tracking-wider drop-shadow">
              Sunny Speedway GP
            </span>
            <span className="text-[10px] uppercase font-bold bg-[#010d29] text-[#d9e2ff]/80 px-2 py-0.5 rounded-full">
              Cup Final
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#ff5355] text-white px-4 py-1.5 rounded-full shadow-[0_4px_14px_rgba(255,83,85,0.4)] transform -rotate-2 animate-pulse border border-white/30">
            <span className="material-symbols-outlined text-[18px]">military_tech</span>
            <span className="text-xs sm:text-sm uppercase font-black tracking-wide">GRAND PRIX CHAMPION!</span>
          </div>
        </div>

        {/* ================= MAIN SPLIT: PODIUM STAGE + VICTORY STATS CARD ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* LEFT 60%: THEATRICAL 3D OFFICIAL PODIUM */}
          <div className="lg:col-span-7 flex flex-col items-center justify-end relative rounded-3xl p-4 sm:p-6 bg-[#0d1b36]/85 backdrop-blur-xl shadow-[0_12px_32px_rgba(1,13,41,0.7)] border border-[#1d2946] min-h-[340px]">
            {/* Official Podium Top Crest */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#ffce4e] text-[#3e2e00] shadow-[0_4px_0_#996f00] z-20 border border-white/40">
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              <span className="text-xs uppercase tracking-wider font-black">Official Podium</span>
            </div>

            {/* Podium Mascot Hierarchy Blocks */}
            <div className="relative w-full h-64 flex items-end justify-center gap-2 pt-6">
              {/* 2nd Place: Bubbles */}
              <div className="flex-1 flex flex-col items-center group max-w-[120px]">
                <div className="relative mb-2 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#638aff]/30 flex items-center justify-center p-1 shadow-lg relative border border-[#638aff]/40">
                    <img
                      src={ASSETS.BUBBLES_AVATAR}
                      alt="Bubbles 2nd"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#283451] text-[#b4c5ff] font-black text-xs flex items-center justify-center shadow-md border border-white/20">
                      2
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#b4c5ff] mt-1 uppercase tracking-tight">Bubbles</span>
                  <span className="text-[10px] text-[#e5bdba] font-bold">+1.82s</span>
                </div>
                {/* 2nd Place Silver Pillar */}
                <div className="w-full h-24 rounded-t-2xl bg-gradient-to-t from-[#1d2946] to-[#283451] p-2 flex flex-col items-center justify-start shadow-[0_6px_0_#060B14] border-t-2 border-white/30">
                  <span className="text-2xl font-black text-[#b4c5ff]/60 leading-none">2</span>
                  <span className="text-[10px] text-[#d9e2ff]/60 uppercase font-black">Silver</span>
                </div>
              </div>

              {/* 1st Place: Zip (Tallest Center) */}
              <div className="flex-[1.3] flex flex-col items-center z-10 -mt-6 max-w-[150px]">
                <div className="relative mb-1 flex flex-col items-center">
                  <div className="absolute -top-7 text-[#ffce4e] animate-bounce">
                    <span className="material-symbols-outlined text-[32px] drop-shadow-[0_0_12px_rgba(255,206,78,0.9)]">
                      emoji_events
                    </span>
                  </div>
                  <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-[#ffce4e]/30 p-1.5 shadow-[0_0_24px_rgba(255,206,78,0.6)] relative border-2 border-[#ffce4e]">
                    <img
                      src={ASSETS.ZIP_CHAMPION}
                      alt="Zip Champion 1st"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#ffce4e] text-[#3e2e00] font-black text-sm flex items-center justify-center shadow-[0_3px_0_#996f00] ring-2 ring-[#251a00]">
                      1
                    </span>
                  </div>
                  <span className="text-sm sm:text-base font-black text-[#ffce4e] mt-1 uppercase tracking-wide drop-shadow">
                    ZIP
                  </span>
                  <div className="px-2 py-0.5 rounded-full bg-[#ffce4e]/20 text-[#ffce4e] text-[10px] font-black uppercase">
                    Winner
                  </div>
                </div>
                {/* 1st Place Golden Pillar */}
                <div className="w-full h-36 rounded-t-2xl bg-gradient-to-t from-[#e5b100] to-[#ffce4e] p-2 flex flex-col items-center justify-start shadow-[0_8px_0_#705400] text-[#3e2e00] border-t-2 border-white/60">
                  <span className="text-4xl font-black text-[#3e2e00] leading-none drop-shadow-sm">1</span>
                  <span className="text-xs uppercase font-black tracking-wider text-[#3e2e00]">CHAMP</span>
                </div>
              </div>

              {/* 3rd Place: Sprout */}
              <div className="flex-1 flex flex-col items-center group max-w-[120px]">
                <div className="relative mb-2 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#1d2946]/80 flex items-center justify-center p-1 shadow-lg relative border border-[#34d399]/40">
                    <img
                      src={ASSETS.SPROUT_AVATAR}
                      alt="Sprout 3rd"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#283451] text-[#f5bf1b] font-black text-xs flex items-center justify-center shadow-md border border-white/20">
                      3
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#f5bf1b] mt-1 uppercase tracking-tight">Sprout</span>
                  <span className="text-[10px] text-[#e5bdba] font-bold">+3.40s</span>
                </div>
                {/* 3rd Place Bronze Pillar */}
                <div className="w-full h-20 rounded-t-2xl bg-gradient-to-t from-[#121f3b] to-[#1d2946] p-2 flex flex-col items-center justify-start shadow-[0_5px_0_#060B14] border-t-2 border-white/20">
                  <span className="text-2xl font-black text-[#d9e2ff]/40 leading-none">3</span>
                  <span className="text-[10px] text-[#d9e2ff]/60 uppercase font-black">Bronze</span>
                </div>
              </div>
            </div>

            {/* Telemetry Footer Strip */}
            <div className="w-full mt-3 pt-3 border-t border-[#1d2946] flex items-center justify-between text-xs text-[#d9e2ff]/80 px-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#638aff]">speed</span>
                <span>
                  Avg Speed: <strong className="text-white font-black">{avgSpeed} KPH</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#ffce4e]">stars</span>
                <span>
                  Drift Score: <strong className="text-white font-black">{driftScore.toLocaleString()} PTS</strong>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT 40%: VICTORY RECORD & REWARDS CARD */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 bg-[#121f3b]/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-[0_10px_28px_rgba(1,13,41,0.65)] border border-[#1d2946]">
            {/* Title & Flare */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black uppercase text-[#ffce4e] tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(255,206,78,0.5)]">
                  VICTORY!
                </div>
                <div className="text-xs uppercase tracking-widest text-[#ffdad7] font-black mt-0.5">
                  1st Place Finish
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ffce4e]/15 flex items-center justify-center text-[#ffce4e] shadow-inner border border-[#ffce4e]/30">
                <span className="material-symbols-outlined text-[28px]">flare</span>
              </div>
            </div>

            {/* Split Lap Times */}
            <div className="grid grid-cols-2 gap-2 bg-[#010d29]/80 p-3 rounded-2xl border border-[#1d2946]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#b4c5ff] uppercase font-bold">Total Time</span>
                <span className="text-lg sm:text-xl font-black text-white tracking-tight tabular-nums mt-0.5">
                  {totalTime}
                </span>
                <div className="mt-1 inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-[#ffce4e] text-[#3e2e00] text-[9px] font-black tracking-wider uppercase shadow-[0_2px_0_#996f00]">
                  <span className="material-symbols-outlined text-[11px]">bolt</span> NEW RECORD!
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-[#b4c5ff] uppercase font-bold">Best Lap (Lap 3)</span>
                <span className="text-lg sm:text-xl font-black text-[#638aff] tracking-tight tabular-nums mt-0.5">
                  {bestLap}
                </span>
                <span className="text-[10px] text-[#dbe1ff] font-bold mt-1">+0.48s vs Ghost</span>
              </div>
            </div>

            {/* Rewards Granted */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase text-[#b4c5ff] font-black tracking-wider">Rewards Granted</span>
              <div className="grid grid-cols-2 gap-2">
                {/* Coins */}
                <div className="flex items-center gap-2.5 bg-[#1d2946]/80 px-3 py-2 rounded-2xl shadow-[0_3px_0_#060B14] border border-[#283451]">
                  <div className="w-8 h-8 rounded-full bg-[#ffce4e]/25 flex items-center justify-center text-[#ffce4e] shadow-inner">
                    <span className="material-symbols-outlined text-[20px]">monetization_on</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-base font-black text-[#ffce4e] tabular-nums">+650</span>
                    <span className="text-[10px] text-[#e5bdba]">Gold Coins</span>
                  </div>
                </div>

                {/* Gems */}
                <div className="flex items-center gap-2.5 bg-[#1d2946]/80 px-3 py-2 rounded-2xl shadow-[0_3px_0_#060B14] border border-[#283451]">
                  <div className="w-8 h-8 rounded-full bg-[#638aff]/25 flex items-center justify-center text-[#638aff] shadow-inner">
                    <span className="material-symbols-outlined text-[20px]">diamond</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-base font-black text-[#638aff] tabular-nums">+25</span>
                    <span className="text-[10px] text-[#e5bdba]">Blue Gems</span>
                  </div>
                </div>
              </div>

              {/* Racer Level Progress Bar */}
              <div className="bg-[#1d2946]/80 p-3 rounded-2xl flex flex-col gap-1.5 shadow-[0_3px_0_#060B14] border border-[#283451]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#ffce4e] font-black uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">military_tech</span>
                    Lv.{profile.level} Racer XP
                  </span>
                  <span className="text-[#638aff] font-black">+1,200 XP (94.5% to Lv.{profile.level + 1})</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#010d29] overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#e5b100] via-[#ffce4e] to-[#638aff] transition-all duration-1000 shadow-[0_0_8px_#ffce4e]"
                    style={{ width: '94.5%' }}
                  />
                </div>
              </div>

              {/* Road Pass Unlock Notification */}
              <div className="bg-gradient-to-r from-[#ff5355]/20 to-[#1d2946] p-3 rounded-2xl flex items-center justify-between shadow-[0_3px_0_#060B14] border border-[#283451]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#ff5355] text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase text-[#ffb3af] font-black">Road Pass Unlock</span>
                    <span className="text-xs font-black text-white">Tier 15: Neon Wheel Trail!</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase bg-[#ffb3af] text-[#68000d] font-black px-2.5 py-1 rounded-full">
                  Claimed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ACTION CTAS ================= */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 h-12 rounded-full bg-[#638aff] text-[#00236b] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_0_#002979] active:translate-y-1 active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
              <span>Share Highlight</span>
            </button>
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full bg-[#1d2946] text-[#d9e2ff] flex items-center justify-center shadow-[0_4px_0_#060B14] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
            >
              <span className="material-symbols-outlined text-[22px]">videocam</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 flex-1 sm:flex-initial justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onRaceAgain();
              }}
              className="flex-1 sm:flex-initial px-5 h-12 rounded-full bg-[#ff5355] text-white font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_5px_0_#93000a] active:translate-y-1.5 active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">replay</span>
              <span>Race Again</span>
            </button>

            <button
              onClick={() => {
                sound.playBoost();
                onNextTrack();
              }}
              className="flex-1 sm:flex-initial px-6 h-12 rounded-full bg-[#ffce4e] text-[#3e2e00] font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_5px_0_#5d4600] active:translate-y-1.5 active:shadow-none transition-all"
            >
              <span>Next Track</span>
              <span className="material-symbols-outlined text-[22px]">fast_forward</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('lobby');
              }}
              className="px-4 h-12 rounded-full bg-[#1d2946] text-[#b4c5ff] hover:text-white font-black text-xs uppercase shadow-[0_4px_0_#010d29] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
            >
              Lobby
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
