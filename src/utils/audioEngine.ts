import { AnimalItem, AudioSettings } from '../types/game';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private musicStep = 0;
  private settings: AudioSettings = {
    volume: 0.85,
    voiceEnabled: true,
    sfxEnabled: true,
    musicEnabled: false,
    voiceRate: 0.9,
    hintsAlwaysAvailable: true,
    unlockAllLevels: false,
  };
  private captionListener: ((text: string | null) => void) | null = null;
  private captionTimeout: number | null = null;

  public updateSettings(next: AudioSettings) {
    const wasMusicOn = this.settings.musicEnabled;
    this.settings = { ...next };

    if (next.musicEnabled && !wasMusicOn) {
      this.startBackgroundMusic();
    } else if (!next.musicEnabled && wasMusicOn) {
      this.stopBackgroundMusic();
    }
  }

  public onCaptionChange(cb: (text: string | null) => void) {
    this.captionListener = cb;
  }

  private emitCaption(text: string, durationMs = 2600) {
    if (this.captionListener) {
      this.captionListener(text);
    }
    if (this.captionTimeout) {
      window.clearTimeout(this.captionTimeout);
    }
    this.captionTimeout = window.setTimeout(() => {
      this.captionListener?.(null);
    }, durationMs);
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private pickIndonesianVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    const idVoices = voices.filter(
      (v) => v.lang.toLowerCase().startsWith('id') || v.name.toLowerCase().includes('indonesia')
    );

    const femalePreferred = idVoices.find((v) =>
      /female|perempuan|gadis|damayanti|google bahasa indonesia|aris/i.test(v.name)
    );

    return femalePreferred ?? idVoices[0] ?? null;
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore speech cancellation errors
      }
    }
  }

  public speak(text: string, options?: { rate?: number; pitch?: number; queue?: boolean }) {
    if (!text.trim()) return;
    this.emitCaption(text, Math.max(2200, text.length * 75));

    if (!this.settings.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (!options?.queue) {
        window.speechSynthesis.cancel();
      }
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'id-ID';
      utter.volume = Math.min(1, Math.max(0, this.settings.volume));
      utter.rate = options?.rate ?? this.settings.voiceRate ?? 0.9;
      utter.pitch = options?.pitch ?? 1.15;

      const chosen = this.pickIndonesianVoice();
      if (chosen) {
        utter.voice = chosen;
      }

      window.speechSynthesis.speak(utter);
    } catch {
      // Safe fallback: caption already displayed
    }
  }

  public speakWordAndSpell(word: string) {
    const clean = word.trim().toUpperCase();
    const letters = clean.split('').join(', ');
    this.emitCaption(`${clean} ... ${clean.split('').join(' - ')}`, 3600);

    if (!this.settings.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const first = new SpeechSynthesisUtterance(clean);
      first.lang = 'id-ID';
      first.volume = this.settings.volume;
      first.rate = Math.max(0.75, this.settings.voiceRate - 0.05);
      first.pitch = 1.15;

      const spell = new SpeechSynthesisUtterance(letters);
      spell.lang = 'id-ID';
      spell.volume = this.settings.volume;
      spell.rate = 0.78;
      spell.pitch = 1.18;

      const chosen = this.pickIndonesianVoice();
      if (chosen) {
        first.voice = chosen;
        spell.voice = chosen;
      }

      window.speechSynthesis.speak(first);
      window.speechSynthesis.speak(spell);
    } catch {
      // Fallback handled by caption
    }
  }

  public speakSpellingOnly(word: string) {
    const clean = word.trim().toUpperCase();
    const letters = clean.split('').join(', ');
    this.speak(`Ayo dengarkan, ${letters}`, { rate: 0.76, pitch: 1.18 });
  }

  private playTone(
    freq: number,
    durationSec: number,
    type: OscillatorType = 'sine',
    gainLevel = 0.16,
    delaySec = 0,
    slideToFreq?: number
  ) {
    if (!this.settings.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideToFreq), now + durationSec);
    }

    const vol = Math.max(0.001, gainLevel * this.settings.volume);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.03);
  }

  public playTileTap() {
    this.playTone(540, 0.09, 'triangle', 0.12, 0, 680);
  }

  public playCorrectLetter() {
    this.playTone(523.25, 0.14, 'sine', 0.18, 0);
    this.playTone(659.25, 0.18, 'sine', 0.18, 0.08);
  }

  public playGentleTryAgain() {
    this.playTone(340, 0.16, 'triangle', 0.12, 0, 280);
    this.playTone(290, 0.18, 'triangle', 0.1, 0.12, 260);
  }

  public playCelebrationFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.24, 'triangle', 0.18, idx * 0.09);
    });
  }

  public playAnimalSound(profile: AnimalItem['soundProfile'], fallbackText: string) {
    this.emitCaption(fallbackText, 1800);
    if (this.settings.sfxEnabled) {
      switch (profile) {
        case 'rooster':
          this.playTone(620, 0.12, 'sawtooth', 0.09, 0, 780);
          this.playTone(760, 0.14, 'sawtooth', 0.09, 0.14, 650);
          this.playTone(880, 0.28, 'sawtooth', 0.09, 0.3, 520);
          break;
        case 'cat':
          this.playTone(520, 0.28, 'triangle', 0.14, 0, 740);
          this.playTone(740, 0.24, 'triangle', 0.12, 0.28, 480);
          break;
        case 'dog':
          this.playTone(220, 0.11, 'square', 0.08, 0, 320);
          this.playTone(240, 0.13, 'square', 0.08, 0.16, 300);
          break;
        case 'cow':
          this.playTone(150, 0.55, 'sawtooth', 0.09, 0, 130);
          break;
        case 'duck':
          this.playTone(430, 0.12, 'sawtooth', 0.09, 0, 360);
          this.playTone(440, 0.12, 'sawtooth', 0.09, 0.16, 350);
          break;
        case 'frog':
          this.playTone(180, 0.12, 'triangle', 0.15, 0, 290);
          this.playTone(190, 0.14, 'triangle', 0.15, 0.18, 310);
          break;
        case 'bird':
          this.playTone(1200, 0.09, 'sine', 0.11, 0, 1650);
          this.playTone(1400, 0.1, 'sine', 0.11, 0.12, 1850);
          break;
        case 'bee':
          this.playTone(260, 0.45, 'sawtooth', 0.06, 0, 290);
          break;
        case 'elephant':
          this.playTone(290, 0.35, 'sawtooth', 0.11, 0, 620);
          break;
        case 'lion':
        case 'tiger':
          this.playTone(160, 0.48, 'sawtooth', 0.1, 0, 95);
          break;
        default:
          this.playTone(440, 0.16, 'triangle', 0.12, 0, 560);
          break;
      }
    }
    window.setTimeout(() => {
      this.speak(fallbackText, { pitch: 1.2 });
    }, 360);
  }

  public startBackgroundMusic() {
    if (this.musicInterval !== null || typeof window === 'undefined') return;
    // Cheerful C-major pentatonic marimba loop
    const melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 587.33];
    this.musicInterval = window.setInterval(() => {
      if (!this.settings.musicEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const freq = melody[this.musicStep % melody.length];
      this.musicStep += 1;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const level = Math.max(0.001, 0.045 * this.settings.volume);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(level, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }, 460);
  }

  public stopBackgroundMusic() {
    if (this.musicInterval !== null) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audioEngine = new AudioEngine();
