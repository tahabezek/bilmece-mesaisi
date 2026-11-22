# 066 n0b: tools/voice_trim.py ile aynı yöntem, yalnız satır içi durak KEEP sn bırakılır (dört söz arasında belirgin durak).
# Kullanım: py -3.13 b066_trim.py <ham.mp3> <çıktı.mp3> <KEEP>   |   py -3.13 b066_trim.py --olc <mp3>
import json, os, subprocess, sys
import numpy as np
SR, WIN = 44100, 441
FF = os.path.join('node_modules', 'ffmpeg-static', 'ffmpeg.exe')
def load(p):
    raw = subprocess.run([FF, '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()
def loud_of(x):
    n = len(x) // WIN
    rms = np.sqrt((x[:n * WIN].reshape(n, WIN) ** 2).mean(axis=1) + 1e-12)
    return 20 * np.log10(rms / rms.max()) > -38, n
if sys.argv[1] == '--olc':
    x = load(sys.argv[2]); loud, n = loud_of(x)
    runs = np.flatnonzero(np.diff(np.concatenate([[0], loud.astype(int), [0]])))
    segs = [[a / 100, b / 100] for a, b in zip(runs[::2], runs[1::2])]
    out = []
    for a, b in segs:
        if out and a - out[-1][1] < 0.22: out[-1][1] = b
        else: out.append([a, b])
    print('süre', round(len(x) / SR, 3)); print('parçalar', [[round(a, 2), round(b, 2)] for a, b in out])
    sys.exit()
src, dst, KEEP = sys.argv[1], sys.argv[2], float(sys.argv[3]); MAX_GAP, EDGE = 0.40, 0.05
x = load(src); loud, n = loud_of(x); idx = np.flatnonzero(loud); first, last = idx[0], idx[-1]
keep = np.zeros(n, dtype=bool); keep[max(0, first - int(EDGE * 100)):min(n, last + 1 + int(EDGE * 100))] = True
i = first
while i <= last:
    if not loud[i]:
        j = i
        while j <= last and not loud[j]: j += 1
        if (j - i) / 100 > max(MAX_GAP, KEEP):
            keep[i + int(KEEP * 50):j - int(KEEP * 50)] = False
        i = j
    else: i += 1
fade = int(0.012 * SR); pieces = []
runs = np.flatnonzero(np.diff(np.concatenate([[0], keep.astype(int), [0]])))
for a, b in zip(runs[::2], runs[1::2]):
    seg = x[a * WIN:b * WIN].copy()
    if pieces and len(seg) > fade and len(pieces[-1]) > fade:
        r = np.linspace(0, 1, fade, dtype=np.float32)
        pieces[-1][-fade:] = pieces[-1][-fade:] * (1 - r) + seg[:fade] * r; seg = seg[fade:]
    pieces.append(seg)
y = np.concatenate(pieces)
subprocess.run([FF, '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'libmp3lame', '-b:a', '160k', dst], input=y.tobytes(), check=True)
print(f"{len(x) / SR:.2f} → {len(y) / SR:.2f} sn")
