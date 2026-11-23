# Calm 120 BPM soundtrack for the Tenang AI before/after video (30 s, D major: D - Bm - G - A).
import wave
import numpy as np

SR = 44100
DUR = 30.0
N = int(SR * DUR)
t = np.arange(N) / SR
L = np.zeros(N)
R = np.zeros(N)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


CHORDS = [[50, 54, 57, 62], [47, 50, 54, 59], [43, 47, 50, 55], [45, 49, 52, 57]]  # D, Bm, G, A
BAR = 2.0

# pad: soft, slow attack, crossfading bar to bar
for b in range(15):
    ch = CHORDS[b % 4] if b < 14 else CHORDS[0]
    d = BAR + 0.6 if b < 14 else 4.0
    tt = np.arange(int(d * SR)) / SR
    env = np.minimum(1, tt / 0.45) * np.minimum(1, (d - tt) / 0.6)
    sig = np.zeros_like(tt)
    for m in ch:
        f = hz(m + 12)
        for det in (-0.003, 0.003):
            sig += np.sin(2 * np.pi * f * (1 + det) * tt) + 0.25 * np.sin(4 * np.pi * f * (1 + det) * tt)
    add(sig * env, b * BAR - 0.3 if b else 0, 0.0, 0.018)

# bass: root, half notes, from the "before" scene on
for b in range(1, 15):
    root = (CHORDS[b % 4] if b < 14 else CHORDS[0])[0] - 12
    for half in (0, 1):
        tt = np.arange(int(0.95 * SR)) / SR
        env = np.minimum(1, tt / 0.02) * np.exp(-tt * 2.2)
        sig = np.sin(2 * np.pi * hz(root) * tt) + 0.2 * np.sin(4 * np.pi * hz(root) * tt)
        add(sig * env, b * BAR + half, 0.0, 0.16)

# plucked arpeggio, eighth notes, gently panned; rests during the hook's first second and the final chord
for b in range(15):
    ch = CHORDS[b % 4] if b < 14 else CHORDS[0]
    pattern = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[3] + 12]
    for k, m in enumerate(pattern):
        st = b * BAR + k * 0.25
        if st < 1.5 or st > 27.6:
            continue
        tt = np.arange(int(0.6 * SR)) / SR
        f = hz(m + 12)
        env = np.minimum(1, tt / 0.004) * np.exp(-tt / 0.16)
        sig = np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt / 0.05)
        add(sig * env, st, -0.35 if k % 2 else 0.35, 0.05 if 23 <= st < 27 else 0.07)

# soft kick on beats 1 and 3 through the comparisons
for k in range(int(7 / 1.0), int(23 / 1.0)):
    tt = np.arange(int(0.35 * SR)) / SR
    f = 45 + 75 * np.exp(-tt / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    add(np.sin(ph) * np.exp(-tt / 0.09), k * 1.0, 0.0, 0.34)

# shaker on the off-beats
rng = np.random.default_rng(7)
for k in range(int(7 / 0.5), int(23 / 0.5)):
    tt = np.arange(int(0.08 * SR)) / SR
    nz = np.diff(rng.standard_normal(len(tt) + 1))
    add(nz * np.exp(-tt / 0.018), k * 0.5 + 0.25, 0.25, 0.022)


def bell(f, d=2.2):
    tt = np.arange(int(d * SR)) / SR
    s = (np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.9) + 0.35 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt / 0.35)
         + 0.15 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt / 0.15))
    return s * np.minimum(1, tt / 0.003)


# chime on each scene change: two notes, in key
for at in (3, 7, 11, 15, 19, 23, 27):
    add(bell(hz(81)), at - 0.02, -0.2, 0.06)
    add(bell(hz(86)), at + 0.11, 0.2, 0.05)

# hook: a soft low swell under each word
for at in (0.5, 1.0):
    tt = np.arange(int(1.4 * SR)) / SR
    add(np.sin(2 * np.pi * hz(38) * tt) * np.exp(-tt / 0.5) * np.minimum(1, tt / 0.01), at, 0.0, 0.22)

# final chord rings out
tt = np.arange(int(3.0 * SR)) / SR
fin = sum(np.sin(2 * np.pi * hz(m + 12) * tt) for m in CHORDS[0]) * np.exp(-tt / 1.4) * np.minimum(1, tt / 0.01)
add(fin, 27.0, 0.0, 0.05)

mix = np.stack([L, R], axis=1)
# gentle one-pole low-pass for warmth
a = 0.35
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
fade[-int(1.6 * SR):] = np.linspace(1, 0, int(1.6 * SR)) ** 1.5
mix *= fade[:, None]
mix *= 10 ** (-1.5 / 20) / np.max(np.abs(mix))
pcm = (mix * 32767).astype(np.int16)
with wave.open("music.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("music.wav", DUR, "s")
