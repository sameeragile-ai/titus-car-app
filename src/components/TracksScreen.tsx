import React from 'react';
import { TRACKS_DATA } from '../constants/gameData';
import { PlayerProfile } from '../types/game';
import { sound } from '../utils/audio';

interface TracksScreenProps {
  profile: PlayerProfile;
  onSelectTrack: (trackName: string) => void;
}

export const TracksScreen: React.FC<TracksScreenProps> = ({ profile, onSelectTrack }) => {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 pt-3 pb-24 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            GRAND PRIX CUPS
          </h2>
          <p className="text-xs text-[#b4c5ff] font-bold">Select a championship track to race</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1d2946] px-3.5 py-1.5 rounded-full border border-[#283451]">
          <span className="material-symbols-outlined text-[#ffce4e] text-[18px]">workspace_premium</span>
          <span className="text-xs font-black text-[#ffce4e] uppercase">{profile.activeEngineClass} CLASS</span>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRACKS_DATA.map((track) => {
          const isCurrent = profile.activeCup.includes(track.name);
          return (
            <div
              key={track.id}
              className={`rounded-3xl overflow-hidden bg-[#1d2946] border flex flex-col justify-between shadow-[0_6px_0_#010d29] transition-all hover:-translate-y-1 ${
                isCurrent ? 'border-[#ffce4e]' : 'border-[#283451]'
              }`}
            >
              {/* Track Thumbnail */}
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  src={track.bg}
                  alt={track.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d2946] via-transparent to-black/30" />
                <div className="absolute top-3 left-3 bg-[#010d29]/80 backdrop-blur-sm px-3 py-0.5 rounded-full text-[10px] font-black uppercase text-[#ffce4e] border border-[#ffce4e]/30">
                  {track.cup}
                </div>
                <div className="absolute top-3 right-3 bg-[#ff5355] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white shadow-sm">
                  {track.difficulty}
                </div>
                <div className="absolute bottom-2 left-3">
                  <h3 className="text-lg font-black text-white uppercase drop-shadow">{track.name}</h3>
                  <span className="text-[10px] text-[#b4c5ff] font-bold">Record: {track.bestRecord}</span>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <p className="text-xs text-[#d9e2ff]/80 font-bold leading-relaxed">{track.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#283451]">
                  <span className="text-xs text-[#ffce4e] font-black uppercase">{track.laps} LAPS</span>
                  <button
                    onClick={() => {
                      sound.playBoost();
                      onSelectTrack(track.name);
                    }}
                    className="px-5 py-2 rounded-full bg-[#ffce4e] hover:bg-[#ffdf97] text-[#3e2e00] font-black text-xs uppercase shadow-[0_3px_0_#5a4400] active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>RACE</span>
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
