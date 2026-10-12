import React, { useState, useRef } from 'react';
import { ASSETS } from '../constants/assets';
import { KARTS, PAINT_COLORS } from '../constants/gameData';
import { PlayerProfile, KartItem, PaintFinish } from '../types/game';
import { sound } from '../utils/audio';

interface GarageScreenProps {
  profile: PlayerProfile;
  onEquipKart: (kartId: string) => void;
  onSelectFinish: (finish: PaintFinish) => void;
  onSelectColor: (colorId: string) => void;
  onTestDrive: () => void;
  onUnlockKart: (kart: KartItem) => void;
}

export const GarageScreen: React.FC<GarageScreenProps> = ({
  profile,
  onEquipKart,
  onSelectFinish,
  onSelectColor,
  onTestDrive,
  onUnlockKart,
}) => {
  const [selectedKartId, setSelectedKartId] = useState<string>(profile.equippedKartId);
  const [activeTab, setActiveTab] = useState<'Body' | 'Paint' | 'Wheels' | 'Spoiler' | 'Boost' | 'Horn' | 'Stickers'>('Paint');
  const [isTurntableOn, setIsTurntableOn] = useState<boolean>(true);
  const [underglowActive, setUnderglowActive] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartX = useRef<number>(0);

  const currentKart = KARTS.find((k) => k.id === selectedKartId) || KARTS[0];
  const currentColor = PAINT_COLORS.find((c) => c.id === profile.paintColorId) || PAINT_COLORS[0];
  const isEquipped = profile.equippedKartId === currentKart.id;

  // Touch and drag rotation simulation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    setRotationAngle((prev) => prev + delta * 0.5);
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col w-full relative select-none pb-24 overflow-x-hidden">
      {/* Dynamic Atmospheric Spotlight Rays in Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#010d29] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-b from-[#638aff]/20 via-[#b4c5ff]/5 to-transparent blur-3xl transform -rotate-12" />
        <div className="absolute top-0 right-1/4 w-96 h-full bg-gradient-to-b from-[#ff5355]/20 via-[#ffb3af]/5 to-transparent blur-3xl transform rotate-12" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-2">
        {/* ================= HERO SHOWROOM MAIN STAGE ================= */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#0d1b36] shadow-2xl flex flex-col justify-between p-4 sm:p-6 border border-[#1d2946]">
          {/* Workshop Wallpaper Canvas */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-65 mix-blend-luminosity scale-105"
            style={{ backgroundImage: `url('${ASSETS.GARAGE_BG}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b36] via-transparent to-[#010d29]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#010d29]/90 via-transparent to-[#010d29]/90" />

          {/* Workshop Header Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#283451]/95 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#ffce4e]/30">
              <span className="material-symbols-outlined text-[#ffce4e] text-[18px]">precision_manufacturing</span>
              <span className="font-black text-sm text-[#ffce4e] tracking-wider uppercase">DRIFT GARAGE</span>
              <span className="px-2 py-0.5 rounded-full bg-[#e5b100] text-[#3e2e00] font-black text-[10px] uppercase tracking-widest">
                BAY 04
              </span>
            </div>

            {/* Stage Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsTurntableOn(!isTurntableOn);
                }}
                className="h-8 px-3 rounded-full bg-[#1d2946]/95 hover:bg-[#283451] active:scale-95 transition-transform flex items-center gap-1.5 shadow-md border border-[#283451]"
              >
                <span
                  className={`material-symbols-outlined text-[#b4c5ff] text-[18px] ${
                    isTurntableOn ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '8s' }}
                >
                  360
                </span>
                <span className="text-[11px] font-extrabold text-[#d9e2ff] uppercase">
                  {isTurntableOn ? 'Turntable ON' : 'Turntable PAUSED'}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setUnderglowActive(!underglowActive);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  underglowActive
                    ? 'bg-[#ffce4e] text-[#3e2e00] shadow-[0_0_8px_#ffce4e]'
                    : 'bg-[#1d2946] text-[#d9e2ff]/60'
                }`}
                title="Toggle Neon Underglow"
              >
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              </button>

              <div className="flex items-center gap-1 bg-[#1d2946]/95 px-2.5 py-1 rounded-full border border-[#283451]">
                <span className="w-2 h-2 rounded-full bg-[#ffce4e] animate-pulse" />
                <span className="text-[10px] text-[#d9e2ff] font-black uppercase">4K CINEMATIC</span>
              </div>
            </div>
          </div>

          {/* Center Floating Stage: Pedestal & Star Kart Showcase */}
          <div
            className="relative w-full my-6 flex items-center justify-center min-h-[220px] cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Turntable Metallic Pedestal */}
            <div className="absolute bottom-2 w-72 sm:w-96 h-18 rounded-[50%] bg-[#283451] shadow-[0_12px_30px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden border border-[#638aff]/40">
              <div className="w-11/12 h-5/6 rounded-[50%] bg-gradient-to-b from-[#2c3956] to-[#010d29] flex items-center justify-center">
                <div
                  className="w-10/12 h-4/5 rounded-[50%] blur-[2px] transition-all duration-300"
                  style={{
                    backgroundColor: underglowActive ? currentColor.hex + '66' : 'transparent',
                    boxShadow: underglowActive ? `0 0 20px ${currentColor.hex}` : 'none',
                  }}
                />
              </div>
            </div>

            {/* Hero Kart Render with simulated 3D tilt & turntable rotation */}
            <div
              className={`relative z-10 flex flex-col items-center transition-transform ${
                isTurntableOn && !isDragging ? 'animate-pulse' : ''
              }`}
              style={{
                transform: `rotateY(${rotationAngle}deg)`,
              }}
            >
              {/* Floating Rarity Banner */}
              <div className="absolute -top-7 -rotate-2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#e5b100] via-[#ffce4e] to-[#e5b100] text-[#3e2e00] shadow-[0_6px_14px_rgba(255,206,78,0.45)] flex items-center gap-1 z-20 border border-white/40">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                <span className="text-[10px] font-black tracking-widest uppercase">
                  {currentKart.classType} CHASSIS
                </span>
              </div>

              {/* 3D Kart Model */}
              <div className="relative w-72 sm:w-84 h-36 sm:h-40 flex items-center justify-center">
                <img
                  src={currentKart.heroImage}
                  alt={currentKart.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_18px_20px_rgba(0,0,0,0.8)] pointer-events-none"
                />
                {/* Underbody Colored Neon Wash */}
                {underglowActive && (
                  <div
                    className="absolute bottom-2 inset-x-8 h-6 blur-lg rounded-full -z-10 transition-colors duration-500"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                )}
              </div>

              {/* Touch & Drag Indicator */}
              <div className="mt-2 flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#1d2946]/90 backdrop-blur-sm text-[#b4c5ff] border border-[#283451]">
                <span className="material-symbols-outlined text-[14px]">touch_app</span>
                <span className="text-[10px] text-[#e5bdba] font-bold tracking-tight">Tap & Drag to Inspect</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= HUD POD: STATS & SPECS + PAINT FINISH ================= */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3 w-full">
          {/* Kart Info & Upgrades Stat Matrix (Col 1-7) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#1d2946]/95 border border-[#283451] shadow-[0_6px_0_#010d29] p-4 sm:p-5 flex flex-col justify-between">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    {currentKart.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#638aff] text-[#00236b] text-[10px] font-black uppercase">
                    {currentKart.category}
                  </span>
                </div>
                <p className="text-xs text-[#b4c5ff] font-bold mt-0.5">{currentKart.subtitle}</p>
              </div>

              {/* Power Score Pill */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-[#ffce4e] uppercase font-black tracking-widest">POWER SCORE</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#ffce4e] leading-none">
                    {currentKart.pwrScore}
                  </span>
                  <span className="text-xs text-[#ffb3af] font-black">↑ +18</span>
                </div>
              </div>
            </div>

            {/* Stat Bars */}
            <div className="mt-4 space-y-2">
              {/* Speed */}
              <div className="flex items-center justify-between gap-3">
                <div className="w-24 flex items-center gap-1.5 text-xs font-black uppercase text-[#d9e2ff]">
                  <span className="material-symbols-outlined text-[#ffce4e] text-[16px]">speed</span>
                  <span>Speed</span>
                </div>
                <div className="flex-1 h-3 rounded-full bg-[#010d29] p-0.5 overflow-hidden flex items-center shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#e5b100] to-[#ffce4e] transition-all duration-500 shadow-[0_0_8px_#ffce4e]"
                    style={{ width: `${currentKart.stats.speed}%` }}
                  />
                </div>
                <div className="w-16 flex items-center justify-end gap-1 text-xs font-black">
                  <span className="text-white">{currentKart.stats.speed}</span>
                  <span className="text-[#ffce4e]">↑{currentKart.statDiff?.speed || 4}</span>
                </div>
              </div>

              {/* Acceleration */}
              <div className="flex items-center justify-between gap-3">
                <div className="w-24 flex items-center gap-1.5 text-xs font-black uppercase text-[#d9e2ff]">
                  <span className="material-symbols-outlined text-[#638aff] text-[16px]">rocket_launch</span>
                  <span>Accel</span>
                </div>
                <div className="flex-1 h-3 rounded-full bg-[#010d29] p-0.5 overflow-hidden flex items-center shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#b4c5ff] to-[#638aff] transition-all duration-500 shadow-[0_0_8px_#638aff]"
                    style={{ width: `${currentKart.stats.accel}%` }}
                  />
                </div>
                <div className="w-16 flex items-center justify-end gap-1 text-xs font-black">
                  <span className="text-white">{currentKart.stats.accel}</span>
                  <span className="text-[#b4c5ff]">—</span>
                </div>
              </div>

              {/* Handling */}
              <div className="flex items-center justify-between gap-3">
                <div className="w-24 flex items-center gap-1.5 text-xs font-black uppercase text-[#d9e2ff]">
                  <span className="material-symbols-outlined text-[#ffb3af] text-[16px]">sports_motorsports</span>
                  <span>Handling</span>
                </div>
                <div className="flex-1 h-3 rounded-full bg-[#010d29] p-0.5 overflow-hidden flex items-center shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ffdad7] to-[#ffb3af] transition-all duration-500"
                    style={{ width: `${currentKart.stats.handling}%` }}
                  />
                </div>
                <div className="w-16 flex items-center justify-end gap-1 text-xs font-black">
                  <span className="text-white">{currentKart.stats.handling}</span>
                  <span className="text-[#ffce4e]">↑{currentKart.statDiff?.handling || 2}</span>
                </div>
              </div>

              {/* Weight */}
              <div className="flex items-center justify-between gap-3">
                <div className="w-24 flex items-center gap-1.5 text-xs font-black uppercase text-[#d9e2ff]">
                  <span className="material-symbols-outlined text-[#ac8886] text-[16px]">fitness_center</span>
                  <span>Weight</span>
                </div>
                <div className="flex-1 h-3 rounded-full bg-[#010d29] p-0.5 overflow-hidden flex items-center shadow-inner">
                  <div
                    className="h-full rounded-full bg-[#2c3956] transition-all duration-500"
                    style={{ width: `${currentKart.stats.weight}%` }}
                  />
                </div>
                <div className="w-16 flex items-center justify-end gap-1 text-xs font-black">
                  <span className="text-white">{currentKart.stats.weight}</span>
                  <span className="text-[#e5bdba]">—</span>
                </div>
              </div>

              {/* Drift */}
              <div className="flex items-center justify-between gap-3">
                <div className="w-24 flex items-center gap-1.5 text-xs font-black uppercase text-[#ffce4e]">
                  <span className="material-symbols-outlined text-[16px]">tire_repair</span>
                  <span>Drift</span>
                </div>
                <div className="flex-1 h-3 rounded-full bg-[#010d29] p-0.5 overflow-hidden flex items-center shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ffce4e] to-[#ff5355] transition-all duration-500 shadow-[0_0_10px_#ffce4e]"
                    style={{ width: `${currentKart.stats.drift}%` }}
                  />
                </div>
                <div className="w-16 flex items-center justify-end gap-1 text-xs font-black">
                  <span className="text-white">{currentKart.stats.drift}</span>
                  <span className="text-[#ffce4e]">↑{currentKart.statDiff?.drift || 6}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Panel: Paint Finish & Swatches (Col 8-12) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#1d2946]/95 border border-[#283451] shadow-[0_6px_0_#010d29] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffce4e] text-[18px]">brush</span>
                  <span className="font-black text-sm text-white uppercase tracking-wider">Paint Finish</span>
                </div>
                <span className="text-[10px] text-[#b4c5ff] uppercase font-black">
                  Formula: {profile.paintFinish.toUpperCase()} ULTRA
                </span>
              </div>

              {/* Finish Selection Pills */}
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                {(['gloss', 'matte', 'metallic', 'chrome', 'holo', 'gold'] as const).map((finish) => {
                  const isCurrent = profile.paintFinish === finish;
                  return (
                    <button
                      key={finish}
                      onClick={() => {
                        sound.playClick();
                        onSelectFinish(finish);
                      }}
                      className={`py-1.5 px-2 rounded-full font-black text-xs uppercase transition-all text-center flex items-center justify-center gap-1 ${
                        isCurrent
                          ? 'bg-[#ffce4e] text-[#3e2e00] shadow-[0_3px_0_#5a4400]'
                          : 'bg-[#283451] text-[#d9e2ff] hover:bg-[#2c3956] active:scale-95'
                      }`}
                    >
                      {isCurrent && <span className="material-symbols-outlined text-[14px]">check</span>}
                      {finish}
                    </button>
                  );
                })}
              </div>

              {/* Color Swatch Palette */}
              <div className="mt-4">
                <span className="text-[11px] text-[#b4c5ff] font-extrabold uppercase tracking-wider block mb-2">
                  Color Palette Swatches
                </span>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {PAINT_COLORS.map((color) => {
                    const isSelected = profile.paintColorId === color.id;
                    return (
                      <button
                        key={color.id}
                        onClick={() => {
                          sound.playClick();
                          onSelectColor(color.id);
                        }}
                        style={{ backgroundColor: color.hex }}
                        className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center shadow-md ${
                          isSelected
                            ? 'ring-4 ring-[#ffce4e] scale-110'
                            : 'hover:scale-105 active:scale-95 opacity-90'
                        }`}
                        title={color.name}
                      >
                        {isSelected && (
                          <span
                            className="material-symbols-outlined text-[16px] font-black"
                            style={{ color: color.hex === '#ffffff' ? '#000000' : '#ffffff' }}
                          >
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action CTAs: Equip & Test Drive */}
            <div className="flex items-center gap-3 mt-4 pt-2 border-t border-[#283451]/60">
              {/* EQUIP / UNLOCK BUTTON */}
              {currentKart.unlocked ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    onEquipKart(currentKart.id);
                  }}
                  className={`flex-1 py-3 px-4 rounded-full font-black text-xs sm:text-sm uppercase transition-all flex items-center justify-center gap-2 shadow-[0_5px_0_#5a4400] active:translate-y-1 active:shadow-none ${
                    isEquipped
                      ? 'bg-[#10b981] text-white shadow-[0_5px_0_#065f46]'
                      : 'bg-[#ffce4e] hover:brightness-110 text-[#3e2e00]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isEquipped ? 'check_circle' : 'bolt'}
                  </span>
                  <span>{isEquipped ? 'EQUIPPED' : 'EQUIP'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    onUnlockKart(currentKart);
                  }}
                  className="flex-1 py-3 px-4 rounded-full font-black text-xs sm:text-sm uppercase bg-[#ff5355] text-white flex items-center justify-center gap-2 shadow-[0_5px_0_#5c000a] active:translate-y-1 active:shadow-none"
                >
                  <span className="material-symbols-outlined text-[18px]">lock_open</span>
                  <span>
                    UNLOCK ({currentKart.cost?.amount} {currentKart.cost?.type.toUpperCase()})
                  </span>
                </button>
              )}

              {/* TEST DRIVE BUTTON */}
              <button
                onClick={() => {
                  sound.playBoost();
                  onTestDrive();
                }}
                className="flex-1 py-3 px-4 rounded-full bg-[#638aff] hover:brightness-110 text-white font-black text-xs sm:text-sm uppercase shadow-[0_5px_0_#00236b] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <span className="material-symbols-outlined text-[20px]">sports_score</span>
                <span>TEST DRIVE</span>
                <span className="material-symbols-outlined absolute right-1 -bottom-2 text-[32px] opacity-20 pointer-events-none -rotate-45">
                  tire_repair
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= CUSTOMIZER CATEGORY TABS ================= */}
        <div className="w-full mt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(
              [
                { id: 'Body', icon: 'directions_car' },
                { id: 'Paint', icon: 'palette' },
                { id: 'Wheels', icon: 'tire_repair' },
                { id: 'Spoiler', icon: 'air' },
                { id: 'Boost', icon: 'local_fire_department' },
                { id: 'Horn', icon: 'campaign' },
                { id: 'Stickers', icon: 'auto_awesome' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`px-4 py-2 rounded-full font-black text-xs uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#ffce4e] text-[#3e2e00] shadow-[0_3px_0_#5a4400]'
                      : 'bg-[#1d2946] text-[#d9e2ff] hover:bg-[#283451]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span>{tab.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= BOTTOM KART FLEET CAROUSEL CARDS ================= */}
        <div className="w-full mt-4 mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-black text-xs sm:text-sm text-white uppercase tracking-wider">
              KART COLLECTION ({KARTS.filter((k) => k.unlocked).length}/{KARTS.length})
            </span>
            <div className="flex items-center gap-1 text-[#b4c5ff] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>TAP TO PREVIEW</span>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {KARTS.map((kart) => {
              const isCardSelected = kart.id === selectedKartId;
              const isCardEquipped = kart.id === profile.equippedKartId;

              return (
                <div
                  key={kart.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedKartId(kart.id);
                  }}
                  className={`min-w-[160px] w-[160px] rounded-2xl p-3 shadow-[0_4px_0_#010d29] flex flex-col items-center relative cursor-pointer transition-all border ${
                    isCardSelected
                      ? 'bg-[#283451] -translate-y-1 border-[#ffce4e]'
                      : 'bg-[#1d2946] hover:bg-[#283451]/80 border-[#283451]'
                  } ${!kart.unlocked ? 'opacity-90' : ''}`}
                >
                  {/* Status Ribbon */}
                  {isCardEquipped ? (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#10b981] text-white text-[9px] font-black flex items-center gap-0.5 shadow-md">
                      <span className="material-symbols-outlined text-[11px]">check_circle</span>
                      <span>EQUIPPED</span>
                    </div>
                  ) : null}

                  {/* Class Badge */}
                  <div className="w-full flex items-center justify-between mt-1">
                    <span
                      className={`text-[9px] font-black uppercase ${
                        kart.classType === 'LEGEND'
                          ? 'text-[#ffce4e]'
                          : kart.classType === 'MYTHIC'
                          ? 'text-[#638aff]'
                          : kart.classType === 'EPIC'
                          ? 'text-[#ff5355]'
                          : 'text-[#b4c5ff]'
                      }`}
                    >
                      {kart.classType}
                    </span>
                    {kart.unlocked ? (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#0d1b36] text-[9px] text-[#d9e2ff] font-bold">
                        OWNED
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[#ac8886] text-[14px]">lock</span>
                    )}
                  </div>

                  {/* Thumbnail Image */}
                  <div className="w-28 h-18 my-2 flex items-center justify-center">
                    <img
                      src={kart.cardImage}
                      alt={kart.name}
                      className={`w-full h-full object-contain filter drop-shadow ${
                        !kart.unlocked ? 'grayscale contrast-125 opacity-75' : ''
                      }`}
                    />
                  </div>

                  {/* Name and Power */}
                  <span className="font-black text-xs text-white uppercase truncate w-full text-center">
                    {kart.name}
                  </span>
                  <span className="text-[11px] font-black text-[#ffce4e] mt-0.5">
                    PWR {kart.pwrScore}
                  </span>

                  {/* Cost Pill if locked */}
                  {!kart.unlocked && kart.cost && (
                    <div className="flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#010d29] text-[9px] font-black text-[#ffce4e] border border-[#283451]">
                      <span className="material-symbols-outlined text-[12px]">
                        {kart.cost.type === 'gems' ? 'diamond' : 'monetization_on'}
                      </span>
                      <span>{kart.cost.amount}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
