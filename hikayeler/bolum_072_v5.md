# 072 · Dama (v5 storyboard, kısa set, cevapsız tasarım, 2026-11-26)

Kaynak: `hikayeler/bolum_070-074.md` § 072. Sahne: `engine/b072.js`. Bölüm dosyası: `bolumler/072-dama.json` (`cevapsizTasarim: true`). Yayın sırası 60 (rozet "BİLMECE #60"). Sayaç 10 sn, `countdown: "n1-0.3"`. Mekanizma: seçim (üst üste iki galibiyet için ortadaki oyun şart).

- **Logline:** Hikmet, Defne'ye üç oyunluk bir dama maçı önerir: üst üste iki oyun kazanırsa bir hafta çay Hikmet'ten. Rakip her oyunda değişir; Hikmet usta, Necmi acemi. Sırayı Defne seçecek: Hikmet–Necmi–Hikmet mi, Necmi–Hikmet–Necmi mi?
- **Akılda kalacak tek şey:** Önce hangi oyunu mutlaka kazanman gerektiğini bul.
- **Kart:** `Üst üste 2 galibiyet şart.` (26) / `Rakip 2 kez usta mı, acemi mi?` (30)
- **Cevap (arşiv, kesilir):** Hikmet–Necmi–Hikmet. Üst üste iki galibiyet için ortadaki oyunu kazanmak şart; kolay rakip ortada olmalı.
- **Kadro:** Hikmet (masanın arkasında ayakta, önden, iki kartın tam ortasında), Defne (masanın sol ucunda oturur, yandan, yüzü sağa), Necmi (masanın sağ ucundan biraz uzakta ayakta, önden; Defne'nin yakın plânlarında kadraj dışında kalsın diye). Kerem yok.
- **Mekân:** `b072_ofis`, ofiste öğle arası. Düz petrol duvar, duvar saati (saniye ibresi döner), kayıtsız pencere (İstanbul silueti, martı), Necmi'nin sağında saksı, önde kilim. Masada Türk daması: 8 × 8, düz iki tonlu ahşap, 16 açık (Defne'nin tarafı, 1. ve 2. sütun) ve 16 koyu taş (5. ve 6. sütun). Masanın arka kenarında iki yuvalı ahşap kart standı. Ödül çayı tahtanın sol arkasında, Defne'nin tarafında.
- **Sızıntı yasağı:**
  - İki dizilim iki aynı kartta durur: aynı kâğıt rengi, aynı boy, aynı yazı (45 px, mürekkep), standda Hikmet'in iki yanında eşit uzaklıkta (±110 px). Arka yüzleri aynı desenli (yazısız).
  - Kartlar aynı koreografiyle, aynı sürede gösterilir: her biri kendi diziliminin ilk kelimesinde (A "ben", B "yoksa") masanın arkasından arka yüzü dönük gelir, çevrilerek kendi yuvasının üstüne kalkar, 1,45 sn tutulur, 0,3 sn'de standa iner; Hikmet kaldırdığı karta bakar; ikisinde de aynı efektler (swish + knock).
  - Sayaçta iki kart yan yana, sabit; kamera iki kartın arasına doğrusal iter. Defne'nin bakışı iki karta eşit sürede (1,6 sn + 1,6 sn, iki tur) gider, sonra tahtaya iner; ipucunda Necmi'ye, sonra yine tahtaya bakar. Hikmet sayaçta kartlara değil kameraya ve iki yana eşit süre bakar. Hiçbir el, parmak ya da bakış kartlardan birinin üstünde beklemez. Defne'nin yakın plânlarında iki kart da güvenli alanda (x 90–920) ve kadrajın ortasına yakın durur.
  - Defne seçimini yapmaz; yanlış denemesi işaretlenmez (✓/✗ yok, kimse başını sallamaz).
  - "ORTADAKİ" ve "KOLAY RAKİP ORTADA" hiçbir yazıda geçmez (`sizinti`).
- **Kare 0:** Üstte kart. Defne oturmuş, tahtaya bakıyor; Hikmet tahtanın arkasında, sağ elinde ödül çayı (buharlı), konuşmaya başlıyor; Necmi sağda gülümsüyor. 0,3 sn'de Defne başını Hikmet'e kaldırır, Hikmet'in sol eli kalkar ("üç" parmak), ses 0,30 sn'de başlar.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | Döngüler | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–2,56 | Masa, üç kişi | h1 ilk cümle: Hikmet "üç oyunluk"ta sol elinin üç parmağını kaldırır; sağ elinde ödül çayı. | saat ibresi, çay buharı, pencerede martı | 0,98x → 0,99x | (yok) |
| 2 Insert | 2,56–6,14 | Tahta, üstten | "iki oyun"da Defne'nin eli soldan gelir, bir taşını bir kare iter (knock 3,74). "çay benden"de Hikmet'in eli yukarıdan çayı tahtanın yanına koyar (knock 5,22), çekilir. 32 taşın hepsi okunur. | çay buharı | 1x (üstten) | sert kesme |
| 3 Rakipler | 6,14–12,46 | Hikmet + Necmi | n0: Necmi "Hikmet Bey"de Hikmet'i gösterir, "ben"de elini göğsüne koyar. h2: Hikmet "Ben"de göğsünü gösterir (USTA etiketi), "Necmi"de Necmi'yi gösterir (ACEMİ etiketi). "Sırayı"da göğüs cebinden iki kartı (desenli arka yüzleri görünür) alır, eller masanın arkasına iner. | pencerede martı, çay buharı | 1,22x → 1,23x | sert kesme |
| 4 Kartlar | 12,46–16,34 | Masa, üç kişi | "ben, Necmi, ben mi": Hikmet sol eliyle A kartını çevirip kaldırır, standın sol yuvasına indirir. "yoksa Necmi, ben, Necmi mi": sağ eliyle B kartını aynı şekilde sağ yuvaya. | saat ibresi, çay buharı, martı | 1,0x | sert kesme |
| 5 Yanlış deneme | 16,34–18,74 | Defne + kartlar + Hikmet | d2: Defne "iki kez"de iki parmağını göğsünün önünde Necmi'ye doğru kaldırır. Kimse onaylamaz ya da itiraz etmez; Hikmet nötr. | çay buharı, martı | 1,3x | sert kesme |
| 6a Sayaç | 18,74–23,79 | Masa, üç kişi | Sayaç başlar: iki kart yan yana, sabit. Defne eli çenesinde düşünür, bakışı iki karta sırayla eşit sürede gider. Hikmet kameraya ve iki yana bakar; Necmi bekler. Sayaç alt bantta, perde yok. | saat ibresi, çay buharı, martı, kamera itmesi | 0,98x → 0,995x doğrusal | sert kesme |
| 6b Sayaç | 23,79–28,79 | Defne + iki kart + Hikmet | Defne düşünmeyi sürdürür; bakışı yine iki karta eşit, sonra tahtaya. | çay buharı, martı, kamera itmesi | 1,3x → 1,32x doğrusal | sert kesme (sayaç rakamı değişirken) |
| 7 İpucu | 28,79–31,85 | Masa, üç kişi | n1: Necmi Defne'ye döner, "hangisi"nde iki kez başını sallar. Defne Necmi'ye bakar, sonra yine tahtaya. Balon kesime kadar ekranda; iki kart son karede okunur. | saat ibresi, çay buharı, martı | 0,995x → 1,005x | sert kesme (sayaç biterken) |
| — Kesim | 31,85 | | `cevapsiz.mjs`: "Buldum!"dan 0,12 sn önce keser, takip kartını ekler. | | | |
| 8 Buldum (arşiv) | 31,97 | Defne | sıçrama, ışınlar | | 1,35x | |
| 9 Cevap ve çağrı (arşiv) | 34,8–42,9 | Masa | Defne konuşur. | | 1,0x | |

| id | Konuşan | Replik | Kelime | sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Defne, üç oyunluk bir dama maçı yapacaksın. Üst üste iki oyun kazanırsan bir hafta çay benden. | 16 | 0,30–5,94 |
| n0 | Necmi | Rakiplerin sırayla Hikmet Bey ve ben olacağız. | 7 | 6,24–8,95 |
| h2 | Hikmet | Ben ustayım, Necmi acemi. Sırayı sen seç: ben, Necmi, ben mi; yoksa Necmi, ben, Necmi mi? | 16 | 9,25–16,14 |
| d2 | Defne | Acemiyle iki kez oynamak daha kolay gibi. | 7 | 16,44–18,69 |
| n1 | Necmi | Mutlaka kazanman gereken oyun hangisi? | 5 | 29,09–31,67 |
| d3 | Defne | Buldum! Hikmet Bey, Necmi, Hikmet Bey. (arşiv) | 6 | 31,97–34,63 |
| d4 | Defne | Ortadaki oyunu kazanmadan üst üste iki galibiyet olmaz. Kolay rakip ortada olmalı. (arşiv) | 12 | 34,98–39,64 |
| d6 | Defne | Bunu her oyunda hesap yapan arkadaşına gönder. (arşiv) | 7 | 40,34–42,85 |

**Süre:** "Buldum!" öncesi 51 kelime. "Buldum!" 31,97 sn; cevaplı arşiv 45,6 sn; kesilmiş film ≈ 34,2 sn.

**Şartların filmdeki yeri (kesilmiş sürüm)**
- Üç oyun dama: h1, kart, insert ve masadaki tahta.
- Rakip her oyunda değişir, iki dizilimden biri: n0 ("sırayla"), h2, iki kart.
- Hikmet usta, Necmi acemi: h2, USTA / ACEMİ etiketleri, kartın ikinci satırı.
- Üst üste iki galibiyet → bir hafta çay: h1, kart, insert'te masaya konan ödül çayı.
- Sırayı Defne seçer: h2 ("Sırayı sen seç").

**Taslağa göre değişenler (şartlar, sayılar, cevap aynı)**
- **Kart:** belgedeki `Üst üste 2 galibiyet: çay benden.` / `Usta-acemi-usta mı, tersi mi?` yerine `Üst üste 2 galibiyet şart.` / `Rakip 2 kez usta mı, acemi mi?`. "Usta-acemi-usta"nın tersi yine usta-acemi-usta olduğu için "tersi" iki anlamlı okunabiliyordu; ilk satır eksiltiliydi ("…: çay benden"). İlk denemedeki `Ustayla 2 kez mi, acemiyle mi?` satırı bağımsız gözde "ustayı iki kez yen" diye de okunabildi; yeni satır seçimin rakip sırası olduğunu söyler, iki seçeneği eşit ağırlıkla adlandırır. "2 kez" + bir başka rakip üç oyunu da taşır.
- h1 "üç oyun dama oynayacaksın" → "üç oyunluk bir dama maçı yapacaksın": TTS "oyun dama"yı "oyunda mı" diye okuyordu (whisper "3 oyunda mı oynayacaksın?" duydu).
- n0 "Rakiplerin sırayla Hikmet Bey ve ben olacağız." aynı kaldı.
- n1 "Hangi oyunu mutlaka kazanman gerekiyor, önce onu düşün." → "Mutlaka kazanman gereken oyun hangisi?": d3 32. saniyeye sığsın diye (aynı ipucu, soru biçiminde).
- Hikmet'in iki satırı `rate: +2%`, Necmi'nin n0'ı `+0%`, n1'i `-2%`; d3 aralığı 0,3 sn, n1 aralığı 10,4 sn: süre bütçesi.
- Doküman sahnesindeki "iki sandalyeyi yer değiştirerek canlandırma" yerine iki kart: iki dizilimi aynı nesnede, eşit vurguyla gösteren ve sayaç boyunca yan yana okunur kalan tek yol buydu. Defne'nin yanlış denemesi sandalye çekmek yerine iki parmakla oynanır.

**Motor için**
- Kartların durumu tek fonksiyondadır (`kartAt`): cep → masanın arkasında bekleme (görünmez) → çevrilerek kalkış (0,38 sn) → tutuş (1,45 sn) → standa iniş (0,3 sn). Tutan el kartın dış kenarındadır, yazının üstüne binmez.
- Kadraj sınırları ölçülerek kuruldu: Necmi'nin başı x = NEC_X − 125'e kadar uzanır; sağa doğru x = NEC_X + 115'e. Defne'nin yakın plânı (1,3x, cx 568–570) B kartını güvenli alanda tutar ve Necmi'yi tamamen dışarıda bırakır; grup plânı (0,98x, cx 702) üç kişiyi tam alır (bağımsız gözün ikinci turunda Necmi'nin sağ kulağı kenarda kesiliyordu, bu yüzden 0,98x).
- Insert üstten ayrı bir çizimdir (dünya = ekran); taş dizilişi yan görünüşle aynı fonksiyondan (`taslar`) gelir, Defne'nin ittiği taş sonraki plânlarda da yeni yerindedir.
- Masanın üstüne uzanan kol 070'teki gibi masadan sonra yeniden çizilir (`kolUst`).
- Sayaç 070'teki bölüme özel sayaçtır (perde yok, alt bant). İpucu balonu kesime kadar kalır (`tlA`).
- Arşiv bölümündeki `cevap` sahnesi kesmesizdir (sert kesme sayısı 8'i aşmasın).
