// Web Audio API Sound Synthesizer for Horological Actions
class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Jumping Hour Mechanical Spring Release Click
  public playJumpHour() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      // Heavy mechanical spring snap + gear latch
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      const filter1 = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(480, t);
      osc1.frequency.exponentialRampToValueAtTime(60, t + 0.08);

      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(1200, t);

      gain1.gain.setValueAtTime(0, t);
      gain1.gain.linearRampToValueAtTime(0.3 * this.volume, t + 0.002);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.1);

      // High metallic latch click
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2800, t + 0.005);
      osc2.frequency.exponentialRampToValueAtTime(1400, t + 0.035);

      gain2.gain.setValueAtTime(0, t + 0.005);
      gain2.gain.linearRampToValueAtTime(0.18 * this.volume, t + 0.007);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.005);
      osc2.stop(t + 0.045);
    } catch {}
  }

  // Subtle Swiss Lever Escapement Tick
  public playTick(isTock = false) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isTock ? 3400 : 3800, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.012);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isTock ? 3200 : 3600, t);
      filter.Q.setValueAtTime(8, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.06 * this.volume, t + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.02);
    } catch {}
  }
}

export const audio = new AudioEngine();
