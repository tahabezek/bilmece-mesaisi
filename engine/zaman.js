// Zaman çizelgesi: replikler ölçülmüş sürelerine göre art arda dizilir (ses saattir). Görüntü, müzik, efekt ve
// altyazı bu tek kaynaktan okur; tarayıcıda ve node'da aynı. rec = assets/voice/<id>/words.json
//   ln.gap  : önceki replik bittikten sonraki ara (sn)
//   ln.snap : replik bir sonraki müzik vuruşuna kaydırılır ("Buldum!" gibi vuruşlar vuruşa düşer)
export const bpmOf = ep => ep.bpm || 120;
const r3 = x => Math.round(x * 1000) / 1000;

export function timeline(ep, rec) {
  const beat = 60 / bpmOf(ep), lines = [];
  let t = 0;
  for (const ln of ep.voice.lines) {
    const r = rec[ln.id];
    t += ln.gap ?? 0.3;
    if (ln.snap) t = Math.ceil(t / beat - 1e-6) * beat;
    const t0 = r3(t), t1 = r3(t + r.dur);
    lines.push({ ...ln, t0, t1, words: r.words.map(w => ({ w: w.w, t0: r3(t0 + w.t0), t1: r3(t0 + w.t1) })) });
    t = t1;
  }
  const L = Object.fromEntries(lines.map(l => [l.id, l]));
  return { lines, L, beat, duration: r3(t + (ep.voice.tail ?? 2.4)) };
}

// Zaman ifadesi: "@1.2" mutlak · "h2a" satır başı · "h2a>" satır sonu · "d4a:3" satırın 3. kelimesinin başı
// · sona "+0.2" / "-0.1" eklenebilir. Efekt ve sahne ipuçları zamanı böyle anar; replik kayınca onlar da kayar.
export function at(tl, expr) {
  const m = /^(@?[\w.]+?)(>|:\d+)?([+-]\d*\.?\d+)?$/.exec(expr);
  if (!m) throw new Error('zaman ifadesi: ' + expr);
  const off = Number(m[3] || 0);
  if (m[1][0] === '@') return Number(m[1].slice(1)) + off;
  const l = tl.L[m[1]];
  if (!l) throw new Error('satır yok: ' + expr);
  if (m[2] === '>') return l.t1 + off;
  if (m[2]) return l.words[Number(m[2].slice(1))].t0 + off;
  return l.t0 + off;
}
