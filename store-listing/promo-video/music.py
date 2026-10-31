"""Original soundtrack + sound effects for the promo film, synthesised from scratch with numpy.

120 BPM in C major, beat grid offset 0.1 s so the downbeats land on the film's scene cuts
(3.6, 12.6, 16.1, 20.1, 24.1). Chords cycle IV-V-iii-vi (F, G, Em, Am) and resolve to Cmaj9 on the
end card. Effects (whooshes, typing, taps, switches, pops, chimes) follow the timeline in index.html.

Usage: python3 store-listing/promo-video/music.py [out.wav]
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
LENGTH = 28.0
N = int(SR * LENGTH)
BEAT = 0.5
T0 = 0.1  # grid offset
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)
duck_src = np.zeros(N)  # kick envelope used for sidechain ducking


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(buf, start, sig, gain=1.0, pan=0.0, side=None):
    """Mix a mono signal into the stereo bus at `start` seconds."""
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    lg, rg = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    buf[0][i:i + len(sig)] += sig * lg
    buf[1][i:i + len(sig)] += sig * rg
    if side is not None:
        side[i:i + len(sig)] += np.abs(sig)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def shaped_noise(dur, lo, hi, tilt=0.0):
    """Band-limited noise made in the frequency domain (no IIR filters needed)."""
    n = int(dur * SR)
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    mask = ((f >= lo) & (f <= hi)).astype(float)
    if tilt:
        mask *= (np.maximum(f, 1) / 1000.0) ** tilt
    out = np.fft.irfft(spec * mask, n)
    return out / (np.max(np.abs(out)) + 1e-9)


# ---------------------------------------------------------------- instruments
def pluck(freq, dur=0.45):
    t = t_axis(dur)
    s = (np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.14)
         + 0.35 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t / 0.06)
         + 0.12 * np.sin(2 * np.pi * 4.02 * freq * t) * np.exp(-t / 0.025))
    return s * np.minimum(1, t / 0.003)


def bell(freq, dur=1.6):
    t = t_axis(dur)
    s = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t / d)
            for r, a, d in [(1, 1, .7), (2.76, .35, .25), (5.4, .18, .1), (8.93, .08, .05)])
    return s * np.minimum(1, t / 0.002)


def pad_note(freq, dur, detune=0.0):
    t = t_axis(dur)
    f = freq * (1 + detune)
    s = sum((1 / k ** 1.6) * np.sin(2 * np.pi * f * k * t + k) for k in range(1, 7))
    s += 0.5 * np.sin(2 * np.pi * f * 1.004 * t)
    env = np.minimum(1, t / 0.5) * np.minimum(1, (dur - t) / 0.7)
    return s * np.clip(env, 0, 1) * (0.9 + 0.1 * np.sin(2 * np.pi * 0.3 * t))


def bass(freq, dur=0.45):
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * 2 * freq * t)
    s = np.tanh(1.6 * s) * np.exp(-t / 0.35) * np.minimum(1, t / 0.004)
    return s


def kick():
    t = t_axis(0.45)
    f = 46 + 110 * np.exp(-t / 0.035)
    phase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(phase) * np.exp(-t / 0.22) + 0.25 * shaped_noise(0.45, 1500, 6000) * np.exp(-t / 0.004)


def clap():
    t = t_axis(0.3)
    n = shaped_noise(0.3, 900, 5000)
    env = sum(np.exp(-np.maximum(0, t - o) / 0.012) * (t >= o) for o in (0, .011, .022)) * 0.5
    env += np.exp(-t / 0.09) * (t >= .03)
    return n * env


def hat(open_=False):
    t = t_axis(0.25)
    return shaped_noise(0.25, 7000, 16000) * np.exp(-t / (0.08 if open_ else 0.025))


def whoosh(dur=0.8, rise=True):
    t = t_axis(dur)
    k = t / dur
    lo, hi = shaped_noise(dur, 200, 1500), shaped_noise(dur, 1500, 9000)
    mix = k if rise else 1 - k
    env = np.sin(np.pi * np.clip(k, 0, 1)) ** 1.5
    return (lo * (1 - mix) + hi * mix) * env


def blip(f0, f1, dur=0.09):
    t = t_axis(dur)
    f = f0 + (f1 - f0) * t / dur
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (dur / 3)) * np.minimum(1, t / 0.002)


def tick():
    t = t_axis(0.03)
    return shaped_noise(0.03, 3000, 12000) * np.exp(-t / 0.006) + 0.3 * np.sin(2 * np.pi * 2400 * t) * np.exp(-t / 0.004)


# ---------------------------------------------------------------- arrangement
CHORDS = {  # (bass root, chord tones)
    'F': (41, [53, 57, 60, 64]), 'G': (43, [55, 59, 62, 64]),
    'Em': (40, [52, 55, 59, 62]), 'Am': (45, [57, 60, 64, 67]),
    'C': (36, [48, 52, 55, 59, 62]),
}
PROG = ['F', 'G', 'Em', 'Am']
END = 24.1
bus = (L, R)


def bar_chord(b):
    return PROG[b % 4]


def drums_on(t):
    return 3.6 <= t < END and not (8.6 <= t < 10.1)


ARP = [0, 2, 4, 1, 3, 2, 4, 3]
LEAD = {  # bar index within the 4-bar cycle -> (16th step, midi)
    0: [(0, 81), (4, 84), (6, 79), (10, 76)],
    1: [(0, 79), (4, 83), (6, 86), (12, 84)],
    2: [(0, 83), (4, 79), (6, 76), (10, 79)],
    3: [(0, 76), (4, 79), (6, 81), (12, 84)],
}

bars = int((END - T0) / 2)
for b in range(bars):
    start = T0 + b * 2.0
    name = bar_chord(b)
    root, tones = CHORDS[name]
    # pad, slightly wider in stereo
    for i, n in enumerate(tones):
        place(bus, start, pad_note(midi(n), 2.3, detune=0.002), 0.045, pan=-0.35)
        place(bus, start, pad_note(midi(n), 2.3, detune=-0.002), 0.045, pan=0.35)
    # arpeggio in 16ths (filtered down in the intro by lowering level)
    arp_tones = [n + 12 for n in tones[:4]] + [tones[0] + 24]
    for s in range(16):
        t = start + s * BEAT / 4
        if t >= END:
            break
        lvl = 0.05 if t < 3.6 else (0.07 if 8.6 <= t < 10.1 else 0.085)
        place(bus, t, pluck(midi(arp_tones[ARP[s % 8]])), lvl, pan=(-0.45 if s % 2 else 0.45))
    if start >= 3.6 - 1e-6:
        # bass: root on 1, the "and" of 2, and 3
        for off in (0, 0.75, 1.0, 1.5):
            place(bus, start + off, bass(midi(root)), 0.22 if off in (0, 1.0) else 0.14)
    for beat in range(4):
        t = start + beat * BEAT
        if drums_on(t):
            place(bus, t, kick(), 0.55, side=duck_src)
            place(bus, t + BEAT / 2, hat(open_=beat == 3), 0.06, pan=0.25)
            if t >= 12.6 and beat in (1, 3):
                place(bus, t, clap(), 0.16, pan=-0.1)
        if 3.6 <= t < END and not drums_on(t):
            place(bus, t + BEAT / 2, hat(), 0.03, pan=0.25)  # keep a pulse while Nano thinks
    # lead bell motif from the speed scene on
    if 12.5 <= start < END - 0.1:
        for step, n in LEAD[b % 4]:
            place(bus, start + step * BEAT / 4, bell(midi(n)), 0.06, pan=0.15)

# snare-roll build into the end card
for i in range(16):
    t = END - 1.0 + i * (1.0 / 16)
    place(bus, t, clap(), 0.03 + 0.1 * i / 16, pan=-0.1)
place(bus, END - 2.0, whoosh(2.0, True), 0.13)

# end: resolve to Cmaj9 with a final hit
root, tones = CHORDS['C']
place(bus, END, kick(), 0.6, side=duck_src)
place(bus, END, bass(midi(root), 1.6), 0.25)
for n in tones:
    place(bus, END, pad_note(midi(n), 3.9), 0.06, pan=-0.3)
    place(bus, END, pad_note(midi(n + 12), 3.9, 0.002), 0.035, pan=0.3)
for i, n in enumerate([72, 76, 79, 83, 86]):
    place(bus, END + 0.6 + i * 0.12, bell(midi(n), 2.0), 0.05, pan=(-0.3 + 0.15 * i))

# intro riser into the first drop
place(bus, 2.2, whoosh(1.4, True), 0.12)

# ---------------------------------------------------------------- sound effects (follow index.html)
for t in (5.45, 12.3, 15.65, 19.85, 23.65):  # shape wipes
    place(bus, t, whoosh(0.9, True), 0.16)
place(bus, 3.1, whoosh(0.7, True), 0.14)  # hero shape fills the screen
for t, pitch in ((4.2, 900), (4.5, 900), (4.8, 1200)):  # switches
    place(bus, t, blip(pitch, pitch * 0.8, 0.05), 0.12)
    place(bus, t + 0.03, tick(), 0.12)
query = 'Write a haiku about coffee on a rainy Monday'
for i in range(len(query)):  # typing
    t = 6.3 + i * (1.7 / len(query))
    place(bus, t, tick(), 0.05 + 0.03 * rng.random(), pan=0.1 * rng.standard_normal())
place(bus, 8.5, blip(500, 950, 0.12), 0.2)  # tap on send
for i in range(4):
    place(bus, 6.6 + i * 0.08, blip(700 + 120 * i, 1100 + 120 * i, 0.06), 0.06)  # chips pop in
for i in range(4):
    place(bus, 11.6 + i * 0.09, blip(800 + 100 * i, 1300 + 100 * i, 0.06), 0.06)  # stat chips
for i, n in enumerate([84, 88, 91]):  # answer card opens
    place(bus, 10.05 + i * 0.07, bell(midi(n), 1.2), 0.035)
for i in range(6):  # privacy packets absorbed by the lock
    place(bus, 17.9 + i * 0.32, blip(1200, 600, 0.07), 0.05, pan=-0.1)
for i in range(6):  # feature cards
    place(bus, 20.75 + i * 0.09, blip(600 + 80 * i, 1000 + 80 * i, 0.06), 0.05)
place(bus, 25.45, blip(400, 800, 0.15), 0.12)  # FAB

# ---------------------------------------------------------------- mix
env = np.convolve(duck_src, np.ones(int(0.02 * SR)) / (0.02 * SR), mode='same')
env = np.clip(env / (env.max() + 1e-9), 0, 1)
release = np.exp(-np.arange(int(0.18 * SR)) / (0.06 * SR))
env = np.convolve(env, release / release.sum() * 6, mode='full')[:N]
duck = 1 - 0.3 * np.clip(env, 0, 1)
mix = np.stack([L, R]) * duck
fade = np.ones(N)
fi = int(26.4 * SR)
fade[fi:] = np.linspace(1, 0, N - fi) ** 1.5
fade[: int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
mix *= fade
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / np.max(np.abs(mix))  # peak at -1 dBFS

out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / 'out' / 'soundtrack.wav'
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype('<i2').tobytes())
print(out)
