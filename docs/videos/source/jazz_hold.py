# Soft jazz trio for the Tenang AI before/after film (74 s, 120 BPM swing, D major).
# Electric piano comping on Dmaj9 - Bm9 - Em9 - A13, walking upright bass, brushes and ride, vibraphone on each scene change.
import wave
import json as _j
_H = sorted(_j.load(open("holds.json"))["film"])
def RT(t):  # scene time -> output time on the timeline with reading pauses
    return t + sum(d for h, d in _H if h < t)
import numpy as np

SR = 44100
DUR = RT(74.0)
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)
BEAT = 0.5
BAR = 2.0
SWING = 2 / 3            # the off-beat eighth lands two thirds into the beat
OUTRO = 2.0 * round(RT(64.0) / 2.0)             # from here: a held Dmaj9 and the vibraphone
DRUMS = [(RT(3), RT(29)), (RT(34), RT(60))]          # full trio; lighter under Nesya, the mission and the outro
SCENES = [RT(x) for x in [3, 8, 13, 17, 21, 25, 29, 34, 39, 44, 50, 54, 60, 65, 69]]
rng = np.random.default_rng(11)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


# rootless voicings (left hand of a jazz pianist) and the roots for the bass
PROG = [
    (50, [54, 57, 61, 64]),   # Dmaj9: F# A C# E
    (47, [50, 54, 57, 61]),   # Bm9:  D F# A C#
    (52, [55, 59, 62, 66]),   # Em9:  G B D F#
    (45, [55, 59, 61, 66]),   # A13:  G B C# F#
]


def chord(b):
    return PROG[0] if b * BAR >= OUTRO else PROG[b % 4]


def drums_on(t):
    return any(a <= t < b for a, b in DRUMS)


def rhodes(f, d, vel=1.0):
    tt = np.arange(int(d * SR)) / SR
    mod = 1.2 * np.exp(-tt / 0.25) * np.sin(2 * np.pi * f * tt)            # bell-like attack (FM)
    s = np.sin(2 * np.pi * f * tt + mod) + 0.18 * np.sin(4 * np.pi * f * tt)
    env = np.minimum(1, tt / 0.006) * np.exp(-tt / 1.1) * np.minimum(1, (d - tt) / 0.08)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.5 * tt)
    return s * env * trem * vel


def bass(f, d):
    tt = np.arange(int(d * SR)) / SR
    s = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / 0.12) + 0.1 * np.sin(6 * np.pi * f * tt) * np.exp(-tt / 0.06)
    env = np.minimum(1, tt / 0.008) * np.exp(-tt / 0.55) * np.minimum(1, (d - tt) / 0.03)
    return s * env


def ride(d=0.9, vel=1.0):
    tt = np.arange(int(d * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * tt) * a for f, a in ((3150, 1), (4720, .7), (5340, .6), (6810, .5), (8230, .35)))
    nz = np.diff(rng.standard_normal(len(tt) + 1))
    return (0.6 * s + 0.5 * nz) * np.exp(-tt / 0.32) * np.minimum(1, tt / 0.001) * vel


def brush(d=0.35, vel=1.0):
    tt = np.arange(int(d * SR)) / SR
    nz = rng.standard_normal(len(tt))
    nz = np.convolve(nz, np.ones(6) / 6, mode='same')                      # soft, papery
    return nz * np.exp(-tt / 0.09) * np.minimum(1, tt / 0.012) * vel


def vibe(f, d=2.4):
    tt = np.arange(int(d * SR)) / SR
    s = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt / 0.08)
    return s * np.exp(-tt / 0.9) * (1 + 0.25 * np.sin(2 * np.pi * 5.5 * tt)) * np.minimum(1, tt / 0.003)


bars = int(DUR / BAR)
for b in range(bars):
    t0 = b * BAR
    root, voicing = chord(b)
    nroot = chord(b + 1)[0]
    held = t0 >= OUTRO
    # electric piano: comp on beat 1 and the swung "and" of 2 (Charleston), softer and sparser in the intro
    if t0 >= OUTRO:
        if t0 == OUTRO:
            for m in voicing + [69]:
                add(rhodes(hz(m), DUR - OUTRO, 0.9), t0, 0.15, 0.07)
    else:
        hits = [(0.0, 1.6, 1.0), (1 * BEAT + SWING * BEAT, 0.9, 0.75)] if t0 >= 3 else [(0.0, 2.2, 0.8)]
        if 60 <= t0 < OUTRO:
            hits = [(0.0, 2.2, 0.85)]
        for at, d, v in hits:
            for m in voicing:
                add(rhodes(hz(m), d, v), t0 + at + rng.uniform(0, 0.012), 0.15, 0.085)
    # walking bass from the second bar: root, chord tones, chromatic approach into the next root
    if 2 <= t0 < OUTRO:
        third = voicing[0] - 12 if voicing[0] - 12 > root else voicing[0]
        fifth = root + 7
        walk = [root, third, fifth, nroot + (1 if (b % 2) else -1)]
        for k, m in enumerate(walk):
            add(bass(hz(m - 12), BEAT * 0.95), t0 + k * BEAT, -0.1, 0.13)
    elif t0 >= OUTRO and t0 == OUTRO:
        add(bass(hz(root - 12), 4.0), t0, -0.1, 0.13)
    # drums: ride "ding, ding-da, ding, ding-da", brushes and hi-hat foot on 2 and 4
    for beat in range(4):
        st = t0 + beat * BEAT
        if drums_on(st):
            add(ride(vel=0.9 if beat % 2 == 0 else 0.7), st, 0.4, 0.07)
            if beat % 2 == 1:
                add(ride(0.5, 0.55), st + SWING * BEAT, 0.4, 0.06)
                add(brush(), st, -0.25, 0.09)
                tt = np.arange(int(0.05 * SR)) / SR
                add(np.diff(rng.standard_normal(len(tt) + 1)) * np.exp(-tt / 0.01), st, 0.3, 0.02)
        elif RT(29) <= st < RT(34) or RT(60) <= st < OUTRO:
            add(ride(vel=0.6), st, 0.4, 0.04) if beat % 2 == 0 else None

# vibraphone on every scene change (a fifth, in key), and a little phrase when Nesya appears
for at in SCENES:
    add(vibe(hz(81)), at, -0.2, 0.05)
    add(vibe(hz(88)), at + 0.12, 0.2, 0.035)
for i, m in enumerate((74, 78, 81, 85)):
    add(vibe(hz(m), 1.6), RT(29.1) + i * 0.25, 0.1 * (i - 1.5), 0.05)
for i, m in enumerate((81, 78, 76, 74)):
    add(vibe(hz(m), 3.0 if i == 3 else 1.4), RT(65.2) + i * 0.5, 0.0, 0.05)

mix = np.stack([L, R], axis=1)
a = 0.75
for c in range(2):
    y = np.empty(N)
    acc = 0.0
    x = mix[:, c]
    for i in range(N):
        acc += a * (x[i] - acc)
        y[i] = acc
    mix[:, c] = y
fade = np.ones(N)
fade[: int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
fade[-int(2.5 * SR):] = np.linspace(1, 0, int(2.5 * SR)) ** 1.5
mix *= fade[:, None]
mix *= 10 ** (-1.5 / 20) / np.max(np.abs(mix))
with wave.open("jazz-hold.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("jazz-hold.wav", DUR, "s")
