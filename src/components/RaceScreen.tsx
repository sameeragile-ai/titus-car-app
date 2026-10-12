import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../constants/assets';
import { PlayerProfile, RaceTelemetry } from '../types/game';
import { sound } from '../utils/audio';

interface RaceScreenProps {
  profile: PlayerProfile;
  onRaceFinish: (result: {
    placement: number;
    totalTime: string;
    bestLap: string;
    avgSpeed: number;
    driftScore: number;
    coinsCollected: number;
  }) => void;
  onExitRace: () => void;
}

export const RaceScreen: React.FC<RaceScreenProps> = ({
  onRaceFinish,
  onExitRace,
}) => {
  // Telemetry state
  const [telemetry, setTelemetry] = useState<RaceTelemetry>({
    lap: 2,
    totalLaps: 3,
    position: 2,
    trackName: 'Sunny Speedway',
    timeSeconds: 74.82,
    speedKmh: 148,
    coinsCollected: 8,
    itemReady: { type: 'rocket', count: 2 },
    driftBoostTier: 2,
    driftCharge: 65,
    deltaVsLeader: '+0.42s vs 1st',
    isDrifting: false,
    steerOffset: 0,
  });

  const [isAccelerating, setIsAccelerating] = useState<boolean>(false);
  const [isBraking, setIsBraking] = useState<boolean>(false);
  const [itemUsedFlash, setItemUsedFlash] = useState<boolean>(false);
  const [boostActive, setBoostActive] = useState<boolean>(false);
  const [sparkTier, setSparkTier] = useState<number>(2);
  const [trackProgress, setTrackProgress] = useState<number>(0.65); // 0 to 1

  const animationFrameRef = useRef<number | null>(null);

  // Time & Physics loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setTelemetry((prev) => {
        let newSpeed = prev.speedKmh;

        // Acceleration & braking physics
        if (boostActive) {
          newSpeed = Math.min(210, newSpeed + 120 * dt);
        } else if (isAccelerating) {
          newSpeed = Math.min(168, newSpeed + 35 * dt);
        } else if (isBraking) {
          newSpeed = Math.max(60, newSpeed - 80 * dt);
        } else {
          // Coasting
          if (newSpeed > 140) newSpeed -= 15 * dt;
          if (newSpeed < 135) newSpeed += 10 * dt;
        }

        // Slight speed jitter
        const jitter = (Math.random() - 0.5) * 1.5;
        const currentSpeedDisplay = Math.round(newSpeed + jitter);

        // Update track lap progress
        const speedRatio = currentSpeedDisplay / 150;
        setTrackProgress((p) => {
          const nextP = p + dt * 0.04 * speedRatio;
          if (nextP >= 1) {
            // Lap advanced!
            if (prev.lap < prev.totalLaps) {
              sound.playCoin();
              return 0.05;
            }
          }
          return nextP;
        });

        // Drift charging while steering & drifting
        let newCharge = prev.driftCharge;
        let newTier = sparkTier;
        if (prev.isDrifting) {
          newCharge = Math.min(100, newCharge + 40 * dt);
          if (newCharge > 75) newTier = 3;
          else if (newCharge > 40) newTier = 2;
          else newTier = 1;
        }

        // Timer
        const newTime = prev.timeSeconds + dt;

        return {
          ...prev,
          speedKmh: currentSpeedDisplay,
          timeSeconds: newTime,
          driftCharge: newCharge,
          driftBoostTier: newTier as 0 | 1 | 2 | 3,
        };
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAccelerating, isBraking, boostActive, sparkTier]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setIsAccelerating(true);
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setIsBraking(true);
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        steer(-1);
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        steer(1);
      }
      if (e.key === ' ' || e.key === 'Enter') {
        triggerItemUse();
      }
      if (e.key === 'Shift') {
        startDrift();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setIsAccelerating(false);
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setIsBraking(false);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
        resetSteer();
      }
      if (e.key === 'Shift') {
        releaseDrift();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const steer = (dir: number) => {
    setTelemetry((prev) => ({
      ...prev,
      steerOffset: Math.max(-1, Math.min(1, prev.steerOffset + dir * 0.4)),
    }));
  };

  const resetSteer = () => {
    setTelemetry((prev) => ({ ...prev, steerOffset: 0 }));
  };

  const startDrift = () => {
    sound.playDriftCharge(2);
    setTelemetry((prev) => ({ ...prev, isDrifting: true }));
  };

  const releaseDrift = () => {
    sound.playBoost();
    setBoostActive(true);
    setTelemetry((prev) => ({
      ...prev,
      isDrifting: false,
      driftCharge: 0,
      position: 1, // Overtake into 1st on mini-turbo!
      deltaVsLeader: 'LEADER (-0.85s)',
    }));
    setTimeout(() => {
      setBoostActive(false);
    }, 1800);
  };

  const triggerItemUse = () => {
    if (!telemetry.itemReady) return;
    sound.playItemUse();
    setItemUsedFlash(true);
    setBoostActive(true);

    setTelemetry((prev) => ({
      ...prev,
      position: 1,
      deltaVsLeader: 'LEADER (-1.24s)',
      itemReady: prev.itemReady && prev.itemReady.count > 1
        ? { ...prev.itemReady, count: prev.itemReady.count - 1 }
        : null,
    }));

    setTimeout(() => {
      setItemUsedFlash(false);
      setBoostActive(false);
    }, 1500);
  };

  const collectCoin = () => {
    sound.playCoin();
    setTelemetry((prev) => ({
      ...prev,
      coinsCollected: Math.min(10, prev.coinsCollected + 1),
    }));
  };

  const completeRace = () => {
    sound.playVictory();
    onRaceFinish({
      placement: 1,
      totalTime: '02:08.41',
      bestLap: '00:41.12',
      avgSpeed: 198.4,
      driftScore: 14890,
      coinsCollected: telemetry.coinsCollected,
    });
  };

  // Format time mm:ss.ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04122e] flex flex-col justify-between overflow-hidden select-none">
      {/* ================= 3D RACE TRACK & GAME WORLD PERSPECTIVE ================= */}
      <div className="relative w-full aspect-[20/9] min-h-[380px] max-h-[580px] overflow-hidden bg-[#010d29] shadow-2xl">
        {/* Rendered Track Action Perspective */}
        <img
          src={ASSETS.RACE_TRACK_VIEW}
          alt="In-Game Race Perspective"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105 transition-transform duration-200"
          style={{
            transform: `scale(1.05) translate(${telemetry.steerOffset * -20}px, ${
              boostActive ? '4px' : '0px'
            }) rotate(${telemetry.steerOffset * 2}deg)`,
          }}
        />

        {/* Speed Flash overlay on item/boost use */}
        {itemUsedFlash && (
          <div className="absolute inset-0 bg-[#ffce4e]/25 mix-blend-overlay pointer-events-none animate-pulse" />
        )}

        {/* Speed Wind Lines / Radial Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#010d29]/40 via-transparent to-[#010d29]/40 mix-blend-multiply" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#010d29]/80 via-transparent to-[#010d29]/50" />

        {/* Speed Streaks Overlay SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 mix-blend-screen">
          <line
            stroke="#ffce4e"
            strokeDasharray="10 30"
            strokeLinecap="round"
            strokeWidth="3"
            x1="0"
            x2="200"
            y1="50"
            y2="80"
          />
          <line
            stroke="#ffdad7"
            strokeDasharray="25 45"
            strokeLinecap="round"
            strokeWidth="3"
            x1="0"
            x2="260"
            y1="220"
            y2="240"
          />
          <line
            stroke="#638aff"
            strokeDasharray="15 35"
            strokeLinecap="round"
            strokeWidth="3"
            x1="100%"
            x2="80%"
            y1="70"
            y2="100"
          />
          <line
            stroke="#ff5355"
            strokeDasharray="30 50"
            strokeLinecap="round"
            strokeWidth="4"
            x1="100%"
            x2="75%"
            y1="260"
            y2="270"
          />
        </svg>

        {/* Dynamic Animated Drift Sparks Nodes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-24 left-[46%] w-4 h-4 rounded-full bg-[#ffce4e] shadow-[0_0_16px_#ffce4e] animate-ping opacity-85" />
          <div className="absolute bottom-20 left-[43%] w-5 h-5 rounded-full bg-[#ff5355] shadow-[0_0_20px_#ff5355] animate-pulse" />
          <div className="absolute bottom-22 right-[45%] w-4 h-4 rounded-full bg-[#638aff] shadow-[0_0_18px_#638aff] animate-ping" />
        </div>

        {/* ================= TOP HUD OVERLAY LAYER ================= */}
        <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none z-20">
          <div className="w-full flex items-start justify-between">
            {/* TOP-LEFT: Position Plaque & Lap Info */}
            <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
              {/* Chunky Position Badge */}
              <div className="relative flex items-center justify-center transform -rotate-3 transition-transform active:scale-95">
                <div className="absolute -bottom-1.5 left-0 right-0 h-full rounded-2xl bg-[#010d29]" />
                <div className="relative px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-[#ffdf97] via-[#ffce4e] to-[#e5b100] flex items-baseline gap-0.5 shadow-xl border-t-2 border-white/60">
                  <span className="text-2xl sm:text-3xl font-black text-[#010d29] leading-none">
                    {telemetry.position}
                  </span>
                  <span className="text-sm font-black text-[#010d29] uppercase tracking-tighter">
                    {telemetry.position === 1 ? 'st' : telemetry.position === 2 ? 'nd' : 'rd'}
                  </span>
                  <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
                </div>
                {telemetry.position === 1 ? (
                  <div className="absolute -top-1.5 -right-1.5 bg-[#10b981] text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-xs font-black">check</span>
                  </div>
                ) : (
                  <div className="absolute -top-1.5 -right-1.5 bg-[#638aff] text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-xs font-black">arrow_upward</span>
                  </div>
                )}
              </div>

              {/* Lap Pod */}
              <div className="flex flex-col gap-0.5">
                <div className="px-3 py-1 rounded-full bg-[#1d2946]/95 backdrop-blur-md flex items-center gap-1.5 shadow-md border border-[#283451]">
                  <span className="w-2 h-2 rounded-full bg-[#ffce4e] animate-pulse" />
                  <span className="text-[10px] text-[#b4c5ff] font-black uppercase tracking-wider">LAP</span>
                  <span className="text-sm font-black text-[#ffce4e]">{telemetry.lap}</span>
                  <span className="text-[10px] text-[#d9e2ff]/60 font-bold">/{telemetry.totalLaps}</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-[#010d29]/80 backdrop-blur-sm self-start">
                  <span className="text-[10px] font-black text-[#ff5355]">{telemetry.deltaVsLeader}</span>
                </div>
              </div>
            </div>

            {/* TOP-CENTER: Item Roulette HUD Box */}
            <div className="pointer-events-auto flex flex-col items-center">
              <div
                onClick={triggerItemUse}
                className="relative group cursor-pointer active:scale-95 transition-all"
                title="Tap to use item"
              >
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#ffce4e] via-[#ff5355] to-[#638aff] blur-md opacity-70 animate-pulse" />
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#1d2946]/95 border-2 border-white/30 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                  {telemetry.itemReady ? (
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-[32px] sm:text-[36px] text-[#ffce4e] drop-shadow-[0_2px_8px_rgba(255,206,78,0.8)]">
                        {telemetry.itemReady.type === 'rocket' ? 'rocket_launch' : 'bolt'}
                      </span>
                      <span className="text-[10px] text-[#ffdf97] font-black uppercase mt-0.5 leading-none">
                        x{telemetry.itemReady.count}
                      </span>
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-[28px] text-[#d9e2ff]/40 animate-spin">
                      help
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-[#ff5355] text-white text-[9px] font-black uppercase tracking-tight shadow-md border border-white/20">
                  {telemetry.itemReady ? 'READY!' : 'EMPTY'}
                </div>
              </div>
            </div>

            {/* TOP-RIGHT: Telemetry & Resources Cluster */}
            <div className="flex items-start gap-2 sm:gap-3 pointer-events-auto">
              <div className="flex flex-col items-end gap-1">
                {/* Timer Plaque */}
                <div className="px-3 py-1 rounded-full bg-[#1d2946]/95 backdrop-blur-md flex items-center gap-1.5 shadow-md border border-[#283451]">
                  <span className="material-symbols-outlined text-[16px] text-[#b4c5ff]">timer</span>
                  <span className="text-xs sm:text-sm font-black text-white font-mono tracking-wider tabular-nums">
                    {formatTime(telemetry.timeSeconds)}
                  </span>
                </div>

                {/* Coin Bank */}
                <button
                  onClick={collectCoin}
                  className="px-3 py-1 rounded-full bg-[#1d2946]/95 hover:bg-[#283451] backdrop-blur-md flex items-center gap-1.5 shadow-md border border-[#283451] active:scale-95 transition-all"
                  title="Collect Coin"
                >
                  <div className="w-4 h-4 rounded-full bg-[#ffce4e] text-[#3e2e00] flex items-center justify-center text-[10px] font-black shadow-sm">
                    $
                  </div>
                  <span className="text-xs font-black text-[#ffce4e] tabular-nums">
                    {telemetry.coinsCollected.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#b4c5ff]">/10</span>
                </button>
              </div>

              {/* Digital Speedometer Gauge */}
              <div className="relative w-20 sm:w-24 h-16 sm:h-18 rounded-2xl bg-[#1d2946]/95 backdrop-blur-md p-1.5 sm:p-2 flex flex-col justify-between items-center shadow-2xl border border-white/20">
                <div className="w-full flex justify-between items-center px-1">
                  <span className="text-[9px] text-[#b4c5ff] font-black">KM/H</span>
                  <span className="material-symbols-outlined text-[14px] text-[#ffce4e]">speed</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-none">
                  {telemetry.speedKmh}
                </div>
                {/* Nitro LED gauge */}
                <div className="w-full h-1.5 bg-[#010d29] rounded-full overflow-hidden flex gap-0.5 p-0.5">
                  <div className="h-full flex-1 bg-[#ffce4e] rounded-full" />
                  <div className="h-full flex-1 bg-[#ffce4e] rounded-full" />
                  <div className="h-full flex-1 bg-[#ffce4e] rounded-full" />
                  <div className="h-full flex-1 bg-[#ff5355] rounded-full" />
                  <div
                    className={`h-full flex-1 rounded-full ${
                      telemetry.speedKmh > 180 ? 'bg-[#ff5355] animate-pulse' : 'bg-[#283451]'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MID SECTION: RADAR MINIMAP & DRIFT TIER ALERT */}
          <div className="flex items-center justify-between pointer-events-none my-auto">
            {/* Stylized Track Map Radar (Left) */}
            <div className="pointer-events-auto relative w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-[#0d1b36]/90 backdrop-blur-md p-1.5 shadow-2xl border border-white/20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Track Curve Pathway */}
                <path
                  d="M 20,50 C 20,20 80,15 80,45 C 80,75 55,85 40,85 C 25,85 20,70 20,50 Z"
                  fill="none"
                  stroke="#1d2946"
                  strokeLinecap="round"
                  strokeWidth="14"
                />
                <path
                  d="M 20,50 C 20,20 80,15 80,45 C 80,75 55,85 40,85 C 25,85 20,70 20,50 Z"
                  fill="none"
                  stroke="#2c3956"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                {/* Bubbles rival (Ahead / Blue) */}
                <circle cx="76" cy="40" r="4" fill="#638aff" stroke="#04122e" strokeWidth="1.5" />
                {/* Player Zip (Pulsing Gold / Red) */}
                <circle
                  cx={20 + trackProgress * 60}
                  cy={50 + Math.sin(trackProgress * Math.PI * 2) * 25}
                  r="6"
                  fill="#ffce4e"
                  fillOpacity="0.4"
                  className="animate-ping"
                />
                <circle
                  cx={20 + trackProgress * 60}
                  cy={50 + Math.sin(trackProgress * Math.PI * 2) * 25}
                  r="4.5"
                  fill="#ff5355"
                  stroke="#ffce4e"
                  strokeWidth="1.5"
                />
                {/* Sprout trailing */}
                <circle cx="35" cy="80" r="3.5" fill="#34d399" stroke="#04122e" strokeWidth="1" />
              </svg>
              <div className="absolute top-1 left-2 text-[8px] text-[#b4c5ff] font-black tracking-widest uppercase">
                MAP
              </div>
            </div>

            {/* Notification Banner / Super Mini-Turbo alert */}
            <div className="pointer-events-none flex flex-col items-center transform -rotate-2 animate-pulse pr-2 sm:pr-4">
              <div className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-[#ff5355] via-[#ffce4e] to-[#ff5355] shadow-[0_4px_0_#5c000a] border border-white/30">
                <span className="text-xs sm:text-sm font-black text-[#5c000a] tracking-wider italic">
                  SUPER MINI-TURBO!
                </span>
              </div>
              <span className="text-[10px] text-[#ffce4e] tracking-widest uppercase font-black mt-0.5 drop-shadow">
                TIER 2 SPARKS ACTIVATED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM HUD & RACE CONTROLS ================= */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-2 flex flex-col gap-2">
        {/* Quick Finish / Test Lap Trigger Strip */}
        <div className="flex items-center justify-between bg-[#1d2946]/80 px-4 py-1.5 rounded-full border border-[#283451] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#ffce4e] font-black uppercase text-[10px]">Controls:</span>
            <span className="text-[#b4c5ff] font-bold text-[10px] hidden sm:inline">
              Keys: W/↑ (Accel), A/D/←/→ (Steer), Space (Item), Shift (Drift), S/↓ (Brake)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={completeRace}
              className="px-3 py-1 rounded-full bg-[#ffce4e] hover:bg-[#ffdf97] text-[#3e2e00] font-black text-xs uppercase shadow-[0_2px_0_#5a4400] active:scale-95 transition-transform"
            >
              🏁 Cross Finish Line (Podium)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onExitRace();
              }}
              className="px-2.5 py-1 rounded-full bg-[#0d1b36] hover:bg-[#283451] text-[#d9e2ff] font-bold text-xs"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Tactile Touch / Arcade Control Deck */}
        <div className="w-full flex items-end justify-between gap-2 pt-1">
          {/* Steer Left & Right Buttons */}
          <div className="flex items-center gap-2">
            <button
              onPointerDown={() => steer(-1)}
              onPointerUp={resetSteer}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1d2946] active:bg-[#283451] text-white flex items-center justify-center shadow-[0_5px_0_#010d29] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
              title="Steer Left"
            >
              <span className="material-symbols-outlined text-[32px]">arrow_left</span>
            </button>

            <button
              onPointerDown={() => steer(1)}
              onPointerUp={resetSteer}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1d2946] active:bg-[#283451] text-white flex items-center justify-center shadow-[0_5px_0_#010d29] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
              title="Steer Right"
            >
              <span className="material-symbols-outlined text-[32px]">arrow_right</span>
            </button>

            {/* Brake */}
            <button
              onPointerDown={() => setIsBraking(true)}
              onPointerUp={() => setIsBraking(false)}
              className="px-3 py-2.5 rounded-2xl bg-[#0d1b36] active:bg-[#1d2946] text-[#ffb4ab] flex flex-col items-center shadow-[0_4px_0_#010d29] active:translate-y-1 active:shadow-none transition-all border border-[#283451]"
            >
              <span className="material-symbols-outlined text-[20px]">g_translate</span>
              <span className="text-[9px] font-black uppercase">BRAKE</span>
            </button>
          </div>

          {/* Center: Drift Charge Gauge */}
          <div className="hidden sm:flex flex-col items-center gap-1 mb-1">
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1d2946]/80">
              <span className="material-symbols-outlined text-[14px] text-[#ffce4e]">local_fire_department</span>
              <span className="text-[10px] text-[#ffce4e] font-black uppercase tracking-wide">
                DRIFT BOOST LV.{sparkTier}
              </span>
            </div>
            <div className="w-40 h-3 rounded-full bg-[#010d29] p-0.5 flex gap-1 shadow-inner">
              <div
                className={`h-full flex-1 rounded-full ${
                  sparkTier >= 1 ? 'bg-[#638aff] shadow-[0_0_6px_#638aff]' : 'bg-[#1d2946]'
                }`}
              />
              <div
                className={`h-full flex-1 rounded-full ${
                  sparkTier >= 2 ? 'bg-[#ffce4e] shadow-[0_0_8px_#ffce4e]' : 'bg-[#1d2946]'
                }`}
              />
              <div
                className={`h-full flex-1 rounded-full ${
                  sparkTier >= 3 ? 'bg-[#ff5355] shadow-[0_0_10px_#ff5355]' : 'bg-[#1d2946]'
                }`}
              />
            </div>
          </div>

          {/* Right Action Buttons: ITEM, DRIFT, GO / ACCEL */}
          <div className="flex items-end gap-2 sm:gap-3">
            {/* Use Item Button */}
            <button
              onClick={triggerItemUse}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-[#ffce4e] active:bg-[#e5b100] text-[#3e2e00] flex flex-col items-center justify-center shadow-[0_5px_0_#5a4400] active:translate-y-1 active:shadow-none transition-all border-t-2 border-white/40"
              title="Use Item"
            >
              <span className="material-symbols-outlined text-[24px]">stars</span>
              <span className="text-[9px] font-black uppercase leading-none">USE</span>
            </button>

            {/* Drift Pedal Button */}
            <button
              onPointerDown={startDrift}
              onPointerUp={releaseDrift}
              className={`w-14 sm:w-16 h-16 sm:h-18 rounded-2xl text-white flex flex-col items-center justify-center gap-0.5 shadow-[0_5px_0_#00174c] active:translate-y-1 active:shadow-none transition-all border-t-2 border-white/40 ${
                telemetry.isDrifting
                  ? 'bg-[#638aff] ring-4 ring-[#ffce4e] scale-105'
                  : 'bg-gradient-to-b from-[#638aff] to-[#00236b]'
              }`}
              title="Hold to charge drift"
            >
              <span className="material-symbols-outlined text-[24px]">cyclone</span>
              <span className="text-[10px] font-black uppercase">DRIFT</span>
            </button>

            {/* Giant GO! / ACCEL Gas Pedal */}
            <button
              onPointerDown={() => setIsAccelerating(true)}
              onPointerUp={() => setIsAccelerating(false)}
              className={`w-18 sm:w-22 h-20 sm:h-24 rounded-3xl text-[#3e2e00] flex flex-col items-center justify-center transition-all border-t-4 border-white/40 cursor-pointer ${
                isAccelerating
                  ? 'bg-[#e5b100] translate-y-2 shadow-[0_1px_0_#5a4400]'
                  : 'bg-gradient-to-b from-[#ffdf97] via-[#ffce4e] to-[#e5b100] shadow-[0_7px_0_#5a4400] active:translate-y-2 active:shadow-[0_1px_0_#5a4400]'
              }`}
              title="Hold to Accelerate"
            >
              <div className="flex flex-col gap-1 items-center mb-1">
                <div className="w-8 h-1 rounded-full bg-[#010d29]/30" />
                <div className="w-8 h-1 rounded-full bg-[#010d29]/30" />
              </div>
              <span className="text-xl sm:text-2xl font-black uppercase tracking-wider drop-shadow-sm">
                GO!
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
