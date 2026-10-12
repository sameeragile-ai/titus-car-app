export type AppScreen = 'lobby' | 'garage' | 'race' | 'podium' | 'tracks' | 'shop' | 'rankings';

export interface KartItem {
  id: string;
  name: string;
  classType: 'COMMON' | 'RARE' | 'EPIC' | 'LEGEND' | 'MYTHIC' | 'VIP';
  category: string;
  subtitle: string;
  pwrScore: number;
  unlocked: boolean;
  cost?: { type: 'coins' | 'gems' | 'pass'; amount: number };
  heroImage: string;
  cardImage: string;
  miniImage: string;
  stats: {
    speed: number;
    accel: number;
    handling: number;
    weight: number;
    drift: number;
  };
  statDiff?: {
    speed: number;
    accel: number;
    handling: number;
    weight: number;
    drift: number;
  };
}

export type PaintFinish = 'gloss' | 'matte' | 'metallic' | 'chrome' | 'holo' | 'gold';

export interface PaintColor {
  id: string;
  name: string;
  hex: string;
  ringColor: string;
}

export interface PlayerProfile {
  name: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  gems: number;
  hasUnreadMail: boolean;
  roadPassTier: number;
  equippedKartId: string;
  paintFinish: PaintFinish;
  paintColorId: string;
  activeMode: 'Grand Prix' | 'Time Trial' | 'Battle Royale';
  activeEngineClass: '50cc' | '100cc' | '150cc' | '200cc';
  activeCup: string;
}

export interface RaceTelemetry {
  lap: number;
  totalLaps: number;
  position: number;
  trackName: string;
  timeSeconds: number;
  speedKmh: number;
  coinsCollected: number;
  itemReady: {
    type: 'rocket' | 'star' | 'boost' | 'lightning';
    count: number;
  } | null;
  driftBoostTier: 0 | 1 | 2 | 3;
  driftCharge: number; // 0 to 100
  deltaVsLeader: string;
  isDrifting: boolean;
  steerOffset: number; // -1 to 1 for visual steering leaning
}
