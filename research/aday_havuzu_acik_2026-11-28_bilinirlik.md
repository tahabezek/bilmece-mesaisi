# Açık yöntem adayları (28 Kas 2026): bilinirlik araması

Kapsam: `aday_havuzu_acik_2026-11-28.md` içindeki A1, A3, A11, A12, A2, A6, A4. Öbür adaylara bakılmadı. Yalnızca **mekanizmanın** bilinirliği arandı; adların ve kurgunun değil. Adayların mantığı yeniden değerlendirilmedi.

Yöntem: Her aday için Türkçe, İngilizce ve Rusça yapısal aramalar (WebSearch). Önemli sonuçlar WebFetch ile açıldı. İki PDF (TÜBİTAK Bilim ve Teknik, МЦНМО föyü) indirilip `pdftotext` ile metni okundu. Ekşi Sözlük ve Evrim Ağacı 403 verdi; onlar için yalnız arama özeti kullanıldı ve bu ayrıca belirtildi. Instagram ve TikTok giriş istediği için doğrudan aranamadı; "Türkçe dolaşıyor mu" sütunu, web aramasının indekslediği Türkçe haber, forum, YouTube ve zekâ sorusu sayfalarından çıkarım. Bu sütun bu yüzden "bulunamadı" demektir, "yok" değil.

Eleme kuralı (önceki raporla aynı): Aynı mekanizma iki ayrı kaynakta popüler biçimde çıkıyorsa (bilmece derlemesi, viral video, popüler bulmaca köşesi) aday elenir. Ders kitabı ya da akademik kaynak tek başına eleme sebebi değildir. Olimpiyat ya da çevre föyünde birebir çıkıp Türkçe popüler dolaşımda olmayan aday "sınırda" sayılır (önceki rapordaki R8 emsali).

Benzerlik ölçeği: **aynı** (kurgu ve mekanizma aynı), **aynı mekanizma farklı kurgu**, **uzak** (aynı aile, hile farklı).

---

## Karar tablosu

| # | Ad | Bilinirlik (Türk izleyici) | IG/TikTok'ta Türkçe | Karar | En yakın kaynak | Klasiği yeniliyor mu? |
|---|---|---|---|---|---|---|
| A1 | Kerem'in başı | orta | bulunamadı (Türkçe yazı ve sözlükte var) | **sınırda** | Boolos/TED-Ed "Three Gods" (ozo/ulu), Evrim Ağacı, Ekşi; Cornell "bilinmeyen evet/hayır kelimeleri" | Kısmen: bilinmeyen sözlüğü tanrı ve yalancıdan ayırıp tek, saf soruya indiriyor; ama "sorsam ne derdin" kalıbını bilen herkes hemen uygular. |
| A3 | Üç kişilik tepsi | düşük–orta | bulunamadı | **sınırda** | МЦНМО 6. sınıf föyü Задача 69 ("ikimiz olsak biri böler…", aynı); Ekşi "fair division"; Numberphile, naked-science, thecode.media | Evet, ama yenilik klasiğin kendisi: iki kişilik halk bilgisinin üç kişide çökmesi zaten kaynaklarda bu sırayla anlatılıyor. |
| A11 | Yılbaşı çekilişi | düşük | bulunamadı | **geçer** | luispedro.substack "Paper-Based Secret Santa Protocol" (numaralı zarf + döngü kuralı, aynı aile); kriptografi makaleleri | Evet: herkesin bildiği "kendini çeken yeniden çeker" alışkanlığını tek çekilişte kıran fiziksel bir döngü hilesi; popüler dolaşımda yok. |
| A12 | Üç kilit | düşük–orta | bulunamadı | **elenir (kural gereği)** | lifehacker.ru "Задача про банковский сейф" (3 müdür, 3 kilit: aynı); puzzleprime "Securing the Box"; TÜBİTAK Bilim ve Teknik, Emrehan Halıcı "Kasa ve Kilitler" (genel N/M) | Hayır: üç kişilik hâli klasiğin en küçük örneği, Rusça popüler bulmaca köşesinde birebir var. |
| A2 | Yarım bardak (ince belli) | düşük | bulunamadı | **geçer** | Eğme klasiği: TÜBİTAK Bilim Çocuk, GeeksforGeeks (uzak); iki bardakla eşitleme yalnız NRICH yorumunda (uzak) | Evet: ince bel, bilinen eğme çözümünü kendiliğinden kırıyor; iki bardakla eşitleme bulmaca olarak dolaşımda değil. Risk bilinirlik değil kolaylık. |
| A6 | Beş kart | düşük | bulunamadı | **geçer** | den Boer 1989 "Five Card Trick" (aynı); UMD ders notu, hajji.org (akademik/ders) | Evet: kriptografi derslerinden çıkmamış bir protokol; Türkçe kaynak yok. |
| A4 | Tek para, üç kişi | düşük | bulunamadı | **sınırda** | МЦНМО 6. sınıf föyü Задача 70 (aynı soru); Straight Dope "three-way coin toss" (eleme tuzağı, tek kalan, 2ⁿ kanıtı: aynı); Wikipedia "Coin flipping"; ders kitabı "odd man out" | Az: eleme tuzağı ve "tek kalan" çözümü aynı forum başlığında birlikte duruyor; Türkçe dolaşım yok ama 042 ile ara adım ortak. |

**Geçer (3):** A11, A2, A6.
**Sınırda (3):** A1, A3, A4.
**Elenir (1):** A12.

---

## Ayrıntı

### A1. Kerem'in başı (bilinmeyen evet işareti)
- **Sorgular:**
  - TR: `"ja" "da" en zor mantık bilmecesi tanrı tek soru evet hayır anlamı bilinmiyor`
  - TR: `"başını" evet hayır anlamını bilmiyorsun tek soru zeka sorusu kapı yalancı doğrucu "ne derdin"`
  - TR: `kafa sallama yukarı hayır demek bilmece zeka sorusu "hangisi evet"`
  - TR: `"en zor mantık sorusu" tanrılar ja da youtube OR tiktok OR instagram türkçe`
  - EN: `riddle nods or shakes head don't know which means yes one question`; `puzzle stranger answers by gesture you don't know which gesture means yes single question fork in road`; `TED-Ed riddle unknown language "yes" "no" words …`
  - RU: `загадка кивает головой не знаешь что означает да один вопрос узнать`
- **Bulunanlar:**
  - **Aynı mekanizma farklı kurgu:** Evrim Ağacı "Gelmiş geçmiş en zor mantık sorusu" (https://evrimagaci.org/gelmis-gecmis-en-zor-mantik-sorusu-8570; 403, arama özetinden). Tanrıların "da/ja" kelimeleri, anlamı bilinmeden gömülü soru ("ancak ve ancak … ise") ile bilgi alma ayrıca anlatılıyor.
  - **Aynı mekanizma farklı kurgu:** Ekşi Sözlük girdisi (https://eksisozluk.com/entry/96776064; 403, arama özetinden). TED-Ed'in "ozo/ulu" kelimeleriyle aynı hileyi Türkçe anlatıyor.
  - **Aynı mekanizma farklı kurgu:** TED-Ed "Can you solve the three gods riddle?" (https://www.ted.com/talks/alex_gendler_can_you_solve_the_three_gods_riddle). Çözüm, bilinmeyen kelimeyi sorunun içine koyuyor. Mental Floss ve Laughing Squid de aynı videoyu yaymış.
  - **Aynı mekanizma:** Cornell Math Explorers' Club (https://pi.math.cornell.edu/~mec/Winter2009/Lipa/Puzzles/lesson3.html). Kelimeleri bilinmeyen yabancı; orada iki soru veriliyor.
  - **Uzak ama çok bilinen:** İki bekçi, iki kapı ("öbür bekçiye sorsam ne der?"). Webtekno mantık soruları (https://www.webtekno.com/mantik-sorulari-kacini-dogru-bilebileceksin-h136931.html). Türk izleyicinin büyük kısmı bu kalıbı bilir; A1'in referans cümlesi ("sana … sorsam … derdin?") bununla aynı dilbilgisi.
  - Baş işaretiyle kurulmuş bir sürüm hiçbir dilde bulunamadı. Rusça sonuçlar yalnız kültürel jest notları.
- **Bilinirlik:** Orta. Saf hâli (tek bilinmeyen: sözlük) popüler değil; ama mekanizma Türkçe iki popüler kaynakta (Evrim Ağacı, Ekşi/TED-Ed) Boolos bilmecesinin alt adımı olarak var ve iki bekçi kalıbı yüzeyde ipucu veriyor.
- **IG/TikTok Türkçe:** Bulunamadı. TED-Ed videosunun Türkçe alt yazılı izlenmesi muhtemel ama doğrulanamadı.
- **Karar:** Sınırda. Kural harfiyen: iki kaynak var, ama ikisi de mekanizmayı ana bilmece olarak değil, "en zor bilmece"nin ara adımı olarak veriyor. Yorumda "bu Boolos'un ja/da sorusu" diyen birkaç kişi beklenir.
- **Yeniliyor mu:** Kısmen. Tanrıları, yalancıyı ve rastgeleyi atıp tek bilinmeyene indirmek bilmeceyi çıplak hâle getiriyor; Türk jest kültürü (yukarı = hayır) ayar sorusu tuzağını güçlendiriyor. Ama çözüm cümlesi klasiğin cümlesi.

### A3. Üç kişilik tepsi (biri keser öbürü seçer, üç kişide)
- **Sorgular:**
  - TR: `"üç kişi" pasta adil paylaşım "biri keser diğeri seçer" üç kişiye nasıl`
  - TR: `pastayı üç kişi arasında adil bölmek matematik video "kes ve seç" üç kişi`
  - RU: `задача как разделить торт на троих справедливо каждый считает что получил не меньше трети`
  - (A4 için açılan МЦНМО föyünde ayrıca çıktı.)
- **Bulunanlar:**
  - **Aynı (kurgu cümlesi dahil):** МЦНМО matematik çevresi, 6. sınıf, 9. ders, Задача 69 (https://old.mccme.ru/circles/mccme/2021/6/09-trio.pdf). Üç haydut ganimeti bölüyor; biri "ikimiz olsak biri böler öbürü seçer" diyor; istenen: herkes en az üçte bir aldığından emin olsun. A3'te Hikmet'in "İki kişi olsak…" cümlesi bununla birebir.
  - **Aynı mekanizma (alternatif yol):** Ekşi Sözlük "fair division" başlığı (https://eksisozluk.com/entry/1674152; 403, arama özetinden). Kayan bıçak yöntemini Türkçe anlatıyor.
  - **Aynı aile, popüler:** Numberphile "Sharing cake between three" (https://www.numberphile.com/videos/sharing-cake-between-three; Selfridge–Conway), naked-science.ru, thecode.media "Как разрезать торт так, чтобы никто не обиделся" (https://thecode.media/cake-cutting/), Science News Explores "How to slice a cake fairly".
- **Bilinirlik:** Düşük–orta. İki kişilik hâli Türkiye'de herkesin bildiği halk bilgisi; üç kişilik hâli Türkçe yalnız Ekşi'de. İngilizce ve Rusça popüler bilimde iyi biliniyor.
- **IG/TikTok Türkçe:** Bulunamadı.
- **Karar:** Sınırda (R8 emsali: çevre föyünde birebir, Türkçe popüler dolaşımda yok). Numberphile ve iki Rusça popüler bilim yazısı aileyi ünlü yapıyor ama referans çözüm (kırpma) ile Numberphile'ın çözümü (Selfridge–Conway) aynı değil.
- **Yeniliyor mu:** Evet ama bu yenilik klasiğe ait: "iki kişide çalışan üç kişide çöker" dönüşü kaynaklarda zaten aynı sırayla kuruluyor. Kenar-orta zevki tartıyı kapatıyor; bu kurgunun katkısı.

### A11. Yılbaşı çekilişi (kimse kendini çekmesin, gizli)
- **Sorgular:**
  - TR: `yılbaşı çekilişi kendi adını çekerse ne olur matematik çözüm kimse kendini çekmesin`
  - EN: `secret santa puzzle nobody draws themselves no one knows who has whom envelopes protocol`; `puzzling stackexchange secret santa draw without anyone getting themselves no trusted third party numbered envelopes`; `secret santa trick draw numbers write your name on next number's envelope cyclic no one gets themselves`
  - RU: `тайный Санта задача никто не вытянет себя никто не знает кто кому протокол конверты`
- **Bulunanlar:**
  - **Aynı aile, en yakın:** Luis Pedro Coelho, "Paper-Based Secret Santa Protocol" (https://luispedro.substack.com/p/paper-based-secret-santa-protocol). Gizli numaralı zarflar, saat yönü kuralıyla hedef. A11'in "numaranın bir fazlası" kuralından farklı ama aynı fikir: ismi değil yeri çek, döngü kimseyi kendine döndürmez. Kişisel blog, popüler değil.
  - **Uzak:** Spektrum HLF blogu "A Mathematical Exchange of Gifts" (https://scilogs.spektrum.de/hlf/?p=11951). Liste dolaştırma protokolü; kendini çekmeyi önlemiyor, yeniden başlatıyor.
  - **Uzak:** Math StackExchange "secret santa algorithm that does not rely on a trusted 3rd party", arXiv "ZK Secret Santa", Bern tezi. Hepsi kriptografik.
  - Popüler içerik (UTS, SAS blog, phys.org) yalnız derangement olasılığını anlatıyor ("yaklaşık %63 ihtimalle biri kendini çeker, yeniden çekin"). Rusça habr ve t-j.ru yazıları da "yeniden çek" ya da "organizatör bilsin" diyor.
  - Türkçe hiçbir kaynak bulunamadı.
- **Bilinirlik:** Düşük.
- **IG/TikTok Türkçe:** Bulunamadı. Yılbaşı çekilişi konulu Türkçe içerik bol, ama hepsi uygulama ya da "kendini çeken yeniden çeksin" düzeyinde.
- **Karar:** Geçer.
- **Yeniliyor mu:** Evet. Herkesin yaşadığı "yeniden çekelim" derdini tek çekilişte çözen fiziksel döngü hilesi; ailesi blog ve kriptografi dışında yok.
- **Not (bilinirlik dışı, avukat için):** Referans çözüm her zaman tek bir 4'lü döngü üretiyor (A→B→C→D→A); "A, B'ye; B, A'ya" gibi karşılıklı çiftler hiç çıkmaz. "Adil çekiliş mi?" itirazı yorumda gelebilir.

### A12. Üç kilit (herhangi ikisi açsın)
- **Sorgular:**
  - TR: `zeka sorusu kasa kilit anahtar herhangi ikisi açabilsin tek başına açamasın kaç kilit`
  - TR: `zeka sorusu 3 kişi kasa 3 kilit her birine 2 anahtar iki kişi bir araya gelince açılsın`
  - EN: `puzzle three people safe locks any two can open but no one alone minimum number of locks keys`; `"11 scientists" locks cabinet "6" puzzle 462 locks`
  - RU: `задача сейф замки ключи любые двое из трёх могут открыть один не может сколько замков`
- **Bulunanlar:**
  - **Aynı (sayılar dahil):** Lifehacker.ru "Задача про банковский сейф" (https://lifehacker.ru/zadacha-pro-bankovskij-sejf/). Birbirine güvenmeyen üç banka müdürü; hiçbiri tek başına açamasın, herhangi ikisi açsın; cevap 3 kilit, 6 anahtar, A-B / B-C / A-C. Popüler bulmaca köşesi.
  - **Aynı mekanizma farklı sayılar:** Puzzle Prime "Securing the Box" (https://www.puzzleprime.com/?p=499; 5 kişi, herhangi 3'ü, 10 kilit). Williams "Safe Generals" (https://sites.williams.edu/mathriddles/?p=105). NCTM "Under Lock and Key" (https://nctm.org/News-and-Calendar/Messages-from-the-President/Archive/J_-Michael-Shaughnessy/Problems-to-Ponder/Problem-to-Ponder_-January-18,-2012). Kenyon "11 bilim insanı, 462 kilit" (https://www2.kenyon.edu/Depts/Math/Aydin/Problem/Past/Sp03/Problem2.html).
  - **Türkçe, aynı mekanizma genel hâli:** TÜBİTAK Bilim ve Teknik, Emrehan Halıcı "Zekâ Oyunları: Kasa ve Kilitler" (https://bilimteknik.tubitak.gov.tr/wp-content/uploads/sites/154/2025/09/0feaf15c-531f-4e0c-8195-f6496066da01-1.pdf). "Birbirlerine fazla güvenmeyen N ortak … en az M ortağın bir araya gelmesiyle kasa açılsın" (metin PDF'ten okundu).
- **Bilinirlik:** Düşük–orta. Genel izleyici bilmez; Bilim ve Teknik okuru ve olimpiyatçı bilir.
- **IG/TikTok Türkçe:** Bulunamadı.
- **Karar:** Elenir (kural gereği). Üç kişilik hâli birebir popüler bir Rusça bulmaca köşesinde, mekanizma ikinci bir popüler bulmaca sitesinde ve Türkçe Bilim ve Teknik'te var.
- **Yeniliyor mu:** Hayır. Üç kişi, klasiğin en küçük ve en çok anlatılan örneği; tuzak (iki kilit) de klasikte aynı.

### A2. Yarım bardak (ince belli)
- **Sorgular:**
  - TR: `bardağı tam yarıya doldurmak zeka sorusu ölçü kabı olmadan yarım bardak`
  - TR: `"iki aynı bardak" OR "iki özdeş bardak" tam yarım zeka sorusu seviyeler eşit`
  - EN: `puzzle "half full" two identical glasses no markings pour until levels equal exactly half`; `riddle how to get exactly half a glass of water without measuring two identical glasses`
  - RU: `как налить ровно половину стакана без мерки два одинаковых стакана задача`
- **Bulunanlar:**
  - **Uzak (A2'nin kırdığı klasik):** Eğme yöntemi. TÜBİTAK Bilim Çocuk (silindir bardakta yarıdan az mı çok mu; arama özetinden), GeeksforGeeks "Cylindrical Glass and Water Measurement" (https://www.geeksforgeeks.org/puzzle-cylindrical-glass-and-water-measurement/), The Weekly Riddle (2010), NUS blogu.
  - **Aynı mekanizma, bulmaca değil:** NRICH "Pouring problem" notunda bir okur yorumu: "birini ağzına kadar doldur, seviyeler eşitlenene kadar öbürüne dök" (https://nrich.maths.org/13664/note).
  - **Uzak:** МГУ küçük mekmat föyünde "iki bardağı eşitleme" işlem olarak veriliyor (https://www.mmmf.msu.ru/archive/20172018/z5/17_10_07-B.pdf; arama özetinden), yarım bardak sorusu olarak değil.
  - Türkçe ya da İngilizce derlemelerde "iki aynı bardakla tam yarım" bilmecesi bulunamadı.
- **Bilinirlik:** Düşük. Eğme klasiği orta düzeyde bilinir ve yorumda gelir; ince bel bunu kapatıyor.
- **IG/TikTok Türkçe:** Bulunamadı.
- **Karar:** Geçer.
- **Yeniliyor mu:** Evet. İnce belli Türk çay bardağı bilinen çözümü (eğme) kendiliğinden kırıyor ve ikinci bardağı ölçü aletine çeviriyor. Risk bilinirlik değil kolaylık: çözüm kâşif için sezgisel olabilir.

### A6. İkisi de istiyorsa (beş kart)
- **Sorgular:**
  - EN: `"five card trick" den Boer dating protocol both want learn puzzle`; `puzzle two people find out if both like each other without revealing if rejected cards brain teaser`; `five card trick secure dating three clubs two hearts video OR blog puzzle "both say yes"`
  - TR: `iki kişi birbirinden hoşlanıyor mu reddedilmeden öğrenmek kartlarla kriptografi türkçe`
  - RU: `задача двое хотят узнать взаимна ли симпатия не раскрывая отказ пять карт`
- **Bulunanlar:**
  - **Aynı:** den Boer, EUROCRYPT '89 "Five Card Trick". UMD ders notu "Crypto, Cards, and Love" (https://www.cs.umd.edu/~gasarch/COURSES/456/F19/lecabcards/lecabcards.pdf), hajji.org "The Game of Like" (https://hajji.org/en/crypto/secure-multiparty-computation/the-game-of-like), Wolfram Demonstrations "Zero-Knowledge Matchmaker", Mizuki vd. dört kart (Asiacrypt 2012).
  - **Uzak:** Galileo.org ve fouryears.eu blogları kart protokolü örneği; Wikipedia "Anonymous matching".
  - Popüler bulmaca derlemesinde, Guardian/Riddler'da ya da Türkçe/Rusça kaynakta bulunamadı. (mathsisfun "Five Card Trick" başka bir hile: Fitch Cheney.)
- **Bilinirlik:** Düşük.
- **IG/TikTok Türkçe:** Bulunamadı.
- **Karar:** Geçer.
- **Yeniliyor mu:** Evet. Kriptografi dersinden çıkmamış bir protokol; ofis kurgusu ilk popüler anlatımı olur. Üretici notundaki "daha basit fiziksel yol var mı" sorusu aramada cevaplanmadı: Quanta'nın bardak-kâğıt bulmacası (eşitlik testi) en yakın fiziksel akraba ama "ve" değil.

### A4. Tek para, üç kişi (cumartesi nöbeti)
- **Sorgular:**
  - TR: `yazı tura ile üç kişi arasında adil kura nasıl çekilir`
  - TR: `bir madeni para ile üç kişiden birini eşit olasılıkla seçmek donanımhaber OR technopat OR ekşi`
  - EN: `"odd man out" coin toss three people fair puzzle one coin`
  - RU: `задача как с помощью одной монеты выбрать одного из трёх человек с равной вероятностью`
- **Bulunanlar:**
  - **Aynı soru:** МЦНМО çevre föyü, 6. sınıf, Задача 70: "Bir ödülü üç kişi arasında bir parayla nasıl çekersin? Şanslar tam eşit olmalı." (https://old.mccme.ru/circles/mccme/2021/6/09-trio.pdf; PDF metninden). A3'ün kaynağıyla aynı föy.
  - **Aynı (tuzak + çözüm + "ama"):** Straight Dope "How do you do a three-way coin toss?" (https://boards.straightdope.com/t/how-do-you-do-a-three-way-coin-toss/438873). Eleme yöntemi önerilip "üçüncü takımın şansı %50, öbürlerinin %25" diye çürütülüyor; "tek kalan" ve "iki atış, dördüncüde yeniden" çözümleri ve "2ⁿ hiçbir zaman 3'e bölünmez" kanıtı aynı başlıkta.
  - **Aynı mekanizma:** Wikipedia "Coin flipping" (üç kişilik "odd man out"), ders kitabı alıştırmaları (Vaia, Transtutors, Vedantu "odd man out"), Math Central (uregina), habr "üç seçenek, bir para" (https://habr.com/en/articles/77983).
  - Türkçe forum ya da zekâ sorusu sitesinde bulunamadı.
- **Bilinirlik:** Düşük (Türk izleyici). İngilizce ve Rusça orta: hem forum hem ders kitabı hem çevre föyü.
- **IG/TikTok Türkçe:** Bulunamadı.
- **Karar:** Sınırda. Türkçe dolaşımda yok; ama tuzak, çözüm ve "sonsuza kadar sürebilir" itirazının cevabı tek bir İngilizce forum başlığında hazır, soru Rusça 6. sınıf föyünde birebir. 042 ile ara adım ortaklığı (üretici notu) bu sınırı aşağı çekiyor.
- **Yeniliyor mu:** Az. Eleme tuzağı klasiğin kendi tuzağı; yeni olan yalnız nöbet kurgusu.

---

## Özet

- **Geçer:** A11 (en temiz: Türkçe sıfır, İngilizce yalnız blog/kriptografi), A6 (yalnız akademik), A2 (yalnız uzak akraba; risk kolaylık).
- **Sınırda:** A1 (Türkçe Evrim Ağacı ve Ekşi'de Boolos'un ara adımı olarak), A3 ve A4 (ikisi de aynı МЦНМО 6. sınıf föyünde birebir; A3 Ekşi'de, A4 İngilizce forumda tam haliyle).
- **Elenir:** A12 (lifehacker.ru'da birebir, Puzzle Prime'da aynı mekanizma, Türkçe Bilim ve Teknik'te genel hâli).
