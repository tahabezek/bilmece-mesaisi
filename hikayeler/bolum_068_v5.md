# 068 · Hikmet Bey'in bardağı (v5 storyboard, cevapsız tasarım, 2026-11-22)

Kaynak: `hikayeler/bolum_064-069.md` § 068. Sahne: `engine/b068.js`. Bölüm dosyası: `bolumler/068-bardak.json` (`cevapsizTasarim: true`). Yayın sırası 56 (rozet "BİLMECE #56"). Sayaç 10 sn, `countdown: "n1-0.3"`. Mekanizma: iki ihtimal, tek sonuç.

- **Logline:** Hikmet bir kâğıda gizlice bir dem ve bir şeker durumu yazar; yazdığı iki özellikten yalnızca birine uyan çayı içecektir. Tezgâhta dört bardak durur. Necmi demli şekerli bardağı önüne iter, Hikmet "Bu bardağı içerim" der. Kâğıt şekerliğin altında kapalı durur; geriye üç bardak kalır.
- **Akılda kalacak tek şey:** Kâğıtta ne yazdığını bilmeden de hangi bardağı içeceği bilinir.
- **Kart:** `Yalnız bir özelliği uyanı içer.` (31) / `Hangi bardağı kesin içer?` (25). Belgedeki 36 ve 37 harflik satırlar ortak kartta 43 px'e küçülüyordu; kısaltılmış satırlar 54 px'te kalıyor.
- **Bardaklar (değişmez; kod yükleme anında denetler):** Soldan sağa açık şekersiz, açık şekerli, demli şekersiz, demli şekerli. Necmi'nin ittiği demli şekerlidir.
  - Dem çayın renginden okunur: demli koyu kızıl (`#7E1B10`), açık soluk kehribar (`#E8A548`).
  - Şeker tabaktan okunur: şekerlide bardağın iki yanında birer kesme şeker (toplam iki küp, 42 px), şekersizde boş tabak. Tabaklar petrol yeşilidir; beyaz küp üstünde seçilir.
  - Bardak boyu 170, eni 84 dünya pikseli. En geniş plânda (1,0x) ekranda 84 px, kalan üç bardağın plânında (1,3x) 109 px genişliğindedir; 360 px genişlikte 28 ve 36 px eder.
- **Etiketler:** Yalnızca ilk tanıtımda (d1a, d1b). İki satırlı hardal kutu, 46 px, kuyruğu bardağını gösterir: `AÇIK ŞEKERSİZ`, `AÇIK ŞEKERLİ`, `DEMLİ ŞEKERSİZ`, `DEMLİ ŞEKERLİ`. Aynı anda en çok iki etiket; dördü de aynı biçimdedir. Etiket, Defne'nin saydığı adın ölçülmüş başlangıcından 0,04 sn önce gelir; en kısa kalan etiket 1,4 sn ekrandadır. Bu iki repliğin altyazı balonu yoktur: etiket aynı sözü taşır ve balonun yerinde durur.
- **Cevap (arşiv, kesilir):** Açık şekersiz. Kâğıtta ya "demli, şekersiz" ya da "açık, şekerli" yazıyor; iki durumda da açık şekersiz yalnızca bir özelliğe uyar.
- **Kadro:** Hikmet, Defne, Necmi. Kerem yok.
- **Mekân:** `b068_ocak` (çay ocağı). Önde taş tezgâh: üst yüzeyi görünür, bardaklar ön sırada, şekerlik ve çaydanlık arka sırada durur. Üç kişi tezgâhın arkasındadır (soldan sağa Defne, Necmi, Hikmet). Duvar yarım boy fayans, Hikmet'in yanında pencere. 059'daki çay ocağından farkı: orada kiler dolabı ve cam bölme vardı, kişiler tezgâhın önündeydi; burada kamera tezgâhın müşteri tarafındadır.
- **Tezgâha uzanan kol:** Aşağı sarkan kol tezgâhın arkasında kalır. Tabağı iten, kâğıdı sıkıştıran, bardağı alan ve bardağı gösteren kol tezgâhın üstüne yeniden çizilir; el nesnenin üstündedir.
- **Sızıntı yasağı:**
  - Kâğıt katlıdır, üstünde yazı yoktur; içi hiç görünmez.
  - Hiçbir bardak renk, ışık ya da işaretle vurgulanmaz. Sayaçta Defne'nin parmağı kalan üç bardakta eşit süre durur (her birinde 2,5 sn, aynı anlarda iki dokunuş; geçişler 0,3 sn). Kod bu eşitliği denetler.
  - Sayaca girilirken ve kesimde kimsenin parmağı ya da bakışı bir bardakta değildir: Defne sayaca Necmi'ye bakarak girer, son karede eli çenesinde yukarı bakar; Necmi kameraya bakar.
  - Sayaç ve ipucu plânında altyazının kuyruğu yoktur (Necmi üçüncü bardağın arkasında durur; kuyruk o bardağı gösterirdi).
  - Hikmet öbür bardaklara uzanmaz; bakışı kâğıtta, Necmi'de ve kamerada gezer, bardaklarda oyalanmaz.
  - Cevabın işareti (yeşil onay) yalnızca arşiv bölümündedir.
- **Kare 0:** Üstte kart. Hikmet katlı kâğıdı iki eliyle göğsüne bastırıyor; Defne ile Necmi ona bakıyor; tezgâhta dört bardak, şekerlik. 0,15 sn'de Hikmet kâğıdı havaya kaldırır, bardaklardan buhar yükselir; ses 0,30 sn'de başlar.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | Döngüler | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–2,58 | Tezgâh, üç kişi, dört bardak | Hikmet katlı kâğıdı göğsünden kaldırıp gösterir; "gizlice"de öbürlerine yan bakar. Defne ile Necmi kâğıda bakar (h1, ilk cümle). | bardak buharı | 1,0x | (yok) |
| 2 Kâğıt | 2,58–4,24 | Hikmet yakın | "çayın demini ve şekerini": kâğıdı iki kez sallar (pop ×2). | bardak buharı, çaydanlık buharı, pencerede martı | 1,44x | sert kesme |
| 3 Açık çift | 4,24–6,92 | Defne, Necmi, dört bardak | Defne sol eliyle birinci, sağ eliyle ikinci bardağı gösterir; adıyla birlikte etiketi çıkar (d1a; pop ×2). Hikmet kadraj dışında. | bardak buharı | 1,2x | sert kesme |
| 4 Demli çift | 6,92–10,02 | Tezgâh, üç kişi | Kamera sağa kayar. Defne üçüncü bardağı, Necmi dördüncü bardağı gösterir; etiketleri çıkar (d1b; pop ×2). Hikmet kâğıdı göğsünde tutar. | bardak buharı | 1,2x → 1,0x kayma | (kesme yok) |
| 5 Kural | 10,02–16,05 | Hikmet yakın | Hikmet kâğıdı havada tutar. "yalnızca birine"de öbür elinin işaret parmağını kaldırır. "içmem"de başını iki yana sallar. Başka hareket yok (h2a, h2b ilk cümle). | bardak buharı, çaydanlık buharı, martı | 1,44x → 1,42x | sert kesme |
| 6 İkili | 16,05–23,21 | Necmi + Hikmet, iki demli bardak, şekerlik | "Hiçbirine uymayanı da içmem"de Hikmet kâğıdı şekerliğin altına sıkıştırır (17,2–18,0; şekerlik hafif kalkar, pop). n0: Necmi "Demli ve şekerli"de tabağı sol kenarından iter (20,3–21,3); tabak şekerliğin önünden kayıp Hikmet'in önünde durur (zip, pop). h3: Hikmet "Evet"te başını sallar, bardağı belinden tutup alır. | bardak buharı, çaydanlık buharı, martı | 1,15x | sert kesme |
| 7 Yudum | 23,21–24,22 | Hikmet yakın | "içerim": bardağı ağzına götürür, bir yudum içer; çay seviyesi iner. | çaydanlık buharı, martı | 1,48x | sert kesme (kısa plân) |
| 8 Üçlü | 24,22–26,79 | Defne + Necmi, kalan üç bardak, şekerlik ve kâğıdın ucu | d2: Defne kâğıda doğru bakar, "bilmiyoruz"da omuz silker. | bardak buharı | 1,28x | sert kesme |
| 9 Soru | 26,79–30,65 | Hikmet yakın, elinde bardak | "üç bardak"ta üç parmağını kaldırır; "Hangisini kesinlikle içerim?"de kameraya döner, bardağını hafifçe kaldırır (h4). | bardak buharı, çaydanlık buharı, martı | 1,45x | sert kesme |
| 10 Sayaç (10 sn) | 30,65–40,7 | Defne + Necmi, kalan üç bardak, şekerlik ve kâğıdın ucu | Defne'nin parmağı üç bardakta sırayla ve eşit süre durur (sol el birinci, sağ el ikinci ve üçüncü bardak); her birine iki kez dokunur. Necmi bıyığını sıvazlar, parmağı izler. Sonda Defne elini çenesine koyar. Sayaç altta: daire solda, "SEN DE DÜŞÜN!" ve paylaşım hapı sağında; perde yok. | bardak buharı ×3, kamera itmesi | 1,2x → 1,3x doğrusal itme | sert kesme |
| 11 İpucu | 40,7–47,71 | Aynı plân | n1: Necmi "Kâğıtta yazanlar"da şekerliğin altındaki kâğıda bakar, "iki ihtimal"de iki parmağını kaldırır (pop), "İkisini de deneyin"de parmaklarını sallayıp Defne'ye döner, replikten sonra kameraya başını sallar. Defne "iki ihtimal"de şaşırır, eli çenesinde düşünür. Balon kesime kadar ekranda kalır (replikten sonra 2,1 sn okuma payı); üç bardak balonun üstünde tam görünür. | bardak buharı ×3, kamera itmesi | 1,3x → 1,35x | (kesme yok) |
| — Kesim | 47,71 | | `cevapsiz.mjs`: "Buldum!"dan 0,12 sn önce keser, takip kartını ekler. | | | |
| 12 Buldum (arşiv) | 47,83 | Defne yakın | sıçrama, ışınlar | | 1,35x | |
| 13 Cevap (arşiv) | 50,07–59,24 | Üçlü plân | Defne açık şekersiz bardağı gösterir, yeşil onay çıkar; çağrıda kameraya döner. | | 1,28x → 1,31x | |

**Nasıl oynanıyor**
- **Düzenek:** Dört bardak tezgâhta, bölüm boyunca aynı yerde. Renk ve şeker her plânda okunur; etiket yalnızca tanıtımda gelir.
- **Kural:** Soyut olduğu için iki replik boyunca ekranda yalnızca Hikmet, kâğıt ve tek parmak vardır. Kâğıdın şekerliğin altına girişi kuralın bittiği anda oynanır.
- **Deneme:** Necmi tabağı gerçekten iter (el tabağın kenarında, 95 px itip bırakır; tabak kayarak durur). Hikmet bardağı alır ve içer: kural bir kez nesneyle uygulanmış olur.
- **Sayaç:** Kalan üç bardak, şekerlik ve kâğıdın ucu aynı kadrajdadır. Hareketi Defne'nin parmağı, Necmi'nin eli, buhar ve kamera itmesi taşır.
- **İpucu:** Necmi cevabı söylemez; kâğıtta yazabilecek şeylerin iki tane olduğunu söyler ve iki parmağını gösterir.

| id | Konuşan | Replik | Kelime | sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Bu kâğıda gizlice iki şey yazdım: çayın demini ve şekerini. | 10 | 0,30–4,04 |
| d1a | Defne | Açık şekersiz, açık şekerli. | 4 | 4,54–6,25 |
| d1b | Defne | Demli şekersiz, demli şekerli. | 4 | 7,55–9,37 |
| h2a | Hikmet | Yazdığım iki özellikten yalnızca birine uyan çayı içerim. | 8 | 10,12–13,83 |
| h2b | Hikmet | İkisine de uyanı içmem. Hiçbirine uymayanı da içmem. | 8 | 14,33–17,98 |
| n0 | Necmi | Şansımı deniyorum. Demli ve şekerli. | 5 | 18,68–21,63 |
| h3 | Hikmet | Evet, bu bardağı içerim. | 4 | 22,13–23,82 |
| d2 | Defne | Kâğıtta ne yazdığını hâlâ bilmiyoruz. | 5 | 24,32–26,39 |
| h4 | Hikmet | Geriye üç bardak kaldı. Hangisini kesinlikle içerim? | 7 | 26,89–30,40 |
| n1 | Necmi | Kâğıtta yazanlar için yalnızca iki ihtimal var. İkisini de deneyin. | 10 | 41,00–45,63 |
| d3 | Defne | Buldum! Açık ve şekersiz olanı. (arşiv) | 5 | 47,83–49,92 |
| d4 | Defne | Kâğıtta ya demli şekersiz ya da açık şekerli yazıyor. İkisinde de açık şekersiz yalnızca birine uyar. (arşiv) | 16 | 50,27–55,76 |
| d6 | Defne | Bunu çayına karışılmasını sevmeyen arkadaşına gönder. (arşiv) | 6 | 56,46–59,14 |

**Süre:** "Buldum!" öncesi 65 kelime. "Buldum!" 47,83 sn; cevaplı arşiv 61,54 sn; kesilmiş film 50,0 sn.

**Şartların filmdeki yeri (kesilmiş sürüm)**
- Dört bardak ve adları: plân 3–4 (söz, etiket, renk, şeker).
- Kâğıda gizlice dem ve şeker yazıldı: h1; kâğıt katlı, sonra şekerliğin altında.
- Yalnızca birine uyanı içer; ikisine de uyanı ve hiçbirine uymayanı içmez: h2a, h2b; kart.
- Necmi demli şekerliyi uzattı, Hikmet "içerim" dedi: n0, h3 (itme, alma, yudum).
- Kâğıtta ne yazdığı bilinmiyor: d2; şekerliğin altındaki kâğıt.
- Soru: h4; kart.

**Taslağa göre değişenler (şartlar, sayılar, cevap aynı)**
- d1a ve d1b eklendi: taslakta dört bardağı sayan replik yoktu. Bardak adları bir kez sesle ve etiketle birlikte verilir; iki ayrı satır olması, ikinci etiketin de yeterince ekranda kalmasını sağlar.
- n0 "Şansımı deneyeyim" → "Şansımı deniyorum": TTS "deneyeyim"i "deneyim" diye okuyordu.
- Kart kısaltıldı (yukarıda).
- Aralar: d1a'dan sonra 1,3 sn (açık çiftin etiketleri okunsun, kamera kaysın), n1'den sonra 2,2 sn (ipucunu okuma payı).

**Motor için**
- Karakterler tezgâhın arkasında durduğu için kol katmanı elle yönetilir: `kolUst` kolun arka kenardan aşağıda kalan kısmını tezgâhtan sonra yeniden çizer (1–2 karelik geçişle), `elUst` eli nesnenin üstüne koyar.
- Sayaç bu bölüme özel (064'teki düzen): perde yok; daire, başlık ve paylaşım hapı alt bantta (y 1234–1406). İpucu balonu aynı banda geldiği için sayaç son 0,3 sn'de çekilir.
- Altyazı için ayrı çizelge (`tlA`): d1a ve d1b çıkarılır; n1'in bitişi "Buldum!"a çekilir ve iki cümlesi tek balonda durur ("iki ihtimal" bölünmez boşlukla yazılır).
- Altyazı kuyruğu kısa tutulur: baş noktası balonun hemen üstüne indirilir, kuyruk bardakların üstünden geçmez. Sayaç ve ipucu plânında kuyruk hiç çizilmez.
- Kadraj dışındaki kişi çizilmez: kalan üç bardağın plânlarında ve açık çift plânında Hikmet yoktur. İkili plânda Necmi bir adım sağda durur (Defne'nin saçı ve ikinci tabak kadraja girmesin).
- Yüzün önüne gelen eller (Necmi'nin bıyığındaki eli, Defne'nin çenesindeki eli) en son çizilir: `drawChar` eli başın arkasında bırakıyor.
- Geniş plânlar 1,0x: dört bardak (712 px), şekerlik ve üç kişi aynı karede. Brifin 1,25–1,3x aralığına inmiyor; bardakları küçültmemek için bu seçildi. Yakın plânlar 1,42–1,48x: 1,5x'in üstünde bardaklar altyazının altında kalıyor.
- `film.kontrol()` üç uyarı verir, üçü de bilinçli: 10 sert kesme (kesilmiş filmde 8), yudum plânında 1,48x, sayaç plânında 17 sn tek anahtar (kamera `kamera()` içinde doğrusal itilir).
