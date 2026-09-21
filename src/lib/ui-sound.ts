// Web Audio API Tactile Sound Synthesizer for Thịnh Vượng Legal
// Supports crisp desktop clicks and zero-latency mobile touch screen taps

class UiSoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private lastPlayTime: number = 0;
  private listeners: Set<(enabled: boolean) => void> = new Set();
  private initializedGlobal: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('tv-ui-sound-enabled');
        this.enabled = stored !== 'false';
      } catch {
        this.enabled = true;
      }
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          return null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Play crisp, warm tactile click sound (desktop mouse click & mobile touch tap)
   */
  playClick(pitch = 1150, volume = 0.055) {
    if (!this.enabled) return;
    const nowMs = performance.now();
    // Throttle double triggers (e.g. pointerdown + click on some mobile browsers)
    if (nowMs - this.lastPlayTime < 32) return;
    this.lastPlayTime = nowMs;

    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Warm subtle bandpass filter to remove harsh digital edges
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1450, now);
      filter.Q.setValueAtTime(1.6, now);

      // Tactile pitch drop: start around 1150Hz and drop to 180Hz over 30ms
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);

      // Volume envelope: instant tactile attack, exponential fade
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Audio synthesis safety fallback
    }
  }

  /**
   * Play smooth expansion chime when opening legal provisions
   */
  playExpand() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.055);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Play subtle typewriter tick during AI streaming text (ultra light)
   */
  playStreamingTick() {
    if (!this.enabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastPlayTime < 50) return;
    this.lastPlayTime = nowMs;

    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.016);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.018);
    } catch {
      // Safe fallback
    }
  }

  toggleSound(): boolean {
    this.enabled = !this.enabled;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tv-ui-sound-enabled', String(this.enabled));
      }
    } catch {
      // Ignore localStorage errors
    }
    this.listeners.forEach((cb) => cb(this.enabled));
    return this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  subscribe(cb: (enabled: boolean) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  initGlobalListeners() {
    if (this.initializedGlobal || typeof window === 'undefined') return;
    this.initializedGlobal = true;

    // Listen on pointerdown (captures instant mouse clicks & instant touch taps on mobile)
    const handlePointerDown = (e: PointerEvent) => {
      // Wake up audio context on user gesture
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, summary, [role="button"], input[type="button"], input[type="submit"], input[type="radio"], input[type="checkbox"], select, .clickable, .tvpay-provision-item, .tvpay-chapter-header, .tvpay-mode-tab',
      );

      if (interactive) {
        this.playClick();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, {
      passive: true,
      capture: true,
    });
  }
}

export const uiSound = new UiSoundManager();
