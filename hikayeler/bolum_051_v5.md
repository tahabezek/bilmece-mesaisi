# 051 · Kimin sayısı büyük? (v5 storyboard, 2026-11-17)

Kaynak: `hikayeler/bolum_045-057.md` § 051, kanıt `research/ozgun_bilmeceler.md` § 5. Sahne: `engine/b051.js`. Bölüm dosyası: `bolumler/051-kimin-sayisi.json`. Yayın sırası 38 (rozet "BİLMECE #38"). Sayaç 10 sn (`cdSure: 10`), ipucu repliği yok (`countdown: "d3-0.3"`). Mekanizma: ortak bilgi.

- **Logline:** Hikmet, Defne'ye ve Necmi'ye 1–5 arasından birer sayı yazılı kâğıt verir ve sayıların ardışık olduğunu söyler. Defne "kimin büyük bilmiyorum", Necmi "ben de bilmiyorum", Defne "şimdi biliyorum" der. Masada iki sıra kutu durur; cevapta her "bilmiyorum" kendi kutularını kapatır ve Necmi kâğıdını çevirir: 3.
- **Akılda kalacak tek şey:** "Bilmiyorum" da bir bilgidir; her "bilmiyorum" birkaç seçeneği kapatır.
- **Kart:** `Sayılar 1–5 arası ve ardışık.` (29) / `Necmi'nin sayısı kaç?` (21)
- **Şartlar (değişmez):** İkisinin sayısı da 1–5 arasında ve ardışık. Konuşma sırası: Defne "Kimin büyük bilmiyorum", Necmi "Ben de bilmiyorum", Defne "Şimdi biliyorum".
- **Cevap (değişmez):** Necmi = 3. Build anında `mantik()` bütün ardışık çiftleri (8 çift) dener ve konuşmalara göre eler: Defne'nin elenenleri {1, 5}, Necmi'nin elenenleri {1, 2, 4, 5}, kalan çözüm Necmi = 3, Defne 2 ya da 4. Kapanan kutuların listesi bu fonksiyondan gelir.
- **Mekân:** Hikmet'in odası (önden). Uzun masanın arkasında soldan sağa Defne (x 330), Hikmet (x 540), Necmi (x 750). Masada Defne'nin önünde mercan çerçeveli 1–5 kutuları, Necmi'nin önünde zeytin çerçeveli 1–5 kutuları; ortada Hikmet'in çayı. Duvarda pencere, klasör rafı, saat.
- **Kâğıtlar:** Defne'ninki sağ elinde, Necmi'ninki sol elinde; ikisi de arkası kameraya dönük, rakam hiç görünmez. Necmi'nin kâğıdı yalnız cevapta "üç" kelimesinde çevrilir.
- **Kare 0:** Hikmet kâğıdı Necmi'ye uzatıyor, Defne kendi kâğıdını tutuyor ve şaşkın; iki sıra kutu masada hazır; kart üstte. 0,3 sn'de kâğıt Necmi'nin eline geçer ("pop").

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–4,9 | Oda, geniş | Hikmet kâğıdı Necmi'ye verir. "birden beşe"de iki sıradaki kutular sırayla kabarır. "ardışık"ta Hikmet iki parmak gösterir (h1). | saat; çay buharı, martı | 1,0x → 0,97x → 1,02x | (yok) |
| 2 Konuşmalar | 5,2–11,1 | Defne → Necmi → Defne | d1: Defne kâğıdına bakar, omuz silker. n0: kamera Necmi'ye kayar; kâğıdına bakar, omuz silker, "Müdür Bey"de Hikmet'e döner. d1b: kamera Defne'ye döner; gülümser, başını sallar. | saat; buhar | 1,3x, kesmesiz kayma | sert kesme |
| 3 Soru | 11,4–14,3 | Hikmet + Necmi | "Necmi'nin"de Hikmet Necmi'nin kâğıdını gösterir, Necmi kâğıdı göğsüne çeker (h2b). | buhar; saat | 1,28x → 1,31x | sert kesme |
| 4 Sayaç (10 sn) | 14,6–24,6 | Oda, geniş | Defne kâğıdına bakar, 1, 2, 3 kutularına dokunur (titrerler), Necmi'ye bakar, eli çenede düşünür. Necmi kâğıdına bakar, düşünür. Hikmet çayını alıp bırakır. Hiçbir kutu kapanmaz. | saat; buhar | 0,97x → 1,05x | sert kesme |
| 5 Buldum! | 24,9–25,7 | Defne | Sıçrama, kâğıtlı el havada, ışınlar (d3). | saat; buhar | 1,35x | "Buldum!" kesmesi |
| 6 Cevap | 25,7–36,3 | Oda, geniş | **Kahraman an.** d4: "bir"de Defne sol eliyle 1'i, "beş"te kâğıtlı eliyle 5'i iter; kutular öne kapanır; "hemen"de kalan 2, 3, 4 kabarır. d5: Necmi "bir, iki"de sol eliyle 1 ve 2'yi, "dört, beş"te sağ eliyle 4 ve 5'i kapatır; "Bilmediğine"de kâğıdını kaldırır, "üç"te çevirir: 3. Necmi'nin 3 kutusu yeşil, ✓. Ardından Defne kendi 3'ünü kapatır (2 ve 4 kalır). | saat; buhar | 0,97x → 1,1x (Necmi'ye) | sert kesme |
| 7 Espri | 36,3–40,2 | Hikmet + Defne | "kaçtı"da Defne'nin 2'si, "peki"de 4'ü kabarır; Hikmet kâğıda uzanır, Defne kâğıdı göğsüne çeker; "unuttum"da Hikmet eli çenede (h4). | saat; buhar | 1,3x → 1,33x | sert kesme |
| 8 Çağrı | 40,3–43,3 | Defne | Defne kâğıdı yanağının yanına kaldırır (arkası kamerada), kameraya bakar (d6). | martı; buhar | 1,36x → 1,4x | sert kesme |
| 9 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

**Nasıl oynanıyor**
- **Düzenek:** Her kişinin beş olasılığı masada kendi sırasında beş kutudur. Kâğıtlar kişilerin elinde, rakam görünmez.
- **Yanlış deneme:** Bu bölümde yok; tuzak ("bu bilgiyle bulunamaz") sayaçta Defne'nin kararsız dokunuşlarıyla taşınır.
- **Cevap:** Her cümle kendi sırasındaki kutuları kapatır. Görüntü cevabı d5'in son kelimesine kadar söylemez.
- **Espri:** Defne'nin sırasında 2 ve 4 kalmıştır; Hikmet hangisi olduğunu unutmuştur, Defne söylemez.

| id | Konuşan | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | İkinize birden beşe kadar birer sayı fısıldadım. Sayılarınız ardışık. | 9 | 0,30–4,85 |
| d1 | Defne | Kimin sayısı büyük, bilmiyorum. | 4 | 5,30–7,03 |
| n0 | Necmi | Ben de bilmiyorum, Müdür Bey. | 5 | 7,43–9,47 |
| d1b | Defne | Şimdi biliyorum işte! | 3 | 9,92–11,14 |
| h2b | Hikmet | Söyleyin bakalım, Necmi'nin sayısı kaç? | 5 | 11,54–14,28 |
| d3 | Defne | Buldum! Necmi'nin sayısı üç! | 4 | 24,88–26,90 |
| d4 | Defne | Benim sayım bir ya da beş olsaydı hemen bilirdim. | 9 | 27,25–29,72 |
| d5 | Defne | Necmi'nin sayısı bir, iki, dört ya da beş olsaydı o da bilirdi. Bilmediğine göre sayısı üç! | 16 | 30,07–35,51 |
| h4 | Hikmet | Defne'nin sayısı kaçtı peki? Ben de unuttum. | 7 | 36,46–39,70 |
| d6 | Defne | Bunu her şeyi bildiğini sanan arkadaşına gönder. | 7 | 40,40–42,86 |

**Süre:** 69 kelime ("Buldum!" öncesi 26). "Buldum!" 24,88 sn, toplam ≈ 45,3 sn.

**Taslağa göre değişen replikler**
- n0: "Ben de bilmiyorum." → "Ben de bilmiyorum, Müdür Bey.": üç kelimelik satır yutulma riski.
- h2b: "Necmi'nin sayısı kaç?" → "Söyleyin bakalım, Necmi'nin sayısı kaç?": kısa satır; "Peki" ile başlatmak P tuzağına düşerdi.
- d4: "Sayım bir ya da beş olsaydı hemen bilirdim. Bilmedim, Necmi bunu anladı." → "Benim sayım bir ya da beş olsaydı hemen bilirdim.": whisper "Sayım"ı "Sayın" duydu; ikinci cümle kutuların kapanmasıyla görüntüde taşınıyor.
- d5: "… benimkini bulurdu. Bulamadıysa üç!" → "… o da bilirdi. Bilmediğine göre sayısı üç!": eksiltili cümle düzeltildi; satır +4% hızla okunur (bir, iki, dört arası kutular için zaman).
- h4: "Peki Defne'nin sayısı kaçtı?" → "Defne'nin sayısı kaçtı peki?": satır P ile başlamasın.

**Motor için**
- Tek mekân `b051_oda`. Kutuların durumu `kutuAt(S, sıra, rakam, t)`: kapanma (`tm.kapa`, mantıktan), kabarma, dokunma titremesi, yeşil çerçeve.
- Kapanma: el kutunun üst kenarına gider (`itYolu`), kutu 0,2 sn'de öne kapanır (ivmeli düşüş, sekme yok), arkası koyu levha olarak masada kalır. Efekt temas karesinden 2 kare önce.
- Sayaç bölüme özeldir (`sayac`): kartın altında, yüzlerin üstünde; "İpucu geliyor" yazısı yok; paylaşım hapı masanın altında.

**Sağlamlık:** Sağlam (bkz. `mantik()`).
