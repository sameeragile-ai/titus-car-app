import React from 'react';
import { ASSETS } from '../constants/assets';
import { PlayerProfile, AppScreen } from '../types/game';
import { sound } from '../utils/audio';

interface HeaderBarProps {
  profile: PlayerProfile;
  currentScreen: AppScreen;
  onOpenShop: () => void;
  onOpenMail: () => void;
  onOpenSettings: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  profile,
  currentScreen,
  onOpenShop,
  onOpenMail,
  onOpenSettings,
  onNavigate,
}) => {
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'lobby':
        return 'Race Lobby';
      case 'garage':
        return 'Kart Garage';
      case 'race':
        return 'Sunny Speedway';
      case 'podium':
        return 'Post Race Podium';
      case 'tracks':
        return 'Grand Prix Cups';
      case 'shop':
        return 'Nitro Shop';
      case 'rankings':
        return 'Global Ranks';
      default:
        return 'Driftlings Arcade';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-[#04122e]/90 backdrop-blur-xl border-b border-[#1d2946]/50 shadow-[0_4px_20px_rgba(1,13,41,0.6)]">
      <div className="h-16 px-3 sm:px-6 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left Section: Logo & Player Level Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentScreen !== 'lobby' && (
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('lobby');
              }}
              className="w-10 h-10 rounded-full bg-[#1d2946] text-[#d9e2ff] hover:bg-[#283451] flex items-center justify-center active:scale-90 transition-transform shadow-md"
              title="Back to Lobby"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('lobby');
            }}
            className="flex items-center active:scale-95 transition-transform"
          >
            <img
              src={ASSETS.LOGO}
              alt="DRIFTLINGS 3D Marquee Logo"
              className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,83,85,0.4)]"
            />
          </button>

          {/* Player Mini Badge with animated level ring */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('garage');
            }}
            className="flex items-center gap-1.5 bg-[#1d2946]/90 hover:bg-[#283451] cursor-pointer px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#283451]"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ffb3af] flex items-center justify-center shadow-[0_0_8px_rgba(255,179,175,0.5)]">
                <span className="material-symbols-outlined text-[#68000d] text-[18px]">person</span>
              </div>
              <div
                className="absolute -inset-0.5 rounded-full border-2 border-[#ffce4e] border-t-transparent animate-spin"
                style={{ animationDuration: '6s' }}
              />
            </div>
            <div className="flex flex-col pr-1">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[#ffce4e] text-xs sm:text-sm leading-none">{profile.name}</span>
                <span className="material-symbols-outlined text-[#ffb3af] text-[12px]">verified</span>
              </div>
              <span className="text-[10px] text-[#b4c5ff] uppercase font-black tracking-wider leading-tight">
                Lv.{profile.level}
              </span>
            </div>
          </div>

          {/* Current Screen Title (Desktop only) */}
          <div className="hidden lg:flex items-center pl-2">
            <span className="font-extrabold uppercase text-[#d9e2ff] tracking-wider text-sm drop-shadow">
              {getScreenTitle()}
            </span>
          </div>
        </div>

        {/* Right Section: Coins, Gems, Mail & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Gold Coins */}
          <div className="flex items-center bg-[#1d2946]/90 rounded-full pl-2 sm:pl-3 pr-1 py-1 gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#283451]">
            <span className="material-symbols-outlined text-[#ffce4e] text-[18px] sm:text-[20px] drop-shadow-[0_0_6px_rgba(255,206,78,0.6)]">
              monetization_on
            </span>
            <span className="text-xs sm:text-sm text-[#d9e2ff] font-black tabular-nums">
              {profile.coins.toLocaleString()}
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenShop();
              }}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#ffce4e] text-[#3e2e00] flex items-center justify-center font-black active:scale-90 transition-transform shadow-sm"
              title="Add Coins"
            >
              <span className="material-symbols-outlined text-[14px] sm:text-[16px]">add</span>
            </button>
          </div>

          {/* Blue Gems */}
          <div className="flex items-center bg-[#1d2946]/90 rounded-full pl-2 sm:pl-3 pr-1 py-1 gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#283451]">
            <span className="material-symbols-outlined text-[#638aff] text-[18px] sm:text-[20px] drop-shadow-[0_0_6px_rgba(99,138,255,0.6)]">
              diamond
            </span>
            <span className="text-xs sm:text-sm text-[#d9e2ff] font-black tabular-nums">
              {profile.gems.toLocaleString()}
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenShop();
              }}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#638aff] text-[#00236b] flex items-center justify-center font-black active:scale-90 transition-transform shadow-sm"
              title="Add Gems"
            >
              <span className="material-symbols-outlined text-[14px] sm:text-[16px]">add</span>
            </button>
          </div>

          {/* Mailbox */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMail();
            }}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1d2946] flex items-center justify-center text-[#d9e2ff] hover:text-[#ffce4e] active:scale-95 transition-all shadow-md"
            title="Driver Inbox"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">mail</span>
            {profile.hasUnreadMail && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#ff5355] ring-2 ring-[#04122e] animate-pulse" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1d2946] flex items-center justify-center text-[#d9e2ff] hover:text-[#ffce4e] active:scale-95 transition-all shadow-md"
            title="Game Settings"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
