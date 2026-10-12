import React from 'react';
import { AppScreen } from '../types/game';
import { sound } from '../utils/audio';

interface BottomNavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen, onNavigate }) => {
  // Hide bottom nav during active race to maximize immersive viewport as shown in racing screenshots
  if (currentScreen === 'race') {
    return null;
  }

  const navItems: { screen: AppScreen; label: string; icon: string }[] = [
    { screen: 'lobby', label: 'Lobby', icon: 'sports_score' },
    { screen: 'garage', label: 'Garage', icon: 'directions_car' },
    { screen: 'tracks', label: 'Tracks', icon: 'alt_route' },
    { screen: 'shop', label: 'Shop', icon: 'storefront' },
    { screen: 'rankings', label: 'Rankings', icon: 'trophy' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#010d29]/95 backdrop-blur-xl border-t border-[#1d2946]/70 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => {
                sound.playClick();
                onNavigate(item.screen);
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl transition-all active:scale-90 ${
                isActive
                  ? 'text-[#ffce4e] font-black'
                  : 'text-[#e5bdba]/70 hover:text-[#d9e2ff]'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[24px] sm:text-[26px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#ffce4e] shadow-[0_0_6px_#ffce4e]" />
                )}
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wide mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
