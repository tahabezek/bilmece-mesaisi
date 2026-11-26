// Yayın kuralları sürümü (YAYIN_KURALLARI.md). Bir kural eklenir ya da değişirse bu sayı bir artırılır.
// Sayı değişince yayınlanmamış her bölümün denetim mührü geçersiz olur: tools/yayin.mjs o bölümü
// yeniden `node tools/denetim.mjs <id>` ve `--onayla` yapılana kadar kuyruğa almaz.
// (26 Kas 2026: Son Vapur'un cevap kapağı, 20 Kasım'daki "cevap verme" kuralından sonra da yayına çıktı;
// kural değişince eldeki stok yeniden denetlenmediği için. Bu sayı o boşluğu kapatır.)
export const KURAL_SURUM = 1;
