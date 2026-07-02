/**
 * Synthesizes the Guter GeDANKE notification sound: a soft, warm
 * music-box arpeggio (G5 → E5 → C5), like a small kalimba.
 *
 * Output: assets/sounds/gedanke.wav (44.1 kHz, 16-bit mono, ~2.2 s)
 * Run: node scripts/generate-sound.js
 */
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const DURATION = 2.2;
const N = Math.floor(SAMPLE_RATE * DURATION);

/** One plucked note: sine + soft harmonics with an exponential decay. */
function pluck(t, freq, start, amp) {
  const dt = t - start;
  if (dt < 0) return 0;
  const attack = Math.min(dt / 0.006, 1);
  const decay = Math.exp(-dt / 0.38);
  const tone =
    Math.sin(2 * Math.PI * freq * dt) +
    0.35 * Math.sin(2 * Math.PI * freq * 2 * dt) * Math.exp(-dt / 0.18) +
    0.12 * Math.sin(2 * Math.PI * freq * 3 * dt) * Math.exp(-dt / 0.1);
  return amp * attack * decay * tone;
}

const NOTES = [
  { freq: 783.99, start: 0.0, amp: 0.3 }, // G5
  { freq: 659.25, start: 0.22, amp: 0.3 }, // E5
  { freq: 523.25, start: 0.44, amp: 0.34 }, // C5
];

const samples = new Int16Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SAMPLE_RATE;
  let v = 0;
  for (const n of NOTES) v += pluck(t, n.freq, n.start, n.amp);
  // Gentle master fade-out over the last 0.4 s.
  const fade = Math.min((DURATION - t) / 0.4, 1);
  samples[i] = Math.max(-1, Math.min(1, v * fade)) * 0.82 * 32767;
}

// Minimal 16-bit PCM WAV container.
const data = Buffer.from(samples.buffer);
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16); // PCM chunk size
header.writeUInt16LE(1, 20); // PCM format
header.writeUInt16LE(1, 22); // mono
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
header.writeUInt16LE(2, 32); // block align
header.writeUInt16LE(16, 34); // bits per sample
header.write('data', 36);
header.writeUInt32LE(data.length, 40);

const out = path.join(__dirname, '..', 'assets', 'sounds', 'gedanke.wav');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.concat([header, data]));
console.log(`✓ assets/sounds/gedanke.wav (${DURATION}s, ${(header.length + data.length) / 1024 | 0} KB)`);
