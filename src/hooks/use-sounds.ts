import { useCallback, useRef } from "react";

type SoundType =
  | "click"
  | "hover"
  | "success"
  | "error"
  | "typewrite"
  | "powerup"
  | "notification"
  | "glitch";

/**
 * Hook that provides Web Audio API sound effects.
 * No audio files needed — generates retro terminal sounds programmatically.
 */
export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      try {
        const ctx = getCtx();
        const now = ctx.currentTime;

        switch (type) {
          case "click": {
            // Short blip — terminal keystroke feel
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
            break;
          }
          case "hover": {
            // Very subtle tick
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(1200, now);
            gain2.gain.setValueAtTime(0.02, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc2.connect(gain2).connect(ctx.destination);
            osc2.start(now);
            osc2.stop(now + 0.03);
            break;
          }
          case "success": {
            // Ascending chime
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.type = "sine";
            osc3.frequency.setValueAtTime(523, now);
            osc3.frequency.setValueAtTime(659, now + 0.1);
            osc3.frequency.setValueAtTime(784, now + 0.2);
            gain3.gain.setValueAtTime(0.1, now);
            gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc3.connect(gain3).connect(ctx.destination);
            osc3.start(now);
            osc3.stop(now + 0.4);
            break;
          }
          case "error": {
            // Descending buzz
            const osc4 = ctx.createOscillator();
            const gain4 = ctx.createGain();
            osc4.type = "sawtooth";
            osc4.frequency.setValueAtTime(300, now);
            osc4.frequency.exponentialRampToValueAtTime(100, now + 0.25);
            gain4.gain.setValueAtTime(0.06, now);
            gain4.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc4.connect(gain4).connect(ctx.destination);
            osc4.start(now);
            osc4.stop(now + 0.25);
            break;
          }
          case "typewrite": {
            // Tiny click — like a key being pressed
            const osc5 = ctx.createOscillator();
            const gain5 = ctx.createGain();
            osc5.type = "square";
            const freq = 500 + Math.random() * 400;
            osc5.frequency.setValueAtTime(freq, now);
            osc5.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 0.03);
            gain5.gain.setValueAtTime(0.03, now);
            gain5.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc5.connect(gain5).connect(ctx.destination);
            osc5.start(now);
            osc5.stop(now + 0.04);
            break;
          }
          case "powerup": {
            // Rising sweep
            const osc6 = ctx.createOscillator();
            const gain6 = ctx.createGain();
            osc6.type = "sine";
            osc6.frequency.setValueAtTime(200, now);
            osc6.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
            gain6.gain.setValueAtTime(0.08, now);
            gain6.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc6.connect(gain6).connect(ctx.destination);
            osc6.start(now);
            osc6.stop(now + 0.35);
            break;
          }
          case "notification": {
            // Double beep
            [0, 0.15].forEach((offset) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.type = "sine";
              o.frequency.setValueAtTime(880, now + offset);
              g.gain.setValueAtTime(0.06, now + offset);
              g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
              o.connect(g).connect(ctx.destination);
              o.start(now + offset);
              o.stop(now + offset + 0.1);
            });
            break;
          }
          case "glitch": {
            // Short noise burst
            const bufferSize = ctx.sampleRate * 0.08;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gain7 = ctx.createGain();
            gain7.gain.setValueAtTime(0.04, now);
            gain7.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            source.connect(gain7).connect(ctx.destination);
            source.start(now);
            break;
          }
        }
      } catch {
        // Audio not available — silently ignore
      }
    },
    [getCtx]
  );

  return { play };
}
