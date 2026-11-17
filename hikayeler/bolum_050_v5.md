# 050 · Bayramlaşma (v5 storyboard, 2026-11-17)

Kaynak: `hikayeler/bolum_045-057.md` § 050. Sahne: `engine/b050.js`. Bölüm dosyası: `bolumler/050-bayramlasma.json`. Yayın sırası 40 (rozet "BİLMECE #40"). Sayaç 10 sn (`cdSure: 10`), ipucu repliği var (`countdown: "n1-0.3"`). Mekanizma: el sıkışma önermesi (parite).

- **Logline:** Bayram sabahı ofiste yedi kişi aile fotoğrafı gibi iki sıra olmuş bayramlaşıyor. Her bayramlaşma, iki kişinin göğsündeki sayaç rozetlerini bağlayan bir kurdeledir. Hikmet defterine göre "tek sayıda kişiyle bayramlaşan tam beş kişi" olduğunu söyler. Defne saymadan "Beş olamaz!" der: her kurdele iki rozeti birden bir artırır, tek sayılı (mercan) rozetlerin adedi hep çift kalır.
- **Akılda kalacak tek şey:** Kurdelenin iki ucu vardır. Tek sayılı rozetler her zaman çift sayıda olur.
- **Kart:** `Tek sayıda kişiyle bayramlaşan: 5 kişi.` (39) / `Defne saymadan "Olamaz" dedi. Neden?` (36)
- **Şart (değişmez):** İki kişi en fazla bir kez bayramlaşır.
- **Cevap (değişmez):** Her bayramlaşma iki kişinin sayısına birer ekler, toplam hep çifttir. Toplam çiftse tek sayıların adedi de çifttir; 5 olamaz.
- **Kadro ve diziliş (soldan sağa):** F1 (`b050_f1`, şeker tabağı) · Defne · Hikmet (defter, kalem) · Kerem · Necmi (kolonya) · F2 (`b050_f2`) · F3 (`b050_f3`). Defne, Kerem ve F2 bir adım geride durur (arka sıra, ölçek 0,95). Kadro ölçeği 0,68.
- **Kurdele dizisi (kodda sabit liste `KURDELE`, build anında `denetle()`):**
  - Önceden bağlı: F1–Defne, Necmi–F2, Hikmet–F3, F1–Kerem.
  - Canlı: F2–F3 (kanca, el sıkışma), Hikmet–Kerem (sayaç, el öpme), Kerem–Necmi (ipucu, el sıkışma).
  - Cevapta: F1–F3 (çift + çift), Defne–Kerem (tek + tek), F3–Necmi (tek + çift).
  - `denetle()` şunları denetler: aynı çift iki kez yok; her adımda tek rozetlerin adedi çift; cevaptaki dizi 2 → 4 → 2 → 2. Tutmazsa build hata verir.
  - Rozet değerleri listeden türetilir (`iz`). TEK ve TOPLAM etiketleri de listeden sayılır, elle yazılmaz.
- **Kare 0:** Geniş plan. Yedi kişi rozetleriyle duruyor, aralarında dört kurdele var. Sağda F2 ile F3'ün elleri buluşmak üzere. Hikmet defterini tutuyor, Defne şaşkın. Kart üstte. 0,3 sn'de eller buluşur ("pop"), 0,75'te yeni kurdele açılır, iki rozet kabarır ve "+1" pulları çıkar (rozetlerde rakam yok).

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–4,2 | Ofis, geniş | F2–F3 el sıkışır, kurdele ortadan iki uca açılır, rozetler döner. Hikmet deftere yazar (h1). | saat, pencerede martı | 1,12x → 1,15x | (yok) |
| 2 Şart | 4,2–6,9 | F1 + Defne | F1, Defne'ye yeniden el uzatır. "fazla"da Defne aralarındaki kurdeleyi kaldırıp gösterir, "bir kez"de F1 elini çeker ve başını sallar (h2a). | saat, sehpada çay buharı | 1,4x | sert kesme |
| 3 Soru | 6,9–11,5 | Hikmet | Kamera Hikmet'e kayar. Defteri göğsüne kaldırır, "beş"te kalemle halkalı "5"e dokunur. "Doğru mu?"da kameraya bakar (h2b). | saat, buhar | 1,42x → 1,46x (kesmesiz kayma) | (yok) |
| 4 Yanlış deneme | 11,8–18,1 | Defne + Hikmet | d2: Hikmet defteri uzatır, Defne satırlara parmağıyla tek tek dokunur. hd: "yüzlerce"de defterden katlı bir şerit zemine kadar sarkar, Defne şaşırır. | saat, buhar | 1,3x → 1,2x | sert kesme |
| 5 Sayaç (10 sn) | 18,4–28,4 | Ofis, geniş | Hikmet şeridi defterine toplar. Kerem, Hikmet'in elini öper (kurdele açılır, iki rozet döner). Defne rozetlere tek tek bakıp parmaklarıyla sayar, sonra eli çenesinde düşünür. Necmi F2'nin avucuna kolonya döker, F2 ellerini ovuşturur. Mercan vurgusu yok. | saat, martı | 1,12x → 1,15x | sert kesme |
| 6 İpucu | 28,4–32,4 | Kerem + Necmi | Necmi ile Kerem el sıkışır. "sıktı"da kurdele açılır ve iki rozet aynı anda döner (n1). | martı, saat | 1,4x | sert kesme |
| 7 Buldum! | 32,4–33,3 | Defne | Sıçrama, ışınlar (d3). | saat, buhar | 1,45x | "Buldum!" kesmesi |
| 8 Cevap | 33,3–44,3 | Ofis, geniş | **Kahraman an.** "olamaz"da tek rozetler sırayla mercan yanar, "TEK: 2" etiketi gelir. d4: F1 ile F3 uzaktan selamlaşır, kurdele F1'den F3'e uçar, "birer"de iki rozet döner ve mercan olur (TEK: 4). "toplarsan"da "TOPLAM: 16". d5: "sayıların"da Defne–Kerem kurdelesi iki mercanı söndürür (TEK: 2, TOPLAM: 18). "çift"te F3–Necmi kurdelesi mercanı F3'ten Necmi'ye geçirir (TEK: 2, TOPLAM: 20). "Beş"te Hikmet defteri kaldırır, "tek"te defterdeki 5'in üstüne ✗ gelir. | saat, martı | 1,12x → 1,13x | sert kesme |
| 9 Espri | 44,3–47,4 | Hikmet + Kerem | Hikmet defterdeki 5'in üstünü çizer, yanına 6 yazar. Kerem başını sallar (h4). | saat, buhar | 1,42x → 1,44x | sert kesme |
| 10 Çağrı | 47,4–50,6 | Defne + F1 | F1 tabağı öne uzatır. Defne bir şeker alır, yanağının yanına kaldırır, kameraya bakar (d6). | saat, buhar | 1,4x → 1,43x | sert kesme |
| 11 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

**Nasıl oynanıyor**
- **Düzenek:** Bayramlaşma bir kurdeledir, rozet kişinin kaç kişiyle bayramlaştığını gösterir. "En fazla bir kez" şartını Defne aralarındaki kurdeleyi kaldırarak gösterir.
- **Yanlış deneme:** Defne defteri satır satır saymaya kalkar, defterden zemine kadar sarkan şerit "olmaz" der.
- **İpucu:** Necmi cevabı söylemez. El sıkıştığında iki rozetin aynı anda döndüğü görünür.
- **Cevap:** Mercan vurgusu ve TEK/TOPLAM etiketleri yalnız "Buldum!"dan sonra gelir. Üç kurdele üç durumu gösterir (+2, −2, 0) ve TEK hep çift kalır.
- **Espri:** Hikmet defterde bir kişiyi eksik yazmıştır, 5'i 6'ya çevirir.

| id | Konuşan | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Bayramlaşma defterini tuttum: kim kiminle bayramlaşmış! | 6 | 0,30–3,99 |
| h2a | Hikmet | İki kişi en fazla bir kez bayramlaşır. | 7 | 4,29–6,66 |
| h2b | Hikmet | Defterde tek sayıda kişiyle bayramlaşan tam beş kişi var. Doğru mu? | 11 | 6,96–11,49 |
| d2 | Defne | Defteri baştan sayalım; kim kiminle bayramlaşmış? | 6 | 11,94–14,64 |
| hd | Hikmet | Saymadan bil, defterde yüzlerce satır var! | 6 | 15,04–18,09 |
| n1 | Necmi | Ben kimin elini sıktıysam, o da benim elimi sıktı. | 9 | 28,69–32,12 |
| d3 | Defne | Buldum! Beş olamaz! | 3 | 32,44–33,93 |
| d4 | Defne | Her bayramlaşma iki kişinin sayısına birer ekler. Herkesin sayısını toplarsan hep çift çıkar. | 14 | 34,28–39,45 |
| d5 | Defne | Bu toplam çiftse, tek sayıların adedi de çift olmalı. Beş ise tek! | 12 | 39,80–43,61 |
| h4 | Hikmet | Defterde bir kişiyi eksik yazmışım. | 5 | 44,51–46,88 |
| d6 | Defne | Bunu bayramda herkesle bayramlaşan arkadaşına gönder. | 6 | 47,58–50,49 |

**Süre:** 85 kelime ("Buldum!" öncesi 45). "Buldum!" 32,44 sn, toplam 52,89 sn.

**Taslağa göre değişen replikler**
- h2b: "Tek sayıda kişiyle …" → "Defterde tek sayıda kişiyle …": satır T ile başlamasın.
- d2: "…, kim kiminle?" → "…; kim kiminle bayramlaşmış?": eksiltili cümle olmasın.
- d5: "Toplam çiftse … Beş tek!" → "Bu toplam çiftse, … Beş ise tek!": satır T ile başlamasın, son cümle eksiltili olmasın.
- whisper bütün satırları doğru duydu ("beş" ve "iki" rakamla duyuldu, konum eşlemesi tuttu).

**Motor için**
- Kurdele dizisi `KURDELE`, denetim `denetle()`, rozet değerleri `iz` (build). Rozet değişince kâğıt gibi döner (0,26 sn), değer ortada değişir. Etiketler dönüş bittikten sonra (+0,16 sn) güncellenir.
- Kurdele, iki rozetin altından sarkan ikinci derece eğridir. Yüzlerin altında kalır. El sıkışmada ortadan iki uca, uzaktan selamda a'dan b'ye açılır. Defne'nin kaldırdığı kurdele için kontrol noktası elden geçecek biçimde kayar.
- Sayaç bu bölüme özeldir: yüzleri örtmesin diye zeminde durur (daire solda, başlık ve paylaşım hapı sağda).
- Arka sıra önce çizilir. Ön sıradakiler uzaktan selamı dış kollarıyla verir, böylece kol arka sıranın yüzüne binmez.

**Koordinatör kararı (2026-11-17): rakamlar "Buldum!"a kadar gizli**
- "Buldum!"dan önce rozetlerin arka yüzü görünür: yuvarlak bayram rozeti, üstünde rakam yerine teal çiçek süsü. Böylece izleyici rozetleri sayıp Hikmet'in "beş"ini gözle çürütemez ("saymadan bil" fikri korunur).
- Kurdele bağlanınca iki uçtaki rozet aynı anda kabarır ve yanlarında birer hardal "+1" pulu çıkar (0,75 sn, eşin ters yanında, yüzlere binmez). Kanca, el öpme ve ipucu (n1, "sıktı") bu dili kullanır.
- "Buldum!"da (d3 + 0,12 sn) rozetler Defne'den başlayarak 0,06 sn arayla kâğıt gibi döner ve rakamlar ilk kez görünür. Mercan vurgusu "olamaz"da açılır. Cevap sahnesi değişmedi. Defterdeki "5" ve kart aynı.
