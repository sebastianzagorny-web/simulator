// Procedural Web Audio API sound synthesizer for statecraft simulation

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft UI click
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context might fail on un-interacted screens
    }
  }

  // Executive decree stamp / gavel thud
  public playStamp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.16);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(t + 0.18);
    } catch {
      // ignore
    }
  }

  // Gold coins / treasury revenue sound
  public playCoins() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [1200, 1600, 2100].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        gain.gain.setValueAtTime(0.06, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.1);
      });
    } catch {
      // ignore
    }
  }

  // War drums / military alert
  public playWarDrum() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(t + 0.35);
    } catch {
      // ignore
    }
  }

  // Crisis Alert siren
  public playCrisis() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.linearRampToValueAtTime(660, t + 0.15);
      osc.frequency.linearRampToValueAtTime(440, t + 0.3);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(t + 0.32);
    } catch {
      // ignore
    }
  }

  // Diplomatic Triumph / fanfare
  public playTriumph() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);
        gain.gain.setValueAtTime(0.1, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  // Aliases for compatibility
  public playCoin() {
    this.playCoins();
  }

  public playHammer() {
    this.playStamp();
  }

  public playMarch() {
    this.playWarDrum();
  }

  public playPin() {
    this.playClick();
  }
}

export const sound = new SoundEngine();
