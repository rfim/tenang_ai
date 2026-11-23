# 10 s computer-style opener: soft square-wave blips as the pixels light, a typing tick per letter,
# a low pad on D, and data "pings" as packets cross between London and Jogja. Then the jazz film follows.
import wave, numpy as np
SR = 44100; DUR = 14.5; SHIFT = 4.5; N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, at, pan=0, g=1):
    _add(sig, at + SHIFT, pan, g)
def _add(sig, at, pan=0, g=1):
    i = int(at * SR); sig = sig[:max(0, N - i)] * g
    L[i:i + len(sig)] += sig * np.sqrt(.5 * (1 - pan)); R[i:i + len(sig)] += sig * np.sqrt(.5 * (1 + pan))
def sq(f, d, decay):
    t = np.arange(int(d * SR)) / SR
    s = np.sign(np.sin(2 * np.pi * f * t)) * .5 + np.sin(2 * np.pi * f * t) * .5
    return s * np.exp(-t / decay) * np.minimum(1, t / .002)
scale = [62, 66, 69, 73, 74, 78, 81]
# pixels light 0.5 - 2.4 s (36 cells)
for k in range(36):
    add(sq(hz(scale[k % 7] + 12), .12, .03), .5 + k * 1.9 / 36, (k % 2) * .4 - .2, .035)
# typing ticks for the title 2.35 - 3.35 s and the log 7.0 - 9.3 s
def tick(): t = np.arange(int(.03 * SR)) / SR; return rng.standard_normal(len(t)) * np.exp(-t / .004)
for k in range(20): add(tick(), 2.35 + k * .05, .1, .05)
for k in range(46): add(tick(), 7.0 + k * .05, -.1, .035)
# boot beeps
for k, at in enumerate((.1, .5, .9, 1.3)): add(sq(hz(86), .08, .02), at, 0, .03)
# pad on D from 0.4 s, swelling into the second part, fading out under the jazz downbeat
t = np.arange(int(9.8 * SR)) / SR
pad = sum(np.sin(2 * np.pi * hz(m) * t * (1 + d)) for m in (50, 57, 62, 66) for d in (-.002, .002))
env = np.minimum(1, t / 1.2) * np.minimum(1, (9.8 - t) / 1.0)
add(pad * env, .2, 0, .018)
# soft heartbeat-like pulse on every beat in part two (120 BPM)
for k in range(10):
    tt = np.arange(int(.3 * SR)) / SR; f = 50 + 50 * np.exp(-tt / .03)
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .08), 5 + k * .5, 0, .18)
# data pings as packets fly (six packets)
for i in range(6):
    add(sq(hz(81 + (i % 2) * 5), .5, .12), 5.9 + i * .55, -.5 if i % 2 == 0 else .5, .03)
# the two-note chime when each part lands
for at in (0.0, 5.0):
    t = np.arange(int(2 * SR)) / SR
    for f, g, o in ((hz(81), .05, 0), (hz(86), .04, .11)):
        add(np.sin(2 * np.pi * f * t) * np.exp(-t / .9), at + o, 0, g)
# part 0: the pioneers. A low CRT hum, a rising sweep as each portrait scans in, typing for the captions, and a soft chord.
t = np.arange(int(4.6 * SR)) / SR
hum = (np.sin(2 * np.pi * 50 * t) + .3 * np.sin(2 * np.pi * 100 * t)) * np.minimum(1, t / .6) * np.minimum(1, (4.6 - t) / .5)
_add(hum, 0, 0, .025)
for at in (.7, 1.3):
    tt = np.arange(int(1.0 * SR)) / SR; f = 300 + 1500 * tt
    _add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt) * .6, at, -.3 if at < 1 else .3, .03)
for k in range(30): _add(tick(), .15 + k * .027, 0, .04)
for k in range(38): _add(tick(), 1.6 + k * .045, -.2, .03)
for k in range(28): _add(tick(), 2.2 + k * .045, .2, .03)
tt = np.arange(int(2.4 * SR)) / SR
_add(sum(np.sin(2 * np.pi * hz(m) * tt) for m in (62, 66, 69)) * np.exp(-tt / 1.0) * np.minimum(1, tt / .02), 3.0, 0, .04)
mix = np.stack([L, R], 1); mix *= 10 ** (-3 / 20) / np.abs(mix).max()
with wave.open('intro.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
# whole soundtrack: opener then jazz
import wave as W
def read(p):
    w = W.open(p); return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2)
full = np.concatenate([read('intro.wav'), read('jazz.wav')])
with wave.open('full.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(full.tobytes())
print('full.wav', len(full) / SR, 's')
