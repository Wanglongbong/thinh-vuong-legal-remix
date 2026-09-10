import { useCallback, useEffect, useRef, useState } from 'react';
import { LoaderCircle, Music2, Volume2, VolumeX } from 'lucide-react';
import { safeStorage } from '@/lib/storage';

const MUSIC_PREFERENCE_KEY = 'tv-background-music-enabled';
const TARGET_VOLUME = 0.1;
const FADE_IN_MS = 2500;
const FADE_OUT_MS = 1500;
const LOOP_FADE_SECONDS = 3;

type PlaybackState = 'loading' | 'playing' | 'blocked' | 'paused';

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const enabledRef = useRef(safeStorage.getItem(MUSIC_PREFERENCE_KEY) !== 'false');
  const loopTransitionRef = useRef(false);
  const pausedForHiddenTabRef = useRef(false);
  const [enabled, setEnabled] = useState(enabledRef.current);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    enabledRef.current ? 'loading' : 'paused',
  );

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (target: number, duration: number, onComplete?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      cancelFade();
      const startedAt = performance.now();
      const initialVolume = audio.volume;

      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = progress * (2 - progress);
        audio.volume = Math.max(
          0,
          Math.min(1, initialVolume + (target - initialVolume) * eased),
        );

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(step);
        } else {
          fadeFrameRef.current = null;
          onComplete?.();
        }
      };

      fadeFrameRef.current = window.requestAnimationFrame(step);
    },
    [cancelFade],
  );

  const startWithFade = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !enabledRef.current || document.visibilityState === 'hidden') {
      return false;
    }

    cancelFade();
    audio.volume = 0;

    try {
      await audio.play();
      setPlaybackState('playing');
      fadeTo(TARGET_VOLUME, FADE_IN_MS);
      return true;
    } catch {
      setPlaybackState('blocked');
      return false;
    }
  }, [cancelFade, fadeTo]);

  const stopWithFade = useCallback(
    (duration = FADE_OUT_MS) => {
      const audio = audioRef.current;
      if (!audio) return;

      loopTransitionRef.current = false;
      if (audio.paused) {
        audio.volume = 0;
        setPlaybackState('paused');
        return;
      }

      fadeTo(0, duration, () => {
        audio.pause();
        setPlaybackState('paused');
      });
    },
    [fadeTo],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !enabledRef.current) return;

    let fallbackActive = true;

    const removeFallbackListeners = () => {
      document.removeEventListener('pointerdown', resumeAfterInteraction);
      document.removeEventListener('keydown', resumeAfterInteraction);
      document.removeEventListener('touchstart', resumeAfterInteraction);
    };

    const resumeAfterInteraction = () => {
      if (!fallbackActive || !enabledRef.current) return;
      void startWithFade().then((started) => {
        if (started) {
          fallbackActive = false;
          removeFallbackListeners();
        }
      });
    };

    document.addEventListener('pointerdown', resumeAfterInteraction, { passive: true });
    document.addEventListener('keydown', resumeAfterInteraction);
    document.addEventListener('touchstart', resumeAfterInteraction, { passive: true });

    void startWithFade().then((started) => {
      if (started) {
        fallbackActive = false;
        removeFallbackListeners();
      }
    });

    return () => {
      fallbackActive = false;
      removeFallbackListeners();
    };
  }, [startWithFade]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (
        !enabledRef.current ||
        loopTransitionRef.current ||
        !Number.isFinite(audio.duration) ||
        audio.duration - audio.currentTime > LOOP_FADE_SECONDS
      ) {
        return;
      }

      loopTransitionRef.current = true;
      fadeTo(0, 2200, () => {
        if (!enabledRef.current) {
          loopTransitionRef.current = false;
          return;
        }
        audio.currentTime = 0;
        audio.volume = 0;
        void audio.play().then(() => {
          setPlaybackState('playing');
          fadeTo(TARGET_VOLUME, 1800, () => {
            loopTransitionRef.current = false;
          });
        }).catch(() => {
          loopTransitionRef.current = false;
          setPlaybackState('blocked');
        });
      });
    };

    const handleEnded = () => {
      if (!enabledRef.current) return;
      loopTransitionRef.current = false;
      audio.currentTime = 0;
      void startWithFade();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [fadeTo, startWithFade]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio || !enabledRef.current) return;

      if (document.visibilityState === 'hidden' && !audio.paused) {
        pausedForHiddenTabRef.current = true;
        fadeTo(0, 350, () => audio.pause());
      } else if (document.visibilityState === 'visible' && pausedForHiddenTabRef.current) {
        pausedForHiddenTabRef.current = false;
        void startWithFade();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fadeTo, startWithFade]);

  useEffect(() => cancelFade, [cancelFade]);

  const togglePlayback = () => {
    if (enabledRef.current && playbackState === 'blocked') {
      setPlaybackState('loading');
      void startWithFade();
      return;
    }

    if (enabledRef.current) {
      enabledRef.current = false;
      loopTransitionRef.current = false;
      setEnabled(false);
      safeStorage.setItem(MUSIC_PREFERENCE_KEY, 'false');
      stopWithFade();
      return;
    }

    enabledRef.current = true;
    loopTransitionRef.current = false;
    setEnabled(true);
    safeStorage.setItem(MUSIC_PREFERENCE_KEY, 'true');
    setPlaybackState('loading');
    void startWithFade();
  };

  const isPlaying = enabled && playbackState === 'playing';
  const statusText = isPlaying
    ? 'Đang phát · 10%'
    : playbackState === 'blocked'
      ? 'Chạm để phát'
      : enabled
        ? 'Đang chuẩn bị'
        : 'Đã tắt';
  const buttonLabel = isPlaying
    ? 'Tắt nhạc nền Golden Embers'
    : 'Bật nhạc nền Golden Embers';

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/golden-embers.mp3"
        preload="auto"
        aria-hidden="true"
      />
      <button
        type="button"
        className={`background-music-control ${isPlaying ? 'is-playing' : ''}`}
        onClick={togglePlayback}
        aria-label={buttonLabel}
        aria-pressed={isPlaying}
        title={buttonLabel}
      >
        <span className="music-control-icon" aria-hidden="true">
          {playbackState === 'loading' && enabled ? (
            <LoaderCircle className="music-loading-icon" />
          ) : isPlaying ? (
            <Volume2 />
          ) : enabled ? (
            <Music2 />
          ) : (
            <VolumeX />
          )}
        </span>
        <span className="music-control-copy">
          <strong>Golden Embers</strong>
          <small>{statusText}</small>
        </span>
        <span className="music-equalizer" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
    </>
  );
}
