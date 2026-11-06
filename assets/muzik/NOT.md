# Kapanış jingle'ı (D · "Bil bakalım", tezahürat)

Seçilen aday: `jingle-d-tam.flac` (26 sn). Henüz hiçbir bölümde kullanılmıyor; nereye konacağına sonra karar verilecek.

## Söz
Bil bakalım, bil bakalım,
Hikmet Bey'in sorusu var!
Bulamazsan eve gitmek yok,
Bil bakalım, bil bakalım!

## Kelime zamanları (whisper medium, sn)
Bil 0.0 · bakalım 0.5 · bil 1.3 · bakalım 1.4 · Hikmet 2.1 · Bey'in 2.6 · sorusu 3.0 · var 3.6 ·
Bulamazsan 4.0 · eve 4.8 · gitmek 5.2 · yok 5.7 · Bil 6.0 · bakalım 6.4 · bil 7.2 · bakalım 7.4
— 7.4–11.5 arası müzik arası; nakarat 11.5'te aynı sözle tekrar başlar, son kelime 19.5, 24.6'dan sonra sessiz.
Kısa kapanış için doğal kesim: ilk dörtlük (0–~9.5 sn).

## Kodda hazır olan
`tools/ses.mjs` `OUTRO=<json>` ortam değişkeni ya da bölüm JSON'unda `outro` alanıyla jingle'ı CTA'dan sonraki ölçüye koyar,
`engine/sahne.js` son kartta karaoke sözleri gösterir. JSON biçimi: `{ file, len, lines: [{ text, t0, t1, words: [{ w, t0, t1 }] }] }`.

## Üretim (ACE-Step 1.5, silindi; gerekirse yeniden kurulur)
github.com/ace-step/ACE-Step-1.5, uv ile Python 3.12 venv, model `acestep-v15-turbo` + LM `acestep-5Hz-lm-1.7B` (thinking açık).
Ayarlar: text2music, 26 sn, 120 bpm, D Major, vocal_language tr, 8 adım, shift 3, tohum 1907.
Başlık: "Extremely catchy stadium chant pop for a Turkish office comedy show: stomping beat, big handclaps, brass hits, a crowd of office friends shouting the hook together like a football chant, a young woman leads each line clearly in Turkish. Simple repeated melody, everyone sings along, funny and energetic."
Söz [Verse]/[Chorus] etiketli, nakarat tekrarlı. Tam ayar dosyası: `jingle-d.toml`.
