import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetProgress,
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(sound.getMuted());
  const [haptics, setHaptics] = useState(true);
  const [quality, setQuality] = useState<'4K' | 'High' | 'Normal'>('4K');

  if (!isOpen) return null;

  const toggleMute = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#0d1b36] rounded-3xl border-2 border-[#1d2946] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#121f3b] border-b border-[#1d2946] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffce4e] text-[24px]">settings</span>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">GAME SETTINGS</h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#1d2946] text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-4">
          {/* Sound FX */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1d2946] border border-[#283451]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ffce4e] text-[20px]">
                {isAudioMuted ? 'volume_off' : 'volume_up'}
              </span>
              <span className="text-sm font-black text-white uppercase">Arcade Sound FX</span>
            </div>
            <button
              onClick={toggleMute}
              className={`px-3 py-1 rounded-full text-xs font-black uppercase transition-colors ${
                !isAudioMuted ? 'bg-[#10b981] text-white' : 'bg-[#283451] text-[#b4c5ff]'
              }`}
            >
              {!isAudioMuted ? 'ON' : 'MUTED'}
            </button>
          </div>

          {/* Haptic Vibration */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1d2946] border border-[#283451]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#638aff] text-[20px]">vibration</span>
              <span className="text-sm font-black text-white uppercase">Tactile Haptics</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setHaptics(!haptics);
              }}
              className={`px-3 py-1 rounded-full text-xs font-black uppercase transition-colors ${
                haptics ? 'bg-[#10b981] text-white' : 'bg-[#283451] text-[#b4c5ff]'
              }`}
            >
              {haptics ? 'ENABLED' : 'OFF'}
            </button>
          </div>

          {/* Render Mode */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1d2946] border border-[#283451]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ff5355] text-[20px]">tv</span>
              <span className="text-sm font-black text-white uppercase">Graphics Preset</span>
            </div>
            <div className="flex items-center gap-1 bg-[#010d29] p-1 rounded-full">
              {(['4K', 'High', 'Normal'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    sound.playClick();
                    setQuality(q);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase transition-all ${
                    quality === q ? 'bg-[#ffce4e] text-[#3e2e00]' : 'text-[#b4c5ff]'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Reset progress */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (confirm('Reset driver coins and garage progress?')) {
                  sound.playClick();
                  onResetProgress();
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-2xl bg-[#ff5355]/20 hover:bg-[#ff5355]/30 text-[#ffb4ab] font-black text-xs uppercase border border-[#ff5355]/40 active:scale-95 transition-all"
            >
              Reset Driver Career Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
