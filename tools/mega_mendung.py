"""Generate mega mendung (Cirebon batik) cloud SVGs.

Each cloud is a set of lobes (circles) plus curled tails (spirals). It is drawn
several times, each time a little smaller and a little lighter, so the bands step
from dark indigo outside to pale blue inside, like the batik.
Run: python3 tools/mega_mendung.py  (writes assets/mm-*.svg)
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets"
BANDS = ["#1f3557", "#2b4a73", "#3d6290", "#5a80ab", "#82a4c7", "#b3cbe0", "#e3edf5"]
NIGHT = ["#0f2a3a", "#174056", "#235a70", "#36778a", "#5596a3", "#86bcc0", "#cfe7e3"]
STEP = 5.0  # band thickness


def spiral(cx, cy, r0, turns, direction=1, start=0.0):
    pts = []
    n = 60
    for i in range(n + 1):
        t = i / n
        a = start + direction * t * turns * 2 * math.pi
        r = r0 * (1 - 0.78 * t)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)


def cloud(name, lobes, tails, size, palette):
    w, h = size
    pad = STEP * len(palette) + 6
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {w + 2 * pad} {h + 2 * pad}">']
    n = len(palette)
    for i, color in enumerate(palette):
        off = (n - 1 - i) * STEP
        g = [f'<g fill="{color}">']
        for cx, cy, r in lobes:
            g.append(f'<circle cx="{cx}" cy="{cy}" r="{r * 0.78 + off:.1f}"/>')
        g.append("</g>")
        for (cx, cy, r0, turns, d, st, sw) in tails:
            g.append(f'<path d="{spiral(cx, cy, r0, turns, d, st)}" fill="none" stroke="{color}" '
                     f'stroke-width="{sw + 2 * off:.1f}" stroke-linecap="round" stroke-linejoin="round"/>')
        parts.append("".join(g))
    parts.append("</svg>")
    (OUT / name).write_text("".join(parts), encoding="utf-8")


# Three cloud shapes: lobes (cx, cy, r) and tails (cx, cy, radius, turns, direction, start angle, width)
SHAPES = {
    "a": ([(60, 70, 26), (98, 52, 34), (142, 50, 30), (180, 66, 24), (120, 78, 26), (78, 84, 18), (160, 86, 18)],
          [(212, 84, 16, 1.15, -1, math.pi, 9), (34, 92, 14, 1.1, 1, 0.0, 8)], (250, 120)),
    "b": ([(52, 58, 22), (86, 42, 28), (124, 46, 24), (100, 66, 22), (66, 76, 16)],
          [(150, 70, 13, 1.2, -1, math.pi, 8)], (175, 100)),
    "c": ([(70, 62, 30), (116, 44, 38), (166, 48, 32), (210, 64, 26), (140, 80, 28), (96, 86, 20), (186, 86, 20)],
          [(244, 80, 18, 1.2, -1, math.pi, 10), (40, 88, 15, 1.1, 1, 0.0, 9), (128, 104, 11, 1.0, 1, -math.pi / 2, 7)], (280, 128)),
}
for key, (lobes, tails, size) in SHAPES.items():
    cloud(f"mm-{key}.svg", lobes, tails, size, BANDS)
    cloud(f"mm-{key}-night.svg", lobes, tails, size, NIGHT)
print("wrote", len(SHAPES) * 2, "clouds")
