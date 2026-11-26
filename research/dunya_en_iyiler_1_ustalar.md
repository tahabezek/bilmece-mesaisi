# Dünyanın en iyileri, kol 1: klasik bulmaca ustaları (26 Kas 2026)

**Görev:** Gardner, Dudeney, Loyd, Carroll, Smullyan, Kordemsky, Perelman, Winkler, Mosteller, Phillips, Berloquin ve Nob Yoshigahara çizgisinden, `research/uzmanlik/USTA_OLCUTU.md` ölçütünü geçen en iyi bilmeceleri bulmak.

**Süzgeç sırası:**
1. Daha önce taranmış yedi dosya ve `bolumler/*.json` kartları (001–077) çıkarıldı. Aynı mekanizma ailesinden olanlar önerilmedi.
2. Hemen ret sebepleri uygulandı: hesap yığını, okul ya da fizik bilgisi, tercihe dayalı cevap, yapay kural, üç cümleyi aşan kanıt.
3. Her aday için en güçlü "ama" itirazı yazıldı. Kapatılamayan aday elendi.
4. Türkçe bilinirlik aday başına iki arama ile denendi.

**Arama sınırları (dürüstlük notu):**
- WebSearch ABD dizinli çalışıyor; Türkçe sorgularda bile sonuçların çoğu İngilizce geldi.
- DuckDuckGo html robot doğrulaması istedi; aşılmadı.
- Bing, WebFetch üzerinden alakasız sonuç döndürdü (Outlook, dizi sayfaları); kullanılmadı.
- Instagram, TikTok ve YouTube içi arama yapılamadı.
- Bu yüzden "çıkmadı" hükmü yalnızca "bu sorgularda çıkmadı" demektir. Yayından önce Ekşi'ye ve video platformlarına elle bakılmalı.

**Kaynak işaretleri:**
- **sayfadan:** Kaynağı ve çözümü bu oturumda bir web sayfasında doğrulandı.
- **bellekten:** Kitap metnine erişilemedi; iyi bilinen içerik bilgiye dayanarak yazıldı.

**Cevapların doğruluğu:** Her cevap elle yeniden kuruldu. Kanıtlarda hesap yok, yalnızca bakış değişikliği var.

---

## 1. Tavla karnesi

- **Kaynak:** Putnam 2004, A1 (basketbol serbest atış yüzdesi, %80). Sayfadan: Kedlaya'nın Putnam arşivi. Winkler tarzı "ara değer" sorularının ayrık hâli.
- **Uyarlama:** Kahvehanede her tavla maçından sonra Hikmet Bey'in galibiyet yüzdesi tahtaya yazılıyor; tavlada beraberlik yok. Ocakta tahtada %75'in altında bir sayı vardı, aralıkta %75'in üstünde. Necmi: "Arada bir maçtan sonra tahtada tam %75 yazmış olmalı." Defne: "Atlamış olabilir, yüzde bir maçta sıçrar." Kim haklı?
- **Cevap:** Necmi. Tam %75 kesin yazılmıştır.
- **Kanıt:**
  - %75, galibiyetin yenilginin tam üç katı olması demektir. Yüzde ancak galibiyetle yükselir; bir galibiyet de galibiyet sayısını yalnızca bir artırır.
  - Üç katın altındaki bir sayı tek adımda üç katın üstüne geçemez, önce tam üç katına basar.
- **En güçlü "ama":** "Bir günde birkaç maç oynandıysa ve tahtaya gün sonunda yazıldıysa atlayabilir." Kurgu bunu kapatır: tahta her maçtan sonra güncelleniyor. "Yuvarlama" itirazı da kapalı: tahtada yuvarlanmış bir sayı değil, gerçek oran var.
- **Güzelliği:** Yüzde "sıçrar" sezgisi doğrudur, ama %75'in 3'e 1 olduğu görülünce sıçramanın tam o noktayı atlayamadığı anlaşılır.
- **Bonus (isteğe bağlı):** Aynı soru %60 için sorulsa cevap "hayır" olur: 1'e 1'den (%50) bir galibiyetle 2'ye 1'e (%67) geçilir. Bu tezat, yorumda ikinci bir tartışma açar.
- **Türkçe bilinirlik:**
  - "serbest atış yüzdesi %80 altında başladı üstünde bitti…": çıkmadı.
  - "galibiyet oranı yüzde 75 altından üstüne…": çıkmadı.
- **Arşiv çakışması:** 038 (kâğıt top, yüzde yüzeyi; mekanizma Simpson, farklı). Tavla yüzeyi 040 ve 072'de var; aynı hafta yayınlanmamalı.
- **Puan:** zorluk 7 · vay 9.

## 2. Esneyen toplantı

- **Kaynak:** "Bulaşıcı satranç tahtası" (bootstrap percolation). Sayfadan: Futility Closet, 2011, "The Infected Checkerboard". Bollobás'ın *The Art of Mathematics* derlemesinde de var (bellekten).
- **Uyarlama:** Pazartesi toplantısı: salonda 8 sıra, her sırada 8 sandalye, 64 kişi. Necmi'nin gözlemi: tek bir komşun esnerse dayanırsın; ama önündeki, arkasındaki, sağındaki ve solundakinden en az ikisi esnerse sen de esnemeye başlarsın, sonra da duramazsın. Çapraz komşu sayılmaz. Toplantının sonunda bütün salonun esnemesi için başta en az kaç kişinin esnemesi gerekir?
- **Cevap:** 8 (örneğin köşegen boyunca oturan 8 kişi).
- **Kanıt:**
  - Esneyenlerin kapladığı bölgenin dış sınırı hiç uzamaz: yeni esneyen kişinin en az iki kenarı zaten esneyene değer, sınıra en fazla iki yeni kenar ekler.
  - Bütün salonun sınırı 32 sandalye kenarı, bir kişininki 4. 8'den az kişiyle sınır 32'ye ulaşamaz.
- **En güçlü "ama":** "Kural uydurma; gerçekte esneme böyle yayılmaz." Kapatma: kural bir eşik gözlemi olarak sahnede gösterilir; tek kişi esneyince kimse etkilenmez, iki komşu esneyince Hikmet Bey bile dayanamaz. İkinci itiraz "çaprazdaki de sayılır" metinde kapalı. Kurgunun en zayıf noktası bu "eşik" kuralının doğallığı; sahne onu ikna edici oynamalı.
- **Güzelliği:** Cevap, salgının içinde hiç değişmeyen tek şeyi, sınırın uzunluğunu görmekten gelir.
- **Türkçe bilinirlik:**
  - "8x8 satranç tahtası enfeksiyon iki komşusu hasta…": yalnızca İngilizce kaynaklar.
  - "tahtada hastalık yayılması iki hasta komşu çevre…": çıkmadı.
- **Arşiv çakışması:** 039 (kolonlu oda) ızgara yüzeyi; mekanizma (boyama) farklı.
- **Puan:** zorluk 8 · vay 9.

## 3. Çevre yolunda benzin

- **Kaynak:** Winkler, *Mathematical Puzzles: A Connoisseur's Collection* ("gas cans around a circular track"). Lovász'a ve matematik folkloruna da atfediliyor. Sayfadan: cut-the-knot "Gasoline Stations on a Circular Trek", quantvault.
- **Uyarlama:** Akaryakıt grevi. Necmi'nin minibüsünün deposu boş; çevre yolunda saat yönünde tam bir tur atması gerekiyor. Yol boyunca altı esnaf arkadaşı dükkânlarına farklı miktarda bidon bırakmış; hepsinin toplamı tam bir tura yetiyor, fazlası yok. Defne dükkânların yerini ve bidon miktarlarını görmeden: "Hangisi bilmem, ama oradan başlarsan turu tamamlayacağın bir dükkân kesin var." Haklı mı?
- **Cevap:** Evet, her durumda böyle bir dükkân var.
- **Kanıt:**
  - Deposu eksiye düşebilen hayalî bir minibüsün herhangi bir dükkândan başlayıp turu attığını düşün ve deponun en dibe indiği yeri işaretle.
  - Gerçek Necmi oradan başlarsa deposu o dibin altına hiç inmez, yani sıfırın altına hiç düşmez. En dip her zaman bir dükkânın kapısındadır, çünkü benzin yalnızca dükkânlarda eklenir.
- **En güçlü "ama":** "Bidonlar çok dengesizse, örneğin hepsi tek dükkândaysa?" O zaman cevap o dükkândır; kanıt bu durumu da kapsar. "Depo hepsini almazsa?" Kurgu: minibüsün deposu bir turluk benzini alır.
- **Güzelliği:** Var olduğu kanıtlanan dükkân, borçla yapılan hayalî bir turun en kötü anında saklıdır.
- **Türkçe bilinirlik:**
  - "dairesel pist benzin bidonları toplam bir tura…": çıkmadı. En yakın sonuç Webtekno'daki "varil sorusu", ama mekanizması farklı.
  - "benzin istasyonu problemi çember tam tur…": çıkmadı.
  - Not: Programlama mülakatlarında "Gas Station" adıyla bir algoritma sorusu olarak bilinir. Yazılımcı izleyici tanıyabilir.
- **Arşiv çakışması:** Yok.
- **Puan:** zorluk 7 · vay 8.

## 4. Uğur böceği ve duvar saati

- **Kaynak:** Winkler ile 3Blue1Brown'ın aylık bulmaca dizisinin ilk sorusu (2025–26); öneren Richard Stanley. Sayfadan: 3Blue1Brown çözüm özeti ve Austin Henley'nin simülasyonu. Winkler'in kitabında olduğu doğrulanamadı.
- **Uyarlama:** Hikmet Bey'in duvar saatinin camına bir uğur böceği konuyor, 12'nin üstünde. Her adımda yanındaki rakama geçiyor; sağa ya da sola gitmesi yazı-tura gibi eşit ihtimalli. Bastığı her rakam, cama değen ayağıyla iz alıyor. On iki rakamın hepsine en az bir kez basınca uçup gidiyor. En son ilk kez basılan rakamın 6 olma ihtimali mi büyük, 1 olma ihtimali mi?
- **Cevap:** Eşit. 1'den 11'e her rakamın son olma ihtimali 1/11.
- **Kanıt:**
  - Bir rakamın son kalması için, böcek o rakamın iki komşusundan birine ilk kez vardığında, rakama hiç basmadan saati uzun yoldan dolaşıp öbür komşuya ulaşmalıdır.
  - Bu durum her rakam için aynıdır: komşudan komşuya, araya basmadan 10 adımlık yol. Rakamın 12'ye uzaklığı yalnızca o ana ne zaman varılacağını değiştirir, ihtimali değiştirmez.
- **En güçlü "ama":** "1, 12'nin dibinde; ilk adımda yarı yarıya basılır, son kalamaz." Kanıt bunu cevaplar: ilk adımda 11'e giderse 1 hâlâ son kalabilir ve o yolun ihtimali, 6'nın son kalma ihtimaliyle tam aynıdır.
- **Güzelliği:** En uzak rakam ile en yakın rakam aynı şansa sahip, çünkü önemli olan uzaklık değil, komşulara ilk varış anı.
- **Risk:** Bu soru Ocak 2026'da 3Blue1Brown'da viral oldu; Türkçe altyazıyla izleyen bir kesim tanıyabilir. Ayrıca usta setinin denetçisi "eşit / fark etmez" kalıbının tekrar ettiğini söylemişti.
- **Türkçe bilinirlik:**
  - "uğur böceği saat 12 rastgele komşu sayıya…": yalnızca İngilizce kaynaklar.
  - "saat kadranında rastgele yürüyen böcek en son…": çıkmadı.
- **Arşiv çakışması:** Yok (rastgele yürüyüş hiç kullanılmadı).
- **Puan:** zorluk 8 · vay 9.

## 5. Dedenin tespihi

- **Kaynak:** Kolye bölüşme problemi (Goldberg ve West 1985; Alon ve West). Sayfadan: Wikipedia "Necklace splitting problem". Bulmaca hâliyle Winkler'in derlemesinde geçtiğini hatırlıyorum, doğrulayamadım (bellekten).
- **Uyarlama:** Dededen kalma halka tespih: 20 kehribar, 12 oltu tanesi, karışık dizilmiş. İki kardeş, Defne ile Necmi, eşit pay istiyor: her biri 10 kehribar, 6 oltu alacak. Taneler ipten çıkarılmayacak; ip yalnızca iki tane arasından kesilebilir. Hikmet Bey diziliş nasıl olursa olsun iki kesikle bu paylaşımın her zaman yapılabileceğini söylüyor. Haklı mı?
- **Cevap:** Evet, her dizilişte iki kesik yeter.
- **Kanıt:**
  - Tespihin tam yarısı uzunluğunda (16 tane) bir pencereyi halka üstünde kaydır. Başta içinde kaç kehribar varsa, yarım tur sonra 20 eksi o kadar olur; her kaydırmada sayı en fazla bir değişir, demek ki bir yerde tam 10 olur.
  - O pencerenin iki ucundan kesilir: pencere 10 kehribar ve 6 oltu taşır, kalan yarı da öyle.
- **En güçlü "ama":** "Bazı dizilişlerde iki kesik yetmez, örneğin taneler bloklar hâlindeyse." Kanıt her dizilişte çalışır. Blok hâlinde bile pencere bir yerde tam 10 kehribar tutar.
- **Güzelliği:** Kaç kesik gerektiğini dizilişe bakmadan bilmek mümkün, çünkü kayan bir pencere eşit payın üstünden atlayamaz.
- **Türkçe bilinirlik:**
  - "kolye iki tür boncuk iki hırsız eşit paylaşım…": yalnızca İngilizce ve akademik kaynaklar.
  - "tespih iki çeşit tane iki kardeş eşit paylaştırma…": çıkmadı.
- **Arşiv çakışması:** 032 (iki gün) ara değer ailesinin uzak akrabası; yüzey ve kanıt farklı.
- **Puan:** zorluk 7 · vay 8.

## 6. Kerem'in parası

- **Kaynak:** Mosteller, *Fifty Challenging Problems in Probability*, Problem 3, "The Flippant Juror" (bellekten; başlık blog sayfasıyla doğrulandı).
- **Uyarlama:** Ofisin yemek yarışmasında iki aday var; jüri üç kişi, çoğunluk kazanır. Hikmet ile Necmi her biri %70 ihtimalle doğru adayı seçer. Kerem'in hiç fikri yok; konuşmaz, cebinden parayı çıkarır, yazı-tura atar. Komşu ofiste tek jüri Defne, o da %70 ihtimalle doğru seçer. Hangi jüri daha isabetli?
- **Cevap:** İkisi aynı isabette.
- **Kanıt:**
  - Hikmet ile Necmi aynı fikirdeyse Kerem'in parası önemsizdir. Ayrıldıklarında para, ikisinden birinin oyunu yarı yarıya seçer.
  - Yani üçlü jüri, "Hikmet'le Necmi'den kurayla birini seç, onun dediği olsun" demektir; o da %70.
- **En güçlü "ama":** "Hikmet ile Necmi birbirinden etkileniyorsa hesap değişir." Değişmez. Kanıt bağımsızlık kullanmıyor, kurayla seçilen kişi her durumda %70 isabetli.
- **Güzelliği:** Üç kişilik çoğunluğun, bir kişinin kura ile seçilmesinden başka bir şey olmadığını görmek; Kerem'in sessizliği de bu numaranın kendisi.
- **Türkçe bilinirlik:**
  - "üç kişilik jüri biri yazı tura atıyor…": ⚠️ Hacettepe Üniversitesi'nin matematik dergisinde bir yazıda birebir var (tek kaynak, akademik).
  - "jüri üyelerinden biri yazı tura atarak oy veriyor…": çıkmadı.
  - Karar: kural gereği elenmez, not düşüldü.
- **Arşiv çakışması:** 042 (hileli para) yazı-tura yüzeyi. "Eşit" kalıbına dikkat: 4 numarayla aynı hafta olmamalı.
- **Puan:** zorluk 6 · vay 8.

## 7. Düğün masası

- **Kaynak:** Arkadaşlar ve yabancılar teoremi, R(3,3) = 6. Putnam 1953; Gardner'ın köşesinde parti problemi olarak (bellekten). Sayfadan: Wikipedia "Theorem on friends and strangers".
- **Uyarlama:** Düğünde Necmi, kimin kimi tanıdığını bilmeden iddia ediyor: "Bu masada ya birbirini tanıyan üç kişi var ya da birbirini hiç tanımayan üç kişi." Tanışıklık karşılıklıdır. Masa en az kaç kişilik olmalı ki Necmi bundan kesin emin olabilsin?
- **Cevap:** 6.
- **Kanıt:**
  - 5 yetmez: beş kişi halka gibi otursun, herkes yalnızca iki yanındakini tanısın. Ne tanışık üçlü olur ne yabancı üçlü.
  - 6 yeter: birini seç. Öbür beşten en az üçünü tanır ya da en az üçünü tanımaz. Tanıdığı üç kişiden herhangi ikisi tanışıyorsa onunla üçlü olurlar; hiçbiri tanışmıyorsa o üçü yabancıdır. Tanımadığı üç kişi için de tersi geçerli.
- **En güçlü "ama":** "Tanışmak tek taraflı olabilir." Kurgu kapatır: tanışıklık karşılıklı. Kanıt dört cümle sürüyor; ölçütün sınırında, videoda iki adıma bölünmeli (önce 5'in karşı örneği, sonra 6).
- **Güzelliği:** Kimseyi tanımadan bir masa hakkında kesin konuşmak; düzen, yeterince kalabalık her yerde kendiliğinden çıkar.
- **Türkçe bilinirlik:**
  - "6 kişilik partide birbirini tanıyan üç kişi…": bilmece olarak çıkmadı.
  - "Ramsey parti problemi altı kişi…": yalnızca İngilizce kaynaklar.
  - Not: Ramsey teoremi Türkçe matematik yazılarında anılıyor olabilir; matematikçi izleyici tanır.
- **Arşiv çakışması:** 054 (vapurda tanıdık sayısı) ve 067 (beşi birden) ile tanışıklık yüzeyi ortak; mekanizma farklı. Bu ikisiyle aynı ay yayınlanmamalı.
- **Puan:** zorluk 7 · vay 8.

## 8. Gece otobüsü

- **Kaynak:** Winkler, "Lost boarding pass" (100 yolculu uçak). Sayfadan: cut-the-knot "The Lost Boarding Pass" ("Winkler'den uyarlanmış").
- **Uyarlama:** 40 kişilik gece otobüsü; bütün biletler satılmış. İlk binen Hikmet Bey biletini kaybetmiş, boş koltuklardan rastgele birine oturuyor. Sonra binenler kendi koltuğu boşsa oraya oturuyor. Doluysa koltukta uyuyanı uyandırmaya kıyamıyor, kalan boş koltuklardan rastgele birine geçiyor. Kerem en son biniyor. Kendi koltuğuna oturma ihtimali nedir?
- **Cevap:** Yarı yarıya.
- **Kanıt:**
  - Kerem'e kalan koltuk ya kendi koltuğu ya Hikmet Bey'inkidir. Aradaki herkes sırası gelince kendi koltuğu boşsa oraya oturduğu için onların koltukları Kerem'e kalamaz.
  - Rastgele seçen her yolcu için bu iki koltuk eşit ihtimallidir; hangisi önce dolarsa sonuç o an belli olur.
- **En güçlü "ama":** "İnsanlar rastgele değil, en yakın boş koltuğa oturur." Kurgu "rastgele" sözünü açıkça söyler. Bu yeterli bulunmazsa sorunun belirleyici biçimi kullanılır: "Kerem hangi koltuklara oturmuş olabilir?" Cevap: "Yalnızca iki koltuk: kendi koltuğu ya da Hikmet Bey'inki." Bu biçim seçim kuralından bağımsızdır, ama "vay" etkisi daha düşüktür. Türkiye'de "pardon, burası benim" deyip kaldırma alışkanlığı da "uyuyanı uyandırmaya kıyamaz" şartıyla kapatılıyor.
- **Güzelliği:** 40 kişilik karmaşa, iki koltuk arasındaki tek bir yazı-turaya iner.
- **Türkçe bilinirlik:**
  - "uçak 100 yolcu ilk yolcu biletini kaybetti…": ⚠️ Evrim Ağacı'nın soru-cevap bölümünde yapısal karşılığı var ("264 yolcunun kendi koltuğuna oturma olasılığı").
  - "uçak koltuğu problemi … ekşi sözlük": çıkmadı.
  - Karar: tek kaynak, not düşüldü. Kuant mülakatlarında çok bilinir.
- **Arşiv çakışması:** Yok.
- **Puan:** zorluk 7 · vay 8.

## 9. Masa tenisi turnuvası

- **Kaynak:** Mosteller, *Fifty Challenging Problems in Probability*, "Will Second-Best Be Runner-Up?" (bellekten).
- **Uyarlama:** Ofiste 8 kişilik, eleme usulü masa tenisi turnuvası; eşleşmeler kurayla. Hikmet Bey herkesi yener. Necmi, Hikmet Bey dışında herkesi yener. Necmi'nin finale çıkma ihtimali nedir?
- **Cevap:** 7'de 4 (4/7).
- **Kanıt:**
  - Necmi'yi yalnızca Hikmet Bey durdurur. İkisi kurada ağacın ayrı yarılarına düşerse Necmi finale çıkar.
  - Hikmet Bey'in yarısında 3 boş yer, öbür yarıda 4 boş yer var: 7'de 4.
- **En güçlü "ama":** "Masa tenisinde sürpriz olur." Kurgu kapatır: "yener" şartı kesin. İkinci itiraz "kura adil mi" de metinde var.
- **Güzelliği:** İkinci en iyi oyuncunun finale kalmasını yeteneği değil, kuradaki tek bir ayrım belirler.
- **Türkçe bilinirlik:**
  - "eleme turnuvası 8 oyuncu kura ikinci en iyi…": çıkmadı.
  - "8 kişilik eleme usulü turnuva en iyi ikinci…": çıkmadı.
- **Arşiv çakışması:** 040 (eleme turnuvası, maç sayısı), 072 (galibiyet sırası) ve 074 (şampiyon Hikmet) yüzeyi yakın. Setin en zayıf "yenilik" puanı bu.
- **Puan:** zorluk 6 · vay 7.

## 10. Ak Hoca, Kara Hoca, Sarı Hoca

- **Kaynak:** Martin Gardner, *Scientific American*, Şubat 1960 (Profesör White, Profesör Black ve Jean Brown). Sayfadan: Scientific American'ın "Name the Hair Color" yeniden yayını.
- **Uyarlama:** Lokantada üç emekli öğretmen öğle yemeğinde: Ak Hoca, Kara Hoca, Sarı Hoca. Biri ak saçlı, biri kara saçlı, biri sarı saçlı. Kara saçlı olan, Ak Hoca'ya dönüp: "Ne tuhaf, hiçbirimizin saçı soyadına uymuyor." Ak Hoca: "Doğru." Sarı Hoca'nın saçı ne renk?
- **Cevap:** Kara.
- **Kanıt:**
  - Kara saçlı kişi Ak Hoca'yla konuştuğuna göre Ak Hoca değildir; saçı adına uymadığına göre Kara Hoca da değildir. Demek ki Sarı Hoca'dır.
  - Bonus: geriye ak saçlı Kara Hoca ve sarı saçlı Ak Hoca kalır.
- **En güçlü "ama":** "Kara saçlı, Ak Hoca'ya kendisi hakkında konuşuyor olamaz mı?" Kapatma: biri kendine dönüp hitap edemez. "Hoca" sözü cinsiyet vermez; Gardner'ın asıl sürümündeki "kadın kim?" katmanı Türkçede kendiliğinden saklanır. İstenirse ikinci soru olarak eklenebilir.
- **Güzelliği:** Bilgi sözün içeriğinde değil, sözün kime söylendiğinde.
- **Türkçe bilinirlik:**
  - "Beyaz Siyah Kızıl soyadlı üç profesör saç rengi…": çıkmadı (yalnızca İngilizce asıl).
  - "saç soyadı renk üç arkadaş siyah saçlı olan dedi…": çıkmadı.
- **Arşiv çakışması:** 066 (duvarın öbür yanı: sözün kimden geldiği) ile akraba bir düşünce; mekanizma farklı.
- **Puan:** zorluk 4 · vay 6. Setin en kolayı; kısa format için.

## 11. Avluda kovalamaca

- **Kaynak:** Dört fare veya böcek problemi (Lucas, 1877; Gardner'ın köşelerinde, bellekten). Sayfadan: cut-the-knot "Four Turtles".
- **Uyarlama:** Okul avlusu 20 metrelik bir kare. Dört çocuk dört köşede. Her biri saat yönündeki komşusunu kovalıyor, hep onun o an bulunduğu yere doğru koşuyor; hepsi aynı hızda. Ortada çarpışana kadar her biri kaç metre koşar?
- **Cevap:** 20 metre, yani avlunun bir kenarı kadar.
- **Kanıt:**
  - Kovalanan çocuk, kovalayanına göre hep yana, dik açıyla koşar; bu, aradaki mesafeyi ne uzatır ne kısaltır.
  - Aradaki 20 metreyi yalnızca kovalayanın kendi koşusu kapatır: 20 metre ara, 20 metre koşu.
- **En güçlü "ama":** "Sarmal çizerek dönüyorlar, yol sonsuz uzun olmaz mı?" Kanıt kapatır: mesafe hep tam hızla kapanıyor. Kalan zayıflık: "dik koşu mesafeyi değiştirmez" fikri hafif bir hareket sezgisi istiyor (K6 sınırında).
- **Güzelliği:** Herkes sarmalın uzunluğunu hesaplamaya kalkar; oysa yalnızca iki çocuk arasındaki mesafeye bakmak yeter.
- **Türkçe bilinirlik:**
  - "karenin köşelerindeki dört böcek birbirini kovalıyor…": çıkmadı.
  - "dört kaplumbağa karenin köşelerinden…": çıkmadı (yalnızca cut-the-knot).
  - Not: Fizik olimpiyat kitaplarında "bağıl hız" sorusu olarak geçebilir.
- **Arşiv çakışması:** 075 ve 077 hareket sorusu; mekanizma farklı.
- **Puan:** zorluk 7 · vay 8.

## 12. Düğün bahçesinde kablolar

- **Kaynak:** Kırmızı-mavi noktaları kesişmeyen doğrularla eşleştirme; uç durum ilkesinin klasik örneği. Putnam 1979, A4 (bellekten). Sayfadan: arXiv 2211.09904 ("en kısa eşleştirme kesişmez, iyi bilinir").
- **Uyarlama:** Köy düğünü için bahçeye 6 masa lambası ve 6 priz kutusu dağınık yerleştirilmiş; hiçbir üçü aynı hizada değil. Her lambaya ayrı bir prizden dümdüz kablo çekilecek; halay çekenler takılmasın diye kablolar birbirinin üstünden geçmeyecek. Lambalar ve prizler nasıl dağılmış olursa olsun bu her zaman mümkün mü?
- **Cevap:** Evet, her zaman.
- **Kanıt:**
  - Toplam kablo boyu en kısa olan bağlantıyı seç.
  - İki kablo kesişseydi uçları değiştirilince ikisinin toplamı kısalırdı, çünkü üçgende iki kenar üçüncüsünden uzundur. Yani en kısa bağlantıda kesişme olamaz.
- **En güçlü "ama":** "Üç ev ve üç tesis bulmacasında bağlantı imkânsızdı." O bulmacada her ev her tesise bağlanır; burada her lambaya tek kablo var. Bu karışıklık, sorunun çekici yanlış cevabını ("hayır") besleyen bilinçli bir tuzaktır.
- **Güzelliği:** En tembel çözüm, yani en kısa kablo, düzgün çözümün ta kendisi çıkar.
- **Türkçe bilinirlik:**
  - "kırmızı ve mavi noktalar kesişmeyen doğru parçalarıyla eşleştirme…": çıkmadı.
  - "lambalar prizler kablolar kesişmeden…": çıkmadı; yalnızca "üç ev üç tesis" sonuçları geldi (DonanımHaber).
- **Arşiv çakışması:** Yok.
- **Puan:** zorluk 6 · vay 7.

---

## Yedekler (geçti ama bir sebeple çekirdekte değil)

| Ad | Kaynak | Öz | Neden yedek |
|---|---|---|---|
| İki lahmacun, tek kesim | Steinhaus'un jambonlu sandviç teoremi; Gardner (bellekten) | Masadaki iki lahmacun, biçimleri ne olursa olsun, tek düz kesimle ikisi birden tam ikiye bölünebilir. Bıçağı döndürürken birinci lahmacunu hep ikiye bölen çizgi, yarım turda ikincinin sol ve sağ payını yer değiştirir; arada bir yerde tam yarıya gelir. | Tespihle aynı mekanizma (ara değer). İkisinden yalnızca biri. Tespihin kanıtı ayrık, daha kesin. |
| İsim kartlı masa | Klasik güvercin yuvası (Engel, Putnam türü; bellekten) | 8 konuk; kimse kendi kartının önüne oturmamış. Herkes aynı yöne aynı sayıda sandalye kayarsa en az iki kişinin kendi kartına geldiği bir kayma kesin var: 8 kişi, ama "hiç kaymamak" kimseye yaramadığı için yalnızca 7 kayma. | Kanıt çok güzel, ama iskeleti 054 ile aynı: "n kişi, bir kutu imkânsız, n−1 kutu". |
| İki vapur | Sam Loyd, "ferry boats" (sayfadan: forum ve okul problem setleri, 720/400 → 1760) | Kadıköy ve Karaköy vapurları aynı anda kalkar, iskelelerde eşit bekler; ilk karşılaşmada birlikte bir boy, ikincide üç boy yol almışlardır. Her biri ilk karşılaşmadakinin 3 katı yol alır. | Tek çarpma ve çıkarma istiyor (aritmetik kuralı). Ayrıca 071 ve 075'in hareket problemi ailesi ve 053–063 vapur yüzeyi dolu. |
| Guguklu saat | Kaynağı doğrulanamadı (Kordemsky ya da Perelman tarzı; bellekten) | Saat buçuklarda bir kez, tam saatlerde saat kadar çalar. Uyandı, bir vuruş duydu; yarım saat sonra bir, yarım saat sonra yine bir. Uyandığında saat 12.30'du (12.30, 1.00, 1.30). | Kolay (zorluk 4). TÜBİTAK Bilim Çocuk'ta aynı guguklu saat düzeneği geçiyor; aynı soru olabilir (tek kaynak, doğrulanmadı). |

## Elenenler

| Aday | Kaynak | Gerekçe |
|---|---|---|
| Chelsea emeklileri (%70 göz, %75 kulak… en az %10) | Carroll, *A Tangled Tale* | Kahvaltı sofrasına uyarlanabilir, ama Türk test kitaplarındaki "kümeler" soru tipinin aynısı; toplama gerektiriyor. |
| Aslan ve tek boynuzlu at ("dün yalan söyledim" → Perşembe) | Smullyan | Yalancı ailesi (009, 020, 036, 045, 076) doymuş. |
| "Seni bugün hiç kandırılmadığın gibi kandıracağım" | Smullyan (1 Nisan) | "Ama" testinde çöker: "kandırıldı" ve "kandırılmadı" ikisi de savunulabiliyor. |
| Acı köşeli lokum tepsisi (Chomp, strateji çalma) | Gale; Winkler | Kanıtı çok güzel, ama "ilk oynayan kazanır mı" ailesi (033); usta setinde aynı gerekçeyle çıkarılmıştı. |
| Çikolata kırma (6×8 → 47 kırma) | Winkler | Her işlem parça sayısını bir artırır; 040'ın (turnuva maç sayısı) mekanizması. |
| Halmos'un el sıkışma partisi | Halmos; Gardner | 045, 050 ve 054 ile aynı aile; kanıt üç cümleyi aşıyor. |
| Bertrand'ın üç kartı | Gardner | Carroll'ın torba sorusunun (dünya seçme listesi #23) ikizi. |
| Gamow–Stern asansörü | Gardner | 056'nın (iki otobüs) faz mekanizması. |
| 17 deve, dört ağırlık (1-3-9-27), Königsberg köprüleri, üç ev üç tesis, 6 kibritle 4 üçgen | Folklor; Bachet; Euler; Dudeney; Gardner | Türkiye'de çok bilinen klasikler (bellekten); bilinirlik testine gerek görülmedi. |
| Yarım fıçı, kum saatleri, sürahiler, 12 bilye, nilüfer | Perelman ve diğerleri | Önceki dosyalarda zaten elendi ya da Türkçede bayat. |

**Kapsam notu:**
- Dudeney ve Loyd malzemesi çoğunlukla parçalama, aritmetik ve yaş problemlerinden oluşuyor; ölçütten yalnızca Loyd'un vapurları geçti, o da yedekte.
- Kordemsky ve Perelman'ın içgörü soruları (hendek, kervan, saat, salyangoz, fıçı) önceki turlarda tüketilmiş.
- Hubert Phillips ve Berloquin'in bulmacaları uzun ızgara mantığı ya da hesap istiyor.
- Nob Yoshigahara'nın en bilinen soruları (otopark 87, otobüsün yönü) daha önce "basit" diye elenmişti.
- Bu dört isimden çekirdeğe aday çıkmadı.

---

## En iyi 5 (sıralı)

1. **Tavla karnesi.**
   - Tamamen Türk gündelik hayatı (kahvehane tahtası), sıfır bilgi.
   - İki cümlelik kanıt: "%75 = 3'e 1".
   - Çekici ve makul bir yanlış cevap var ("yüzde sıçrar"); tek kelimelik cevap.
   - %60 bonusu yorumda ikinci bir tartışma açar.
2. **Esneyen toplantı.**
   - Setin en güçlü "aha"sı: salgın büyürken sınır hiç uzamaz.
   - Cevap tek sayı (8) ve şaşırtıcı derecede küçük.
   - Sahne komik ve karakterlerle oynanır.
   - Tek zayıflığı eşik kuralının doğallığı.
3. **Çevre yolunda benzin.**
   - Kanıt bir hikâye: borçla atılan hayalî turun dibi.
   - "Dağılıma bağlı" sezgisi çok güçlü, cevap kesin.
   - Grev ve esnaf dayanışması Türkiye'ye oturuyor.
4. **Uğur böceği ve duvar saati.**
   - Sezgiyi en sert ters çeviren soru: en uzak ile en yakın rakam eşit.
   - Kanıt iki cümle.
   - Sıralamadaki tek kaygı 2026'daki 3Blue1Brown viralliği ve "eşit" kalıbının tekrarı.
5. **Kerem'in parası.**
   - Konuşmayan Kerem'in sabit özelliğini bilmecenin kendisine çeviriyor.
   - Kanıt tek bakış: "çoğunluk = kurayla seçilen bir kişi".
   - Türkçede tek bir akademik kaynakta var.
   - 4 ile aynı hafta yayınlanmamalı ("eşit" kalıbı).

Hemen arkasından: **Dedenin tespihi** (6) ve **Gece otobüsü** (7).
