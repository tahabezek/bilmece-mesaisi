# 053 · Son Vapur 1: Uykucu yolcu (v5 storyboard, 2026-11-17)

Kaynak: `research/konsept_son_vapur.md` § Örnek bilmece 1, `hikayeler/bolum_045-057.md` § 053–055. Sahne: `engine/b053.js`. Bölüm dosyası: `bolumler/053-vapur-uykucu.json`. Yayın sırası 43 (rozet "BİLMECE #43" + "SON VAPUR" etiketi). Sayaç 10 sn (`cdSure: 10`), yazısı "NEDEN?"; ipucu repliği yok (Bora konuşmaz), `countdown: "d3-0.3"`. Mekanizma: ortalama ve süre. Serinin ilk bölümü: kadro, vapur mekânı ve "CEVAP:" kapağı burada kurulur (aşağıda "Seri çekirdeği").

- **Biçim: önce cevap.** Kare 0'da büyük kapak `CEVAP: ÜÇ KEZ`. Kapak, Rıza soruyu sorarken ("vapur" kelimesi) 0,36 sn'de bilmece kartına döner.
- **Logline:** Uykucu yolcu 07.20'de Karaköy'de vapura binip iki saatini ayarlar ve uyur. Kadıköy'de uyandığında biri 08.21'i, öbürü 08.19'u gösterir. Kaptan Rıza bahse girer: vapur kaç kez karşıya geçti? Çaycı Bora tepsideki iki bardağın ortasına üçüncüyü koyar; Simitçi Lâl ortalamayı bulur.
- **Akılda kalacak tek şey:** Biri ileri, biri geri giden iki saatin ortası gerçek saattir.
- **Kart:** `Geçiş 20 dk. Saatler 08.21 ve 08.19.` (36) / `Vapur kaç kez karşıya geçti?` (28)
- **Şartlar (değişmez):** 07.20'de Karaköy'de bindi, iki saati ayarladı. Biri saatte 1 dk ileri, öbürü 1 dk geri. Kadıköy'de 08.21 ve 08.19. Bir geçiş 20 dk.
- **Cevap (değişmez):** Ortalama 08.20 → 1 saat geçti → 60 ÷ 20 = 3 geçiş (Karaköy → Kadıköy → Karaköy → Kadıköy; tek sayı, Kadıköy'de iner). Saatler `durum()` içinde tek kaynaktan hesaplanır: `saatL = gerçek + geçen/60`, `saatR = gerçek − geçen/60`.
- **Mekân:** Gece vapurunun dış güvertesi (önden). Arkada küpeşte, borda, can simidi, ahşap bank, iki kehribar fener; korkuluğun ardında koyu petrol gece, deniz dalgaları, uzakta Galata, Kız Kulesi, Haydarpaşa siluetleri; yanaşılan iskele (Karaköy alçak ve kemerli, Kadıköy saat kuleli) levhasıyla. Kadıköy'de (08.20) ufukta düz şafak bandı belirir.
- **Yerleşim:** Rıza x 170 (ayakta), yolcu bankta x 470 (oturur), Lâl x 720 (tabla önünde), Bora x 920 (askılı tepsi).
- **Kare 0:** Yolcu iki bileğini göğsünün önüne kaldırmış, saatlerini ayarlıyor; Rıza onu gösteriyor, Lâl şaşkın; Karaköy levhası arkada; kapak üstte. 0,3 sn'de saat ibreleri 07.20'ye döner.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–4,4 | Güverte, Karaköy | Yolcu saatlerini 07.20'ye ayarlar ("yedi yirmide" iki "07.20" etiketi), "ayarladı"da kollarını kucağına indirir, satır sonunda uyur, şapkası öne düşer. Rıza onu gösterir (h1). | dalgalar, martı; saniye kolları | 1,10x → 1,13x | (yok) |
| 2 Kural | 4,4–8,7 | Yolcu yakın, Karaköy | Uyuyan yolcunun saatleri: "ileri"de "+1 DK", "geri"de "−1 DK" (h2a). | saniye kolları; dalgalar | 1,42x → 1,44x | sert kesme |
| 3 Kadıköy | 8,7–13,1 | Aynı kadraj, Kadıköy | Zaman sıçraması (geçiş sayısı gösterilmez): arkada Kadıköy, şafak bandı. Yolcu uyanır, bileklerine bakar: "08.21", "08.19" (h2b). | dalgalar; yansıyan ışıklar | 1,36x → 1,40x | sert kesme |
| 4 Bahis, yanlış deneme, itiraz | 13,1–23,9 | Güverte, geniş | "yirmi"de Rıza iki parmak; "Bahse girelim"de Bora'nın tepsisini gösterir, Bora tepsiyi kaldırır (ödül: çay); "vapur"da kart döner (h3). d2: Lâl tabladan simit alıp onu vapur gibi soldan sağa "yüzdürür". hd: kamera saatlere iter; Rıza saatleri gösterir; "yedi kırkı"da iki etiket mercan "07.40" olur + ✗, sonra sarsılıp 08.21 / 08.19'a döner; simit tablaya döner. | dalgalar, martı | 1,0x → 1,06x → 1,3x | sert kesme |
| 5 Sayaç (10 sn) | 23,9–33,9 | Güverte, geniş → Bora | Yolcu bileğini kaldırıp saatini sallar; Lâl eli çenede düşünür, parmakla sayar; Rıza belinde eli, gülümser. Son 4,6 sn: kamera Bora'ya kayar, Bora askılı tepsiyi sol eliyle göğsüne kaldırır, sağ elindeki üçüncü bardağı iki bardağın tam ortasına koyar, gösterir. Lâl bakar, şaşırır. | dalgalar; saniye kolları | 0,97x → 1,30x (Bora ve tepsi) | sert kesme |
| 6 Buldum! | 34,2–35,0 | Lâl | Sıçrama, ışınlar (d3). | dalgalar | 1,35x | "Buldum!" kesmesi |
| 7 Cevap | 35,0–43,2 | Yolcu, sonra geniş | **Kahraman an.** d4: "ortası"nda Lâl iki saatin arasını gösterir, iki etiket ortaya kayıp yeşil "08.20" olur. "tam"da kamera geri çekilir; 0,4 sn geri sarma (iskele Karaköy'e döner, yolcu yeniden uyur, şafak söner), sonra zaman atlaması: gerçek saat hapı 07.20 → 08.20, vapur "gitti"de Kadıköy'e, "döndü"de Karaköy'e, "yine gitti"de Kadıköy'e varır; "1. / 2. / 3. GEÇİŞ", saat ibreleri bir tur döner ve ayrılır, şafak bandı doğar. "Üç geçiş!"te ✓, yolcu uyanır (d5). | dalgalar; ibreler | 1,36x → 1,08x → 1,12x | sert kesme |
| 8 Espri | 44,0–48,1 | Güverte, geniş | "uyudu"da yolcu yine uyur; Rıza ellerini havaya kaldırır; "Dördüncü"de vapur Kadıköy'den ayrılır, "4. GEÇİŞ?" etiketi. Bora tepsiyi uzatır, Lâl ortadaki çayı alır (bahsin ödülü) (h4). | dalgalar, martı | 1,02x → 1,06x | sert kesme |
| 9 Çağrı | 48,1–50,4 | Lâl | Lâl çayı kaldırır, kameraya bakar (d6). | dalgalar | 1,34x → 1,38x | sert kesme |
| 10 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

| id | Konuşan (ses) | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Rıza (hikmet, −6 %, −12 Hz) | Bu yolcu yedi yirmide Karaköy'de bindi, iki saatini ayarladı. | 9 | 0,30–4,13 |
| h2a | Rıza | Biri saatte bir dakika ileri gider, öbürü bir dakika geri kalır. | 11 | 4,48–8,45 |
| h2b | Rıza | Kadıköy'de biri sekiz yirmi biri, öbürü sekiz on dokuzu gösterdi. | 10 | 8,80–12,87 |
| h3 | Rıza | Geçiş yirmi dakika sürer. Bahse girelim: vapur kaç kez karşıya geçti? | 11 | 13,22–18,15 |
| d2 | Lâl (defne, +16 %, +3 Hz) | Bir kez, Karaköy'den Kadıköy'e! | 4 | 18,55–20,23 |
| hd | Rıza | Bir kez geçseydi saatler yedi kırkı gösterirdi. | 7 | 20,58–23,62 |
| d3 | Lâl | Buldum! Yolcu uyuyakalmış! | 3 | 34,22–36,08 |
| d4 | Lâl | İki saatin ortası sekiz yirmi: yani tam bir saat geçmiş. | 10 | 36,43–39,64 |
| d5 | Lâl (+12 %) | Vapur gitti, döndü, sonra yine gitti. Üç geçiş! | 8 | 39,99–43,15 |
| h4 | Rıza | Eyvah, yine uyudu! Dördüncü sefer başlıyor. | 6 | 44,10–47,52 |
| d6 | Lâl | Bunu vapurda uyuyakalan arkadaşına gönder. | 6 | 48,22–50,35 |

**Süre:** 85 kelime ("Buldum!" öncesi 52). "Buldum!" 34,22 sn, toplam 52,75 sn.

**Açıklama:** `Zeka sorusu: Bir yolcu 07.20'de Karaköy'de vapura bindi ve iki kol saatini ayarladı. …` (JSON `caption`).

## Seri çekirdeği (054 ve 055 için)
`engine/b053.js` dosyasının başındaki "SERİ ÇEKİRDEĞİ" bloğu, `export` edilir:
- `SV` palet; `KARTLAR` → `H.CARDS.b053_riza / b053_lal / b053_bora / b053_yolcu`; `BOYU`; `SES` (Rıza → hikmet, Lâl → defne).
- `svKisi`, `svOyna` (dudak ve balon kuyruğu ses adından), `rizaUst` (şapka, sakal, düğmeler), `lalUst` (örgüler), `lalTepsi`, `simit`, `bardak`, `boraTepsi`, `kolSaati`, `yolcuCiz` (oturan uykucu yolcu).
- `svManzara(K, t, { yer, safak })` (gök, şafak bandı, martılar, uzak kıyı, deniz, iskeleler, yalpa), `svGuverte`, `svBankOn`, mekân kaydı `b053_guverte`; sabitler `UFUK, KUPESTE, BORDA, GUVERTE`.
- `svKart` (kapak → bilmece kartı + rozet + "SON VAPUR"), `svSayac` ("NEDEN?"), `saatYaz`.
