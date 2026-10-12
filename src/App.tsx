/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreen, PlayerProfile, PaintFinish, KartItem } from './types/game';
import { INITIAL_PROFILE, KARTS } from './constants/gameData';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavBar } from './components/BottomNavBar';
import { LobbyScreen } from './components/LobbyScreen';
import { GarageScreen } from './components/GarageScreen';
import { RaceScreen } from './components/RaceScreen';
import { PodiumScreen } from './components/PodiumScreen';
import { TracksScreen } from './components/TracksScreen';
import { RankingsScreen } from './components/RankingsScreen';
import { ShopModal } from './components/ShopModal';
import { RoadPassModal } from './components/RoadPassModal';
import { MailboxModal } from './components/MailboxModal';
import { SettingsModal } from './components/SettingsModal';
import { sound } from './utils/audio';

const STORAGE_KEY = 'driftlings_profile_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('lobby');
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback to default
    }
    return INITIAL_PROFILE;
  });

  // Modal controls
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isRoadPassOpen, setIsRoadPassOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Latest race result for podium
  const [lastRaceResult, setLastRaceResult] = useState<{
    placement: number;
    totalTime: string;
    bestLap: string;
    avgSpeed: number;
    driftScore: number;
    coinsCollected: number;
  }>({
    placement: 1,
    totalTime: '02:08.41',
    bestLap: '00:41.12',
    avgSpeed: 198.4,
    driftScore: 14890,
    coinsCollected: 8,
  });

  // Save profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  const handleEquipKart = (kartId: string) => {
    setProfile((prev) => ({ ...prev, equippedKartId: kartId }));
  };

  const handleSelectFinish = (finish: PaintFinish) => {
    setProfile((prev) => ({ ...prev, paintFinish: finish }));
  };

  const handleSelectColor = (colorId: string) => {
    setProfile((prev) => ({ ...prev, paintColorId: colorId }));
  };

  const handleUnlockKart = (kart: KartItem) => {
    if (!kart.cost) return;
    if (kart.cost.type === 'coins') {
      if (profile.coins >= kart.cost.amount) {
        kart.unlocked = true;
        setProfile((prev) => ({
          ...prev,
          coins: prev.coins - (kart.cost?.amount || 0),
          equippedKartId: kart.id,
        }));
        sound.playCoin();
      } else {
        alert('Need more coins! Win races or visit the Shop.');
      }
    } else if (kart.cost.type === 'gems') {
      if (profile.gems >= kart.cost.amount) {
        kart.unlocked = true;
        setProfile((prev) => ({
          ...prev,
          gems: prev.gems - (kart.cost?.amount || 0),
          equippedKartId: kart.id,
        }));
        sound.playCoin();
      } else {
        alert('Need more gems! Check your Inbox or the Shop.');
      }
    }
  };

  const handleClaimRewards = (coins: number, gems: number, xp: number) => {
    setProfile((prev) => {
      const nextXp = prev.xp + xp;
      let nextLevel = prev.level;
      let leftOverXp = nextXp;
      if (nextXp >= prev.nextLevelXp) {
        nextLevel += 1;
        leftOverXp = nextXp - prev.nextLevelXp;
      }
      return {
        ...prev,
        coins: prev.coins + coins,
        gems: prev.gems + gems,
        xp: leftOverXp,
        level: nextLevel,
        roadPassTier: Math.min(50, prev.roadPassTier + 1),
      };
    });
  };

  const handleUpdateBalances = (coinsDiff: number, gemsDiff: number) => {
    setProfile((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins + coinsDiff),
      gems: Math.max(0, prev.gems + gemsDiff),
    }));
  };

  const handleResetProgress = () => {
    setProfile(INITIAL_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
    KARTS.forEach((k) => {
      if (k.id !== 'bolt' && k.id !== 'standard' && k.id !== 'bubble') {
        k.unlocked = false;
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#04122e] text-[#d9e2ff] flex flex-col justify-between selection:bg-[#ff5355] selection:text-white">
      {/* Top Header Bar (Persistent except in full-screen race mode) */}
      {currentScreen !== 'race' && (
        <HeaderBar
          profile={profile}
          currentScreen={currentScreen}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenMail={() => setIsMailOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}

      {/* Main Screen Content View */}
      <main className={`flex-1 flex flex-col ${currentScreen !== 'race' ? 'pt-16' : ''}`}>
        {currentScreen === 'lobby' && (
          <LobbyScreen
            profile={profile}
            onStartRace={() => setCurrentScreen('race')}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenRoadPass={() => setIsRoadPassOpen(true)}
            onSelectMode={(mode) => setProfile((prev) => ({ ...prev, activeMode: mode }))}
            onSelectClass={(cc) => setProfile((prev) => ({ ...prev, activeEngineClass: cc }))}
          />
        )}

        {currentScreen === 'garage' && (
          <GarageScreen
            profile={profile}
            onEquipKart={handleEquipKart}
            onSelectFinish={handleSelectFinish}
            onSelectColor={handleSelectColor}
            onTestDrive={() => setCurrentScreen('race')}
            onUnlockKart={handleUnlockKart}
          />
        )}

        {currentScreen === 'race' && (
          <RaceScreen
            profile={profile}
            onRaceFinish={(result) => {
              setLastRaceResult(result);
              setCurrentScreen('podium');
            }}
            onExitRace={() => setCurrentScreen('lobby')}
          />
        )}

        {currentScreen === 'podium' && (
          <PodiumScreen
            profile={profile}
            raceResult={lastRaceResult}
            onRaceAgain={() => setCurrentScreen('race')}
            onNextTrack={() => {
              setProfile((prev) => ({ ...prev, activeCup: 'Turbo Island GP' }));
              setCurrentScreen('race');
            }}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onClaimRewards={handleClaimRewards}
          />
        )}

        {currentScreen === 'tracks' && (
          <TracksScreen
            profile={profile}
            onSelectTrack={(trackName) => {
              setProfile((prev) => ({ ...prev, activeCup: `${trackName} GP` }));
              setCurrentScreen('race');
            }}
          />
        )}

        {currentScreen === 'shop' && (
          <div className="w-full max-w-4xl mx-auto p-4">
            <ShopModal
              isOpen={true}
              onClose={() => setCurrentScreen('lobby')}
              profile={profile}
              onUpdateBalances={handleUpdateBalances}
            />
          </div>
        )}

        {currentScreen === 'rankings' && <RankingsScreen profile={profile} />}
      </main>

      {/* Persistent Bottom Tab Bar */}
      <BottomNavBar currentScreen={currentScreen} onNavigate={(screen) => setCurrentScreen(screen)} />

      {/* Modals & Dialogs */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        profile={profile}
        onUpdateBalances={handleUpdateBalances}
      />

      <RoadPassModal
        isOpen={isRoadPassOpen}
        onClose={() => setIsRoadPassOpen(false)}
        profile={profile}
        onClaimTier={(tier) => {
          setProfile((prev) => ({ ...prev, roadPassTier: Math.max(prev.roadPassTier, tier) }));
          handleClaimRewards(500, 10, 500);
        }}
      />

      <MailboxModal
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
        onClaimAll={() => {
          handleClaimRewards(1000, 10, 0);
          setProfile((prev) => ({ ...prev, hasUnreadMail: false }));
          setIsMailOpen(false);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
