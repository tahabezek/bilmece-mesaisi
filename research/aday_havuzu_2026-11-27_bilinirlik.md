# Aday havuzu (27 Kas 2026): bilinirlik araması

Kapsam: `aday_havuzu_2026-11-27.md` içindeki Y1, Y2, R1–R19. Yalnızca bilinirlik arandı; adayların mantığı değerlendirilmedi.

Yöntem: Her aday için en az üç web araması yapıldı: Türkçe kelime anahtarı, İngilizce yapısal anahtar, Rusça (gerekirse Arapça ya da Almanca) yapısal anahtar. Önemli sonuçlar WebFetch ile açıldı. 403 ya da 404 veren sayfalar (inkl.com/Guardian, spektrum.de, competitivekids.org) zorlanmadı; bunlar için yalnızca arama özeti kullanıldı ve rapor bunu ayrıca belirtiyor.

Eleme kuralı: Aynı mekanizma iki ayrı kaynakta popüler biçimde çıkıyorsa (bilmece derlemesi, viral video, zekâ sorusu sitesi) aday "elenir". Ders kitabı ya da akademik kaynak tek başına eleme sebebi değildir; ama yaygın bir ders kitabı soru tipiyse ayrıca not edildi.

Benzerlik ölçeği:
- **aynı**: kurgu ve mekanizma aynı;
- **aynı mekanizma farklı kurgu**: hile aynı, hikâye farklı;
- **uzak**: aynı aile, ama hile farklı.

---

## Özet tablo

| # | Ad | Bilinirlik (Türk izleyici) | Kural kararı | En yakın kaynak |
|---|---|---|---|---|
| Y1 | …ya çeyrek kala | düşük | geçer | bulunamadı |
| Y2 | [bip] mü geldi? | düşük | geçer | bulunamadı (yalnız dil öğretimi alıştırmaları) |
| R1 | İki ağırlıkla iki kilo | orta | **elenir** | NZ müfredatı "Old scales" (aynı sayılar); Bachet 1-3-9-27 (Evrim Ağacı, mathsisfun) |
| R2 | Yelkovansız saat | düşük | geçer | NRICH "Two Clocks" (aynı mekanizma farklı kurgu) |
| R3 | Kapının yanındaki kap | orta | **elenir (tür düzeyinde)** | Sabah "Masaya hangi örtü serilmez? Bitki örtüsü"; İngilizce "hangi kupa su tutmaz? hiccup" |
| R4 | Benden başka üç gözlüklü | düşük | geçer | bulunamadı |
| R5 | Takvimdeki kare | orta | **elenir** | NRICH "Calendar Capers", cut-the-knot, TVOKids videosu (aynı) |
| R6 | Yarı yol, yarı süre | orta | **elenir (sınırda)** + ders kitabı tipi | EngineerZone "Logic Lounge" bilmecesi (aynı); YKS fiziği eşit yol/eşit süre ortalama hız |
| R7 | Çay ocağı nereye? | düşük–orta | **elenir** | competitivekids "Build the school" (100/50 köy, aynı mekanizma); Byju's ders sorusu |
| R8 | Eğri terazi | düşük | sınırda (elenmez, risk yazılır) | МЦНМО 6. sınıf çevre föyü (aynı); Spektrum "Die defekte Waage" (aynı mekanizma) |
| R9 | Boş seferi kimse anlatmaz | düşük | geçer | bilmece biçimi bulunamadı; paradoks istatistik/blog yazısı olarak var |
| R10 | Masa masa oylama | düşük–orta | **elenir** | FiveThirtyEight Riddler, Guardian (Bellos) gerrymandering bulmacaları, math.uni.lu |
| R11 | Kapalı zarf | düşük (genel) / yüksek (iktisat okumuş) | geçer + ders kitabı tipi | Vickrey: iktisat/oyun teorisi derslerinin standart örneği |
| R12 | Saksı | düşük | geçer | Heartfulness dergisi "The Detective King" (aynı mekanizma farklı kurgu) |
| R13 | Baklava yemini | düşük | geçer | bulunamadı (Türkçe, İngilizce, Arapça, Rusça) |
| R14 | İki kat (merdiven yemini) | düşük | geçer | bulunamadı |
| R15 | Bardaktaki su | düşük | geçer | bulunamadı |
| R16 | Sessiz Necmi ("geçmiş olsun") | orta | **elenir (mekanizma düzeyinde)** | "I Never Said It Was Poison" kalıbı: Bored Panda dedektif bilmeceleri, Scribd derlemesi |
| R17 | Birbirinin dayısı | düşük | **elenir (kural gereği)** | Alcuin (8. yy), Dudeney "Surprising Relationship", Futility Closet "Family Ties" (2026) |
| R18 | Sekiz simit | orta | **elenir** | GeeksforGeeks "Ali and 8 Loaves", riddles.com "Two Shepherds", Braingle, Malba Tahan |
| R19 | İki merdiven | düşük | geçer | bulunamadı |

**Kural gereği elenenler (9):** R1, R3, R5, R6, R7, R10, R16, R17, R18.
**Sınırda (1):** R8.
**Geçenler (11):** Y1, Y2, R2, R4, R9, R11, R12, R13, R14, R15, R19.

---

## Ayrıntı

### Y1. "…ya çeyrek kala"
- **Sorgular:**
  - TR: `"çeyrek kala" ek ünlü uyumu saat kaç zeka sorusu duyulmadı`
  - TR: `"altıya çeyrek" bilmece OR "zeka sorusu" ek duyuldu sayı duyulmadı`
  - EN (yapısal): `riddle deduce the number from the article "an" heard only "an" vowel sound which number puzzle`
  - RU (yapısal): `загадка не расслышал слово угадать по окончанию грамматика головоломка время "без четверти"`
- **En yakın eşleşme:** Yok. Türkçe sonuçlar yalnızca saat okuma alıştırmaları ve ünlü uyumu konu anlatımları. İngilizcede "a/an" ile kelime tahmini bulmacası çıkmadı (yalnız redblobgames "a vs an" dil notu: https://www.redblobgames.com/x/2635-a-vs-an/, uzak). Rusçada da eşleşme yok.
- **Bilinirlik:** Düşük. Ek üzerinden gizli kelimeyi bulma bir bilmece kalıbı olarak dolaşımda görünmüyor.

### Y2. "[bip] mü geldi?"
- **Sorgular:**
  - TR: `"mı mi mu mü" soru eki bilmece hangisi geldi zeka sorusu`
  - EN (yapısal): `puzzle guess the missing word from the suffix vowel harmony Turkish "linguistics olympiad" question particle mı mi mu mü`
  - RU (yapısal, Y1 ile ortak): `загадка не расслышал слово угадать по окончанию…`
- **En yakın eşleşme:** Uzak. Türkçe öğrenenler için boşluk doldurma alıştırmaları var ("Okul ___?" → mu; SACE sınav pratiği: https://open-exam-prep.com/practice/au-sace-stage2-turkish-continuers). Bunlar ekten kelimeyi değil, kelimeden eki buluyor; yön ters. Dilbilim olimpiyatı sorusu bulunamadı.
- **Bilinirlik:** Düşük. Not: Y1 ile aynı mekanizma; arama ikisini de aynı ölçüde temiz gösteriyor.

### R1. İki ağırlıkla iki kilo
- **Sorgular:**
  - TR: `1 kg ve 3 kg ağırlık ile terazide 2 kg nasıl tartılır zeka sorusu`
  - TR: `"40 kg" dört ağırlık terazi 1 3 9 27 zeka sorusu cevabı`
  - EN: `balance scale puzzle only 1 kg and 3 kg weights measure exactly 2 kg one weighing put weight on same pan`
  - RU: `чашечные весы гири 1 кг и 3 кг как отвесить 2 кг за одно взвешивание задача`
- **En yakın eşleşme:**
  - **Aynı (sayılar dahil):** Yeni Zelanda müfredatı "Old scales" görevi, 1 ve 3 kg ağırlıkla 2 kg patates (https://newzealandcurriculum.tahurangi.education.govt.nz/old-scales/5637166567.p ; nzmaths.co.nz/node/590). Eğitim kaynağı.
  - **Aynı mekanizma:** Bachet'nin dört ağırlık bulmacası (1-3-9-27 ile 1–40 kg; ağırlığı malla aynı kefeye koymak). Türkçede Evrim Ağacı soru-cevap (https://evrimagaci.org/soru/elimizde-4-tane-agirlik-var-bu-dort-agirlik-birden-kirka-kadar-butun-sayilari-tartmalidir-bu-dort-agirlik-nedir-60209). İngilizcede mathsisfun "Only 4 Weights" (https://www.mathsisfun.com/puzzles/only-4-weights-solution.html). TÜBİTAK Bilim ve Teknik zekâ sayfalarında da tartı soruları var.
  - Rusça: Tam eşleşme yok. Tartma problemleri МЦНМО ve МГУ çevre föylerinde bol.
- **Bilinirlik:** Orta. Bachet'yi bilen herkes "ağırlık malla aynı kefeye konur" hamlesini hazır bilir.
- **Karar:** Elenir. Aynı hile popüler iki bulmaca kaynağında (Evrim Ağacı, mathsisfun) var; birebir sayılar bir müfredat görevinde de var.

### R2. Yelkovansız saat
- **Sorgular:**
  - TR: `saat yelkovanı kopmuş sadece akrep ile dakika okunur mu zeka sorusu`
  - EN: `riddle clock lost its minute hand tell exact time from hour hand alone puzzle`
  - EN: `"Two Clocks" nrich lost its minute hand Sam tell the time`
  - EN: `"single hand" OR "one-handed" watch hour hand alone tells minutes…`
  - RU: `загадка часы без минутной стрелки определить минуты по часовой стрелке головоломка`
- **En yakın eşleşme:**
  - **Aynı mekanizma farklı kurgu:** NRICH "Two Clocks" (https://nrich.maths.org/4806). Sam'in çalar saatinin yelkovanı kopmuş, saati yalnız akrepten okuyor. İlkokul matematik görevi; TES'te de paylaşılmış.
  - Rusça sonuçlarda "ibreleri aynı görünen saat" bulmacaları var (thecode.media/broken-clock, techinsider). Orada akrebin konumu dakikayı ele veriyor; uzak akraba.
  - Tek ibreli saatler tasarım haberlerinde çok geçiyor ("akrepten 5 dakika hassasiyetle okunur"). Bilmece değil.
- **Bilinirlik:** Düşük. Türkçe kaynak yok; tek ciddi eşleşme bir okul görevi.
- **Karar:** Geçer.

### R3. Kapının yanındaki kap (ayakkabı)
- **Sorgular:**
  - TR: `"ayakkabı" bilmece "ayak kabı" kap bilmecesi cevabı`
  - TR: `"hangi kaba" bilmece "ayakkabı" OR "hangi kap" yemek konmaz bilmece cevabı ayakkabı`
  - TR: `"hangi top" OR "hangi gül" OR "hangi kale" bilmece…`
  - TR: `"masaya hangi örtü serilmez" bilmece`
  - EN (yapısal): `riddle "what kind of cup can't hold water" compound word hidden word riddles list`
  - RU: `загадка с подвохом "какой" сложное слово скрытое слово…`
- **En yakın eşleşme:**
  - "Ayakkabı = ayak kabı" bilmecesi bulunamadı. Ayakkabı bilmeceleri var ama başka mekanizmayla ("Ben dolaşırım o dolaşır, üzerine çamur bulaşır": egitim.net.tr). Uzak.
  - **Aynı mekanizma farklı kurgu (TR):** Sabah bilmeceler, "Masaya hangi örtü serilmez? Bitki örtüsü" (https://www.sabah.com.tr/bilmeceler/komik-bilmeceler). Bileşik addaki kelimeyi gerçek anlamıyla soran "hangi X …" kalıbı.
  - **Aynı mekanizma farklı kurgu (EN):** "What kind of cup can't hold water? Hiccup / cupcake". Barry Popik bunu 2008'den beri belgeliyor (https://barrypopik.com/blog/what_kind_of_cup); Reader's Digest ve çocuk bilmecesi listelerinde de var.
- **Bilinirlik:** Orta. Özgül cevap bulunmadı, ama Türk izleyici "hangi X … olmaz" kelime içi oyun kalıbını tanır. Kalıbı tanıyan, ilk saniyede kelimenin içinde "kap" arar.
- **Karar:** Elenir (tür düzeyinde). Özgül soru temiz; kural mekanizmaya bakıyorsa elenir.

### R4. Benden başka üç gözlüklü
- **Sorgular:**
  - TR: `"benden başka" "gözlüklü" mantık sorusu herkes doğru söylüyor odada kaç kişi`
  - TR: `"benden başka" OR "kendisi hariç" herkes aynı cümleyi söyledi gözlüklü OR şapkalı kaç kişi mantık bulmacası`
  - EN: `puzzle everyone in the room says "besides me there are exactly three people wearing glasses"…`
  - RU: `задача каждый сказал "кроме меня" здесь ровно трое в очках сколько человек в комнате`
  - RU: `"кроме меня" "ровно" каждый из присутствующих сказал сколько человек олимпиадная задача рыцари лжецы`
- **En yakın eşleşme:** Uzak.
  - Mavi/yeşil göz tümevarım bulmacası (Webtekno: https://www.webtekno.com/beyin-yakan-yesil-goz-adli-mantik-sorusunu-cozebilir-misin-h47508.html; xkcd "Blue Eyes"). Mekanizması farklı: ortak bilgi.
  - Rus şövalye–yalancı problemlerinde "diğerleri arasında tam N …" cümleleri var (mmmf.msu.ru föyleri). Orada yalancı unsuru da var; "kendini sayma asimetrisi" tek başına çıkmadı.
- **Bilinirlik:** Düşük.
- **Karar:** Geçer. (Ön aramadaki 045/036 aile uyarısı ayrı bir konu.)

### R5. Takvimdeki kare
- **Sorgular:**
  - TR: `takvimde 3x3 kare dokuz sayının toplamı ortadaki sayının 9 katı zeka sorusu`
  - TR: `takvim sihirbazlık numarası kare içindeki sayıların toplamı ortadaki sayı matematik oyunu`
  - TR: `takvim hilesi "takvim" seçilen sayıların toplamı tahmin etme…`
  - EN: `calendar math trick 3x3 square of dates sum equals nine times middle date magic trick`
  - RU: `фокус с календарём квадрат 3 на 3 сумма девяти чисел угадать центральное число`
- **En yakın eşleşme (aynı):**
  - NRICH "Calendar Capers" (https://nrich.maths.org/85)
  - cut-the-knot "Calendar" (https://www.cut-the-knot.org/SimpleGames/Calendar.shtml)
  - pleacher.com "Calendar Trick #1"
  - Math for Love "The Calendar Problem"
  - TVOKids Mathxplosion videosu "Pick a block of dates" (https://www.tvokids.com/school-age/mathxplosion/videos/pick-block-dates-any-block)
  - OSU "rich math problem"
  - Türkçe: TÜBİTAK Bilim Çocuk takvim toplamı oyunları (dikey üç sayı, çapraz dört sayı; aynı aile, bulunan sayfalarda 3×3 yok).
  - Rusça: Doğrudan Rusça fokus sayfası çıkmadı (mel.fm'nin fokus listesinde yok).
- **Bilinirlik:** Orta. İngilizcede çok yaygın bir sınıf numarası; Türkçede aynı ailenin çocuk dergisi sürümleri var.
- **Karar:** Elenir.

### R6. Yarı yol, yarı süre
- **Sorgular:**
  - TR: `yolun yarısını yürüyor yarısını koşuyor diğeri sürenin yarısını yürüyor yarısını koşuyor kim önce varır`
  - TR: `"yolun yarısını" "zamanın yarısını" OR "sürenin yarısını" hangisi önce varır ortalama hız sorusu`
  - TR: `ortalama hız "eşit sürelerde" "eşit yolları"…`
  - EN: `puzzle one walks half the distance and runs half the distance, other walks half the time…`
  - EN: `riddle brain teaser "half the time" walking "half the distance" running two friends race who wins viral`
  - RU: `задача половину пути шёл половину бежал другой половину времени шёл… кто раньше придёт`
- **En yakın eşleşme:**
  - **Aynı:** Analog Devices EngineerZone "Logic Lounge" bilmecesi "KCC's quiz AQQ274 about 2 sportsmen running and walking" (https://ez.analog.com/how-to-use-engineerzone/logic-lounge/f/quizzes/589727/kcc-s-quiz-aqq274-about-2-sportsmen-running-and-walking), çok yorumlu.
  - **Aynı:** PhysicsForums ödev başlıkları ("running walking for half distance"; "Tim vs Rick running and walking").
  - **Aynı mekanizma:** OSU günlük matematik problemi (arabalar).
  - Rusça: Tam eşleşme yok; triatlon gibi "yarı zaman / yarı yol" ders soruları var (school.ioffe.ru).
  - Türkçe: Tam bilmece yok. Ama "eşit yol" ile "eşit süre" ortalama hız karşılaştırması (harmonik ortalama) YKS/TYT fiziğinde ve MEB destek materyallerinde (odsgm.meb.gov.tr) yaygın bir **ders kitabı soru tipi**.
- **Bilinirlik:** Orta. Lise fiziğinden "eşit süre, eşit yol" ayrımını hatırlayan izleyici bunu soru tipi olarak tanır.
- **Karar:** Elenir (sınırda). İki bulmaca/forum kaynağı var, üstüne yaygın ders kitabı tipi.

### R7. Çay ocağı nereye?
- **Sorgular:**
  - TR: `koridorda iki oda 4 kişi 3 kişi çay ocağı nereye konmalı toplam yol en az zeka sorusu`
  - TR: `iki köy okul nereye yapılmalı öğrencilerin toplam yolu en az olsun "100 öğrenci" "50 öğrenci" problem`
  - EN: `puzzle two villages different populations where to build the school minimize total distance…`
  - RU: `задача две деревни в одной 100 школьников в другой 50 где построить школу…`
  - RU: `"где построить школу" задача деревни учеников суммарный путь…`
- **En yakın eşleşme:**
  - **Aynı mekanizma farklı kurgu:** competitivekids.org "Build the school": A köyünde 100, B'de 50 öğrenci, köyler 3 km arayla (https://competitivekids.org/blog/build-the-school). Sayfa şu an 404; metin arama özetinden.
  - **Aynı mekanizma:** Byju's ders sorusu "Two towns P and Q are 60 km apart… 150 students in P, 50 in Q" (https://byjus.com/question-answer/two-towns-p-and-q-are-60-km-apart-a-school-is-to-be-built). Hindistan ders kitabı tipi.
  - Math Kangaroo 2022, 5–6. sınıf, soru 28: video çözüm sayfası; içerik doğrulanamadı.
  - NCTM Illuminations "BT133 Houses".
  - Rusça: Yandex algoritma eğitimi, "okulu öğrencilerin ortancasına kur" sorusu (github.com/feeedback/yandex-algorithm-training). Olimpiyat/programlama sorusu.
  - Türkçe: Bulunamadı.
- **Bilinirlik:** Düşük–orta. Türkçede yok; ama "ortanca, ortalamayı yener" bulmacası İngilizce yarışma ve ders kaynaklarında yerleşik.
- **Karar:** Elenir. Bulmaca sitesi ve yarışma hazırlığında aynı mekanizma var, ayrıca ders kitabı sorusu. Not: Türk izleyici açısından risk düşük.

### R8. Eğri terazi
- **Sorgular:**
  - TR: `eşit olmayan kollu terazi ile doğru tartma 1 kg ağırlık şeker hileli terazi zeka sorusu`
  - EN: `puzzle false balance unequal arms one 1 kg weight measure exactly 1 kg sugar substitution weighing Borda method riddle`
  - EN: `Gauss double weighing OR "substitution weighing" OR "Borda" unequal arm balance brain teaser…`
  - RU: `неравноплечие весы гиря 1 кг как отвесить ровно 1 кг сахара задача`
  - RU: `problems.ru неправильные весы правильная гиря отвесить крупы…`
  - DE: `Rätsel ungleicharmige Balkenwaage nur ein 1-kg-Gewicht genau 1 kg Zucker abwiegen`
- **En yakın eşleşme:**
  - **Aynı:** МЦНМО çevre föyü, 6. sınıf, 2024, "28. Взвешивания", soru 6 (https://old.mccme.ru/circles/mccme/2024/6/28_vzveshivaniya.pdf). PDF metninden doğrulandı: hatalı terazi, bir çuval kabuklu tahıl ve doğru bir 1 kg'lık ağırlıkla 1 kg tahıl tartmak.
  - **Aynı mekanizma:** Spektrum.de, Hemme'nin bulmaca köşesi, "Die defekte Waage" (https://www.spektrum.de/raetsel/die-defekte-waage/1818314). Bozuk terazi ve iki 500 g ağırlıkla 1 kg şeker. Arama özetine göre çözüm ağırlıkları kaldırıp aynı kefeye şeker doldurmak. Sayfa 403 verdi; terazinin eşit kollu olup olmadığı doğrulanamadı.
  - Uzak: Dudeney "The False Scales" (ProofWiki); orada gerçek ağırlık hesaplanıyor. USAMO 1980/1.
  - Türkçe: Bulunamadı (yalnız eşit kollu terazi ders soruları). Ön aramayla tutarlı.
- **Bilinirlik:** Düşük.
- **Karar:** Sınırda. İki ayrı kaynakta var, ama yalnız biri popüler köşe (Spektrum); öbürü Rus matematik çevresi föyü. Kural tam karşılanmıyor. Türk izleyici riski düşük; yorumda "Rus olimpiyat sorusu" diyen çıkabilir.

### R9. Boş seferi kimse anlatmaz (dolmuş)
- **Sorgular:**
  - TR: `dolmuş her yolcu "14 yolcu" ortalama şoför sefer başına ortalama boş sefer zeka sorusu`
  - TR: `"sınıf mevcudu paradoksu" OR "muayene paradoksu" OR "arkadaşlık paradoksu" otobüs kalabalık ortalama Türkçe`
  - EN: `puzzle bus driver average passengers per trip vs passengers say their bus was full "class size paradox" riddle how many empty trips`
  - RU: `задача каждый пассажир сказал в моём рейсе было 14 человек водитель в среднем 7 пассажиров…`
- **En yakın eşleşme:** Uzak.
  - Paradoks blog ve istatistik yazısı olarak var: talkingtransport.com, "the average bus-passenger is on a bus that's much more full than the average bus" (https://talkingtransport.com/2022/06/29/the-average-bus-passenger-is-on-a-bus-thats-much-more-full-than-the-average-bus-paradox/); Pew sınıf mevcudu yazısı; gwern/jakevdp "waiting time paradox".
  - "Kaç sefer boştu?" bilmece biçimi hiçbir dilde çıkmadı. Türkçede kavram adıyla da kaynak yok.
- **Bilinirlik:** Düşük.
- **Karar:** Geçer.

### R10. Masa masa oylama
- **Sorgular:**
  - TR: `9 kişi üç masa masa çoğunluğu en az kaç oy ile kazanılır zeka sorusu gerrymandering`
  - TR: `Masa masa oylama "en az kaç" seçmen "bölgeye ayrılır"…`
  - EN: `gerrymandering puzzle minimum votes to win districts viral video OR "how to steal an election"…`
  - RU: `задача выборы жираф округа участки наименьшее число голосов чтобы победить олимпиада`
  - RU: `"Жираф" выборы "участки" "районы" задача "наименьшее"…`
- **En yakın eşleşme (aynı mekanizma farklı kurgu):**
  - Guardian, Alex Bellos, "Can you solve it? Are you a genius at gerrymandering?" (inkl.com kopyası 403 verdi; başlık arama sonucunda).
  - FiveThirtyEight Riddler "Rig the election with math" (https://fivethirtyeight.com/features/rig-the-election-with-math).
  - Lüksemburg Üniversitesi olimpiyat sayfası (https://math.uni.lu/olympiade/gerry/gerry1.html): 100 seçmen 10'luk gruplarda, en az 35 oy.
  - Science Friday "district drawing is like Sudoku"; ABD üniversite ders föyleri.
  - Rusça: Moskova bilişim olimpiyatı "Выборы в США", en az seçmenle kazanma (olympiads.ru 2016-17). "Жираф" sorusu bu aramalarla doğrulanamadı.
  - Türkçe: Bulunamadı.
- **Bilinirlik:** Düşük–orta. Türkçede bilmece olarak yok; ama ABD seçici kurulu "%22 ile kazanma" fikri popüler video kültüründe dolaşıyor (bu son bilgi bu turda aranarak doğrulanmadı).
- **Karar:** Elenir. İki popüler bulmaca köşesi (Guardian, FiveThirtyEight) aynı hileyi kullanıyor.

### R11. Kapalı zarf (ikinci fiyat)
- **Sorgular:**
  - TR: `kapalı zarf ihale en yüksek teklif veren ikinci en yüksek fiyatı öder ne yazmalı zeka sorusu Vickrey`
  - TR: `ikinci fiyat ihalesi Vickrey Türkçe oyun teorisi gerçek değerini teklif et baskın strateji ders notu`
  - EN: `second price sealed bid auction puzzle brain teaser what should you bid riddle "bid your true value"`
  - RU: `аукцион второй цены задача какую ставку назвать головоломка честная ставка Викри`
- **En yakın eşleşme:**
  - Bilmece/zekâ sorusu olarak hiçbir dilde çıkmadı.
  - Ders kaynağı olarak her yerde: Brown CS1440 ders notu, Harvard karar teorisi notları, GSU EconPort, Cornell Math Explorers; DergiPark'ta bir Türkçe makale; Rusçada Yandex Direkt ve RTB "ikinci fiyat açık artırması" anlatımları.
- **Bilinirlik:** Genel izleyicide düşük. İktisat, işletme ya da dijital reklamcılık görmüş izleyicide yüksek: "doğru teklif = gerçek değer" oyun teorisi derslerinin ilk örneği.
- **Karar:** Geçer (popüler bilmece kaynağı yok). Not: yaygın ders kitabı soru tipi; yorumda "bu Vickrey" diyen çıkacağı kesine yakın.

### R12. Saksı
- **Sorgular:**
  - TR: `saksının dibine para gömdü kimse görmedi parayı kim aldı saksıyı değiştiren zeka sorusu`
  - EN: `story merchant buried gold under a tree nobody saw, money gone, king asked doctors who prescribed the root of that tree folktale`
  - EN: `riddle money hidden in plant pot nobody saw, who took it, the one who repotted the plant detective riddle`
  - RU: `притча закопал деньги под деревом никто не видел царь спросил лекарей…`
- **En yakın eşleşme:**
  - **Aynı mekanizma farklı kurgu:** Heartfulness Magazine, "The Detective King" (https://heartfulness.org/magazine/the-detective-king). Tüccar altınını bir arka çalısının dibine gömer; hekim arka kökü reçete etmiştir; kralın sorgusu kökü kazıyan hizmetkârı bulur. Ezkiyâ hikâyesinin Hint versiyonu.
  - Uzak: "The Stolen Cleopatra" (hyconrad.com); para saksının altında, bitki yer değiştirmiş.
  - Rusça ve Türkçe: Bulunamadı.
- **Bilinirlik:** Düşük. Kaynak tek ve Hindistan'daki ruhani dergi okurlarına sınırlı.
- **Karar:** Geçer.

### R13. Baklava yemini
- **Sorgular:**
  - TR: `"seni kovmadan" OR "seni öldürmeden" "bu lokmayı yemem" yemin hikaye fıkra`
  - EN: `Hajjaj swore "I will not eat this morsel until I kill you" man said feed it to me story wit`
  - AR: `الحجاج حلف لا آكل هذه اللقمة حتى أقتلك فقال أطعمنيها`
  - RU: `притча поклялся не съем этот кусок пока не казню тебя "накорми меня"…`
- **En yakın eşleşme:** Yok. Arapçada da bu kelimelerle çıkmadı (kaynak Ezkiyâ; açık web'de dolaşmıyor).
- **Bilinirlik:** Düşük.
- **Karar:** Geçer.

### R14. İki kat (merdivendeki yemin)
- **Sorgular:**
  - TR: `merdivende "ne yukarı çıkarım" "ne aşağı inerim" "ne de dururum" bilmece iki hanım`
  - EN: `riddle man on ladder swore "I will not go up to you, nor go down to you, nor stay where I am" two wives solution swap places`
  - RU: `загадка человек на лестнице поклялся не подниматься не спускаться не стоять на месте как выполнить клятву`
- **En yakın eşleşme:** Yok. Çıkan sonuçlar alakasız: kuyu kovası bilmecesi ("aşağı iner güle güle"), nehir geçme bulmacaları, Bern bilmecesi "De scala" (cevabı merdivenin kendisi).
- **Bilinirlik:** Düşük.
- **Karar:** Geçer.

### R15. Bardaktaki su
- **Sorgular:**
  - TR: `bilmece bardaktaki suyu içmeden dökmeden bardakta bırakmadan nasıl yok edersin`
  - EN: `riddle how can you get rid of water in a glass without drinking it, pouring it out, or leaving it in the glass`
  - RU: `загадка воду из стакана не пить не выливать не оставлять в стакане как избавиться`
- **En yakın eşleşme:** Uzak.
  - Bilim Çocuk deneyi "Bardağı hareket ettirmeden içindeki suyu boşaltabilir misiniz?" (pipetle).
  - Garson ve kibrit bulmacası (Braingle, techinsider.ru).
  - Kâğıt havluyla "yürüyen su" deneyi.
  - Üçlü yasak kalıbıyla bir bilmece bulunamadı. Rusça arama özetinde "dondur" cevabının yaygın olduğu söylendi, ama hiçbir kaynakla desteklenmedi; yok sayıldı.
- **Bilinirlik:** Düşük.
- **Karar:** Geçer.

### R16. Sessiz Necmi ("geçmiş olsun")
- **Sorgular:**
  - TR: `"geçmiş olsun" dedi hırsız o çıktı kimseye söylememişti zeka sorusu dedektif`
  - EN: `riddle victim told nobody about the theft, one person said "sorry for your loss" so he was the thief…`
  - EN: `detective riddle "I never said" how did he know culprit revealed knowledge nobody told him classic riddle answer`
  - RU: `детективная загадка вор выдал себя знал то о чём никто не говорил "никому не рассказывал" кража…`
- **En yakın eşleşme:**
  - **Aynı mekanizma farklı kurgu:** "I Never Said It Was Poison" kalıbı (TV Tropes).
    - Bored Panda dedektif bilmeceleri: "Who shot her?" diye bağıran şüpheliye vurulduğu söylenmemişti (https://boredpanda.com/detective-riddles).
    - Scribd "Detective Riddles" derlemesi: polis olay yerini söylemediği hâlde adam doğruca oraya gidiyor.
    - Yahoo "Two-Minute Mini Mystery".
  - Türkçe: Habertürk "Beyin yakan zekâ testleri" (https://www.haberturk.com/beyin-yakan-zeka-testleri-1909749). Gazeteci sorusunda suçlu, gazete okuyacak kimse olmayacağını biliyordu; aynı aile.
  - Rusça: Sovyet dönemi dedektif bulmacaları (techinsider, vokrugsveta, sport24) var, ama çoğu çelişki türünden; birebir eşleşme yok.
  - Özgül kurgu (mağdur bilerek susuyor, "geçmiş olsun" cümlesi) hiçbir dilde çıkmadı.
- **Bilinirlik:** Orta. Kalıp, Türk ve İngiliz bilmece listelerinin en bilinen dedektif hilesi; izleyici "söylenmeyeni bilen suçludur" refleksiyle hemen çözer.
- **Karar:** Elenir (mekanizma düzeyinde). Özgül kurgu yeni; karar verirken bu ayrım dikkate alınabilir. Ön aramadaki "üst tür biliniyor" notu doğrulandı.

### R17. Birbirinin dayısı
- **Sorgular:**
  - TR: `"birbirinin dayısı" OR "birbirinin amcası" iki kişi nasıl olur akrabalık bilmecesi`
  - EN: `riddle how can two men each be the other's uncle answer`
  - RU: `загадка два человека каждый из них дядя другому как такое возможно`
- **En yakın eşleşme (aynı mekanizma, ayna kurgu):**
  - Alcuin, *Propositiones ad Acuendos Juvenes*, 11. soru (8. yy; ProofWiki).
  - Dudeney, *Puzzles and Curious Problems* 39, "Surprising Relationship" (https://proofwiki.org/wiki/Henry_Ernest_Dudeney/Puzzles_and_Curious_Problems/39_-_Surprising_Relationship).
  - Futility Closet "Family Ties", 9 Nisan 2026 (https://www.futilitycloset.com/2026/04/09/family-ties): Northrop'un *Riddles in Mathematics* (1961) kitabından, "iki adam birbirinin annesiyle evlenir, oğulları birbirinin amcası olur".
  - Guardian (Bellos) "Did you solve it? The world's strangest families": başlık arama sonucunda; sayfa 403, içerik doğrulanamadı.
  - daviddarling.info "kinship puzzles".
  - Fark: Klasik sürümde babalar birbirinin **annesiyle** evlenir ve oğullar birbirinin **amcası** olur. Adayda babalar birbirinin **kızıyla** evlenir ve oğullar birbirinin **dayısı** olur. Mekanizma (çapraz evlilikle karşılıklı amca/dayı) aynı.
  - Türkçe ve Rusça: Bulunamadı. DonanımHaber'de başka bir akrabalık sorusu var ("oğlumun oğlu kocamın kardeşi").
- **Bilinirlik:** Düşük. İngilizce bulmaca klasiği, Türkçede dolaşmıyor.
- **Karar:** Elenir (kural gereği: klasik derlemeler ve popüler bulmaca blogu). Türk izleyici riski düşük; karar verici bu ayrımı dikkate alabilir.

### R18. Sekiz simit
- **Sorgular:**
  - TR: `beş ekmek üç ekmek sekiz dirhem yolcu paylaşım hikayesi Hz. Ali yedi bir`
  - TR: `zeka sorusu "5 ekmek" "3 ekmek" yolcu "8 lira" OR "8 altın" OR "8 dirhem" nasıl paylaşılır`
  - TR: `Malba Tahan "Sayıları Seven Adam" OR "Sayılarla" Beremiz ekmek…`
  - EN: `puzzle five loaves three loaves stranger shared equally paid 8 coins how divide answer 7 and 1 Man Who Counted`
  - RU: `задача у одного 5 лепёшек у другого 3 путник съел поровну оставил 8 монет как разделить`
- **En yakın eşleşme (aynı):**
  - GeeksforGeeks "Puzzle – Ali and 8 Loaves" (https://www.geeksforgeeks.org/puzzle-ali-and-8-loaves/).
  - riddles.com "Two Shepherds" ve "The Hunter And The Shepherds".
  - Braingle 50642; puzzles-world.com; GMAT Club forumu; theweeklyriddle.blogspot (2010).
  - Malba Tahan, *The Man Who Counted*: Beremiz paranın 7'sini kendine, 1'ini Hanak'a ayırır (arama özetine göre; kitapta olduğu genel olarak bilinir).
  - İslami kaynaklar: islamqa, al-islam.org, World Federation çocuk etkinliği.
  - Rusça: Avcı ve iki çoban sürümü dolaşımda; Habr yorumlarında da aynı yöntem.
  - Türkçe: Arama motorunda Türkçe sayfa çıkmadı. Ön aramadaki "vaazlarda dolaşıyor olabilir" sezgisi bu turda doğrulanamadı; YouTube'a el ile bakılması önerisi geçerli.
- **Bilinirlik:** Orta. İngilizce bulmaca sitelerinde çok yaygın; Malba Tahan Türkçeye çevrilmiş bir kitap; dinî anlatı da var.
- **Karar:** Elenir.

### R19. İki merdiven
- **Sorgular:**
  - TR: `merdivenin ortasında ne çıkabilir ne inebilir ne atlayabilir nasıl kurtulur bilmece cevabı`
  - EN: `riddle stuck in middle of ladder can't climb up or down or jump or stay, how do you get off answer step onto another ladder`
  - EN: `riddle stuck on a ladder "move to the other ladder" OR "step onto the next ladder" vow neither climb up nor down`
  - RU: `загадка стоит на середине лестницы не может ни подняться ни спуститься ни спрыгнуть перешёл на соседнюю лестницу`
- **En yakın eşleşme:** Uzak. Merdiven bilmeceleri başka hilelerle çıktı: "20 metrelik merdivenden düştü, incinmedi: en alt basamak" (Reader's Digest, riddles.com) ve itfaiyeci basamak sayısı. Yan merdivene geçme bulunamadı.
- **Bilinirlik:** Düşük.
- **Karar:** Geçer.

---

## Notlar ve sınırlar
- Erişilemeyen sayfalar, adaylarla birlikte:
  - inkl.com, Guardian kopyası (R10, R17);
  - spektrum.de (R8);
  - competitivekids.org (R7: 404);
  - nzmaths.co.nz (R1: kapanış duyurusuna yönlendiriyor).
  - Bu kaynaklar için yalnızca arama sonucu başlığı ya da özeti kullanıldı.
- YouTube, Instagram ve TikTok içi arama yapılamadı; yalnız arama motorunda görünen video sayfaları (TVOKids gibi) sayıldı. R18 için Türkçe vaaz ve YouTube kontrolü hâlâ el ile yapılmalı.
- "Elenir (tür/mekanizma düzeyinde)" etiketi R3 ve R16'da kullanıldı: özgül soru bulunamadı, ama hilenin kendisi popüler bilmece listelerinde. R17'de klasik İngilizce kaynak var, Türkçe yok. Bu üçünde son karar verici kuralı mekanizma mı kurgu mu düzeyinde uygulayacağını seçmeli.
