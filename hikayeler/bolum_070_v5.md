# 070 · Necmi'nin oyunu (v5 storyboard, cevapsız tasarım, kısa format, 2026-11-26)

Kaynak: `hikayeler/bolum_070-074.md` § 070. Sahne: `engine/b070.js`. Bölüm dosyası: `bolumler/070-on-bes.json` (`cevapsizTasarim: true`). Yayın sırası 58 (rozet "BİLMECE #58"). Sayaç 10 sn, `countdown: "n1-0.3"`. Mekanizma: kılık değiştirmiş oyun.

- **Logline:** Çay molasında Defne ile Necmi, Necmi'nin getirdiği oyunu karşılıklı oynar: masadaki dokuz taştan sırayla birer taş alınır, elindeki üç taşın toplamı 15 olan kazanır. Yüz oyunun hepsi berabere biter. Necmi: "Bunu çocukken hep oynardınız, yalnız adı başkaydı."
- **Akılda kalacak tek şey:** Bildiğin bir oyun, sayıların arkasına saklanmış olabilir.
- **Kart:** `Üç taşın toplamı 15 olan kazanır.` (33; 26 Kas, eski "Üç taşı 15 eden" bozuktu) / `Bu aslında hangi oyun?` (22)
- **Cevap (arşiv, kesilir):** XOX. 1–9 sihirli kareye dizilince (2 7 6 / 9 5 1 / 4 3 8) toplamı 15 eden sekiz üçlünün her biri bir satır, sütun ya da çapraz olur.
- **Kadro:** Hikmet (ayakta, çetele defteriyle), Defne (solda oturur, yüzü sağa), Necmi (sağda oturur, yüzü sola). Kerem yok.
- **Mekân:** `b070_mola`, ofisin mola köşesi. Düz duvar (desensiz), kayıtsız pencere (İstanbul silueti, martı), Defne'nin arkasında yan dolap ve çaydanlık. Küçük ahşap masa önden görünür, üst yüzeyi görünür: arkada dokuz taşlık havuz, önde iki ıstaka, ortada iki çay.
- **Taşlar:** Okey taşı gibi: krem zemin, kırmızı rakam (42 px'lik yazı; 1,6x plânda ekranda yaklaşık 48 px). Hepsi aynı renk ve büyüklükte.
- **Oyun (kod yükleme anında denetler):** Havuz tek düz sıra, soldan sağa `7 9 1 8 4 | 5 2 6 3` (ortada küçük aralık: sol yarıdan Defne, sağ yarıdan Necmi alır). İki yarı iki oyuncunun eli gibi okunabileceği için ikisinde de 15 eden üçlü yoktur (berabere biten bir dağılım); yan yana duran hiçbir üç taş 15 etmez (bağımsız göz 1. turda `6 7 2` yan yanalığını ve sol yarıdaki 2 + 6 + 7'yi yakaladı).
  - Açılış oyunu, Necmi başlar: kareden önce N3, D1, N5. Kare 0'da Defne 7'yi alır (Necmi'nin 3-5-7 tehdidini keser). n0'da Necmi 6'yı alır: 3 + 5 + 6 = 14. n0'nun sonunda ("olan") Defne 4'ü alır (Necmi'nin 4-5-6 tehdidini keser).
  - Zaman atlamasında taşlar ellerle havuza geri taşınır (Necmi üç, Defne üç taş; hızlandırılmış).
  - Sayaçta yeni oyun, Necmi başlar: N2, D1, N3, D4, N6, D7. Her hamle rakibin tehdidini keser; kimse kazanamaz.
- **Sızıntı yasağı:**
  - Taşlar hiçbir anda 3 × 3 dizilmez: havuz tek düz sıra, ıstakalar tek sıra; ıstaka yerleri havuzdan yarım taş kaydırmalıdır (üst üste sütun oluşmaz). Havuz taşları masanın arkasında ve %12 küçüktür (derinlik): ıstakadaki taşlarla iki katlı ıstaka gibi okunmaz.
  - Kareli örtü, ızgara, X ya da O işareti, çizgili tahta yok. Duvar desensiz, pencere kayıtsız (iki kat ızgara oluşmasın).
  - Çetele beşli demetlerdir; satırlar el yazısı gibi kaymalı akar.
  - "XOX", "X O X", "İKS O İKS", "SİHİRLİ KARE", "TİK TAK" hiçbir yazıda geçmez (`sizinti`).
- **Kare 0:** Üstte kart. Defne'nin eli havuzun en solundaki 7'nin üstünde; Necmi'nin ıstakasında iki taş; masada iki buharlı çay; Hikmet defteriyle yanlarında, konuşuyor. 0,3 sn'de Defne taşı kaldırır, ses 0,30 sn'de başlar.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | Döngüler | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–2,08 | Mola köşesi, üç kişi | Defne 7'yi alır, ıstakasına koyar (knock 0,92). Hikmet Necmi'ye bakarak konuşur (h1). | çay buharı, çaydanlık buharı, martı | 1,15x | (yok) |
| 2 Dokuz taş | 2,08–4,25 | Masa yakın | "dokuz taş"ta dokuz taş soldan sağa birer nabız atar (55–60 ms arayla, pop). Dokuzu da okunur. | çay buharı, martı | 1,6x | sert kesme |
| 3 Kural | 4,20–9,27 | Üç kişi | n0: Necmi "birer taş"ta 6'yı alır, ıstakasına koyar. "Elindeki"de Hikmet sağ elinin üç parmağını sayar, başını iki yana sallar; mercan etiket `3 + 5 + 6 = 14` (7,1–9,2). "olan"da Defne 4'ü alır (knock). | çay buharı, çaydanlık buharı, martı | 1,12x | sert kesme |
| 4 Yüz oyun | 9,27–10,78 | Aynı plân | Zaman atlaması (u, 9,35–10,70): taşlar ellerle havuza döner, Hikmet çeteleye yazar (2 → 100 çizgi), çaylar boşalır, ışık akşama döner. Zaman hapı `100 OYUN SONRA` (9,5–10,6). Hikmet'in ağzı kapalı (Defne konuşuyor). | çaydanlık buharı, martı | 1,12x | (kesme değil) |
| 5 Berabere | 10,78–12,00 | Defne yakın | "berabere kaldı": dokuz taş havuzda, düz sırada. | martı | 1,6x | sert kesme |
| 6 Eski oyun | 12,00–15,94 | Defne + Necmi + masa | n0b (iki balon: "Bunu çocukken hep oynardınız." / "Yalnız adı başkaydı."): Necmi arkasına yaslanır, gülümser; "başkaydı"dan sonra başını sallar. Defne "Yalnız"da şaşırır. | martı | 1,5x | sert kesme |
| 7 Soru | 15,94–17,71 | Hikmet + Necmi | h3: Hikmet kameraya bakar, "hangi"de kalemi deftere vurur. | martı | 1,5x | sert kesme |
| 8 Sayaç (10 sn) | 17,71–27,76 | Masa | Yeni oyun: altı hamle, her biri 1,32 sn arayla, ıstakaya vuruşta knock. Defne son hamleden sonra eli çenesinde düşünür. Sayaç alt bantta, perde yok. | çay buharı yok (çaylar boş), martı, kamera itmesi | 1,42x → 1,56x doğrusal | sert kesme |
| 9 İpucu | 28,06–31,85 | Aynı plân | n1: Necmi öne eğilir, "sayın"da bir, "Sekiz"de iki kez başını sallar; Defne eli çenesinden iner, "sayın"da taşlara bakar, sonda yine elini çenesine koyar. Balon kesime kadar ekranda. | martı, kamera itmesi | 1,56x → 1,58x | (yok) |
| — Kesim | 31,85 | | `cevapsiz.mjs`: "Buldum!"dan 0,12 sn önce keser, takip kartını ekler. | | | |
| 10 Buldum (arşiv) | 31,97 | Defne | sıçrama, ışınlar | | 1,35x | |
| 11 Cevap (arşiv) | 33,8–41,3 | Masa | Defne konuşur; çağrı. | | 1,5x | |

| id | Konuşan | Replik | Kelime | sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Necmi yeni bir oyun getirdi. Birden dokuza, dokuz taş. | 9 | 0,30–4,05 |
| n0 | Necmi | Sırayla birer taş alıyoruz. Elindeki herhangi üç taşın toplamı on beş olan kazanır. | 13 | 4,30–9,63 |
| d1 | Defne | Yüz kez oynadık. Hepsi berabere kaldı. | 6 | 9,88–12,36 |
| n0b | Necmi | Bunu çocukken hep oynardınız. Yalnız adı başkaydı. | 7 | 12,61–16,30 |
| h3 | Hikmet | Bu aslında hangi oyun? | 4 | 16,55–18,12 |
| n1 | Necmi | On beş eden üçlüleri sayın. Sekiz tane çıkacak. | 8 | 28,57–31,88 |
| d3 | Defne | Buldum! XOX. (tts: "Buldum! İks o iks.") (arşiv) | 2 | 32,33–33,94 |
| d4 | Defne | Dokuz taşı sihirli kareye dizin. On beş eden her üçlü bir sıra olur. (arşiv) | 13 | 34,29–38,09 |
| d6 | Defne | Bunu XOX'ta hiç yenilmeyen arkadaşına gönder. (arşiv) | 6 | 38,79–41,53 |

**Süre:** "Buldum!" öncesi 47 kelime. "Buldum!" 32,33 sn; cevaplı arşiv 43,93 sn; kesilmiş film 34,5 sn. (26 Kas n0 düzeltmesinden sonra plân tablosundaki n0 sonrası anlar ≈ 0,5 sn kaydı; çapalar kelimeye bağlı.)

**Şartların filmdeki yeri (kesilmiş sürüm)**
- 1'den 9'a dokuz taş: h1, plân 2'deki dokuz taş (hepsi okunur).
- Sırayla birer taş: n0, kancadaki ve n0'daki hamleler, sayaçtaki altı hamle.
- Herhangi üç taşın toplamı 15 olan kazanır: kart, n0 ("herhangi"); Necmi'nin üç taşı 14 eder, olmaz (etiket).
- Yüz kez oynandı, hepsi berabere: d1, zaman atlaması, çetele, zaman hapı.
- Necmi'nin sözü: n0b.
- Soru: h3, kart.

**Taslağa göre değişenler (şartlar, sayılar, cevap aynı)**
- n0 (26 Kas, usta editör): "Elindeki herhangi üç taşı on beş eden kazanır" bozuk ve muğlaktı → "Elindeki herhangi üç taşın toplamı on beş olan kazanır" (açıklama metnindeki kural cümlesiyle aynı); d3 öncesi ara 0,6 → 0,45 sn. Önceki: "Elinde toplamı on beş eden üç taş olan kazanır" → "Elindeki herhangi üç taşı on beş eden kazanır". Kısa format için kısaldı; "herhangi" bağımsız gözün uyarısıyla geri kondu (elde üçten çok taş olabileceği şartı). Aralar 0,25 sn'ye, d3 öncesi 0,6 sn'ye indi.
- d1 "Hepsi berabere bitti" → "Hepsi berabere kaldı": TTS "berabere bitti"yi "beraber bitti" diye okuyordu (whisper small ve medium ikisi de böyle duydu).
- n1 T ile başlıyordu ("Toplamı…", "Tam sekiz…"): "On beş eden üçlüleri sayın. Sekiz tane çıkacak."
- Necmi'nin üç satırı `rate: -4%` (kanaldaki -10%'dan hızlı): süre bütçesi.
- Hikmet'in "on dört" sözü replik değil, mercan etiket (`1 + 5 + 8 = 14`) ve baş sallama.
- Taslakta Hikmet masanın arkasında ayakta gibi düşünülebilirdi; ayakta boyu yakın plânlarda başını kartın altına sokuyordu. Hikmet Necmi'nin sağında durur; masa plânlarında kadraj dışıdır.

**Motor için**
- Karakterler yandan oturur (`H.otur`), kollar kısa (≈ 180 px): masa 450 px geniş, havuz ortada, ıstakalar oyuncuların önünde. Gövde uzanılan yere göre 5°–24° eğilir.
- Masanın üstüne uzanan kol masadan sonra yeniden çizilir (`kolUst`, 068'deki yöntem); tutan el taşın üstündedir.
- El ve taş aynı yolu okur: el taşa 0,28 sn'de varır, taşı üst ortasından tutar, 0,62 sn'de taşır (44 px yay), ıstakada bırakır, 0,32 sn'de masanın ön kenarına döner.
- Sayaç 068'deki bölüme özel sayaçtır (perde yok, alt bant). İpucu balonu kesime kadar kalır (`tlA`).
- `film.kontrol()` uyarıları: zoom (1,5–1,6x yakın plânlar) bilinçli.
- Bağımsız göz (iki tur): 1. turda havuzun sol yarısında 2 + 6 + 7 = 15 ve yan yana `6 7 2`, "herhangi"nin düşmesi, "on / beş" bölünmesi, zaman atlamasında Hikmet'in açık ağzı; 2. turda açılış oyununda Necmi'nin üst üste oynuyormuş gibi görünmesi ve havuzun Defne'nin ıstakasıyla karışması. Hepsi düzeltildi. 31,5 sn'deki boş göz motorun göz kırpma karesidir.
