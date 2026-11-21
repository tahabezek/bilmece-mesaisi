# 063 · Son Vapur: Simit vergisi (v5 storyboard, cevapsız tasarım, 2026-11-22)

Kaynak: `hikayeler/bolum_058-063.md` § 063. Sahne: `engine/b063.js`. Bölüm dosyası: `bolumler/063-vapur-simit.json` (`cevapsizTasarim: true`). Yayın sırası 51 (rozet "BİLMECE #51" + "SON VAPUR" etiketi). Sayaç 10 sn, yazısı "KAÇ SİMİT?", ipucu repliği var (`countdown: "n1-0.3"`). Seri çekirdeği (kadro kartları, vapur manzarası, `svKart`, `svSayac`, ses eşlemesi) `engine/b053.js`'ten import edilir, değiştirilmez.

- **Logline:** Gece vapurunda Kaptan Rıza her iskelede Simitçi Lâl'in tablasındaki simitlerin yarısını "vergi" diye sepetine alır, vicdanı sızlar, birini geri koyar. Yedi iskele sonra tablada üç simit kalır. Lâl yola kaç simitle çıkmıştı?
- **Akılda kalacak tek şey:** İki simit hiç değişmez; fazlası her iskelede yarıya iner.
- **Kart:** `Her iskelede yarısını Rıza alır, 1 geri.` (40) / `7 iskele sonra 3 simit. Kaçla başladı?` (38). Belgedeki satırdaki iki nokta kaldırıldı (41 → 40 harf), anlam aynı.
- **Cevap (arşiv, videoda yok):** 130. Zincir 130 → 66 → 34 → 18 → 10 → 6 → 4 → 3. `zincir()` build anında denetler (her iskelede sayı çift, geri sarım 130).
- **Sızıntı yasağı:** Başlangıç tablası üst üste yığılmış, sayılamaz bir yığın (görünen simit adedi gerçek sayıya eşit değil). Ara sayılar hiçbir yerde yazmaz; montajda yığın küçülür ama sayılamaz. Yalnız son durum nettir: tablada yan yana üç simit.
- **Mekân:** Seri güvertesi (`svManzara` + `svGuverte`), gece. Arkada iskele binaları ve levhaları (numara rozeti + ad, tr-TR büyük harf): 1 BEŞİKTAŞ, 2 ORTAKÖY, 3 ARNAVUTKÖY, 4 BEBEK, 5 KANDİLLİ, 6 EMİRGAN, 7 SARIYER. Rıza ile Lâl arasında bağlama demiri (baba) üstünde Rıza'nın hasır "vergi sepeti"; doldukça ağzından taşar.
- **Yerleşim:** Rıza x 300, sepet x 478, Lâl x 690 (tabla göğüs hizasında, iki eliyle tutar; altyazı bandının üstünde kalsın diye), Bora x 1030.
- **Döngüler:** dalgalar, martılar, iskele ışıklarının yansıması, yalpa, Bora'nın çay buharı.
- **Kare 0:** Gece vapuru; Rıza'nın sağ eli Lâl'in tepeleme simit yığınına uzanmış, Lâl şaşkın; 1. iskele sağdan yanaşıyor. Kart üstte. El 0,3 sn'de yığının üstüne varır.

| # | ≈ sn | Ana eylem (nesneyle) | Kamera | Kesme |
|---|---|---|---|---|
| 1 Kanca | 0–6,7 | 1. iskele (BEŞİKTAŞ) yanaşır. Rıza yığına uzanmış; "Vergi"de iki kez dokunur (h1). Lâl tablayı geri çeker, korkar (d1). | 1,36x → 1,4x | |
| 2 Vergi döngüsü (yakın) | 6,7–11,1 | "Merak etme"de Rıza avucunu yığına daldırır, yarısını kaldırıp sepetine taşır; "birini geri"de sepetten bir simit alır, "veririm"de tablanın önüne koyar; "Ben vicdanlı"da eli göğsünde (h2a). Lâl yorgun bakar. | 1,44x → 1,46x | sert kesme |
| 3 Montaj | 11,1–15,8 | İskele levhaları 2…7 sağdan sola akar (her biri 0,38 sn gelir, 0,3 sn durur). Her duruşta Rıza avuçlayıp sepete atar: tabladaki yığın küçülür, sepet dolar (h2b). | 1,3x → 1,32x | sert kesme |
| 4 Lâl'in yorgun yüzü | 15,8–18,9 | Yakın plan. Tablada yan yana üç simit; "üç"te Lâl gösterir (d2). | 1,44x → 1,46x | sert kesme |
| 5 Soru | 18,9–25,5 | Rıza eli dolu sepetinde sorar, "kaç"ta tablayı gösterir (h3). Kamera ikili plana kayar; Lâl omuz silker, "Bir tabla doluydu"da iki elini yana açıp yığının boyunu çizer (dd). | 1,38x → 1,34x | sert kesme |
| 6 Sayaç (10 sn) | 25,5–35,6 | Yavaş, doğrusal itme (1,3x → 1,44x), odak üç simitlik tabla. Lâl eli çenede, simitlere tek tek dokunur; Rıza eli sepette, keyifli. **Insert (1,45 sn):** Bora sessizce çayını karıştırır, buhar. Dönüşte Lâl Rıza'nın dolu sepetine bakıp gösterir, sonra tablaya döner. Sayaç dairesi tablanın altında (y 1250), yüzler açık. | doğrusal itme | sert kesme × 3 |
| 7 İpucu | 35,7–40,7 | "Senin"de Rıza avucunu bir simidin üstüne kapatır (iki kalır); "kâr"da ikinciyi kaldırır, "etmezdim"de geri koyar, eli göğsüne gider (n1). Lâl düşünür. n1 balonu kesime kadar tam opak kalır. | 1,4x → 1,43x | sert kesme |
| (arşiv) | 40,7–53,4 | Buldum, cevap, çağrı: sade. `cevapsiz.mjs` keser. | | |

| id | Konuşan (ses) | Replik | ≈ sn (ölçülen) |
|---|---|---|---|
| h1 | Rıza (hikmet, −6 %, −12 Hz) | Her iskelede simitlerinin yarısı benim. Vergi. | 0,30–3,38 |
| d1 | Lâl (defne, +14 %, +3 Hz) | Yarısı mı, kaptan? Bu ne biçim vergi? | 3,88–6,31 |
| h2a | Rıza | Merak etme, birini geri veririm. Ben vicdanlı adamım. | 6,81–10,56 |
| h2b | Rıza | Sonraki her iskelede aynı hesap: yarısı bana, biri sana. | 11,16–15,28 |
| d2 | Lâl (+10 %) | Yedi iskele geçti, tepside üç simit kaldı. | 15,88–18,42 |
| h3 | Rıza | Söyle bakalım, bu vapura kaç simitle bindin? | 19,02–21,98 |
| dd | Lâl (+12 %) | Hiç saymadım ki, kaptan. Bir tabla doluydu. | 22,48–25,25 |
| n1 | Rıza (−8 %) | Senin iki simidin olsa, ben hiç kâr etmezdim. | 35,85–39,19 |
| d3 | Lâl | Buldum! Yüz otuz. | 40,79–42,20 |
| d4 | Lâl | İkinin fazlası her iskelede yarıya iniyor. Sonda bir fazla varsa, başta yüz yirmi sekiz fazla vardı. | 42,55–48,21 |
| d6 | Lâl | Bunu vapurda simit alan arkadaşına gönder. | 48,91–51,01 |

**TTS düzeltmeleri (anlam aynı):** "Tepside üç simit kaldı" ve "Peki sen…" T/P ile başlıyordu: "Yedi iskele geçti, tepside…", "Söyle bakalım, bu vapura…". "Saymadım ki." 2 kelimeydi: "Hiç saymadım ki, kaptan. Bir tabla doluydu." İpucu "Tepside iki simit olsa" yerine "Senin iki simidin olsa". Kurulum zenginleşsin diye h2b (montaj) eklendi.

**Süre:** "Buldum!" öncesi 61 kelime. "Buldum!" 40,79 sn; kesilmiş sürüm yaklaşık 43 sn.

**Açıklama:** JSON `caption` (belgedeki metin).
