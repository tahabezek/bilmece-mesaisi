# Bilmece Mimarı: koleksiyon ve tasarım defteri (22 Kas 2026)

Bu dosya, "Riddle Architect" görevinin ilk turunun sonucudur: araştırma, özgün tasarım, kör test ve eleme. Sonda yedi çekirdek bilmece, beş yedek ve elenenlerin gerekçeli listesi var.

**Dürüstlük notu.** Kör çözücüler yapay zekâydı ve çekirdek bilmecelerin hepsini çözdü. Aşağıdaki zorluk puanları onların "sıradan zeki bir yetişkin için" tahminidir; hiçbir bilmece henüz insanla denenmedi. Bilinirlik aramaları sınırlıydı (ayrıntı § 6).

## 1. Nasıl çalıştım

1. **Araştırma, üç kol.** Daha önce taranan kaynaklar (Gardner, Winkler, Smullyan, Perelman, Bellos) tekrar edilmedi.
   - `1_adil_ipucu_ve_mikro_gizem.md`: adil oyun dedektif kurgusu, Japon gündelik gizem türü, mikro-gizem kitaplarının eleştirisi. 15 ilke, 22 mekanizma, 35 bayat kalıp.
   - `2_yanal_mentalizm_akil_tuzaklari.md`: yanal bulmaca toplulukları, sahne sihri ve dolandırıcılık yöntemleri, zeki yetişkinlerin sistematik yanıldığı akıl yürütme görevleri.
   - `3_turkce_dil_ve_gorgu.md`: rolü sabit kalıp sözler (TDK tanımlarıyla), rakama gelen ekler, önvarsayım taşıyan küçük sözcükler.
2. **Tasarım.** Kırk kadar fikirden 18'i tam metin olarak yazıldı.
3. **Eleme hunisi.**
   - Türkçe web'de bilinirlik araması.
   - Kör çözüm: çözücü yalnız soruyu görür; ilk tepkisini, çözümünü, rakip cevapları ve pürüzleri yazar.
   - Karşı denetim: cevabı bilen bir editör her adayı çürütmeye çalışır.
   - Yayın arşiviyle (001–063) mekanizma ailesi karşılaştırması.

## 2. Bu turun dersleri

1. **Bilinen bir numarayı hikâye etmek bilmece değildir.** "Emanet saz" ve "kâhin mektupları" iyi anlatılar; ama çözecek bir şey bırakmıyorlar, okur düzeneği tanıyor.
2. **"Nasıl yaparsın?" sorusu tek cevabı zorlamıyorsa açık uçludur.** "Usta tadımcı" bu yüzden elendi.
3. **En verimli damar, anadilin örtük bilgisi.** Türkçe konuşan herkes "dokuzu", "altıya", "sıfırın" der; "güle güle"yi kalanın söylediğini bilir. Bunları hiç bilgi olarak düşünmemiştir. Bilmece o bilgiyi kanıta çevirir.
4. **İkinci damar: teorem, hikâye ve on saniyelik kanıt.** Cevap "olabilir" değil "kesin" çıkar; izleyici kanıtı kendi başına yeniden kurabilir.
5. **Çelişki suç değildir.** Dedektif sorusu "kim suçlu?" diye sorulursa her tutarsızlığın masum bir açıklaması bulunur. Soru "kim doğru söylüyor?" ya da "ne kesin?" olmalı.
6. **Aynı mekanizmadan ikiz çıkmaz.** "Ajanda", "ıslak not"un ikiziydi; biri kaldı.

## 3. Çekirdek set

| # | Ad | Tür | Mekanizma | Zorluk | Vay |
|---|---|---|---|---|---|
| 1 | Islak not | özgün | ek, rakamı ele verir | 5 | 8 |
| 2 | Duvarın öbür yanı | özgün | nezaket sözü rol bildirir | 5 | 8 |
| 3 | Falcının zarfları | özgün kurgu, bilinen sahne yöntemi | bir zarf geriden gelmek | 6–7 | 8–9 |
| 4 | Beşi birden | teorem giydirme | ilk gidene bak | 6–7 | 7–8 |
| 5 | Düğün fotoğrafı | klasik, yeni kurgu | kesişimdeki kişi | 7 | 7–8 |
| 6 | Hikmet Bey'in bardağı | deney giydirme | iki ihtimal, tek sonuç | 6–7 | 7 |
| 7 | Şampiyonun cevabı | teorem giydirme | en çok kazananın güvencesi | 6 | 6 |

---

### 1. Islak not

**Bilmece.** Hikmet Bey'in dedesinden kalma çevirmeli bir kasası var. Kadranında 0'dan 9'a on rakam yazıyor. Şifreyi unutmamak için yıllar önce bir kâğıda not almış. Kâğıdın üstüne çay dökülmüş; mürekkep tam rakamların olduğu yerlerde dağılmış. Okunabilen şu kadar:

> Önce ●'u bul. Sonra ●'ya çevir. En son ●'ın üstünde bırak.

Her leke tek bir rakamı örtüyor. Hikmet Bey "Bin ihtimal var, akşama kadar deneriz" diyor. Defne kâğıda bir kez bakıyor ve kasayı ilk denemede açıyor.

Şifre ne?

**Çözüm: 9 – 6 – 0.** Rakam silinmiş ama eki duruyor; ek de rakamın okunuşuna uymak zorunda.
- "'u" alan tek rakam dokuzdur: dokuz**u**.
- "'ya" alan tek rakam altıdır: altı**ya**. İki ve yedi "'ye" alır.
- "'ın" alan tek rakam sıfırdır: sıfır**ın**. Bir "'in", dokuz "'un", altı "'nın" alır.

**Neden başka türlü olamaz.** On rakam üç ek için tek tek denendi; her ek yalnızca bir rakama uyuyor. "Kadran 0–9" ve "her leke tek rakam" şartları 10, 30, 40 gibi sayıları kapatıyor.

**Editör notu.**
- **Düşünme mekanizması:** Çözücü "bilgi rakamdaydı, rakam gitti" diye düşünür. Oysa Türkçede ek, önündeki sözcüğün izini taşır.
- **Köken:** Özgün. İngilizcede "an ●" ile kurulan uzak bir akrabası var (8, 11, 18); Türkçe ek uyumuyla kurulmuşu aramalarda çıkmadı.
- **Sınır:** Her rakam böyle bulunamaz. 3 ile 4, 2 ile 7, 1 ile 8 hiçbir ekle ayrılmaz; 5 ancak iki farklı ekle bulunur. Şifre bu yüzden 9, 6 ve 0'dan kuruldu.
- **Arşiv:** 058 (soru eki) ve 059 (-miş/-di) ile aynı aileden, mekanizması farklı. Arka arkaya yayımlanmamalı.
- **Video:** Not ekranda yazılı durmalı; lekeler seslendirilemez. Cevap yoruma "960" diye yazılır.
- **Paylaşım değeri:** Yüksek. Cevabı duyan, kendi kulağıyla doğrular.

---

### 2. Duvarın öbür yanı

**Bilmece.** Hikmet Bey'in babasından kalma cep saati vitrinden kayboldu. O gün eve yalnızca eski arkadaşı Necmi gelmişti; evde ikisinden başka kimse yoktu.

Hikmet Bey: "Yemekten sonra ilacımı almak için eczaneye indim. Necmi evde tek başına kaldı. Döndüğümde gitmişti, saat de yoktu."

Necmi: "Doğru değil. Hikmet Bey evden adımını atmadı. Yemeğimi yedim, kalktım; beni kapıdan kendisi uğurladı. O evde bir dakika bile yalnız kalmadım."

Söz söze karşı. Tek tanık, duvar komşusu Müzeyyen Hanım: "Duvar incedir ama Hikmet Bey alçak sesle konuşur, onu hiç duymam. Necmi Bey'in sesi gürdür. O gün, şu sırayla, yalnız şu dört sözü duydum:

— Hoş bulduk!
— Sen de gör!
— Ellerine sağlık!
— Güle güle!"

Komiser defterini kapattı: "Kimin doğru söylediği belli oldu."

Kim doğru söylüyor? Komiser bunu nereden anladı?

**Çözüm: Hikmet Bey doğru söylüyor.** "Güle güle"yi kalan kişi, gidene söyler. Bu sözü Necmi söylediğine göre kapıdan çıkan Hikmet Bey'di; Necmi evde kaldı. Necmi'nin anlattığı gibi uğurlanan kendisi olsaydı "hoşça kal" ya da "Allah'a ısmarladık" derdi.

Dört söz aynı yöntemle okunur ve Hikmet Bey'in anlattığı sırayı verir:
1. "Hoş bulduk": Necmi geldi; Hikmet Bey "hoş geldin" dedi.
2. "Sen de gör": Necmi hapşırdı; Hikmet Bey "çok yaşa" dedi.
3. "Ellerine sağlık": Yemeği Hikmet Bey yapmıştı.
4. "Güle güle": Hikmet Bey eczaneye çıktı.

Necmi sonra evden sessizce ayrıldı; uğurlayan olmadığı için beşinci bir söz duyulmadı.

**Neden başka türlü olamaz.** Evde üçüncü kişi yok. Tanık yalnız dört söz duymuş; bu yüzden "güle güle kullan" gibi uzun bir sözün parçası olamaz. Sahne ev içinde ve yüz yüze: sokakta ya da telefonda iki taraf da "güle güle" diyebilir, kapıda uğurlanan misafir demez (TDK: "kalan kişinin uğurlanan kişiye söylediği iyi dilek sözü").

**Editör notu.**
- **Düşünme mekanizması:** Dört söz de nezaket kalıbı gibi durur, bilgi taşımaz sanılır. Oysa her biri söyleyenin rolünü bildirir.
- **Köken:** Kurgu ve çıkarım zinciri özgün. Aynı anahtar, depodaki Japon "papağan" bilmecesinde de var (`dunya_secme_bilmeceler.md`, madde 3); ikisi birden yayımlanmamalı.
- **Pürüz:** Kör çözücülerden biri "Sen de gör"ü hemen tanımadı, "hayrını gör"e cevap sandı. Çözümü bozmuyor; istenirse bu söz çıkarılıp üç sözle de kurulabilir.
- **Soru bilerek "kim suçlu?" değil.** Kanıtlanan yalnızca Necmi'nin evde yalnız kaldığı ve bunu inkâr ettiği.
- **Video:** Yalnız Necmi'nin konuşma balonları görünür; karşı taraf "…" olarak kalır. Sesli anlatıma çok uygun.

---

### 3. Falcının zarfları

**Bilmece.** Kasabaya bir falcı geldi. İddiası şu: "Kapalı zarfın içindeki soruyu, zarfı açmadan okurum."

Salonda on kişi birer kâğıda sorusunu yazdı, kendi eliyle zarfa koyup yapıştırdı. Zarflar kalındı; ışığa tutulsa bile içi görünmüyordu. Falcı ilk zarfı en arka sırada oturan adamdan aldı; sonra öne doğru yürüyerek öbür zarfları topladı, her zarfı bir öncekinin üstüne koydu. Desteyi masaya bıraktı.

En üstteki zarfı alnına dayadı, gözlerini kapadı: "Biri soruyor: Kaybolan yüzüğümü bulacak mıyım?" En arka sıradaki adam "Benim sorum!" diye ayağa kalktı. Falcı zarfı yırtıp açtı, kâğıda baktı, başını salladı: "Evet, aynen böyle yazıyor." Kâğıdı buruşturup cebine attı.

Sıradaki zarfı alnına dayadı: "Biri soruyor: Oğlum askerden ne zaman dönecek?" Ön sıradan bir kadın şaşkınlıkla elini kaldırdı. Falcı zarfı açtı, baktı, başını salladı, kâğıdı cebine attı.

On zarfın onunda da soruyu yazan kişi salondan çıktı.

Sonradan öğrenildi: Salonda falcının tek bir tanıdığı vardı, yüzük sorusuna "Benim!" diyen adam. Gösteri boyunca bundan başka hiçbir şey yapmadı; başkalarının ne yazdığını da bilmiyordu.

Falcı öbür dokuz kişinin sorusunu nasıl bildi?

**Çözüm: Falcı hep bir zarf geriden geliyor.**
1. İlk "okuduğu" yüzük sorusu uydurma. Tanıdığı sahipleniyor; işi bu kadar.
2. Zarflar arkadan öne toplandığı için tanıdığın zarfı destenin en altında, ön sıradaki kadının zarfı en üstte.
3. Falcı "kontrol" diye en üstteki zarfı açıyor. Kâğıtta yüzük sorusu yok; kadının asker sorusu yazıyor. "Aynen böyle" deyip kâğıdı cebine atıyor.
4. İkinci zarfı alnına dayayıp az önce okuduğu asker sorusunu söylüyor. O zarfı açınca üçüncü kişinin sorusunu öğreniyor.
5. Her açtığı zarf, bir sonraki "kehanetin" kaynağı oluyor. En sona tanıdığının zarfı kalıyor; içinde ne yazdığının önemi yok.

Sayım tutuyor: bir uydurma ve dokuz gerçek soru, on duyuru, on zarf.

**Neden başka türlü olamaz.** Metindeki adil ipucu: en üstteki zarf ön sıradan gelmişti, ama ilk soruyu en arka sıradaki adam sahiplendi. İlk zarfın içinde yüzük sorusu olamaz. Kâğıtların kimseye gösterilmeden cebe atılması da bunu gizlemek için.

**Editör notu.**
- **Düşünme mekanizması:** Çözücü "zarfı açmadan nasıl okudu?" diye düşünür. Asıl soru "açtığı zarfta ne okudu?"dur.
- **Köken:** Yöntem, sahne sihrinde "bir adım önde" adıyla bilinen eski bir numara; sihirle ilgilenen biri tanır. Özgün olan kurgu: toplama yönü ve sıralar sayesinde yöntem, sihir bilmeden yalnızca anlatılandan çıkarılabiliyor. Türkçe bilmece olarak aramalarda çıkmadı.
- **Pürüz:** Uzun. Videoda iki sahneye bölünmeli (toplama, ilk iki zarf). Falcının kâğıdı okuyup ezberlediği görüntüde belli edilmemeli.
- **Paylaşım değeri:** Yüksek; "falcı nasıl biliyor?" merakı evrensel.

---

### 4. Beşi birden

**Bilmece.** Hikmet Bey'in emeklilikten önceki son iş günü. Odasına gün boyunca beş eski arkadaşı uğradı. Her biri bir kez geldi, bir süre oturdu, sonra gitti; giden bir daha dönmedi.

Akşam Hikmet Bey buruk: "Beşini bir arada göremedim. Gün boyu odaya girip çıktım; biri gelirken öbürü gidiyordu herhalde."

Defne beş arkadaşı tek tek aradı, hepsine "O odada kimleri gördün?" diye sordu. Sonra şunu söyledi: "Hangi ikisini alırsanız alın, o iki kişi bu odada aynı anda bulunmuş, birbirini görmüş. On çiftin onu da karşılaşmış."

Hikmet Bey: "İkişer ikişer karşılaşmışlar, o kadar. Bu, beşinin birden bu odada bulunduğu bir an olduğunu göstermez."

Defne: "Gösterir. O an kesinlikle yaşandı. Hatta hangi an olduğunu da söyleyebilirim."

Kim haklı? Defne haklıysa hangi anı kastediyor?

**Çözüm: Defne haklı.** Beş kişiden odadan ilk ayrılanı düşün. Öbür dördü onu odada gördüğüne göre, o çıkmadan önce gelmiş olmalı. O ilk ayrılan olduğuna göre de o ana kadar kimse gitmemişti. Demek ki ilk kişi kapıdan çıkmadan hemen önce beşi de odadaydı.

Aynı an öbür uçtan da bulunur: en son gelen kapıdan girdiğinde öbür dördü içerideydi, çünkü hepsi onu gördü. Beşi, son gelenin girişinden ilk gidenin çıkışına kadar birlikteydi.

**Neden başka türlü olamaz.** Hikmet Bey'in sezgisi genel hâlde doğrudur: insanlar gidip geri gelebilseydi üç kişi ikişer ikişer, ayrı zamanlarda karşılaşabilirdi. Sezgiyi bozan tek şart "giden bir daha dönmedi".

**Editör notu.**
- **Düşünme mekanizması:** Çözücü on çifti tek tek düşünür. Çözüm, tek bir kişiye bakmaktır: ilk giden.
- **Köken:** Matematikte Helly teoreminin tek boyutlu hâli; olimpiyat çevrelerinde bilinir. Kurgu bize ait. Türkçe bilmece olarak tek sorguda çıkmadı.
- **Bilgi istemez:** Sayı, formül yok. Kanıt iki cümle.
- **Video:** Zaman çizgisinde beş renkli şerit; izleyici şeritleri kaydırmaya çalışır, olmaz.
- **Paylaşım değeri:** Orta-yüksek. Cevapsız formatta yoruma "Defne; ilk giden çıkarken" diye yazılır.

---

### 5. Düğün fotoğrafı

**Bilmece.** Düğünde 30 kişi fotoğraf için dizildi: 5 sıra, her sırada yan yana 6 kişi. Böylece arka arkaya duranlar da 6 sütun oluşturdu; her sütunda 5 kişi var. Herkesin boyu farklı.

Fotoğrafçı önce her sıranın en kısasını öne çağırdı: beş kişi. Bu beş kişinin en uzunu Defne'ydi. Herkes yerine döndü.

Sonra her sütunun en uzununu öne çağırdı: altı kişi. Bu altı kişinin en kısası Necmi'ydi.

Defne ile Necmi ayrı kişiler. Kimin nerede durduğunu bilmiyoruz, kimsenin boyunu da ölçmedik.

Hangisi daha uzun? Yoksa bilinemez mi?

**Çözüm: Necmi daha uzun.** Defne'nin sırası ile Necmi'nin sütununun kesiştiği yerde duran kişiye bak.
- Defne kendi sırasının en kısası; o kişiden uzun olamaz.
- Necmi kendi sütununun en uzunu; o kişiden kısa olamaz.

Defne ≤ o kişi ≤ Necmi. İkisi ayrı kişiler ve boylar farklı olduğuna göre Defne daha kısa.

**Neden başka türlü olamaz.** Kanıt üç durumda da çalışıyor: ikisi aynı sıradaysa kesişimdeki kişi Necmi'nin kendisidir, aynı sütundaysa Defne'nin kendisidir; sonuç değişmez.

**Editör notu.**
- **Düşünme mekanizması:** "Kısaların en uzunu" ile "uzunların en kısası" karşılaştırılamaz gibi görünür; çekici yanlış cevap "bilinemez"dir. "Beşin en uzunu", "altının en kısası" bilgileri kanıtta hiç kullanılmaz; yalnızca tuzaktır.
- **Köken:** Klasik (matematik bilmecesi derlemelerinde asker sırasıyla anlatılır). Kurgu yeni. Türkçe üç sorguda çıkmadı.
- **Video:** Izgarada bir sıra ve bir sütun yanar; kesişimdeki kişi çözümün kendisidir. Görüntü, çözüm anına kadar kesişimi vurgulamamalı.

---

### 6. Hikmet Bey'in bardağı

**Bilmece.** Çay ocağının tezgâhında dört bardak duruyor: demli şekerli, demli şekersiz, açık şekerli, açık şekersiz.

Hikmet Bey bir kâğıda gizlice iki şey yazdı: bir dem (açık ya da demli) ve bir şeker durumu (şekerli ya da şekersiz). Sonra kuralını söyledi: "Yazdığım iki özellikten yalnız birine uyan bardağı içerim. İkisine de uyanı içmem, hiçbirine uymayanı da içmem."

Necmi şansını denedi, demli şekerli bardağı uzattı. Hikmet Bey: "Bunu içerim."

Kâğıtta ne yazdığını hâlâ bilmiyoruz. Öbür üç bardak için ne söylenebilir: Hikmet Bey hangisini kesin içer, hangisini kesin içmez, hangisi belirsiz?

**Çözüm: Açık şekersizi kesin içer; öbür ikisini kesin içmez. Belirsiz bardak yok.** Demli şekerliyi içtiğine göre kâğıtta ya "demli, şekersiz" ya da "açık, şekerli" yazıyor.

| Bardak | Kâğıt "demli, şekersiz" ise | Kâğıt "açık, şekerli" ise | Sonuç |
|---|---|---|---|
| Demli şekersiz | ikisine de uyar | hiçbirine uymaz | kesin içmez |
| Açık şekerli | hiçbirine uymaz | ikisine de uyar | kesin içmez |
| Açık şekersiz | yalnız şekere uyar | yalnız deme uyar | kesin içer |

**Editör notu.**
- **Düşünme mekanizması:** Sezgi tam tersini söyler: "İçtiği bardakla bir özelliği paylaşanlar olabilir; hiçbir özelliği paylaşmayan olamaz." Doğrusu, içtiği bardağın tam zıddıdır.
- **Köken:** Wason ve Brooks'un 1979 tarihli THOG problemi; deneylerde tipik başarı yüzde 20'nin altında. Çay bardağı kurgusu bize ait. Türkçe karşılığı aramalarda çıkmadı.
- **Pürüz:** "Hangisi belirsiz?" sorusu bilerek kurulmuş bir tuzak; bazı izleyiciler itiraz edebilir. İstenirse "Hangisini kesin içer?" diye sadeleşir. Sesle takibi ağır; dört bardak ekranda sabit durmalı.
- **Arşiv:** Çakışma yok.

---

### 7. Şampiyonun cevabı

**Bilmece.** Ofisin tavla turnuvası bitti. Sekiz kişi katıldı; herkes herkesle birer maç yaptı. Tavlada beraberlik olmaz.

En çok maçı Necmi kazandı, kupa onun oldu. Ama Bora itiraz ediyor: "Şampiyon dediğiniz adamı ben yendim. Asıl kupa bana yakışır."

Necmi maç cetveline bakmadan, kimin kimi yendiğini de hatırlamadan cevap verdi: "Bora, benim yendiğim öyle biri var ki o da seni yenmiş. Kim olduğunu bilmiyorum, ama var."

Necmi blöf mü yapıyor, yoksa bundan emin olabilir mi?

**Çözüm: Emin olabilir.** Tersini düşün: Necmi'nin yendiği hiç kimse Bora'yı yenememiş olsun. O zaman Bora, Necmi'nin yendiği herkesi yenmiştir; üstüne Necmi'yi de yenmiştir. Bora'nın galibiyeti Necmi'ninkinden en az bir fazla olurdu. Ama en çok maçı Necmi kazandı. Demek ki Necmi'nin yendiği en az bir kişi Bora'yı yenmiştir.

**Editör notu.**
- **Düşünme mekanizması:** "Cetvele bakmadan bilemez" sezgisi. Kesinlik cetvelden değil, "en çok kazanan" olmaktan gelir.
- **Köken:** Turnuva çizgelerindeki "kral" teoremi (bellekten: Landau, 1953). Kurgu bize ait. Türkçe bilinirliği aranmadı.
- **Zayıflık:** Setin en hafifi; kör çözücü zorluğa da "vay"a da 6 verdi.
- **Arşiv:** 040 da tavla turnuvası, ama orada maç sayılıyor; mekanizma farklı. Aynı hafta yayımlanmamalı.

## 4. Yedekler

Kullanılabilir, ama çekirdeğe almadım.

| Ad | Öz | Neden yedek |
|---|---|---|
| Tek kelime | Ayrı odalarda sorgulanan şüphelilerden biri "Ben **de** sahildeydim" diyor; "de", ötekinin ifadesini bildiğini ele veriyor. | Kolay (zorluk 4). 058'in kuzeni. "Bilmiyorum, ben de bilmiyorum" kopya fıkrasıyla aynı espri. Kullanılırsa komiser "biri, bilmemesi gereken bir şeyi biliyor" demeli. |
| Kapıcının sözü | "Sekize doğru Defne**ler** geldi": "-ler", Defne'nin yalnız gelmediğini gösterir; üç misafir en az dörttür. | Kolay (zorluk 3–4, vay 6–7). "Çocukla geldiyse misafir sayılır mı?" ve saygı çoğulu itirazları açık. Yedeklerin en iyisi. |
| Emanet kese | "İkimiz birlikte gelmeden verme" şartıyla bırakılan kese; kadı: "Ortağını getir, birlikte alın." | Antik bir anlatı (Demosthenes'e ve Hz. Ali'ye atfedilen sürümleri var); bir çözücü "adalet değil laf oyunu" dedi. Türkçe web'de çıkmadı. |
| Çeşme | Yedi evin toplam yürüyüşünü en aza indiren yer ortanca evin önüdür; uzaktaki evin uzaklığı önemsizdir. | Bilinen bir problem; zorluk 4–5, vay 5–6. Ortanca ev, altı evin ortasına göre zaten yarım aralık uzağa kayık; muhtarın "biraz kaydıralım" sözü harfiyen doğru çıkıyor. |
| Tutanak | "Sayın Kaya teklifi sundu, Kaya Bey karşı çıktı": "Bey" adla, "Sayın" soyadla kullanılır. | "Sayın" kuralı kesin değil; cevap kaygan. |

## 5. Elenenler

| Aday | Gerekçe |
|---|---|
| Yüzlük açık artırma | Türkçede birebir dolaşıyor (5 kaynak). |
| Uydurma yazı-tura | Türkçede birebir dolaşıyor (3 kaynak). |
| Hep aynı bardak (sihirbazın seçimi) | Kolay; yöntemi öğreten Türkçe video var. |
| Dolu otobüs, boş otobüs | Aynı ilke "denetim paradoksu" adıyla iki Türkçe sitede. |
| Yarım banknot | Merkez Bankası kuralı mantığı bozuyor: banknotun tam yarısı yarı değerle değiştiriliyor. |
| Ajanda ("8'ü çeyrek geçe") | Islak notun ikizi; yazım hatası diye masum açıklaması var, el yazısı varsayımına dayanıyor. |
| Duran saat | Kolay (zorluk 3); tanığın cümlesi hileyi bağırıyor; durmuş saat bayat bir polisiye ögesi. |
| Kâhin mektupları | Düzenek çok bilinen bir dolandırıcılık; metindeki ipucu cevabı veriyor. |
| Usta tadımcı | Açık uçlu; 061'in aynası. |
| Emanet saz | Bilmece değil, anlatılmış bir dolandırıcılık (zorluk 2). |
| Üç ortak, üç kilit | Klasik; zorluk 4. 030 ile aynı yüzey (kilit ve anahtar). |

## 6. Sınırlar ve açık iş

- **İnsan testi yok.** Zorluk ve "vay" puanları yapay zekâ çözücülerin tahmini.
- **Bilinirlik aramaları dar.** Aday başına 2–6 sorgu; arama dizini ABD ağırlıklıydı, DuckDuckGo robot doğrulaması istedi, Ekşi Sözlük 403 verdi, Instagram, TikTok ve YouTube içi arama yapılmadı. "Çıkmadı" hükmü "bu sorgularda çıkmadı" demektir. Yayından önce Ekşi'ye ve video platformlarına elle bakılmalı. "Şampiyonun cevabı" hiç aranmadı.
- **Bir kör çözücü raporunu veremedi.** İlk turdaki küçük modelin cevabı bir güvenlik süzgecine takıldı; o turda tek kör çözücü ve bir denetçiyle yetinildi.
- **Setin eksiği.** Kurucu strateji ("nasıl yaparsın?") ve nesneyle oynanan bilmece yok. Gündelik gizem türü ("neden böyle yapıyor?") denendi; tek cevabı zorlayan bir örnek çıkaramadım.
- **Sonraki tur için en umutlu yönler:** Türkçenin örtük bilgisinden yeni mekanizmalar (getir/götür, akrabalık adlarının taşıdığı soy bilgisi, saat söylemede zorunlu ekler) ve iki cümlelik kanıtı olan başka teoremler.
