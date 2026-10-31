"""Original deep house soundtrack + sound effects for the promo film, synthesised from scratch with numpy.

Happy, restless, lounge-y deep house at 112 BPM: soft round four-on-the-floor kick, swung 16th hats,
offbeat open hats, claps on 2 and 4, FM electric-piano chord stabs (Dm9 - G13 - Cmaj9 - Am9), a syncopated
sub bass pumped by the kick, a pluck hook with a dotted-8th echo, room reverb and light vinyl crackle.
Beat 0 lands on the first scene cut (3.6 s); Nano "thinks" over a two-beat breakdown and the end card
resolves on Cmaj9. Effects (whooshes, typing, taps, switches, pops, chimes) follow the timeline in index.html.

Usage: python3 store-listing/promo-video/music.py [out.wav]
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
LENGTH = 28.0
N = int(SR * LENGTH)
BPM = 112
BEAT = 60 / BPM
STEP = BEAT / 4
SWING = 0.22 * STEP  # late offbeat 16ths
DROP = 3.6           # time of beat 0
rng = np.random.default_rng(11)


def beat_t(k):
    return DROP + k * BEAT


def step_t(k, s):
    return beat_t(k) + s * STEP + (SWING if s % 2 else 0)


dry = np.zeros((2, N))
verb = np.zeros((2, N))  # reverb send
side = np.zeros(N)       # kick envelope for sidechain


def place(start, sig, gain=1.0, pan=0.0, send=0.0, key=False, duck=True):
    i = int(round(start * SR))
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i] * gain
    lg, rg = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    tgt = dry if duck else nodk
    tgt[0, i:i + len(sig)] += sig * lg
    tgt[1, i:i + len(sig)] += sig * rg
    if send:
        verb[0, i:i + len(sig)] += sig * lg * send
        verb[1, i:i + len(sig)] += sig * rg * send
    if key:
        side[i:i + len(sig)] += np.abs(sig)


nodk = np.zeros((2, N))  # elements that should not pump (kick, hats, fx)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def shaped_noise(dur, lo, hi):
    n = max(2, int(dur * SR))
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    out = np.fft.irfft(spec * ((f >= lo) & (f <= hi)), n)
    return out / (np.max(np.abs(out)) + 1e-9)


# ---------------------------------------------------------------- instruments
def epiano(freq, dur, bright=1.0):
    """FM electric piano: tine attack that mellows, slight tremolo."""
    t = t_axis(dur + 0.5)
    index = bright * (1.1 * np.exp(-t / 0.25) + 0.15)
    mod = index * np.sin(2 * np.pi * freq * t)
    s = np.sin(2 * np.pi * freq * t + mod)
    s += 0.18 * bright * np.sin(2 * np.pi * freq * 7.1 * t) * np.exp(-t / 0.02)  # tine click
    env = np.exp(-t / 1.6) * np.minimum(1, t / 0.004)
    env *= np.clip((dur + 0.5 - t) / 0.5, 0, 1) * np.where(t > dur, np.exp(-(t - dur) / 0.08), 1)
    return s * env * (1 + 0.08 * np.sin(2 * np.pi * 5.2 * t))


def pad(freq, dur):
    t = t_axis(dur)
    s = sum((1 / k ** 2) * np.sin(2 * np.pi * freq * k * t + k) for k in range(1, 5))
    s += 0.6 * np.sin(2 * np.pi * freq * 1.003 * t)
    return s * np.clip(np.minimum(t / 0.6, (dur - t) / 0.8), 0, 1)


def sub(freq, dur):
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t) + 0.22 * np.sin(2 * np.pi * 2 * freq * t) + 0.06 * np.sin(2 * np.pi * 3 * freq * t)
    env = np.minimum(1, t / 0.006) * np.clip((dur - t) / 0.03, 0, 1)
    return np.tanh(1.3 * s) * env


def kick():
    t = t_axis(0.5)
    f = 48 + 70 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.26) * np.minimum(1, t / 0.001)


def clap():
    t = t_axis(0.35)
    env = sum(np.exp(-np.maximum(0, t - o) / 0.01) * (t >= o) for o in (0, .009, .019)) * 0.45
    env += np.exp(-np.maximum(0, t - .025) / 0.1) * (t >= .025)
    return shaped_noise(0.35, 1000, 6000) * env


def hat(decay):
    t = t_axis(decay * 6)
    return shaped_noise(decay * 6, 7500, 17000) * np.exp(-t / decay)


def shaker():
    t = t_axis(0.09)
    return shaped_noise(0.09, 5000, 14000) * np.sin(np.pi * np.clip(t / 0.09, 0, 1)) ** 2


def rim():
    t = t_axis(0.08)
    return (0.6 * np.sin(2 * np.pi * 1700 * t) + shaped_noise(0.08, 2000, 8000) * 0.5) * np.exp(-t / 0.012)


def pluck(freq, dur=0.5):
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t + 0.8 * np.exp(-t / 0.05) * np.sin(2 * np.pi * 2 * freq * t))
    return s * np.exp(-t / 0.16) * np.minimum(1, t / 0.002)


def bell(freq, dur=1.4):
    t = t_axis(dur)
    s = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t / d) for r, a, d in [(1, 1, .6), (2.76, .3, .2), (5.4, .12, .08)])
    return s * np.minimum(1, t / 0.002)


def whoosh(dur, rise=True):
    t = t_axis(dur)
    k = t / dur
    lo, hi = shaped_noise(dur, 200, 1500), shaped_noise(dur, 1500, 8000)
    mix = k if rise else 1 - k
    return (lo * (1 - mix) + hi * mix) * np.sin(np.pi * np.clip(k, 0, 1)) ** 1.5


def blip(f0, f1, dur=0.09):
    t = t_axis(dur)
    f = f0 + (f1 - f0) * t / dur
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (dur / 3)) * np.minimum(1, t / 0.002)


def tick():
    t = t_axis(0.03)
    return shaped_noise(0.03, 3000, 11000) * np.exp(-t / 0.006)


# ---------------------------------------------------------------- arrangement (beat grid)
CHORDS = [  # (sub root, rootless EP voicing)
    (38, [53, 57, 60, 64]),  # Dm9
    (31, [53, 59, 64, 69]),  # G13
    (36, [52, 55, 59, 62]),  # Cmaj9
    (33, [55, 59, 60, 64]),  # Am9
]
CMAJ9 = (36, [52, 55, 59, 62, 67])
END_BEAT = 38                     # 23.96 s: end card
BREAK = (10, 12)                  # Nano thinks: 8.96 - 10.03 s
FIRST = -8                        # intro bar starts just before 0 s
EP_RHYTHM = [(0, 3), (3, 2), (6, 3), (10, 2), (12, 3)]       # (16th step, length in steps) per bar
BASS = [(0, 0, 3), (3, 0, 1), (6, 12, 1), (8, 0, 2), (11, 7, 1), (14, 10, 2)]  # (step, interval, len)
HOOK = [  # per bar of the 4-bar cycle: (16th step, midi)
    [(2, 76), (4, 74), (6, 72), (10, 74)],
    [(2, 74), (4, 71), (7, 67), (12, 69)],
    [(2, 76), (4, 79), (6, 76), (10, 74), (12, 72)],
    [(2, 72), (6, 69), (8, 67), (12, 69)],
]


def in_break(k):
    return BREAK[0] <= k < BREAK[1]


for k in range(FIRST, END_BEAT):
    bar, beat_in_bar = divmod(k, 4)
    root, voicing = CHORDS[bar % 4]
    intro = k < 0
    # drums
    if not intro and not in_break(k) and not (END_BEAT - 2 <= k < END_BEAT):
        place(beat_t(k), kick(), 0.6, key=True, duck=False)
    if not intro and not in_break(k):
        place(step_t(k, 2), hat(0.045), 0.11, pan=0.2, send=0.1, duck=False)  # offbeat open hat
        if beat_in_bar in (1, 3) and k >= 4:
            place(beat_t(k), clap(), 0.26, pan=-0.05, send=0.35, duck=False)
        if k >= 8 and beat_in_bar == 3:
            place(step_t(k, 3), rim(), 0.08, pan=-0.3, send=0.2, duck=False)
    for s in range(4):  # swung shaker / closed hats, accented
        vel = (0.05 if s % 2 else 0.035) * (0.55 if intro or in_break(k) else 1)
        place(step_t(k, s), shaker() if s % 2 else hat(0.012), vel, pan=0.35, duck=False)
    if beat_in_bar:
        continue
    # once per bar: EP stabs, pad, bass, hook
    t_bar = beat_t(k)
    bright = 0.35 + 0.65 * min(1, max(0, (t_bar + 0.6) / 4.2))  # intro "filter" opens up
    for step, length in EP_RHYTHM:
        for i, n in enumerate(voicing):
            place(step_t(k, step), epiano(midi(n), length * STEP * 0.9, bright), 0.07, pan=-0.25 + 0.17 * i, send=0.3)
    for n in voicing[:3]:
        place(t_bar, pad(midi(n - 12), 4 * BEAT + 0.4), 0.025, pan=0, send=0.2)
    if not intro:
        for step, interval, length in BASS:
            at = k + step / 4
            if in_break(int(at)) or at >= END_BEAT:
                continue
            place(step_t(k, step), sub(midi(root + interval), length * STEP * 0.92), 0.3)
    if k >= 16:  # hook from the speed scene on, with a dotted-8th echo
        for step, n in HOOK[bar % 4]:
            t = step_t(k, step)
            if t >= beat_t(END_BEAT) - 0.05:
                continue
            for e, g in enumerate((0.075, 0.035, 0.016)):
                place(t + e * 3 * STEP, pluck(midi(n)), g, pan=(0.25, -0.35, 0.35)[e], send=0.35)

# end card: resolve on Cmaj9 and ride the groove out
t_end = beat_t(END_BEAT)
place(t_end - 2 * BEAT, whoosh(2 * BEAT, True), 0.12, duck=False)
root, voicing = CMAJ9
for i, n in enumerate(voicing):
    place(t_end, epiano(midi(n), 2.2), 0.08, pan=-0.3 + 0.15 * i, send=0.45)
    place(t_end, pad(midi(n - 12), 4.0), 0.03, send=0.3)
place(t_end, sub(midi(root), 1.5), 0.32)
for i, n in enumerate([72, 76, 79, 83]):
    place(t_end + 0.55 + i * STEP * 2, bell(midi(n)), 0.04, pan=-0.2 + 0.13 * i, send=0.5, duck=False)
for k in range(END_BEAT, END_BEAT + 8):
    if beat_t(k) >= LENGTH:
        break
    place(beat_t(k), kick(), 0.55, key=True, duck=False)
    place(step_t(k, 2), hat(0.045), 0.1, pan=0.2, send=0.1, duck=False)
    for s in range(4):
        place(step_t(k, s), shaker() if s % 2 else hat(0.012), 0.04 if s % 2 else 0.03, pan=0.35, duck=False)

# intro riser + vinyl crackle bed
place(DROP - 1.4, whoosh(1.4, True), 0.12, duck=False)
crackle = np.zeros(N)
pops = rng.random(N) < 18 / SR
crackle[pops] = rng.standard_normal(pops.sum()) * 0.5
crackle = np.convolve(crackle, np.exp(-np.arange(40) / 6), mode='same') + 0.004 * shaped_noise(LENGTH, 2000, 9000)
nodk += 0.05 * crackle

# ---------------------------------------------------------------- sound effects (follow index.html)
for t in (5.45, 12.3, 15.65, 19.85, 23.65):
    place(t, whoosh(0.9, True), 0.11, duck=False)
place(3.1, whoosh(0.6, True), 0.09, duck=False)
for t, pitch in ((4.2, 900), (4.5, 900), (4.8, 1200)):
    place(t, blip(pitch, pitch * 0.8, 0.05), 0.09, duck=False)
    place(t + 0.03, tick(), 0.09, duck=False)
query = 'Write a haiku about coffee on a rainy Monday'
for i in range(len(query)):
    place(6.3 + i * (1.7 / len(query)), tick(), 0.035 + 0.025 * rng.random(), pan=0.1 * rng.standard_normal(), duck=False)
place(8.5, blip(500, 950, 0.12), 0.15, duck=False)
for i in range(4):
    place(6.6 + i * 0.08, blip(700 + 120 * i, 1100 + 120 * i, 0.06), 0.045, duck=False)
    place(11.6 + i * 0.09, blip(800 + 100 * i, 1300 + 100 * i, 0.06), 0.045, duck=False)
for i, n in enumerate([84, 88, 91]):
    place(10.05 + i * 0.07, bell(midi(n), 1.0), 0.03, send=0.4, duck=False)
for i in range(6):
    place(17.9 + i * 0.32, blip(1200, 600, 0.07), 0.035, pan=-0.1, duck=False)
    place(20.75 + i * 0.09, blip(600 + 80 * i, 1000 + 80 * i, 0.06), 0.035, duck=False)
place(25.45, blip(400, 800, 0.15), 0.09, duck=False)

# ---------------------------------------------------------------- mix
def fft_convolve(x, ir):
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x)]


ir_t = t_axis(1.8)
for ch in (0, 1):  # decorrelated room reverb per channel
    ir = shaped_noise(1.8, 250, 7000) * np.exp(-ir_t / 0.38)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    ir /= np.sqrt(np.sum(ir ** 2))
    dry[ch] += 0.55 * fft_convolve(verb[ch], ir)

env = np.convolve(side, np.ones(int(0.015 * SR)) / (0.015 * SR), mode='same')
env = np.clip(env / (np.percentile(env[env > 0], 99) + 1e-9), 0, 1)
release = np.exp(-np.arange(int(0.3 * SR)) / (0.09 * SR))
env = np.clip(np.convolve(env, release / release.max(), mode='full')[:N], 0, 1)
mix = dry * (1 - 0.45 * env) + nodk
fade = np.ones(N)
fi = int(26.2 * SR)
fade[fi:] = np.linspace(1, 0, N - fi) ** 1.6
fade[: int(0.08 * SR)] = np.linspace(0, 1, int(0.08 * SR))
mix *= fade
mix -= mix.mean(axis=1, keepdims=True)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.15) / np.tanh(1.15)
mix *= 0.89 / np.max(np.abs(mix))  # peak at -1 dBFS

out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / 'out' / 'soundtrack.wav'
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype('<i2').tobytes())
print(out)
