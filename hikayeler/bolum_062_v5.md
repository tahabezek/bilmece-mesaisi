# 062 · Maaş ortalaması (v5 storyboard, cevapsız tasarım, 2026-11-22)

Kaynak: `hikayeler/bolum_058-063.md` § 062. Sahne: `engine/b062.js`. Bölüm dosyası: `bolumler/062-maas.json` (`cevapsizTasarim: true`). Yayın sırası 50 (rozet "BİLMECE #50"). Sayaç 10 sn, ipucu repliği var (`countdown: "n1-0.3"`). Mekanizma: gizli sayıyla maskeleme.

- **Logline:** Ofis mutfağında, masada dört ters bordro zarfı. Dördü de maaş ortalamasını merak ediyor, kimse maaşını söylemiyor. Hikmet hesap makinesi açık telefonu yüzüstü çevirir, üstüne not destesi ve kalem koyar. Necmi bir yaprak koparıp "yazalım, karıştıralım" der; Defne "el yazısından bilinir" diye karşı çıkar. Hikmet zarfını göğsüne bastırıp kolunu siper eder. Sayaçtan sonra Necmi boş bir yaprağı kaldırır.
- **Akılda kalacak tek şey:** Bir sayıyı gizli bir sayıyla karıştırırsan, söylediğin şey artık maaşın değildir.
- **Kart:** `Dört kişi maaş ortalamasını öğrenecek.` (38) / `Kimse maaşını kimseye söylemeyecek.` (35)
- **Cevap (arşiv, videoda yok):** Hikmet büyük bir sayı uydurur, maaşını ekler, Defne'ye fısıldar; herkes kendi maaşını ekleyip devreder; Kerem sonucu Hikmet'e söyler; Hikmet uydurduğu sayıyı çıkarır, dörde böler. `mantik()` build anında denetler.
- **Sızıntı yasağı:** fısıldama, kulağa eğilme, sayı zinciri yok. Zarflar hiç açılmaz; kâğıtlar boştur, ekranda hiç rakam yok (telefonun tuşları rakamsız). Kerem nötr, konuşmaz.
- **Kadro:** Defne, Hikmet, Necmi, Kerem (soldan sağa, masada oturur).
- **Mekân:** `b062_mutfak`: fayans bantlı ofis mutfağı, pencere (İstanbul, martı), duvar saati, raf ve semaver; önde derin ahşap masa, çizgili muşamba. Döngüler: saat saniyesi, çay ve demlik buharı, martı.
- **Kare 0:** Dört ters bordro zarfı (GİZLİ damgalı) ve dört şüpheli, yan bakış. Hikmet'in eli zarfında; 0,15 sn'de zarfı kendine çeker.

| # | ≈ sn | Ana eylem (nesneyle) | Kamera | Kesme |
|---|---|---|---|---|
| 1 Kanca | 0–3,7 | Dört şüpheli bakış; Hikmet zarfını çeker, "maaş"ta zarfa vurur (h1). | geniş 1,34x → 1,34x | |
| 2 Defne | 3,8–7,3 | "Ama"da iki eliyle zarfını kendine çeker, "söylemem"de başını sallar (d1). | yakın 1,72x | sert |
| 3 Necmi | 7,3–9,5 | "ölsem"de çay bardağını kaldırıp zarfının üstüne ağırlık diye koyar (n0). | yakın 1,66x | sert |
| 4 Zarflar | 9,5–11,6 | Insert, masa üstten (yüz yok): "Dördümüz"de dört el sırayla kendi zarfına basar (h2). | 1,15x → 1,19x | sert |
| 5 Geniş | 11,6–15,0 | Hikmet parmak sallar; "tahmin"de herkes yan gözle komşusuna bakar, Kerem başını sallar. | geniş 1,3x → 1,36x | sert |
| 6 Hikmet | 15,0–20,3 | "Hesap"ta telefona dokunur, "yok"ta yüzüstü çevirir; "Kâğıt"ta cebinden not destesi, "kalem"de kalem; "serbest"te avuçlar açılır (h2b). | yakın 1,62x | sert |
| 7 Necmi | 20,3–23,9 | Desteden boş yaprak koparır, "karıştıralım"da yaprakla daire çizer (n2). | 1,55x | sert |
| 8 Üçlü | 23,9–26,5 | "Olmaz"da Defne parmak sallar, "el yazısından"da Necmi'nin yaprağını gösterir (d2). | 1,42x | sert |
| 9 Siper | 26,5–29,4 | Komik yakın: Hikmet kamburlaşır, zarfını göğsüne bastırır, kolunu üstüne siper eder, yan gözle bakar (h3). | yakın 1,82x | sert |
| 10 Sayaç | 29,4–39,5 | Doğrusal itme. Necmi yaprağı desteye bırakır; Kerem Hikmet'e bakar; Necmi zarfında parmak tıkırdatır; Kerem zarfını kendine çeker; Hikmet siperi bırakır, düşünür; Defne ve Necmi düşünür. | 1,26x → 1,38x doğrusal | sert |
| 11 İpucu | 39,5–44,5 | Necmi desteden boş yaprak alıp kaldırır, "maaşını"da zarfına dokunur; cümle 1,5 sn daha okunur kalır (n1). | 1,56x → 1,61x | sert |
| (arşiv) | 44,6–58,8 | Buldum, cevap, çağrı: sade. `cevapsiz.mjs` keser. | | |

| id | Konuşan | Replik | ≈ sn |
|---|---|---|---|
| h1 | Hikmet | Bu ofiste maaş ortalaması kaç, merak ediyorum. | 0,30–3,29 |
| d1 | Defne | Ben de merak ediyorum. Ama maaşımı kimseye söylemem. | 3,89–6,93 |
| n0 | Necmi | Ben ölsem de söylemem. | 7,43–9,02 |
| h2 | Hikmet | Dördümüz de söylemeyeceğiz. Kimse kimsenin maaşını tahmin bile edemeyecek. | 9,62–14,61 |
| h2b | Hikmet | Hesap makinesi yok, uygulama yok. Kâğıt, kalem ve fısıltı serbest. | 15,11–19,84 |
| n2 | Necmi | Herkes kâğıda yazsın, kâğıtları karıştıralım. | 20,44–23,49 |
| d2 | Defne | Olmaz, el yazısından kimin olduğu bilinir. | 23,99–26,34 |
| h3 | Hikmet | Öyleyse ortalamayı nasıl buluruz? | 26,94–29,15 |
| n1 | Necmi | Bir sayı söylemek, maaşını söylemek değildir. | 39,75–43,04 |
| d3 | Defne | Buldum! İlk sayıyı Hikmet Bey uyduracak. | 44,64 (kesim ≈ 44,52) |
| d4 | Defne | Uydurduğu sayıya maaşını ekleyip fısıldayacak. Herkes ekleyip devredecek. Sonunda uydurduğu sayıyı çıkaracak. | arşiv |
| d6 | Defne | Bunu maaşını saklayan arkadaşına gönder. | arşiv |

**Bütçe:** "Buldum!" öncesi 59 kelime (≤ 75). d3 44,64 sn.

**Taslağa göre değişenler**
- d1 "Ben de." → "Ben de merak ediyorum.": eksiltili cümle olmasın.
- n0 "Ben hiç söylemem." → "Ben ölsem de söylemem.": 3 kelimelik satır yutulabilir; bardak ağırlığı esprisine bağlandı.
- h2 iki cümleye bölündü; h2b eklendi: şart ("kâğıt, kalem ve fısıltı serbest; hiçbir uygulamaya güvenmiyorlar") sözle ve nesneyle (yüzüstü telefon, deste, kalem) verilsin.
- d2 "El yazısından bilinir." → "Olmaz, el yazısından kimin olduğu bilinir.": kısa satır.
- h3 "Ortalamayı nasıl buluruz?" → "Öyleyse ortalamayı nasıl buluruz?": kısa satır.

**Motor için**
- Karakterler masada oturur (masa belden aşağısını örter); masa karakterlerden sonra çizildiği için masanın üstündeki önkollar `kolUst` ile yeniden çizilir.
- Zarf, bardak, deste ve kalem tek durum fonksiyonlarından okunur (`zarfAt`, `bardakAt`).
- Kadraj (koordinatör, 22 Kas): baş üstleri kartın alt kenarının ≥ 30 px altında, masanın ön kenarı ekranda y ≈ 1470, zarflar ve eller ortada; GİZLİ damgası 44 px (ekranda ≈ 57 px).
- Sayaç bölüme özel (perde yok): başlık ve daire altyazı bölgesinde (y 1262), yüzleri örtmez. İpucu balonu n1 bittikten sonra kesime kadar tam opak kalır.
- Yakın planlar 1,5–1,9x: rehberin 0,94–1,46 aralığı bilerek aşılır; 12 sert kesme (3–8 sınırı aşılır, koordinatörün plan çeşitliliği isteği).
