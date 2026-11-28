# 090 · İkiye bir pide (v5 storyboard, cevapsız tasarım, kısa format, 2026-11-28)

Kaynak: `hikayeler/bolum_089-090.md` § 090 (kart, şartlar, tuzak ve çürütme, referans cevap). Sahne: `engine/b090.js`. Bölüm dosyası: `bolumler/090-pide.json` (`cevapsizTasarim: true`, `cdShare` yok: sayaçta yalnız "SEN DE DÜŞÜN!"). Yayın sırası 75 (rozet "BİLMECE #75"). Sayaç 10 sn, `countdown: "n1-0.3"`. Cevap türü yöntem (kes-seç'in eşit olmayan paya genişletilmesi).

## Senaryo

Pide salonu. Fayanslı duvar, solda taş fırın (ağzında odun ateşi), sağda bakır tencere rafı. Mermer masanın arkasında üç kişi: Necmi (solda), Hikmet Bey (ortada), Defne (sağda). Masada ahşap tahtanın üstünde kesilmemiş, uzun, buharı tüten kıymalı pide; bıçak pidenin üstünde yatıyor (kollar pidenin üstünden uzanır). Necmi'nin elinde mavi 100, Defne'nin elinde lila 200 liralık.

Hikmet pideyi eliyle sunar: "Bu pide üç yüz lira; Defne iki yüz, Necmi yüz lira verdi." Adlarında ikisi paralarını kaldırır, sonra masaya bırakır. Hikmet'e yakın plân: "Herkes kendi gözünde parası kadar alsın;" ("kendi gözünde"de parmağı gözünün yanında, "parası kadar"da eli pidenin üstünde payı ölçer gibi gezinir). Pideye insert: "terazi yok" omuz silker; "kimse kimsenin bıçağına güvenmez" bıçağı kaldırır, Necmi ile Defne birbirine şüpheyle bakar; bıçak pidenin üstüne iner.

Necmi: "Biri keser, öbürü seçer: Defne ikiye kessin, ben seçeyim." ("keser"de eliyle pidenin ortasını keser, bıçağı Defne'ye iter, "ben"de göğsünü gösterir.) Defne bıçağı Necmi'ye doğru geri iter: "Olmaz, sen büyüğünü seçersin;" (eliyle ortayı keser, pidenin ortasında mercan kesik çizgi belirir) "bana yarısı kalır." (eli sağ yarıda, o yarı mercan tonu alır) "Nasıl bölüşeceğiz?" (omuz silker).

Sayaç: Defne pidenin çıtır ucuna bakar (zevki kenar), sonra parmağı yanağında; Necmi pidenin ortasını koklar (zevki orta), sonra eli çenesinde; Hikmet bıçağı alıp bakar, bırakır, eli çenesinde. Defne 200'lüğünü yeniden alıp bakar, bırakır. İpucu: Hikmet bıçağı ucundan iterek Necmi'nin önüne getirir, Necmi sapına elini koyar: "Bence kesen, kendi payını bilmeli." Herkes bıçağa, sonra Necmi'ye bakar. (Kesim.)

- **Logline:** Defne 200, Necmi 100 lira verdi; terazi yok, kimse kimsenin bıçağına güvenmiyor, zevkleri farklı. Necmi'nin "Defne ikiye kessin, ben seçeyim" yolunu Defne çürütür: Necmi büyüğünü seçer, Defne'ye yarısı kalır.
- **Akılda kalacak tek şey:** Keseni ve seçeni paya göre kur.
- **Kart:** `Defne 200, Necmi 100 lira verdi.` (32) / `Parası kadar nasıl bölüşürler?` (30).
- **Referans cevap (arşiv, kesilir):** Necmi pideyi kendi gözünde üç eşit parçaya keser, Defne iki parça seçer, kalan Necmi'nin. Ters rol de doğru: Defne üçe keser, Necmi bir parça seçer. Geçerli alternatif: önce kes-seç ile yarı yarıya, sonra Necmi kendi yarısını üçe keser ve son seçimi Defne yapar.
- **Kadro:** Necmi, Hikmet Bey, Defne. Kerem yok. Yan karakter yok.
- **Mekân:** `b090_salon`. Döngüler: fırında yanan ateş, pideden yükselen buhar.
- **Nesneler:** kıymalı pide (kahraman; tahtanın neredeyse tamamı), ahşap servis tahtası, bıçak, 100 ve 200 liralık (ekranda ≥ 55 px rakam), kare 0'dan h1 sonuna "300 TL" fiyat etiketi.
- **Sızıntı yasağı:** Pide hiçbir karede üçe bölünmez, üç parça çizgisi ya da üç işaret yok; kimse parmakla üç saymaz. Görünen tek çizgi yanlış denemenin orta çizgisidir (ikiye) ve sayaç kesmesinde kalkar. Ekranda "üçe", "üç parça", "iki parça seç" yok (`sizinti`).
- **Kare 0:** Üstte kart. Grup plânı (1,25x): pide masada buharlı, Necmi "100"ü, Defne "200"ü göğüs hizasında tutar, pidenin üstünde "300 TL" etiketi. Hikmet'in eli 0,3 sn'de pideye uzanır; ses 0,30 sn'de başlar.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | Döngüler | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–4,42 | Grup | h1: Hikmet pideyi sunar; "Defne"de 200, "Necmi"de 100 kalkar; "verdi"de paralar masaya. | ateş, buhar | 1,25 → 1,27x | (yok) |
| 2 Hikmet | 4,42–6,98 | Hikmet ve pide | "kendi gözünde": parmak gözün yanında; "parası kadar": el pidenin üstünde gezinir. | ateş, buhar | 1,44x | sert kesme |
| 3 Pide insert | 6,98–10,31 | Pide, üç yüz | "terazi yok" omuz silker; "kimse"de bıçağı kaldırır; Necmi ve Defne şüpheyle birbirine, sonra bıçağa bakar; bıçak iner (knock). | ateş, buhar | 1,50 → 1,53x | sert kesme |
| 4 Necmi (tuzak) | 10,31–14,47 | Necmi ve Hikmet | "keser": eliyle ortayı keser; "seçer": pideyi gösterir; "Defne ikiye kessin": bıçağı sağa iter (swish); "ben": göğsünü gösterir. | ateş, buhar | 1,44x | sert kesme |
| 5 Çürütme ve soru | 14,47–18,52 | Hikmet ve Defne | "Olmaz": bıçağı geri iter; "büyüğünü": ortayı keser, mercan kesik orta çizgi; "yarısı": eli sağ yarıda, yarı mercan; "Nasıl": omuz silker. | ateş, buhar | 1,44x | sert kesme |
| 6 Sayaç (10 sn) | 18,52–28,57 | Grup | Defne çıtır uca bakar, parmak yanakta, 200'ü alıp bakar; Necmi ortayı koklar, eli çenede; Hikmet bıçağı alıp bakar, bırakır, eli çenede. Sayaç alt bantta, perde yok. | ateş, buhar, doğrusal itme | 1,25 → 1,31x | sert kesme |
| 7 İpucu | 28,87–31,84 | Aynı plân | n1: "kesen"de Hikmet bıçağı ucundan Necmi'nin önüne iter, Necmi sapına elini koyar; Defne Necmi'ye bakar. Balon kesime kadar. | aynı | itme sürer | (yok) |
| — Kesim | ≈ 31,84 | | `cevapsiz.mjs`: "Buldum!"dan 0,12 sn önce keser, takip kartını ekler. | | | |
| 8 Buldum (arşiv) | 31,96 | Defne | sıçrama, ışınlar | | 1,44x | |
| 9 Cevap (arşiv) | 35,0–44,2 | Grup | Defne anlatır; çağrı. | | 1,25 → 1,3x | |

| id | Konuşan | Replik | Kelime | sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Bu pide üç yüz lira; Defne iki yüz, Necmi yüz lira verdi. | 12 | 0,30–4,27 |
| h2 | Hikmet | Herkes kendi gözünde parası kadar alsın; terazi yok, kimse kimsenin bıçağına güvenmez. | 12 | 4,52–10,23 |
| n0 | Necmi | Biri keser, öbürü seçer: Defne ikiye kessin, ben seçeyim. | 9 | 10,43–14,39 |
| d2 | Defne | Olmaz, sen büyüğünü seçersin; bana yarısı kalır. Nasıl bölüşeceğiz? | 9 | 14,59–18,52 |
| n1 | Hikmet | Bence kesen, kendi payını bilmeli. | 5 | 28,87–31,11 |
| d3 | Defne | Buldum! Necmi üçe kessin, ben ikisini seçeyim. (arşiv) | 7 | 31,96–34,87 |
| d4 | Defne | Necmi kendi gözünde üç eşit parça keser; ben iki parça seçerim, kalan onun. İkimiz de payımızdan emin oluruz. (arşiv) | 18 | 35,22–41,48 |
| d6 | Defne | Bunu pideyi paylaştığın birine gönder. (arşiv) | 5 | 42,18–44,11 |

**Süre:** "Buldum!" öncesi 47 kelime (sınır 55), toplam 77. "Buldum!" 31,96 sn (hedef ≤ 32). Kesilmiş film ≈ 34,2 sn.

**Şartların filmdeki yeri (kesilmiş sürüm)**
- Pide salonu, kesilmemiş kıymalı pide, 300 lira: mekân (taş fırın), kare 0'dan masadaki uzun pide, h1, "300 TL" etiketi.
- Defne 200, Necmi 100: kart, h1, kaldırılan paralar (sayaçta Defne 200'ü yeniden alır).
- Herkes parası kadar, her biri kendi gözünde: h2 ("kendi gözünde"de Hikmet'in parmağı gözünün yanında).
- Terazi yok, kimse kimsenin bıçağına güvenmiyor: h2 ve insert (omuz silkme; kaldırılan bıçak, şüpheli bakışlar).
- Zevk farkı: söylenmez; sayaçta Defne çıtır uca, Necmi kıymalı ortaya bakar (açıklama metninde de yazar).
- Tuzak ve çürütme: n0 bıçakla oynanır; d2 orta çizgi ve mercan yarıyla.

**İpucu değerlendirmesi (kritik):** "Bence kesen, kendi payını bilmeli." ile bıçağın Necmi'ye itilmesi iki yön verir: az payı olan kessin, kendi payını ölçü alsın. Üç parça fikrini ve Defne'nin iki parça seçmesini söylemez; bu sıçrama izleyiciye kalır. Zayıf yanı: yalnız söz olsaydı "kendi payını bilmeli" muğlak kalırdı; bıçak itilmesi onu somutlaştırır. Güçlü yanı: kes-seç'i bilen izleyiciyi tuzaktaki "ikiye" çizgisinden kurtarıp paya göre kesmeye çevirir. Ters rol (Defne üçe keser) de geçerli olduğu için bıçağın Necmi'ye gitmesi cevabı tek yola kilitlemez. Karar: kalır.

**Taslağa göre değişenler (şartlar ve cevap aynı)**
- h1 "Kıymalı pide…" → "Bu pide…" (d3 32,55 → 31,96 sn); "Necmi yüz verdi" whisper'da birleşiyordu, "yüz lira verdi" oldu.
- h2'ye "kendi gözünde" şartı eklendi; "güvenmiyor" → "güvenmez" (süre).
- d2 "bana yarısı kalır" noktalı virgülden sonra Emel'de "yeri sıkılır" duyuluyordu: `tts` alanında virgül (ekranda noktalı virgül).
- Hızlar: Hikmet ve Defne voices.json temelinde (Hikmet −4%, Defne +12%), Necmi +2%. Son işlem yok (Necmi'nin onaylı titremesi dışında).

**Kritik ve bağımsız göz (28 Kas)**
- Kendi turum: (1) paralar göğüs hizasında Necmi'nin ağzını örtüyordu → pidenin arka kenarı hizasına indi, 200'de rakam tutan elin karşı yanına kaydı; (2) "kendi gözünde"de parmak yukarı-dışarı bakıyordu → göze döndü; (3) insert 1,62x'te Defne'nin saçı Hikmet'in yüzüne biniyordu, 1,55x'te Necmi'nin kulağı kenarda kesiliyordu → 1,5x, yan karakterler 22/14 px içeri, insertte altyazı 1300 px. Ayrıca pide kahraman olsun diye dikeyde 1,38x kabartıldı, bıçak 1,3x büyütüldü.
- Bağımsız göz (yapıma katılmamış alt ajan, 1 fps kare): sızıntı yok, konuşan belli; puanlar kanca 6, okunabilirlik 8, hareket 5, çeşitlilik 7, kompozisyon 7, anlaşılırlık 6. Uygulananlar: ipucunda Hikmet'in eli bıçak sapını izleyemiyordu (kol yetmiyor, bıçak elsiz kayıyordu) → Hikmet bıçağı ucundan iter, bıçak 200 px kayar, Necmi sapına elini koyar; masanın önündeki bıçağa pidenin arkasından uzanan eller havada disk gibi duruyordu → bıçak pidenin üstüne alındı, kollar pidenin üstünden görünür, kaldırma 1018 px'e kadar; Necmi'nin "keser" elindeki aşağı parmak pidenin içine giriyordu → parmak kaldırıldı; zevk bakışları seçilmiyordu → Defne başını çıtır uca çevirip eğer, Necmi ortaya eğilip koklar; "300 TL" etiketi Hikmet'in çenesine değiyordu → aşağı alındı.
- Uygulanmayanlar: "12,5 → 13,5 sn bıçak sıçrıyor" (Necmi'nin bilerek ittiği hareket); kartın "kendi gözünde"yi içermemesi (kart görev belgesinde sabit); kart ve rozetin güvenli alan sınırı (ortak `riddleCard`, bütün bölümlerde aynı); "Olmaz"da Defne'nin gülümser görünmesi (konuşma ağzı; ifade ciddi).
- Düzeltmeden sonra tam render, kesim ve kapılar yeniden alındı; son 3 sn'ye bakıldı (ipucu balonu okunur, kart temiz). Düzeltilmiş film bağımsız göze ikinci kez izletilmedi.

**Koordinatör düzeltmesi (28 Kas, ikinci tur)**
- Kadraj: karakterler 40 px yukarı (masa göğüs altına iner), grup 1,38x (sayaçta 1,42x'e itilir), yakın plânlar ve insert 1,43x; pide dikeyde 2,0x kabarık, kıymalı yüzey büyük. Masanın önünden yeşil-krem çizgili, mercan saçaklı pide salonu örtüsü sarkar; altyazı (balon üstü 1240 px, iki satır 1405 px'te biter) ve sayaç örtünün üstünde. Baş tepeleri ≥ 550 px (kartın altı ≈ 509). Bıçak pidenin üstünde, kaldırınca yüzlere binmesin diye 1008 px'te kalır.
- Altyazı: her balon büyük harfle başlayan tam cümle, 48 px. Ekran metinleri: h1 "Bu pide üç yüz lira. / Defne iki yüz, Necmi yüz lira verdi.", h2 "Herkes kendi gözünde parası kadar alsın. / Terazi yok, kimse kimsenin bıçağına güvenmez.", n0 "Biri keser, öbürü seçer. / Defne ikiye kessin, ben seçeyim.", d2 "Olmaz, sen büyüğünü seçersin; bana yarısı kalır. / Nasıl bölüşeceğiz?". Ses değişmedi (`tts` alanları eski metinle; mp3 anahtarları aynı, zamanlar aynı).
- İkinci bağımsız göz: sızıntı yok, balonlar tam cümle, ≥ 44 px; puanlar kanca 7, okunabilirlik 8, hareket 5, çeşitlilik 6, kompozisyon 4 (örtüyü boş yüzey saydı), anlaşılırlık 7. Uygulananlar: zoom 1,3 → 1,38/1,43; balon 10 px yukarı; Hikmet'in sayaçtaki "eli çenede" pozu Necmi'nin ve sonra Defne'nin yanağına biniyordu → kaldırıldı; Hikmet yakın plânında kenarda kalan para kenarları gizlendi; h1 balonu kesmeden önce söner.
