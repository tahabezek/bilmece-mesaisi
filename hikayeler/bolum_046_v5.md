# 046 · Taş, kâğıt, zar (v5 storyboard, 2026-11-17)

Kaynak: `hikayeler/bolum_045-057.md` § 046. Sahne: `engine/b046.js`. Bölüm dosyası: `bolumler/046-tas-kagit-zar.json`. Yayın sırası 33 (rozet "BİLMECE #33"). Mekanizma: geçişsizlik.

- **Logline:** Hikmet'in masasında üç zar vardır. "Önce sen seç, ben sonra seçerim" der. Defne en büyük sayılı dokuzlu zarı alır ve dokuz atışta 6–3 yenilir. Çay ocağında Necmi'yle Kerem'in taş-kâğıt-makas oyunu ona daireyi hatırlatır.
- **Akılda kalacak tek şey:** En iyi zar yoktur. Her zarı yenen başka bir zar vardır; sonra seçen hep kazanır.
- **Kart:** `Önce sen seç, sonra Hikmet seçer.` (33) / `Neden hep Hikmet kazanıyor?` (27)
- **Zarlar (değişmez):** A 2-2-4-4-9-9 (dokuzlu, hardal) · B 1-1-6-6-8-8 (sekizli, yeşil) · C 3-3-5-5-7-7 (yedili, mercan). Karşılıklı yüzler aynıdır. Her zarın arkasında yüz kartı durur: üç sütun, iki satır (karşılıklı yüzler alt alta), rakamlar dünyada 48 px.
- **Cevap (değişmez):** A, B'yi; B, C'yi; C de A'yı 9'da 5 ihtimalle yener (36 eşleşmenin 20'si). Sonra seçen, karşısındakini yenen zarı alır. Build anında denetlenir.
- **Yanlış denemenin dokuz atışı (sabit liste, [A, C]):** 9-5 D · 2-3 H · 4-5 H · 9-7 D · 2-7 H · 4-3 D · 2-5 H · 4-7 H · 2-3 H → 3–6. Her atışın kazananı ve skor build anında denetlenir.
- **Mekânlar:** Hikmet'in odası (önden: pencere, raf, duvar saati, masa, sağda dolabın üstünde tavla takımı) · çay ocağı (`cayOcagi`) · tepsi yakın planı (kuşbakışı).
- **Kare 0:** Hikmet masanın arkasında; yedili zar sol elinin altında havada, 0,3 sn'de masaya düşer ("tok"). Dokuzlu ve sekizli zar yüz kartlarının önünde. Defne solda, ağzı açık. Üstte kart.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–2,4 | Oda, masa | 0,3 sn: yedili zar düşer, kamera 1,11x'e iter. Hikmet kendinden emin (h1). | saat; pencerede martı | 1,05x → 1,11x | (yok) |
| 2 Düzenek | 2,6–6,8 | Oda | "Önce sen seç"te Hikmet Defne'yi gösterir, "ben"de elini göğsüne koyar; "Kim büyük atarsa"da sekizli ve yedili zara dokunur, zarlar kabarır (h2a). | saat; çay buharı | 1,05x → 1,2x, kesmesiz | (yok) |
| 3 Soru | 7,0–10,5 | Masa yakın | Hikmet sekizli zarı kaldırır, üç kez çevirir (8 → 6 → 1 → 8), yerine koyar; "Neden hep ben"de kameraya bakar (h2b). | saat; çay buharı | 1,34x | sert kesme |
| 4 Bahis | 10,8–12,7 | Masa → dolap | Kamera sağa kayar; "tavla"da Hikmet dolabın üstündeki tavla takımına dokunur, çanta kabarır (h3). | saat; çay buharı | 1,3x | (yok) |
| 5 Yanlış deneme | 13,1–19,3 | Masa, iki kişi | d2: Defne dokuzlu zarı alır, gösterir; "en"de Hikmet yediliyi alır; "onda!"da ilk atış: 9–5, Defne önde (1–0). hd: dokuz atış; her atışta kazananın yığınına bir pul düşer, üstte "Defne 1 – 0 Hikmet" skor etiketi; "ikilerin"de Defne'nin zarında 2. "kazandım"da 3–6 mercan. | saat; çay buharı | 1,12x → 1,15x | sert kesme |
| 6 Sayaç (10 sn) | 19,6–29,6 | Oda, geniş | Defne dokuzluyu alır, çevirir (2 → 4 → 9 → 2), bırakır; parmaklarıyla üçe kadar sayar, eli çenede düşünür. Hikmet bakışlarını gezdirir, başını sallar, yediliye dokunur. Son 0,75 sn: Defne sağa bakar. | saat; çay buharı | 1,0x → 1,02x | sert kesme |
| 7 İpucu | 29,5–33,4 | Çay ocağı | Necmi ile Kerem taş-kâğıt-makas oynar; her tur iki sallama ve ortaya çıkış: "Makas"ta makas–kâğıt, "kâğıt"ta kâğıt–taş, "taş"ta taş–makas. Kerem her seferinde yenilir (n1). | çaydanlık buharı; musluk damlası | 1,55x → 1,58x | bakış kesmesi |
| 8 Buldum! | 33,6–35,5 | Oda, Defne | Defne dokuzlu zarı havaya kaldırıp sıçrar; ışınlar (d3). | saat; martı | 1,35x | "Buldum!" kesmesi |
| 9 Cevap | 35,6–43,5 | Tepsi, kuşbakışı | **Kahraman an.** Defne'nin eli dokuzluyu tepsinin üst köşesine koyar. "Dokuzlu sekizliyi"de parmağı A → B okunu çizer, "sekizli yediliyi"de B → C, "yedili de dokuzluyu"da C → A: oklar daire çizer. d5: Defne dokuzluyu seçer (zarın çevresinde hardal halka), Hikmet'in eli üstten gelip yediliyi kendine çeker; C → A oku yeşil yanar. Oklardan sonra beyaz bir işaret daire boyunca döner. | çay buharı; dönen işaret | 1,0x → 1,03x | sert kesme |
| 10 Espri | 43,5–46,1 | Oda | Hikmet'in yüzü düşük; "tavla takımı"nda çantayı masada Defne'ye doğru iter (h4). | saat; çay buharı | 1,3x → 1,33x | sert kesme |
| 11 Çağrı | 46,6–49,1 | Oda, Defne | Defne tavla çantasını tutamağından kaldırır, kameraya bakar (d6). | saat; martı | 1,36x → 1,4x | sert kesme |
| 12 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

**Nasıl oynanıyor**
- **Düzenek:** Zarlar ve yüz kartları masada; Hikmet zarı çevirerek hilesiz olduğunu gösterir.
- **Yanlış deneme:** Gerçekten dokuz atış oynanır. Sonuç pul yığınlarında (3 beyaz, 6 koyu) ve skor etiketinde görünür.
- **İpucu:** Necmi cevabı söylemez; taş-kâğıt-makasın döngüsünü oynar.
- **Cevap:** Tepsinin üç köşesinde üç zar, oklar daire çizer. Defne hangi zarı alsa Hikmet okun öbür ucundakini alır.
- **Espri:** Hikmet'in sırrı çözülür, tavla takımını kendi eliyle verir.

| id | Konuşan | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Bu üç zarla beni kimse yenemiyor! | 6 | 0,30–2,35 |
| h2a | Hikmet | Önce sen seç, ben sonra seçerim. Kim büyük atarsa kazanır. | 10 | 2,65–6,78 |
| h2b | Hikmet | Bu zarlar hileli değil. Neden hep ben kazanıyorum? | 8 | 7,08–10,49 |
| h3 | Hikmet | Yenersen tavla takımı senin. | 4 | 10,84–12,73 |
| d2 | Defne | Dokuzlu zarı alırım, en büyük sayı onda! | 7 | 13,18–15,37 |
| hd | Hikmet | Dokuz var ama ikilerin de var. İşte yine kazandım. | 9 | 15,77–19,26 |
| n1 | Necmi | Makas kâğıdı, kâğıt taşı, taş da makası yener. | 8 | 29,86–33,34 |
| d3 | Defne | Buldum! En iyi zar yok! | 5 | 33,66–35,32 |
| d4 | Defne | Her zarı yenen bir zar var. Dokuzlu sekizliyi, sekizli yediliyi, yedili de dokuzluyu yener. | 14 | 35,67–40,81 |
| d5 | Defne | Sonra seçen yenen zarı alır! | 5 | 41,16–42,77 |
| h4 | Hikmet | Sırrım çözüldü, tavla takımı senin. | 5 | 43,67–46,08 |
| d6 | Defne | Bunu önce seçmeyi seven arkadaşına gönder. | 6 | 46,78–49,07 |

**Süre:** 87 kelime ("Buldum!" öncesi 52). "Buldum!" 33,66 sn, toplam 51,47 sn.

**Taslağa göre değişen replikler**
- h2a: "Büyük atan kazanır." → "Kim büyük atarsa kazanır.": whisper "Büyük hatan" duydu.
- h2b: "Zarlar hileli değil." → "Bu zarlar hileli değil.": cümle başındaki "Zarlar" "Sağlar" duyuldu.
- hd: "Bak, yine kazandım." → "İşte yine kazandım.": "Bak" yutuldu.
- n1: "Taş makası, makas kâğıdı, kâğıt da taşı yener." → "Makas kâğıdı, kâğıt taşı, taş da makası yener.": satır T ile başlamasın diye döngü makastan başlatıldı; anlam aynı.
- d4: "Birinci ikinciyi, ikinci üçüncüyü, üçüncü birinciyi" → "Dokuzlu sekizliyi, sekizli yediliyi, yedili de dokuzluyu": ekrandaki zarların adlarıyla eşleşir ve "yedili dokuzluyu yener" sürprizi söylenir. "Her zarı yenen başka bir zar var" → "Her zarı yenen bir zar var" (bütçe).
- d5: "hep" çıktı (bütçe).
- h4: "Sırrımı çözdün" → "Sırrım çözüldü": ikinci tekil geçmiş zaman tuzağı.

**Motor için**
- Zarlar tek tabloda (`ZAR`); atışlar `ATIS`, skor `SKOR`. Yanlış denemede zarın yeri ve yüzü `atisZar(t)` fonksiyonundan okunur; her atış 0,26 sn havada kalır, temas karesinde durur.
- Atış anları `tm.r`: ilki "onda!"da, dokuzuncusu "kazandım"da; aralarda eşit.
- Kahraman an ayrı bir kuşbakışı dünyada çizilir (`tepsi`). Okların ilerlemesi ile Defne'nin parmağı aynı eğriden (`okU`) okunur.
- Taş-kâğıt-makas turları `tm.tur`: her tur 0,5 sn sallama ve ortaya çıkış; el şekilleri `elSekli`.

**Sağlamlık:** Sağlam. 36 eşleşmede A–B 20–16, B–C 20–16, C–A 20–16. Hangi zar seçilirse seçilsin, onu yenen zar vardır.
