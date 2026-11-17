# 054 · Son Vapur 2: Tanıdık sayısı (v5 storyboard, 2026-11-17)

Kaynak: `research/konsept_son_vapur.md` § Örnek bilmece 2, `hikayeler/bolum_045-057.md` § 053–055. Sahne: `engine/b054.js` (seri çekirdeği `engine/b053.js`'ten import edilir, değiştirilmez). Bölüm dosyası: `bolumler/054-vapur-tanidik.json`. Yayın sırası 44 (rozet "BİLMECE #44" + "SON VAPUR" etiketi). Sayaç 10 sn (`cdSure: 10`), yazısı "NEDEN?"; ipucu repliği yok (Bora konuşmaz), `countdown: "d3-0.3"`. Mekanizma: güvercin yuvası.

- **Biçim: önce cevap.** Kare 0'da büyük kapak `CEVAP: KESİN VAR`. Kapak, Rıza bahsi söylerken ("tanıdığı" kelimesi) 0,36 sn'de bilmece kartına döner.
- **Logline:** Son vapurda 30 yolcu var. Kaptan Rıza bahse girer: vapurdaki tanıdığı sayısı aynı olan iki yolcu yoktur. Lâl herkese tek tek sormaya kalkar ama vapur yanaşmak üzeredir. Çaycı Bora dört bardağı üç halkalı tepsiye koyar, biri dolu halkaya düşer. Lâl "tanıdık sayısı rafı"nda gösterir: 30 bilet 29 göze sığmaz.
- **Akılda kalacak tek şey:** 30 kişiye yalnız 29 olası sayı düşer; ikisi aynı olmak zorundadır.
- **Kart:** `Vapurda 30 yolcu var.` (21) / `Tanıdık sayısı aynı iki kişi var mı?` (36)
- **Şartlar (değişmez):** 30 yolcu. Tanışıklık karşılıklıdır. Kaptan: "Tanıdığı sayısı aynı olan iki yolcu yoktur." Lâl saymadan kazanır.
- **Cevap (değişmez):** Olası tanıdık sayısı 0–29 (30 değer), ama 0 ile 29 birlikte olamaz: 29 tanıdığı olan herkesi tanır. Geriye 29 değer kalır, yolcu 30 kişidir; iki kişi aynı sayıda olmak zorundadır.
- **Kodda denetim:** `tanidikGrafi()` Havel–Hakimi ile gerçek bir 30 kişilik tanışıklık grafı kurar (dereceler 1…29 ve bir kez daha 15). Denetlenen: dizi gerçekten bir graf, 0 ile 29 birlikte değil, farklı değer sayısı ≤ 29, aynı göze düşen değer 15; ayrıca 2–6 kişilik bütün graflar taranır ve "herkesin derecesi farklı" bir graf bulunamaz. Raf bu grafı gösterir: 29 dolu, 0 kilitli, 1–28 birer bilet, 30. bilet 15'e düşer. Hata olursa `console.error('mantık hatası: …')`.
- **Mekân:** 053'ün gece vapuru güvertesi (çekirdek: `svManzara`, `svGuverte`). Bu kez güverte boyunca uzun bir bank ve üstünde oturan yolcular (figüranlar `b054_fA…fD` + uykucu yolcu). Vapur Karaköy'den çıkmış, karşıya gidiyor; "yanaşmadan"da Kadıköy iskelesi yaklaşır, espride iskeleye yanaşmıştır. İkinci yer: güvertenin sağ ucundaki ahşap **tanıdık sayısı rafı** (6 × 5 = 30 göz, 0–29; başlık levhası `TANIDIK SAYISI`).
- **Yerleşim (053'ten farklı):** bankta oturanlar x −150, 15, 180, uykucu 345, 520, 690, 870, 1240; ayakta Lâl x 580, Rıza x 850, Bora x 1030 (önünde sehpa, üstünde 4 bardak). Raf dünya x 1550–2078; raf sahnesinde Lâl x 1455.
- **Kare 0:** Rıza bilet destesini (otuz bilet) kalabalığa doğru uzatmış, Lâl şaşkın, uykucu bankta uyuyor, figüranlar sohbet ediyor; Karaköy levhası solda; kapak üstte. 0,3 sn'de deste yelpaze gibi açılır.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–4,3 | Güverte, geniş | Rıza desteyi kaldırıp yelpaze gibi açar; "otuz"da `30 YOLCU`; "tanıyor"da kiremit paltolu kadın yanındakine el sallar (h1). | deniz ve martılar; yolcuların sohbeti (komşular birbirine döner) | 0,98x → 1,02x | (yok) |
| 2 Bahis | 4,3–11,7 | Rıza ve Lâl, yakın | "tanıdığı"da kapak bilmece kartına döner; "iki"de Rıza iki parmak kaldırır (h2a). "simitlerini"de desteyle Lâl'in simit tablasını gösterir; Lâl tablaya bakıp gülümser (h3). | sohbet; dalgalar | 1,30x → 1,27x | sert kesme |
| 3 Yanlış deneme, itiraz | 11,7–17,4 | Güverte, geniş | Lâl sol eliyle oturanları tek tek gösterir: uykucu, genç, kadın; `1 / 30`, `2 / 30`, `3 / 30` (d2). "yanaşmadan"da Rıza arkadan yaklaşan Kadıköy iskelesini gösterir, "bitmez"de sayaç mercan + ✗; "Saymadan"da desteyi Lâl'e verir (iki el destede) (hd). | iskele yaklaşır; sohbet | 1,02x → 1,0x → 1,04x | sert kesme |
| 4 Sayaç (10 sn) | 17,4–27,4 | Güverte, geniş → Bora | Lâl desteye bakar, düşünür, parmağıyla biletleri sayar; Rıza belinde eli, gülümser. Son 7,2 sn: kamera Bora'ya iner (1,46x). Bora sehpadaki dört bardağı tek tek üç halkalı tepsiye taşır: 1., 2., 3. halka dolar, dördüncü bardak dolu üçüncü halkaya sıkışıp yana yatar (halka bir kez kabarır); Bora tepsiyi gösterir. | dalgalar; iskele ışıklarının yansıması | 0,97x → 1,46x | sert kesme |
| 5 Buldum! | 27,6–29,5 | Lâl | Sıçrama, ışınlar; desteyi havaya kaldırır (d3). | dalgalar | 1,35x | "Buldum!" kesmesi |
| 6 Cevap | 29,5–41,1 | Raf | **Kahraman an.** d4: "sıfırdan"da Lâl 0'ı gösterir, numaralar 0'dan 29'a hardal yanıp söner, "yirmi dokuza"da 29'u gösterir; "otuz göz"de `30 GÖZ`. d5: "yirmi dokuz"da bir bilet 29'a uçar; "sıfır"da 0 gözü mercan olur, çarpıyla kilitlenir. d5b: `30 YOLCU` / `29 GÖZ`; biletler desteden 1–28 gözlerine dağılır (52 ms arayla), 30. bilet yüksek bir yayla dolu 15 gözüne düşer ("göze"), göz yeşil olur, kamera 15 gözüne yaklaşır (1,46x). | dalgalar; uçan biletler | 1,18x → 1,2x → 1,46x | sert kesme |
| 7 Espri | 41,1–44,9 | Güverte, geniş (Kadıköy'e yanaşmış) | Rıza uykucuyu gösterir: "kimseyi"de `0 TANIDIK` (h4). Satır biter bitmez uykucu uyanıp gülümser, bütün yolcular ona el sallar; etiket yeşil `29 TANIDIK` olur; Rıza önce şaşırır, sonra ellerini havaya kaldırır. | yolcuların el sallaması; dalgalar | 1,12x → 1,15x | sert kesme |
| 8 Çağrı | 44,9–47,9 | Lâl | Lâl desteyi yelpaze gibi açıp kaldırır, kameraya bakar (d6). | dalgalar | 1,34x → 1,38x | sert kesme |
| 9 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

| id | Konuşan (ses) | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Rıza (hikmet, −6 %, −12 Hz) | Bu vapurda otuz yolcu var, herkes birkaç kişiyi tanıyor. | 9 | 0,30–4,04 |
| h2a | Rıza | Bahse girerim, vapurdaki tanıdığı sayısı aynı olan iki yolcu yoktur. | 11 | 4,39–8,82 |
| h3 | Rıza | Bilirsen bütün simitlerini ben alırım. | 5 | 9,17–11,43 |
| d2 | Lâl (defne, +16 %, +3 Hz) | Herkese tek tek sorayım! | 4 | 11,83–13,17 |
| hd | Rıza | Vapur yanaşmadan bitmez. Saymadan bileceksin! | 6 | 13,52–17,06 |
| d3 | Lâl | Buldum! Saymaya gerek yok! | 4 | 27,66–29,31 |
| d4 | Lâl | Herkesin tanıdığı sıfırdan yirmi dokuza kadar olabilir: otuz göz. | 10 | 29,66–33,04 |
| d5 | Lâl | Ama yirmi dokuz tanıyan herkesi tanır, sıfır tanıyan kalmaz. | 10 | 33,39–36,51 |
| d5b | Lâl (+12 %) | Otuz yolcuya yirmi dokuz göz kalır, iki bilet aynı göze düşer! | 11 | 36,86–40,25 |
| h4 | Rıza | Bu uykucu kimseyi tanımıyor ki, sıfır! | 6 | 41,20–43,79 |
| d6 | Lâl | Bunu herkesi tanıdığını sanan arkadaşına gönder. | 6 | 45,59–48,03 |

**Süre:** 82 kelime ("Buldum!" öncesi 35). "Buldum!" 27,66 sn, toplam 50,43 sn. d6 öncesi ara 1,8 sn: espride el sallama ve `29 TANIDIK` etiketi en az 1,25 sn görünsün diye.

**Espri mantığı:** Rıza uykucunun 0 tanıdığı olduğunu sanır; uykucu uyanınca herkes ona el sallar: aslında herkesi tanır (29). Bu da cevabın kendisidir: 29 varsa 0 olamaz.

**Açıklama:** `Zeka sorusu: Son vapurda 30 yolcu var. Tanışıklık karşılıklıdır: …` (JSON `caption`).
