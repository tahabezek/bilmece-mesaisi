# 057 · Hikmet birim değiştirdi (v5 storyboard, 2026-11-17)

Kaynak: `hikayeler/bolum_045-057.md` § 057. Sahne: `engine/b057.js`. Bölüm dosyası: `bolumler/057-birim.json`. Yayın sırası 41 (rozet "BİLMECE #41"). Sayaç 10 sn (`cdSure: 10`), ipucu repliği var (`countdown: "n1-0.3"`). Mekanizma: ortalama (Will Rogers olgusu).

- **Logline:** Hikmet kolisini alıp muhasebeden bilgi işleme geçer. İki kapının üstündeki yaş ortalaması tabelaları da yükselir: 49 → 50 ve 22 → 28. Kimse yaş almamış, kimse girip çıkmamıştır. Defne "Buldum!"dan sonra koliden çıkan katlanır metreyi açar: ölçekte üç ok vardır ve Hikmet'in oku ortadadır.
- **Akılda kalacak tek şey:** İki ortalamanın arasındaki biri, ayrıldığı yeri de vardığı yeri de yükseltir.
- **Kart:** `Hikmet muhasebeden bilgi işleme geçti.` (38) / `İki birimin de yaş ortalaması arttı!` (36)
- **Sayılar (değişmez, kodda `denetle()` ile hesaplanır; tutmazsa build hata verir):**
  - Muhasebe: 40, 50, 60 ve Hikmet 46. Ortalama 49; Hikmet gidince 50.
  - Bilgi işlem: 20, 22, 24. Ortalama 22; Hikmet gelince 28.
  - Tabelalar, hesap makinesinin ekranı (150 ÷ 3 = 50, 112 ÷ 4 = 28) ve cevaptaki oklar bu hesaptan türetilir; elle yazılmaz.
- **Cevap (değişmez):** Hikmet muhasebenin ortalamasından genç, bilgi işleminkinden yaşlıdır. Gidince muhasebe, gelince bilgi işlem yaşlanır.
- **Kadro:** Hikmet (koli: içinde "46" plakası ve katlı metre), Defne, Necmi (iki fotoğraf). Figüranlar `b057_y40`, `b057_y50`, `b057_y60` (muhasebe; 60 kır saçlı, 50 kırlaşmış) ve `b057_y20`, `b057_y22`, `b057_y24` (bilgi işlem; genç iskelet). Masalarda yaş plakaları.
- **Mekânlar:** `b057_koridor` (iki kapı, kapıların üstünde tabela, su sebili, saat), `b057_muh` (pencere, saat, çay), `b057_bil` (monitörler, sunucu dolabı).
- **Kare 0:** Koridor. Hikmet koliyle muhasebe kapısından çıkmış, yan dönmüş; Defne solda şaşkın. Tabelalar 49 ve 22. Kart üstte. Hikmet ilk karede yürümeye başlar.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–3,0 | Koridor, geniş | Hikmet koliyle soldan sağa yürür. "değiştirdim"de muhasebe tabelası 49 → 50, "yaşlandı"da bilgi işlem tabelası 22 → 28 döner (yeşil üçgen). Hikmet bilgi işlem kapısının önünde döner (h1). | sebil, saat | 0,99x → 1,0x | (yok) |
| 2 Muhasebe | 3,0–4,5 | Muhasebe odası | 40, 50, 60 plakalı üç kişi boş masaya bakar; masada plakanın tozlu izi (h2a "Muhasebeden bilgi"). | saat, çay buharı | 1,0x | sert kesme (kısa plan) |
| 3 Bilgi işlem | 4,5–8,7 | Bilgi işlem odası | Hikmet koliyle soldan girer, boş masanın arkasına geçer. 20, 22, 24 plakalı gençler ona döner. "girip çıkmadı"da kapı kapanır (h2a). | monitörlerde kod, sunucu ışıkları | 0,97x → 1,0x | sert kesme |
| 4 Soru | 8,7–12,5 | Koridor | Hikmet bilgi işlem kapısında, koli yerde. "yükseldi"de tabelaları gösterir, iki tabela kabarır (h2b). | sebil, saat | 0,97x → 0,99x | sert kesme |
| 5 Yanlış deneme | 12,9–18,4 | Koridor, orta | d2: Defne iki koluyla tahterevalli yapar (biri yukarı, öteki aşağı). hd: Hikmet hesap makinesini uzatır, "bak"ta tuşa basar; ekranda 28 çıkar. | sebil, saat | 1,06x → 1,09x | (kesmesiz kayma) |
| 6 Sayaç (10 sn) | 18,7–28,7 | Koridor, geniş | Hikmet makineyi Defne'ye verir. Defne 150 ÷ 3 = 50'yi tuşlar, muhasebe tabelasına bakar; 112 ÷ 4 = 28'i tuşlar, bilgi işlem tabelasına bakar; düşünür. Necmi soldan gelir. | sebil, saat | 0,97x → 1,0x | (kesmesiz geçiş) |
| 7 İpucu | 28,8–33,0 | Necmi yakın | Necmi iki fotoğrafı başının iki yanına kaldırır: "dedemlerin"de büyükler masası, "torunların"da çocuklar masası (n1). | sebil | 1,38x → 1,42x | sert kesme |
| 8 Buldum! | 33,3–34,1 | Defne yakın | Sıçrama, ışınlar (d3). | sebil | 1,35x | "Buldum!" kesmesi |
| 9 Cevap | 34,1–43,7 | Koridor | **Kahraman an.** Hikmet yeniden muhasebe kapısında, tabelalar 49 ve 22. Defne katlı metreyi açar (soldan sağa 60 → 20). d4: "Muhasebenin"de mercan 49 oku, "gençsiniz"de altta "HİKMET 46" oku, "bilgi"de teal 22 oku. d5: Hikmet metrenin arkasından yeniden yürür; "yaşlandı"da muhasebe oku ve tabelası 49 → 50, ikinci "yaşlandı"da bilgi işlem oku ve tabelası 22 → 28. Hikmet'in oku ortada kalır. | sebil, saat | 1,0x | sert kesme |
| 10 Espri | 44,4–47,9 | Hikmet yakın | Hikmet kolideki "46" plakasını yüzüstü yatırır (h4). | saat | 1,32x → 1,35x | sert kesme |
| 11 Çağrı | 47,9–50,6 | Defne | Defne metreyi kaldırıp kameraya bakar (d6). | sebil | 1,3x → 1,33x | (kesmesiz kayma) |
| 12 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

**Nasıl oynanıyor**
- **Düzenek:** Kapının üstündeki tabela birimin yaş ortalamasıdır; Hikmet'in yaşı kolideki plakada, ötekilerin yaşı masalardaki plakalardadır.
- **Yanlış deneme:** Defne'nin tahterevallisi "biri artarsa öteki azalır" der; Hikmet'in hesap makinesi 28 gösterir.
- **İpucu:** Necmi cevabı söylemez. İki fotoğrafta bir masada en genç, öbüründe en yaşlıdır.
- **Cevap:** Ölçek ve oklar yalnız "Buldum!"dan sonra gelir. Metre soldan sağa 60 → 20 okunur; böylece muhasebe solda, bilgi işlem sağda kalır ve oklar kapılarla aynı yanda durur.
- **Espri:** Hikmet yaşını gösteren plakayı yatırır.

| id | Konuşan | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Ben birim değiştirdim, iki birim de yaşlandı! | 7 | 0,30–3,11 |
| h2a | Hikmet | Muhasebeden bilgi işleme geçtim. Kimse yaş almadı, kimse girip çıkmadı. | 10 | 3,41–8,46 |
| h2b | Hikmet | Ama iki birimin de yaş ortalaması yükseldi. Bu nasıl olur? | 10 | 8,76–12,49 |
| d2 | Defne | İmkânsız! Biri artarsa öteki azalır! | 5 | 12,94–15,53 |
| hd | Hikmet | Hesap makinesi yalan söylemez, bak. | 5 | 15,93–18,44 |
| n1 | Necmi | Ben dedemlerin masasında genç, torunların masasında yaşlıyım. | 7 | 29,04–33,00 |
| d3 | Defne | Buldum! Siz ikisinin arasındasınız! | 4 | 33,32–35,65 |
| d4 | Defne | Muhasebenin ortalamasından gençsiniz, bilgi işleminkinden yaşlısınız. | 7 | 36,00–39,87 |
| d5 | Defne | Siz gidince muhasebe yaşlandı, gelince bilgi işlem yaşlandı! | 8 | 40,22–43,72 |
| h4 | Hikmet | Demek ki her yerde ortalamayı ben bozuyorum. | 7 | 44,62–47,34 |
| d6 | Defne | Bunu iş değiştirmeyi düşünen arkadaşına gönder. | 6 | 48,04–50,52 |

**Süre:** 76 kelime ("Buldum!" öncesi 44). "Buldum!" 33,32 sn, toplam 52,92 sn.

**Taslağa göre değişen replikler**
- h2b: "… yükseldi. Nasıl?" → "… yükseldi. Bu nasıl olur?": tek kelimelik eksiltili soru olmasın.
- d5: "Gidince muhasebe …" → "Siz gidince muhasebe …": özne açık olsun.
- whisper: h2a "yaş almadı"yı "yaşa almadı", h2b "birimin de"yi "biriminde" duydu (bitişik okuma); kelime çapaları konumdan tuttu.

**Motor için**
- Tabela ve cevap okları aynı olay listesini okur (`tm.tabM`, `tm.tabB`); cevap kesmesinde tabelalar dönmeden 49 ve 22'ye geri gelir (Defne olayı yeniden oynatır).
- Katlanır metre: 9 parçalı zikzak, merkezi Defne'nin ellerinde; açılma tek `u` ile.
- Sayaç bu bölüme özeldir: başlık kartın altında, daire iki tabelanın arasında, paylaşım hapı ayak hizasında.
- Kart cevap kesmesinde (d3 + 0,82 sn) kalkar; cevap kadrajında tabelalar kartın altında kalmasın diye.
