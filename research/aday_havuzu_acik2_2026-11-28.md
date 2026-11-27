# Aday havuzu: açık yöntem soruları, ikinci tur (28 Kas 2026)

**Neden ikinci tur:** İlk turdan (`aday_havuzu_acik_2026-11-28.md`) üretime A2 yarım bardak (087) ve A11 yılbaşı çekilişi (088) girdi. A12 üç kilit klasik olduğu, A6 beş kart daha basit bir yol bulunduğu, A4 tek para bilindiği için elendi. A1 Kerem'in başı ve A3 üç kişilik tepsi bekliyor.

**Kör panelden alınan ölçü:** En güçlü aday, okurun ilk tepkide **aynı yanlış yönteme** düştüğü ve doğruya giden **birden çok geçerli yolun** bulunduğu adaydır (088: 3/3 aynı tuzak, iki farklı doğru yol). En zayıfı, çözücünün "bu bilinen bir klasik" dediği adaydır. Kolay ama güzel aday kabul edilebilir (087: zorluk 4–5, güzellik 5–8).

**Protokol:** `uzmanlik/USTALIK_DEFTERI.md` § 3, `uzmanlik/USTA_OLCUTU.md`. Bu dosyayı ben ürettim. Eleme ayrı oturumdaki avukata, bilinirlik ajanına ve kör panele kalır. Aşağıdaki "ama" ve bilinirlik notları üreticinin ilk taramasıdır.

**Kadro:** Hikmet Bey (patron), Defne, Necmi, Kerem (**hiç konuşmaz**). Yan karakter yalnız tek seferlik.

**Kısa format:** Kart iki satır, satır başına ≤ 33 harf (bütün kartlar sayıldı). "Buldum!" öncesi ≤ 55 kelime. Kurgu bölümlerindeki replikler taslaktır, sayılmadı.

**061 dersi** (`okur_duzeltmeleri.md`): Fiziksel yollar (karışım, ışık, ısı, koku, tartı, makine, telefon) kurgu aşamasında kapatılır. Her adayda "kurgunun kapatması gereken kapılar" başlığı bunun için var. Kapatılamayan makul yolu açıkça yazdım.

**Kendi kanıtlarım:** `duzeltme_defteri.md`'deki 27 Kas önlemine uygun olarak her referansı kendim yeniden türettim. Sayısal ya da geometrik olanların türetimi adayın içinde. Emin olmadığım olguları "emin değilim" diye işaretledim.

**Arşiv taraması:** `bolumler/001–088` kartlarının hepsi ve ilk turun 12 adayı mekanizma düzeyinde tarandı. Her adayda "arşiv yakınlığı" satırı var. Özellikle kaçınılanlar: 036 tek halkada yalancılar, 039 ve 050 tek-çift boyama, 041 kodlu tartı, 042 hileli para, 046 sıra avantajı, 047 Kerem'in tek bardakla bilgi aktarması, 060 tek soru ve üçüncü cevap, 061 sıfır bilgili kanıt, 062 gizli toplam, 081 ara değer, 084 ortanca, 085 çift tartı, 087 eşitleyerek ölçme, 088 döngüsel çekiliş.

**Bilinirlik ön taraması:** Her aday için tek bir İngilizce yapısal arama yaptım (Türkçe ve Rusça aramalar bilinirlik ajanına kalır). Bu tarama yüzünden dört aday yazıldıktan sonra atıldı; gerekçeleri dosyanın sonunda, "Yazılıp atılanlar" başlığında.

**Son 10 bölümün sınıfları:** 079 sözün lafzı, 080 S8, 081 ara değer, 082 S11, 083 sayım, 084 ortanca, 085 S2, 086 örnekleme, 087 S3, 088 S2.

---

## C1. Ortak makine (biri fiyat söyler, öbürü seçer)

**Kart:** `Ortak makineyi ikisi de istiyor.` / `Kimse kazıklanmadan kim alır?`

**Kurgu:** Defne ile Necmi iki yıl önce çay ocağına yarı yarıya bir Türk kahvesi makinesi aldı. Defne başka şubeye geçiyor ve makineyi ikisi de istiyor. Hikmet: "Kavga yok. Biriniz makineyi alır, öbürüne para verir. Kimse kazıklanmayacak." Necmi (tuzak): "Değerini ben söylerim, kim alırsa öbürüne yarısını verir." Defne (çürütme): "Olmaz. Makineyi sen alacaksan düşük, ben alacaksam yüksek söylersin." Hikmet: "İnternet fiyatı da yok. İkinizin gözünde değeri başka."

**Soru (açıklama metni tabanı):** Defne ile Necmi bir makineyi yarı yarıya aldı, şimdi biri alacak ve öbürüne para verecek. İkisinin gözünde makinenin değeri farklı. Kimse kimsenin söylediği fiyata güvenmiyor, aracı da yok. Her biri kendi gözünde en az yarı payını almalı. Nasıl anlaşırlar?

**Referans çözüm:** Necmi bir fiyat söyler. Defne iki şeyden birini seçer: ya makineyi o fiyattan alır ve Necmi'ye fiyatın yarısını öder, ya da makineyi Necmi'ye bırakır ve fiyatın yarısını Necmi'den alır.

**Kanıt:** Fiyatı söyleyen, makinenin hangi tarafa kalacağını bilmediği için iki ihtimale de razı olacağı fiyatı, yani kendi gözündeki değeri söylemek zorundadır: düşük söylerse makine ucuza elinden gider, yüksek söylerse makine pahalıya kendisine kalır. Seçen ise iki seçenekten kendi gözünde iyi olanı alır.

*Türetim:* Necmi'nin gözündeki değer N, söylediği fiyat p olsun. Defne alırsa Necmi p/2 alır. Necmi tutarsa N − p/2 kalır. p = N seçilince iki sonuç da N/2 olur. Defne'nin gözündeki değer D ise Defne max(D − p/2, p/2) alır, bu da en az D/2'dir, çünkü iki sayının toplamı D'dir.

**Bilinen geçerli alternatifler (tartışmanın yakıtı):**
- **Kapalı teklif:** İkisi de fiyatını kâğıda yazar, aynı anda açar. Yüksek yazan makineyi alır ve **kendi yazdığı** fiyatın yarısını öbürüne öder. Herkes dürüst yazarsa kazanan D/2, kaybeden en az kendi değerinin yarısını alır.
- **İki teklifin ortalaması:** Yüksek yazan alır, iki teklifin ortalamasının yarısını öder. Bu da tutar: kazanan a − (a+b)/4 ≥ a/2 alır, kaybeden (a+b)/4 ≥ b/2 alır.
- **Açık artırma:** Fiyat yükselir, ilk vazgeçen kaybeder. Kazanan, vazgeçilen fiyatın yarısını öder.

Hepsi aynı fikrin kardeşi. Hiçbiri referanstan kısa ya da daha kesin değil; yorumda "ben başka yol buldum" diye gelir.

**Kurgunun kapatması gereken kapılar:**
- **İnternet ya da piyasa fiyatı** (ikinci el sitesi): Hikmet'in replikle kapattığı kapı. Kapanış ölçütü: "Her biri **kendi gözünde** en az yarısını almalı." Piyasa fiyatı bu ölçütü sağlamaz: makineyi piyasa fiyatının iki katı değerinde gören kişi, kaybederse kendi gözünde az alır. Bu ölçüt kartta değil açıklama metninde ve Hikmet'in "ikinizin gözünde değeri başka" repliğinde olmalı.
- **Makineyi satıp parayı bölmek:** İkisi de makineyi istiyor (replikte söylenir). Ayrıca satış fiyatı ikisinin gözünde değerin altındadır.
- **Sırayla kullanmak:** Defne başka şubeye geçiyor.
- **Aracı ya da bilirkişi:** "Aracı yok" açıklama metninde.

**Yorumda beklenen yanlış yöntemler:**
1. Biri fiyat söylesin, yine o seçsin (videodaki tuzağın kardeşi): söyleyen kendi işine gelen fiyatı söyler.
2. Yazı tura atılsın, kazanan alıp yarı parayı versin: hangi paranın yarısı? Değer hâlâ belirsiz.
3. İkisi fiyat yazsın, ortalamadan **kim isterse** alsın: ikisi de ister, ayrıca ikisi de abartır.
4. Piyasa fiyatının yarısı: ölçüt "kendi gözünde"; makineyi çok seven kaybederse kazıklanmış sayar.
5. Makineyi satıp parayı bölmek: ikisi de istiyor.

**İlk tepki tuzağı:** "İnternette fiyatına bakarlar, kim alırsa yarısını öder." Sıradan zeki okur bunu söyler ve bitmiş sanar. Kurgu bu yüzden değerin kişiden kişiye değiştiğini açıkça söylemeli.

**Kısıt sınıfı:** S1 (varsayılan rol). Fiyatı söyleyenin alıcı ya da satıcı rolüne baştan kilitli olduğu varsayılır; çözümde rolü sonradan öbürü seçer. "Biri keser öbürü seçer"in bölünmeyen mala taşınmış hâli. Açık sınıf, son 10 bölümde yok. **Arşiv yakınlığı:** yok. İlk turun A3'üyle (tepsi) aile ortak ama mekanizma farklı: orada bölünen şey kek, burada para ile rol.

**En güçlü "ama":** "Necmi, Defne'nin makineyi çok istediğini biliyorsa fiyatı yüksek söyler ve Defne'ye pahalıya satar." Doğru, ama ölçütü bozmaz: Defne yine alıp almamayı seçer ve kendi gözünde en az yarısını alır, Necmi de kendi gözündeki değerin yarısından fazlasını kazanır. Ölçüt "kimse kendi gözünde yarısından azını almasın"dır, "kimse öbüründen fazla kazanmasın" değil. İkinci aday: "Defne'nin parası yetmezse?" Kurgu dışı; açıklama metninde iki tarafın da ödeyebildiği söylenir.

**Ustanın tek cümlesi:** Fiyatı söyleyen, alacak mı satacak mı bilmezse dürüst olmaktan başka çaresi kalmaz.

**Protokol tablosu:**

| Kim | Ne biliyor | Nasıl öğrendi | Davranışı |
|---|---|---|---|
| Necmi | Kendi gözündeki değer | Kendi zevki | Fiyatı söyler; Defne'nin seçimini bilmez |
| Defne | Kendi gözündeki değer, Necmi'nin söylediği fiyat | Fiyat açıkça söylendi | İki seçenekten kendine iyi geleni seçer |
| Hikmet | Kuralı | Kendisi koydu | Aracılık yapmaz, fiyat söylemez |

**Bilinirlik riski:** Düşük. Mekanizma ortaklık sözleşmelerinde "Texas shoot-out" ya da "buy-sell" maddesi adıyla ve adil bölüşüm ders kitaplarında var (Knaster yöntemi, Brams). Bilmece olarak dolaşan bir sürüm İngilizce aramada çıkmadı. Türk izleyici "biri keser öbürü seçer"i bildiği için cevap gelince tanıma (rahatlama tipi aha) güçlü olur. **Dudeney satırı:** Bu sürümde yeni olan, herkesin bildiği kek kuralının paraya ve bölünmeyen bir eşyaya taşınması. Çözüm gelince izleyici kuralı tanır ama kendisi taşıyamamıştır.

**Alternatif kurgu notu:** Aynı mekanizma "öğrenci evi kirası" ile de kurulur (biri iki odanın kirasını böler, öbürü odasını seçer), ama o sürüm mekanizmayı "biri keser öbürü seçer"e fazla yaklaştırır. Makine sürümü daha taze.

---

## C2. Yüzük kimde? ("sende mi" deme)

**Kart:** `Yüzük kimdeyse yalan söylüyor.` / `Tek soruyla yüzük kimde?`

**Kurgu:** İftardan sonra ofiste yüzük oyunu. Yüzük Hikmet, Necmi ya da Kerem'in kapalı avucunda. Hikmet kuralı okur: "Yüzük kimdeyse her soruya yalan söyler, öbür ikisi doğruyu. Defne tek soru soracak, üçümüz aynı anda başımızla evet ya da hayır diyeceğiz." Necmi (tuzak, takılarak): "Sor bakalım: yüzük sende mi?" Defne (çürütme): "Olmaz. Yüzük kimdeyse o da 'hayır' der, üçünüz de aynı cevabı verirsiniz."

**Soru:** Üç kişiden birinin avucunda yüzük var. Yüzüğü tutan her soruya yalan söyler, öbür ikisi doğruyu söyler. Üçüne aynı anda tek bir evet-hayır sorusu sorabilirsin, üçü de aynı anda cevap verir. Yüzüğün kimde olduğunu nasıl bulursun?

**Referans çözüm:** "Yüzük Hikmet Bey'de mi?" diye sor (ya da herkes için doğru cevabı aynı olan herhangi bir soru). Öbür ikisinden farklı cevap veren kişi yüzüğü tutuyordur.

**Kanıt:** Soru kişiden kişiye değişmeyen bir şeyi sorduğu için iki dürüst kişi aynı cevabı verir, yalancı ise tersini söylemek zorunda kalır ve tek başına ayrışır. "Yüzük sende mi?" sorusu ise her kişiye başka bir şeyi sorduğu için yalancının yalanı dürüstlerin doğrusuyla aynı cevaba ("hayır") düşer.

*Türetim (üç durum):* Yüzük Hikmet'teyse doğru cevap herkes için "evet"; Hikmet yalan söyleyip "hayır" der, öbürleri "evet": Hikmet ayrışır. Necmi'deyse doğru cevap "hayır"; Necmi "evet" der, öbürleri "hayır": Necmi ayrışır. Kerem'de de aynı. Üç durumda da ayrışan kişi yüzüğü tutan kişidir.

**Bilinen geçerli alternatifler:**
- Yüzükle ilgisiz, cevabı herkesçe bilinen her soru: "Bugün cuma mı?", "İki kere iki dört mü?" Yüzüğü tutan **her** soruya yalan söylediği için çalışır.
- Yüzükle ilgili ama kişiye göre değişmeyen sorular: "Yüzük bu masada mı?", "Yüzük Kerem'de mi?" Bunlar, protokol "yüzüğü tutan yalnız yüzükle ilgili sorularda yalan söyler" diye okunsa bile çalışır. Referansın bu türden seçilmesinin sebebi bu: protokolün iki okumasında da tutar.
- "Yüzük solundakinde mi?" türü dolaylı sorular da (çember düzeninde) iki "evet"in deseninden yüzüğü verir, ama daha uzun.

**Kurgunun kapatması gereken kapılar:**
- **Avuçları açtırmak, yüzüğü ellemek:** Oyunun kuralı; yalnız tek soru.
- **Yüz ifadesinden, terlemeden okumak:** Bilgi iddiası değil, keyfî. Açıklama metninde "yalnız cevaplara bakarak" denir.
- **Sırayla cevap:** "Üçü aynı anda cevap verir" kuralı, sonradan cevap verenin öbürlerine bakarak kopya çekmesini kapatır.
- **Yalancının "bilmiyorum" demesi:** Kural: herkes yalnız evet ya da hayır der.
- **Kerem'in baş işareti:** Bu adayda baş işaretinin anlamı herkesçe bilinir (aşağı evet). A1'deki bilinmeyen işaretle karışmaması için iki bölüm art arda yayımlanmamalı.

**Yorumda beklenen yanlış yöntemler:**
1. "Yüzük sende mi?" (videodaki tuzak): üçü de "hayır" der.
2. "Yüzük sende değil mi?": üçü de "evet" der. Olumsuz soru tuzağı kurtarmaz; yorumda büyük ihtimalle çok gelir.
3. "Yüzük senin sağındakinde mi?" gibi kişiye göre değişen her soru: çoğu durumda iki kişi ayrışır, tek kişi değil; dikkatli çözülmezse yanlış kişi seçilir.
4. "Hepsine 'yalancı mısın' diye sor": dürüstler "hayır", yalancı da "hayır" der. Klasik yalancı paradoksuna kayan yorumlar gelir.
5. "Önce birine sor, sonra öbürüne": tek soru kuralı.

**İlk tepki tuzağı:** "Yüzük sende mi?" Soru kendiliğinden kişiye yöneltilir; aranan şeyi sormak refleks. Necmi'nin repliği bu refleksi sesli kuruyor, Defne'ninki sesli öldürüyor.

**Kısıt sınıfı:** S5 (gözlemci ve çerçeve). Gevşeyen kısıt: "Soru, aranan kişiye kendisi hakkında sorulmalı." Çözüm, çerçeveyi kişiden dünyaya çevirir: herkes için aynı olan bir soruda yalan tek başına kalır. Açık sınıf, son 10 bölümde yok. **Arşiv yakınlığı:** 036 yalancılar (halkada "solumdaki yalancı"; mekanizma tek-çift, farklı), 009 çay ocağı (doğru ya da yanlış söyleme cümlesi, farklı), 060 (tek soru çerçevesi). Ortak imge "tek soru"; ara adım ortak değil.

**En güçlü "ama":** "Yüzüğü tutan yalnız yüzük hakkında yalan söylerse 'Bugün cuma mı?' işe yaramaz." Doğru. Bu yüzden referans soru yüzükle ilgili ama kişiye göre değişmeyen bir sorudur ("Yüzük Hikmet Bey'de mi?") ve iki protokol okumasında da tutar. Sabitlenmiş yanıtta bu ayrım bir cümleyle söylenir; itirazı yapan haklı çıkar ama referans çökmez. İkinci aday: "Yalancı, akıllı davranıp doğru söylerse?" Kural "yüzüğü tutan yalan söyler"; oyun kuralı protokoldür. Kurguda Hikmet bunu açıkça okur.

**Ustanın tek cümlesi:** "Sende mi?" diye sorarsan herkes aynı yalanın arkasına saklanır; herkese aynı şeyi sorarsan yalancı tek başına kalır.

**Protokol tablosu:**

| Kim | Ne biliyor | Nasıl öğrendi | Davranışı |
|---|---|---|---|
| Yüzüğü tutan | Yüzüğün kendisinde olduğu | Avucunda | Her soruya yalan; yalnız evet ya da hayır; öbürleriyle aynı anda |
| Öbür ikisi | Yüzüğün kendilerinde olmadığı; kimde olduğunu bilmiyorlar ya da biliyorlar (fark etmez) | Avuçları boş | Her soruya doğru; aynı anda |
| Defne | Kuralı | Hikmet okudu | Tek soru sorar |

Not: Dürüstlerin yüzüğün kimde olduğunu bilip bilmemesi referansı etkilemez, ama "Yüzük Hikmet'te mi?" sorusuna doğru cevap verebilmeleri için **bilmeleri** gerekir. Kurgu bunu sağlamalı: yüzük Hikmet'in elinden dağıtıldı ve üçü de dağıtımı gördü, yalnız Defne arkasını dönmüştü. Bilmeyen dürüst kişi "bilmiyorum" diyemez; bu açık bu yüzden kurguda kapanmalı. Bilmemeleri istenirse referans soru "Bugün cuma mı?" türüne kayar ve "yalnız yüzük hakkında yalan" itirazı açık kalır. **Avukat bu tercihi tartmalı.**

**Bilinirlik riski:** Orta. "Yalancıyı bulmak için cevabı bilinen bir soru sor" doğrucu-yalancı bilmecelerinin temel hamlesi; mantık bulmacası seven izleyici tanır. Ama yüzük oyunu imgesi, "sende mi" tuzağı ve aynı anda cevap kuralıyla kurulmuş bir sürüm aramada çıkmadı (yalnız İngilizce tek arama; bilinirlik ajanı Türkçe ve Rusça aramalı). **Dudeney satırı:** Bu sürümde yeni olan, yalancının kim olduğunun aranan şeyin kendisi olması ve tuzağın Türkçede ikinci tekil şahısla ("sende") kurulması.

---

## C3. Kare halı (dört kenar yetmez)

**Kart:** `Halıcı "kare" diyor, elde bir ip.` / `Halı gerçekten kare mi?`

**Kurgu:** Hikmet Bey kare toplantı odası için pazardan el dokuması bir halı alacak. Halıcı (tek seferlik yan karakter): "Kare abi, kare!" Necmi: "El dokuması bunlar, eğri çıkar." Ellerinde metre yok, yalnız bir sicim parçası var. Necmi (tuzak): "Dört kenarı iple ölçerim, hepsi eşitse karedir." Defne (çürütme): "Olmaz. Halıyı yandan itince dört kenarı yine eşit kalır ama köşeleri eğilir." (Defne halının köşesini iter, halı eşkenar dörtgene kayar: ipucu eylemle değil çürütmeyle veriliyor, cevap gösterilmiyor.)

**Soru:** Elinde yalnız bir sicim var: metre, gönye, telefon yok. Halının kenarları dümdüz. Halının tam kare olduğunu nasıl anlarsın?

**Referans çözüm:** Sicimle dört kenarı karşılaştır: hepsi eşit olmalı. Sonra iki köşegeni karşılaştır: ikisi de eşit olmalı. İkisi birden tutarsa halı karedir.

**Kanıt:** Dört kenarı eşit olan halı ya karedir ya da yana yatmış bir karedir (eşkenar dörtgen). Yana yattıkça bir köşegen uzar, öbürü kısalır; iki köşegen ancak köşeler dikken eşit olur.

*Türetim:* Kenarı a, açısı θ olan eşkenar dörtgenin köşegenleri 2a·cos(θ/2) ve 2a·sin(θ/2). Bunlar ancak θ = 90° iken eşit.

**Bilinen geçerli alternatifler:**
- **Katlama:** Halıyı iki köşegeninden ayrı ayrı katlamak (iki katlamada da tam üst üste biniyorsa eşkenar dörtgendir) ve bir orta çizgiden katlamak (karşılıklı kenarların ortalarını birleştiren çizgi; tam biniyorsa köşeler eşittir). Üçü birden kareyi verir. Büyük halıda zahmetli, mantıkça doğru.
- **Köşegenlerin hem eşit hem birbirini ortalaması** ve kenarların eşitliği: aynı fikrin kardeşi.
- **İple 3-4-5 üçgeni:** İpi on iki eşit parçaya işaretleyip dik açı kurmak. İpi katlayarak üçe bölmek ancak deneme yanılmayla olur; mümkün ama referanstan uzun.

**Kurgunun kapatması gereken kapılar:**
- **Gönye, kâğıdın köşesi, telefon uygulaması, duvar köşesi, yerdeki karolar:** "Elde yalnız sicim" ve pazar ortamı (karo yok, kâğıt yok). Kâğıt köşesi yorumda kesin gelir; açıklama metninde "cebinde hiçbir şey yok" demek gerekir. Kâğıdın köşesinin dik olduğu da bir bilgi iddiasıdır; sabitlenmiş yanıtta söylenir.
- **İpin esnemesi:** "Sicim" (esnemez) kelimesi seçilir.
- **Halının kenarlarının eğri olması:** "Kenarları dümdüz" açıklama metninde. Kenar eğriyse soru başka bir soruya döner.
- **Saçaklar:** Ölçü dokumanın kenarından alınır; sahnede saçaksız ya da kısa saçaklı halı.

**Yorumda beklenen yanlış yöntemler:**
1. Dört kenar eşitse kare (videodaki tuzak): eşkenar dörtgen.
2. **Köşegenden katla, tam biniyorsa kare:** eşkenar dörtgen de köşegeninden tam biner. En sinsi ikinci tuzak; yorumda çok gelir.
3. **Ortadan ikiye katla, tam biniyorsa kare:** dikdörtgen de biner.
4. Yalnız köşegenler eşitse kare: dikdörtgen de, ikizkenar yamuk da eşit köşegenlidir.
5. Karşılıklı kenarlar eşit ve köşegenler eşit: dikdörtgen.
6. "Göz kararı": el dokumasının eğriliği gözle görülmeyecek kadar küçük olabilir.

**İlk tepki tuzağı:** "Dört kenarı ölçerim." Sıradan okurun karesi "dört eşit kenar"dır; açı akla ikinci gelir.

**Kısıt sınıfı:** S7 (çekici eşitlik). Dört kenarın eşitliği kareliği kanıtlamış gibi görünür; gerekli ama yeterli değil. Orta doygunluk, son 10 bölümde yok. **Arşiv yakınlığı:** yok. 087 ile aile ("ölçmeden doğrula") komşu, mekanizma farklı.

**En güçlü "ama":** "Bu bir geometri bilgisi; izleyici 'köşegenleri eşit eşkenar dörtgen karedir'i bilmek zorunda değil." Kanıtın sözlü hâli bilgiye değil görüntüye dayanır: halı yana yatırıldıkça bir köşegenin uzayıp öbürünün kısaldığı gözle görülür. Video bunu Defne'nin halıyı itmesiyle (tuzağın çürütülmesi) zaten gösterir. İkinci aday: "İple uzunluk karşılaştırırken milimetrik fark görülmez." Doğru, ama aynı itiraz her ölçüme gelir; soru "kare mi" sorusunun yöntemini istiyor. Sabitlenmiş yanıtta dürüstçe kabul edilir.

**Ustanın tek cümlesi:** Kenarlar halının boyunu söyler, köşegenler duruşunu: eğik halının bir köşegeni uzun kalır.

**Protokol tablosu:**

| Kim | Ne biliyor | Davranışı |
|---|---|---|
| Halıcı | Halının kare olduğunu iddia ediyor | Yalnız "kare" der; ölçüme karışmaz |
| Necmi | El dokumasının eğri çıkabileceğini | Tuzağı kurar (dört kenar) |
| Defne | Eşkenar dörtgenin dört kenarının da eşit olduğunu | Halıyı iterek çürütür, köşegenden söz etmez |
| Hikmet | Yalnız sicimi var | Soruyu sorar |

**Bilinirlik riski:** Düşük-orta. Köşegenleri karşılaştırmak inşaat ve marangozlukta bilinen "çapraz ölçme" yöntemidir; usta izleyici tanır ve yorumda gururla yazar (bu iyi bir şey). Bilmece olarak dolaşan bir sürüm İngilizce aramada çıkmadı. **Dudeney satırı:** Bu sürümde yeni olan, el dokuması halının gerçekten eğri çıkabilmesi ve "köşegenden katla" yanlışının ikinci tuzak olarak hazır beklemesi.

---

## C4. İkiye bir pide

**Kart:** `Pideye biri 200, öbürü 100 verdi.` / `Parası kadar nasıl bölüşürler?`

**Kurgu:** Pide salonu. Kıymalı pide 300 lira; Defne 200, Necmi 100 verdi. Defne kenarların çıtırını sever, Necmi kaşarlı ortayı (bu zevk listesi yalnız "eşit uzunluk adil değil" demek için; kimse öbürünün zevkini tam bilmiyor). Kimse kimsenin bıçağına güvenmiyor. Hikmet: "Herkes parası kadar alsın." Necmi (tuzak): "Biri keser öbürü seçer: Defne üçte iki ile üçte bir diye ikiye kessin, ben seçeyim." Defne (çürütme): "Olmaz, sen büyük parçayı seçersin, bana üçte bir kalır."

**Soru:** İki kişi bir pideyi parası oranında, biri üçte iki öbürü üçte bir alacak şekilde paylaşacak. Kimse kimsenin bıçağına güvenmiyor, terazi yok, ikisinin zevki farklı. Her biri kendi gözünde hakkını aldığından emin olmalı. Nasıl bölerler?

**Referans çözüm:** Necmi pideyi kendi gözünde **üç eşit** parçaya keser. Defne bu üç parçadan **ikisini** seçer, kalan Necmi'nindir.

**Kanıt:** Necmi'nin gözünde her parça üçte birdir; hangisi kalırsa kalsın hakkını alır. Defne üç parçadan en iyi ikisini seçer ve en kötü parça kendi gözünde en çok üçte bir olduğu için seçtiği iki parça en az üçte ikidir.

**Bilinen geçerli alternatifler:**
- **Ters rol:** Defne pideyi kendi gözünde üç eşit parçaya keser, Necmi bir parça seçer. Defne'ye kalan iki parça kendi gözünde tam üçte iki, Necmi'nin seçtiği en iyi parça kendi gözünde en az üçte bir. Bu da doğru; yorumda "kim keserse" tartışması çıkar ve ikisi de haklıdır.
- **Necmi üçe keser, Defne bir parçayı Necmi'ye bırakır:** referansın aynısı, başka cümle.

**Kurgunun kapatması gereken kapılar:**
- **Terazi, cetvel:** Yok; ayrıca zevk farkı tartıyı kendiliğinden kapatır (aynı ağırlık iki kişiye aynı değeri vermez).
- **Garsona ya da Hikmet'e kestirmek:** "Kimse kimsenin bıçağına güvenmiyor." Garson kurguda yok.
- **İkinci bir pide almak, parayı geri vermek:** Hikmet'in kuralı: bu pide, bu para. Zayıf ama karaktere uygun.
- **Pideyi dilimleyip saymak** (pide salonları çoğu zaman dilimli getirir): Dilimler eşit değil ve zevk farkı var; sahnede pide kesilmemiş gelir.

**Yorumda beklenen yanlış yöntemler:**
1. İkiye kes (2/3 ve 1/3), biri seçsin (videodaki tuzak): seçen büyük parçayı alır ya da kesen haksız kesmiş olur.
2. **Önce biri keser öbürü seçer ile yarı yarıya bölün, sonra Necmi kendi yarısının üçte birini Defne'ye versin:** Necmi bu üçte biri kendi gözüne göre keser; Defne'nin gözünde Necmi'nin yarısı küçük olabilir, Defne'ye toplamda üçte ikiden az kalabilir. İnce bir yanlış; yorumda tartışma doğurur.
3. Uzunlamasına üçe ölç, ikisini Defne alsın: kim ölçecek? Zevk farkı da var.
4. Hepsini dilimle, Defne iki dilim alırken Necmi bir alsın, sırayla: dilimler eşit değil, ilk seçen kazanır (C10 ile aynı sorun).
5. "Paralarını geri alsınlar, her biri kendi pidesini alsın": soruyu ortadan kaldırır, Hikmet'in kuralıyla kapalı.

**İlk tepki tuzağı:** "Biri keser öbürü seçer." Herkesin bildiği iki kişilik kural, eşit olmayan payda kendiliğinden işe yarar sanılır.

**Kısıt sınıfı:** S2 (işlem kısıtı). Gevşeyen kısıt: "Biri keser öbürü seçer, iki parça demektir." Çözümde parça sayısı paydaya eşitlenir. Açık sınıf. **Arşiv yakınlığı:** yok. İlk turun A3'ü (üç kişilik tepsi) aynı aileden; ikisi birlikte yayımlanırsa iki "biri keser öbürü seçer yenilemesi" üst üste gelir, aralarına en az beş bölüm konmalı.

**En güçlü "ama":** "Necmi üç parçadan birini bilerek küçük keserse?" O zaman kendi zararına keser: Defne büyük ikisini alır, küçük Necmi'ye kalır. Kesen dürüst olmazsa yalnız kendini yakar. İkinci aday: "Defne üç parçanın en iyi ikisini seçince Necmi kıskanır mı?" Necmi'nin gözünde Defne'nin iki parçası tam üçte iki, kendi parçası tam üçte bir; hakkından fazlası kimsede yok.

**Ustanın tek cümlesi:** Pay üçte birse bıçak da üçe keser: kesen kendi gözünde her parçaya razıdır, seçen en iyi ikisini alır.

**Protokol tablosu:**

| Kim | Ne biliyor | Davranışı |
|---|---|---|
| Necmi | Kendi zevki, payının üçte bir olduğu | Üçe keser |
| Defne | Kendi zevki, payının üçte iki olduğu | İki parça seçer |
| Hikmet | Kuralı ("parası kadar") | Kesmez, seçmez |
| İkisi | Öbürünün zevkini tam bilmez, öbürüne güvenmez | Yalnız kendi gözüne göre karar verir |

**Bilinirlik riski:** Düşük. Eşit olmayan payları "payda kadar parçaya kes" ile bölmek adil bölüşüm literatüründe var; bilmece olarak dolaşan bir sürüm İngilizce aramada çıkmadı. Türk izleyici iki kişilik kuralı bilir; tanıma güçlü, çözüm taze. **Dudeney satırı:** Bu sürümde yeni olan, herkesin bildiği kuralın tek bir şartla (paylar eşit değil) çökmesi ve kurtaran fikrin parça sayısını değiştirmek olması.

---

## C5. Kitapçık türü (A ve B yetmez)

**Kart:** `Çaprazdaki de aynısını almasın.` / `En az kaç tür kitapçık lazım?`

**Kurgu:** Hikmet Bey toplantı salonunda işe alım sınavı yapacak; masalar 4 sıra, her sırada 5 masa. Hikmet: "Geçen sefer A ve B kitapçığı dağıttık, dama tahtası gibi. Yine kopya çıktı: çaprazdan baktılar. Bu sefer yanındaki, önündeki, arkasındaki, çaprazındaki kimse aynı kitapçığı almasın. Kitapçık basmak pahalı." Necmi (tuzak): "Üç tür yeter: A, B, C, her sırada bir kaydırırız." Defne (çürütme): "Olmaz, bir yerde iki çapraz komşu yine aynı harfe düşüyor." (Hangi yer olduğunu söylemez.)

**Soru:** Masalar düzgün sıralarda. Hiçbir öğrenci yanındaki, önündeki, arkasındaki ya da çaprazındaki öğrenciyle aynı kitapçığı almamalı. En az kaç tür kitapçık gerekir, nasıl dağıtırsın?

**Referans çözüm:** Dört tür. Tek sıralarda A B A B A, çift sıralarda C D C D C.

**Kanıt:** Yan yana iki sıranın yan yana iki masası, dört masalık küçük bir kare yapar ve bu dört kişiden her biri öbür üçünün ya yanında ya önünde ya da çaprazındadır; dördü de farklı kitapçık almak zorundadır. Desen her masaya, komşusundan sıra ya da sütun tek-çiftliği farklı olan bir harf verdiği için dört tür yeter.

*Türetim (üçün neden yetmediği):* Dört masalık her karede dört kişi birbirine komşudur, bu yüzden üç türle dağıtılamaz. Necmi'nin kaydırmalı A B C deseni ilk iki sırada şöyledir: A B C A B / B C A B C. Birinci sıranın 2. masası (B) ile ikinci sıranın 1. masası (B) çaprazdır.

**Bilinen geçerli alternatifler:** Dört türlü başka desenler: her sıra A B C D A, bir alt sıra C D A B C (iki kaydırma) ya da sütun sütun kurulan desenler. Hepsi "her dört masalık karede dört farklı harf" kuralına uyar.

**Kurgunun kapatması gereken kapılar:**
- **Masaları seyreltmek, boş masa bırakmak:** "Salon dolu" (Hikmet'in repliğine eklenebilir).
- **Herkese farklı kitapçık:** "En az" sorusu kapatır; Hikmet "kitapçık pahalı" der.
- **Soruların ve şıkların sırasını ayrıca karıştırmak:** Gerçek hayatta yapılır ama "kitapçık türü" zaten bu demektir; soru tür sayısını soruyor.
- **Gözetmen sayısını artırmak:** Soru dışı.

**Yorumda beklenen yanlış yöntemler:**
1. İki tür, dama tahtası gibi (Hikmet'in anlattığı eski hata): çaprazlar aynı.
2. Üç tür, kaydırarak (videodaki tuzak): her desende bir dört masalık kare üç harfe sığmaz.
3. Beş, altı ya da sekiz tür ("her yönde bir komşu var, sekiz komşu"): fazla; komşular birbirinin de komşusu olmadığı için harf tekrar kullanılabilir.
4. "Sıra sayısı kadar": gereksiz.

**İlk tepki tuzağı:** "Üç yeter." İki türün çökmesi videoda söylendiği için okur bir üst sayıya geçer; dörtlü kareyi görmeden üçü dener.

**Kısıt sınıfı:** S6 (sayıdan uzaya). Gevşeyen kısıt, "kaç tür?" sayısal sorusunun bir komşuluk geometrisiyle (dört masalık kare) çözülmesi. Ayrıca S7'nin "bilinen çözüm (dama) yeni şartta çöker" kalıbına da benzer. **Arşiv yakınlığı:** 039 kolonlu oda (dama boyaması) imge olarak yakın, soru ters: orada boyama imkânsızlığı kanıtlıyor, burada renk sayısı aranıyor. Avukat tartmalı.

**En güçlü "ama":** "Gerçek sınav salonunda masalar arası mesafe var, çaprazdan görülmez." Kurgu buna Hikmet'in "çaprazdan baktılar" anısıyla cevap veriyor. İkinci aday: "İki kişilik sıralarda sıra arkadaşı?" Kurgu: tek kişilik masalar.

**Ustanın tek cümlesi:** Çaprazı da sayınca dört masalık her köşe bir küçük aile olur ve ailede herkes birbirine komşudur.

**Protokol tablosu:** Tek bilgi masaların düzeni; herkes görüyor. Hikmet kuralı koyar. Necmi tuzağı kurar, Defne çürütür.

**Bilinirlik riski:** Düşük. Matematikte "şah grafiğinin renk sayısı" (4) olarak bilinir; bilmece olarak dolaşan bir sürüm İngilizce aramada çıkmadı. Türk izleyici ÖSYM'nin A ve B kitapçıklarını bildiği için kanca kendiliğinden kurulur. **Zaaf:** Kolay olabilir (087 gibi); kör panelde 30 saniyede çözme %50'yi geçerse kolaylık sorunudur.

---

## C6. Necmi'nin sürprizi (işaretin anlamını sakla)

**Kart:** `Kerem başıyla cevap verecek.` / `Sürprizi ona nasıl sızdırmazsın?`

(İkinci satırdaki "ona" belirsiz kalıyor; avukat kartı yeniden yazabilir. Seçenek: `Necmi, Kerem'in başını görüyor.` / `Sürprizi ona nasıl sızdırmazsın?`, 30 ve 32 harf.)

**Kurgu:** Yarın Necmi'nin doğum günü. Defne, Kerem'in hediyeyi alıp almadığını öğrenmek istiyor, ama Necmi yanlarında oturuyor ve kuşkulanmış: "Bana sürpriz mi hazırlıyorsunuz? Kerem, ne cevap verirsen ben de göreceğim!" Kerem konuşmaz, yazmaz (kolu alçıda), yalnız başını aşağı indirir ya da yukarı kaldırır. Hikmet (tuzak, Defne'ye yardım ederek): "Soruyu kulağına fısılda, Necmi duymasın." Defne (çürütme): "Olmaz. Necmi neyi sorduğumu tahmin eder; Kerem başını indirince anlar."

**Soru:** Kerem yalnız başını aşağı indirerek ya da yukarı kaldırarak cevap verir ve Necmi bunu görür. Defne Kerem'in kulağına istediğini fısıldayabilir, Necmi fısıltıyı duymaz. Defne, Kerem'in hediyeyi alıp almadığını Necmi hiçbir şey anlamadan nasıl öğrenir?

**Referans çözüm:** Defne Kerem'in kulağına şunu fısıldar: "Hediyeyi aldıysan başını yukarı kaldır, almadıysan indir." Hangi işaretin "aldım" demek olacağını, Necmi'nin görmediği bir yazı turayla seçer.

**Kanıt:** Necmi işareti görür ama anlamını bilmez; Defne anlamı yazı turayla seçtiyse Necmi için "aşağı" da "yukarı" da yarı yarıya "aldım" demektir. Cevabı saklamaya gerek yok, işaretin anlamını saklamak yeter.

**Bilinen geçerli alternatifler:**
- **Rastgele olumsuzlama:** Defne yazı turaya göre ya "Hediyeyi aldın mı?" ya da "Hediyeyi almadın mı?" diye fısıldar. Aynı fikir.
- **Ortak sırla karıştırma:** "Hediyeyi aldın mı ve sabah sana gösterdiğim kartın rengi kırmızı mıydı, ikisi aynı mı?" Aynı fikrin uzun hâli.
- Yazı tura olmadan "tersini seç" de çoğu zaman yeter, ama Necmi Defne'nin ters seçtiğini tahmin edebilir. Yazı tura bu ikinci tahmini de öldürür; yorumda bu tartışma çıkar ve referansın iki katmanı oradan görünür.

**Kurgunun kapatması gereken kapılar:**
- **Kerem'in yazması, telefondan mesaj atması:** Kolu alçıda, telefonu şarjsız; ya da Necmi'nin "telefonlar masaya" kuralı. Kadro kartı Kerem'in yazabildiğini söylediği için bu kapı mutlaka kapanmalı.
- **Odadan çıkıp sonra sormak:** "Şimdi" şartı zayıf. Daha iyisi: Necmi kuşkulanmış ve Defne'yle Kerem'i gün boyu yalnız bırakmıyor (replikte "ben de göreceğim").
- **Kerem'in başka bir işaret yapması** (göz kırpmak, parmak): Necmi her hareketi görür; Kerem'in protokolü yalnız iki baş hareketi.
- **Defne'nin Kerem'e başka bir yerde bir not bırakıp sonra cevabı alması:** "Şimdi, burada" şartının zayıflığı. Avukat bu kapıyı tartmalı; kapanmıyorsa kurgu "Defne bu akşam hediyeyi alacak mı karar vermeli, dükkân kapanıyor" gibi bir aciliyetle güçlendirilir.

**Yorumda beklenen yanlış yöntemler:**
1. Soruyu fısılda (videodaki tuzak): Necmi soruyu tahmin eder, işaretin olağan anlamını bilir.
2. "Kerem göz kırpsın": Necmi görür.
3. "Defne başka bir şey sorsun, 'çay ister misin' gibi": Kerem'in cevabı hediyeyle ilgili bilgi taşımaz.
4. "Necmi'yi dışarı gönderin": kurguda kapalı ama gelir.
5. "Tersini anlaşırlar" (yazı turasız): yarı doğru; yorumda "Necmi de tersini düşünür" itirazıyla tartışılır.

**İlk tepki tuzağı:** "Kulağına fısılda." Saklanması gerekenin soru olduğu sanılır; oysa soru zaten tahmin edilebilir, saklanması gereken işaretin anlamıdır.

**Kısıt sınıfı:** S11 (epistemik): cevabın değil anlamın gizlenmesi. **Dolu sınıf;** bu bilinçli bir uyarı. **Arşiv yakınlığı:** A1 Kerem'in başı bunun aynası (A1'de anlam bizden saklı, burada biz saklıyoruz). İkisi aynı haftada yayımlanmamalı; ama art arda iki hafta "Kerem'in başı 1 ve 2" diye kurulursa ikincinin cevabı birinciden doğal bir dönüş olur. 047 (Kerem'in bilgi aktarması) farklı: orada önceden anlaşma yok, tek seçimle bilgi taşınıyor.

**En güçlü "ama":** "Defne Kerem'in kulağına istediğini fısıldayabiliyorsa Kerem de Defne'nin kulağına başıyla bir şey anlatamaz mı?" Kerem konuşmaz ve fısıldamaz; baş hareketi herkesin önünde. İkinci aday: "Necmi Kerem'in yüzünden anlar." Bilgi iddiası değil, keyfî. Üçüncü aday: "Bu, yazı tura olmadan da yeter." Bkz. alternatifler: Necmi'nin ikinci tahmini.

**Ustanın tek cümlesi:** Herkesin gördüğü bir işaret, anlamı tek kişide kaldıkça sırdır.

**Protokol tablosu:**

| Kim | Ne biliyor | Nasıl öğrendi | Davranışı |
|---|---|---|---|
| Kerem | Hediyeyi alıp almadığı; Defne'nin fısıldadığı anlam | Kendisi aldı; fısıltı | Hep doğru; yalnız aşağı ya da yukarı; konuşmaz, yazmaz |
| Defne | Yazı turanın sonucu, işaretin anlamı | Kendisi attı | Fısıldar, işareti okur |
| Necmi | Sorunun konusunu tahmin ediyor, işareti görüyor | Kuşku, göz | Fısıltıyı duymaz |
| Hikmet | Sürprizi biliyor | Defne söyledi | Tuzağı (fısıltıyı) önerir |

**Bilinirlik riski:** Düşük. Mekanizma kriptografideki "tek kullanımlık anahtar" fikrinin en küçük hâli; bu aday için arama yapmadım, bilmece olarak dolaşmadığı benim tahminim. **Zaaf:** Kolay olabilir; zorluk görüntüsü "Necmi tahmin eder" ikinci katmanından gelir.

---

## C7. İlk imza (çemberin başı yok)

**Kart:** `İlk imzayı atan elebaşı sayılır.` / `Dilekçe ilksiz nasıl imzalanır?`

**Kurgu:** Ekip, cumartesi mesaisinin kalkması için Hikmet Bey'e dilekçe yazdı. Hikmet'in huyu bilinir: "İlk imzayı atan elebaşıdır." Kimse ilk imzayı atmak istemiyor. Necmi (tuzak): "Alfabetik gidelim, olsun bitsin." Defne (çürütme): "Olmaz, o zaman ilk imza benim! Kura da olmaz, kura da birini başa koyar." Kerem kalemi alıp kâğıdın ortasına bir çay bardağı koyar (eylem ipucu: bardağın dibi kâğıtta yuvarlak bir iz bırakır). Bu ipucu avukatın ve kullanıcının onayına bağlı; cevaba fazla yaklaşıyorsa kaldırılır.

**Soru:** Dört kişi bir dilekçe imzalayacak. Dilekçeyi okuyan, en üstteki ya da ilk imzayı atanı "elebaşı" sayıyor. İmzasız dilekçe kabul edilmiyor. Kimse ilk imzacı görünmeden dilekçeyi nasıl imzalarlar?

**Referans çözüm:** İmzalar alt alta ya da yan yana değil, dilekçe metninin altına çizilen bir çemberin çevresine, her biri merkezden dışarı bakacak şekilde atılır. Çemberin başı ve sonu yoktur.

**Kanıt:** "İlk imza" bir sıranın başıdır ve sıra ancak bir çizgi üstünde vardır: satırda soldaki, sütunda üstteki ilktir. Çemberin her noktası öbürleriyle aynı yerdedir; imzalar merkezden dışarı bakınca hangisinden okumaya başlanacağı da belli olmaz.

**Bilinen geçerli alternatifler:**
- Yıldız ya da üçgen gibi dönme simetrisi olan her düzen: aynı fikir.
- **İmzaların aynı noktada üst üste atılması:** Sıra yok ama imzalar okunmaz; Hikmet kabul etmez. Yorumda gelir, tartışılır.
- **Herkesin dilekçenin ayrı bir kopyasını imzalaması ve kopyaların tek zarfta verilmesi:** En üstteki kopya yine "ilk" sayılabilir; zayıf.

**Tarihî not:** Yöntem gerçektir: İngilizcede "round robin" adı, 17. yüzyılda elebaşı belli olmasın diye çember biçiminde imzalanan dilekçelerden gelir (Wikipedia, "Round-robin (document)"; kaynak az atıflı, kesin tarih için emin değilim). Sabitlenmiş yanıtta bu not bir cümleyle verilebilir ve cevabı "uydurma kural" olmaktan çıkarır.

**Kurgunun kapatması gereken kapılar:**
- **İmzasız dilekçe:** Hikmet'in kuralı ("imzasız dilekçeye bakmam"). Resmî dilekçede imza gerçekten şart; iş yerinde karaktere uygun.
- **Hep birlikte sözlü gitmek:** Dilekçe yazılı istendi (kurguda Hikmet "yazılı getirin" der).
- **Mürekkep sırası, kurumadan kimin önce attığını anlamak:** Şaka olarak gelir; kurgu dışı.
- **Hikmet'in herkesi tek tek çağırıp sorması:** Soru dışı; bilmece imzanın kendisi hakkında.

**Yorumda beklenen yanlış yöntemler:**
1. Alfabetik sıra (videodaki tuzak): baştaki elebaşı olur.
2. Kura: kuradan çıkan yine ilk imzacıdır.
3. Kerem'e ilk imzayı attırmak (konuşmuyor, "suçlanamaz"): şaka, ama Kerem'e haksızlık; yorumda gelir.
4. Hikmet'in adını ilk satıra yazmak: dilekçe Hikmet'e.
5. Yan yana aynı satır: soldaki ilk okunur.

**İlk tepki tuzağı:** "Kura çekelim." Ya da "alfabetik". İkisi de sırayı adil kılmaya çalışır; sorun sıranın kendisidir.

**Kısıt sınıfı:** S6 (sayıdan uzaya). "İlk" sözcüğü bir sayı (sıra numarası) çağrıştırır; çözüm sırayı bir çizgiden bir çembere taşıyarak numarayı yok eder. Açık sınıf. **Arşiv yakınlığı:** yok.

**En güçlü "ama":** "Hikmet çemberde de saat 12'deki imzayı ilk sayar." Kısmen tutar: dilekçe metni yönü belirlediği için çemberin bir "tepesi" vardır. Kapanış: imzalar merkezden dışarı doğru atılır, böylece hiçbir imza metinle aynı yönde okunmaz; ya da çember metnin tam ortasına çizilir. Bu itiraz yorumda kesin gelir; avukat tutup tutmadığını tartmalı. **Bu adayın en büyük riski bu "ama".**

**Ustanın tek cümlesi:** Sıra bir çizgiye yazılınca doğar; çemberde kimse önde değildir.

**Protokol tablosu:**

| Kim | Ne biliyor | Davranışı |
|---|---|---|
| Hikmet | Dilekçenin geleceğini; kuralı ("ilk imza elebaşı") | Yalnız imzaların düzenine bakar |
| Defne, Necmi, Kerem | Kuralı | İmzalar; kimse ilk görünmek istemez |

**Bilinirlik riski:** Düşük-orta. "Round robin" adının kökeni İngilizce bilgi yarışmalarında bilinen bir merak notu; Türkçede bilinmiyor. Bilmece olarak çok az dolaşıyor. **Zaaf:** Cevap mantıktan çok yanal bir numara; "uydurma" duygusu tarihî notla karşılanır.

---

## C8. Hesabı kim ödedi? (ekmek sepeti)

**Kart:** `Hesap ödenmiş, ödeyen söylemiyor.` / `Bizden biri mi? Kimse bilmesin.`

**Kurgu:** Ekip akşam yemeğinde. Garson: "Hesap ödendi." Masadaki dört kişiden biri gizlice ödemiş olabilir, ya da yan masadaki Hikmet'in eski patronu Rıza Bey. Rıza Bey ödediyse gidip teşekkür etmek gerekiyor; masadan biri ödediyse, kim olduğu ortaya çıkmasın, ödeyen istemiyor. Necmi (tuzak): "Herkes gözünü kapatsın, ödeyen elini kaldırsın." Defne (çürütme): "Olmaz, sen gözünü açarsın."

**Soru:** Dört kişiden biri hesabı gizlice ödemiş olabilir, ya da yan masadaki tanıdık ödemiş olabilir. Masadakiler bizden birinin ödeyip ödemediğini öğrenmeli, ama ödeyen kişinin kim olduğunu kimse öğrenmemeli. Nasıl yaparlar?

**Referans çözüm:** Ekmek sepetinin üstüne peçete örtülür. Herkes sırayla elini peçetenin altına sokar; ödeyen sepete bir bozuk para bırakır, öbürleri boş el sokar. Peçete kalkınca sepette para varsa bizden biri ödemiştir, yoksa Rıza Bey.

**Kanıt:** Herkes aynı hareketi yaptığı için sepete el sokmak kimseyi ele vermez. Sepetteki para yalnız "biri koydu mu" sorusunu cevaplar, "kim koydu" sorusunu değil.

**Bilinen geçerli alternatifler:**
- Aynı peçeteden kesilmiş dört kâğıt; ödeyen çarpı işaretli, öbürleri boş katlar; kâğıtlar bir bardakta karıştırılıp açılır.
- Masa altında birbirine elden ele dolaşan kapalı kutu.
- 062'nin "gizli toplam" yöntemi de tutar (herkes rastgele bir sayı ekler). **Arşiv tekrarı riski bu.**

**Kurgunun kapatması gereken kapılar:**
- **Garsona sormak:** Garson söylemez ("ödeyen söylemememi istedi"; Türkiye'de gerçek bir davranış).
- **Kart fişi, banka bildirimi:** Nakit ödendi.
- **Rıza Bey'e sormak:** Rıza Bey ödediyse "ben ödemedim" der (Türk usulü alçakgönüllülük); sormak bilgi vermez. İnce ama kurgu içinde tutarlı.
- **El yazısı:** Kâğıt yöntemi için çarpı ya da boş; ekmek sepeti yöntemi yazısız.

**Yorumda beklenen yanlış yöntemler:**
1. Gözler kapalı el kaldırma (videodaki tuzak).
2. Garsona sor.
3. "Herkes 'ben ödemedim' desin, kim yalan söylüyor bakarız": ödeyen de "ödemedim" der.
4. Herkes kâğıda adını yazıp ödediyse çarpı koysun: adlar sızdırır.

**İlk tepki tuzağı:** "Garsona sor." Kurgu kapatmalı.

**Kısıt sınıfı:** Gizli hesap ailesi (062). Dolu aile. **Arşiv yakınlığı:** 062 maaş ortalaması aynı aileden ve 062'nin yöntemi bu soruyu da çözer. **Bu adayın en büyük zaafı.**

**En güçlü "ama":** "Sepete elini en son sokan, peçete kalkmadan önce parayı hissedip kimden geldiğini çıkarabilir mi?" Sıra ve süre farkından bir şey çıkmaz, ama kâğıt yöntemi bu itirazı da kapatır. İkinci aday: "Bizden iki kişi ödediyse?" Hesap bir kez ödenir.

**Ustanın tek cümlesi:** "Kim?" sorusunu değil "biri mi?" sorusunu sor: karıştırınca isim kaybolur, sayı kalır.

**Protokol tablosu:**

| Kim | Ne biliyor | Davranışı |
|---|---|---|
| Ödeyen (varsa) | Kendisinin ödediğini | Ortaya çıkmak istemez, yöntemde dürüst |
| Öbürleri | Kendilerinin ödemediğini | Yöntemde dürüst |
| Garson | Kimin ödediğini | Söylemez |
| Rıza Bey | Kendisinin ödeyip ödemediğini | Sorulursa her durumda "ben ödemedim" der |

**Bilinirlik riski:** Düşük (kriptografideki "yemek yiyen kriptografçılar" problemi bu sorunun akademik hâlidir, ama oradaki çözüm madeni parayla, karıştırmasız). **Zaaf:** Kolay; kör panelde 30 saniyede çözme oranı büyük ihtimalle %50'nin üstünde. Listede Türk kültürüne çok iyi oturduğu için duruyor ("hesabı gizlice ödemek"); 062'den en az on bölüm uzağa konmalı ya da elenmeli.

---

## C9. Sayışma (sayan ebeyi seçiyor)

**Kart:** `Sayan, ebeyi kendisi seçiyor.` / `Sayışma nasıl hilesiz olur?`

**Kurgu:** Toplantı odasında telefonlar sepette (Hikmet'in kuralı), ceplerde bir şey yok. Kimin çay toplayacağına sayışmayla karar veriliyor; Necmi sayıyor: "O piti piti karamela sepeti…" Üç gündür hep Kerem çıkıyor. Defne: "Necmi heceyi önceden sayıyor, kimi isterse onu çıkarıyor." Hikmet: "Sayışmayı öyle yapın ki sonucu kimse seçemesin, Necmi dahil." Necmi (tuzak): "Tamam, Defne saysın." Defne (çürütme): "Olmaz, ben de heceyi sayarım, kimi istersem onu çıkarırım."

**Soru:** Dört kişi sayışmayla bir ebe seçecek. Elde para, zar, kâğıt yok. Sayan kişi tekerlemenin hece sayısını bildiği için istediğini ebe yapabiliyor. Sonucu hiç kimsenin tek başına seçemeyeceği bir sayışma nasıl yapılır?

**Referans çözüm:** Herkes elini masanın altında, istediği kadar parmak açarak hazırlar. "Üç" deyince dört el birden masaya konur. Açılan parmakların toplamı kadar, önceden belirlenmiş bir kişiden başlanıp saat yönünde sayılır; sayının bittiği kişi ebedir.

**Kanıt:** Herkes kendi parmağını öbürlerininkini görmeden seçtiği için toplamı tek başına kimse belirleyemez. Sayının nerede biteceği hepsinin seçimine birlikte bağlıdır.

**Bilinen geçerli alternatifler:**
- **Sayan gözünü kapar, öbürleri yer değiştirir:** Sayan hece sayısını bilse de kimin nerede oturduğunu bilmez. Güzel bir yanal yol; yorumda gelir.
- **Taş kâğıt makas elemesi:** Aynı anda atış ilkesi; uzun sürer ama adil.
- **Tekerlemenin sonuna herkesin aynı anda söylediği sayıları eklemek:** referansın sözlü hâli.

**Kurgunun kapatması gereken kapılar:**
- **Para, zar, kâğıt, telefon:** Toplantı odası kuralı ve boş cepler. Zayıf kapı; "biri cebinden bozuk para çıkarır" yorumu gelir.
- **Geç açmak** (biri öbürlerini görüp sonra açar): "Üç deyince hepsi birden" kuralı ve eller masanın altında hazır. 046'da Necmi'nin "hep geç atması" kanca olarak kullanıldı; burada tekrar edilmemeli.

**Yorumda beklenen yanlış yöntemler:**
1. Başkası saysın (videodaki tuzak): o da hece sayar.
2. "Rastgele birinden başla": başlangıcı kim seçecek?
3. "Tekerlemeyi değiştir": sayan yine sayar.
4. "Herkes kendini saysın": anlamsız.

**İlk tepki tuzağı:** "Başka biri saysın."

**Kısıt sınıfı:** S7 (çekici eşitlik: sayışma herkesi tek tek saydığı için adil görünür, oysa sonucu sayan belirler). **Arşiv yakınlığı:** 046 taş kâğıt zar ve 083 taş kâğıt makas çetelesi (sıra ve aynı anda atış teması), ilk turun A4'ü (adil kura). Aile yakın, mekanizma (sayışmanın belirlenimci olması) yeni.

**En güçlü "ama":** "Bu adil değil: toplam her sayıya eşit olasılıkla düşmez." Doğru ve soru bunu istemiyor: ölçüt "kimse sonucu tek başına seçemesin". Ama yorumda "eşit şans" diye okunacaktır; açıklama metni ölçütü açıkça yazmalı. Ayrıca iki kişi önceden anlaşırsa birlikte de sonucu seçemezler, çünkü öbür ikisinin parmaklarını bilmezler.

**Ustanın tek cümlesi:** Tekerleme rastgele değildir, yalnız uzundur; rastgeleliği tek kişiden değil herkesten al.

**Protokol tablosu:**

| Kim | Ne biliyor | Davranışı |
|---|---|---|
| Necmi | Tekerlemenin hece sayısı | Önceden hile yaptı |
| Defne | Hilenin nasıl yapıldığı | Çürütür |
| Hikmet | Kuralı | Kimse sonucu seçemesin |
| Kerem | Hep ebe çıkıyor | Konuşmaz; ilk parmağı masaya o koyar (eylem ipucu, isteğe bağlı) |

**Bilinirlik riski:** Orta. Sayışma tekerlemelerinin belirlenimci olduğu çocuklar arasında bilinir; parmak toplamıyla seçim (İtalyanların "morra"sı) eski bir oyun. **Zaaf:** Kapılar zayıf (bozuk para); cevap kolay. Alt sırada.

---

## C10. Bayram zarfları (uçtan alma oyunu)

**Not:** Bu aday klasik bir oyunun ("coins in a line") Türk kurgusudur; bilinirlik ön taraması onu İngilizce popüler kaynaklarda buldu (Science News, Cut-the-Knot, GeeksforGeeks). İlk turdaki A5 künefe gibi, listede tam olması için duruyor; elenmesini beklerim. Türk izleyicide bilinmediğini düşündüğüm için kullanıcıya gösterilmeye değer buldum.

**Kart:** `Sırayla, yalnız uçtaki zarflar.` / `İlk alan nasıl hep kaybetmez?`

**Kurgu:** Hikmet Bey bayram ikramiyesini oyunla dağıtıyor: masaya yan yana sekiz zarf diziyor, üstlerinde içindeki para yazılı. Defne ile Necmi sırayla, yalnız iki uçtaki zarflardan birini alacak; ilk Necmi alıyor. Hikmet: "Her bayram dizilişi değiştiririm." Necmi (tuzak): "Kolay, her seferinde uçtaki büyük zarfı alırım." Defne (çürütme): "Olmaz, büyüğü alınca arkasındaki iki yüzlüğü bana açarsın."

**Soru:** Masada yan yana sekiz zarf var, tutarlar üstlerinde yazılı. İki kişi sırayla, yalnız iki uçtaki zarflardan birini alıyor. Zarflar nasıl dizilmiş olursa olsun, ilk alan en az öbürü kadar parayı nasıl garantiler?

**Referans çözüm:** Zarflara soldan sağa 1'den 8'e numara ver. Tek numaralıların toplamı ile çift numaralıların toplamını karşılaştır. Büyük olan gruptan uçtaki zarfı al; bundan sonra her seferinde Defne'nin açtığı, senin grubundan olan ucu al. Böylece bütün grubu toplarsın.

**Kanıt:** Çift sayıda zarfta iki uç her zaman farklı gruptadır. Necmi kendi grubundan bir uç alınca Defne'nin önündeki iki uç da öbür gruptan olur; Defne hangisini alırsa alsın, Necmi'nin grubundan yeni bir uç açılır.

*Türetim (açgözlülüğün yenildiği örnek):* Dizi 10, 200, 5, 20, 50, 5. Açgözlü Necmi uçlardan büyüğü (10) alır ve 200'ü Defne'ye açar. Tekler toplamı 10 + 5 + 50 = 65, çiftler 200 + 20 + 5 = 225; Necmi önce sağdaki 5'i (6. zarf) alır ve sonunda 225'e karşı 65 kazanır.

**Bilinen geçerli alternatifler:** Belirli bir dizilişte her durumu sonuna kadar hesaplamak (daha çok kazandırabilir ama kafada yapılmaz). Soru "garantiler" dediği için referans yeterli.

**Kurgunun kapatması gereken kapılar:** Zarf sayısının çift olması (tek sayıda yöntem çöker; soru "sekiz" der), tutarların görünür olması.

**Yorumda beklenen yanlış yöntemler:** Açgözlü (videodaki tuzak); "hep küçüğü al, Defne'yi büyüğe zorla"; "ikinci olmak avantajlı"; "en büyük zarfı hedefle".

**İlk tepki tuzağı:** "Büyük olanı alırım."

**Kısıt sınıfı:** S10 (tek-çift değişmezi, strateji alt türü). **En dolu sınıf.** **Arşiv yakınlığı:** 039 ve 050 tek-çift; 033 altlık oyunu (ilk hamlenin avantajı, simetri).

**En güçlü "ama":** "Bu en çok kazandırmaz." Doğru; soru kaybetmemeyi soruyor.

**Ustanın tek cümlesi:** Zarflara bakma, yerlerine bak: tek ile çift hiç karşılaşmaz.

**Protokol tablosu:** Herkes bütün tutarları görür; ilk Necmi alır; kural yalnız uçlar.

**Bilinirlik riski:** **Yüksek** (İngilizce bulmaca ve mülakat kaynaklarında yaygın, LeetCode "Stone Game"). Türkçe dolaşım aranmadı.

---

## A1 yeniden kurgu: Kerem'in başı (oyun çerçevesi)

**Kart:** `Kerem'in evet işareti bugün sır.` / `Tek soruyla lokum hangi elde?`

**Kurgu:** Sabah çay ocağında Kerem bir iddia başlatır: elinde bir lokum, ellerini arkasına alır, lokum birinde. Ödül bir kutu lokum. Kerem'in iddiası (Hikmet okur, Kerem başıyla onaylar): "Kerem hep doğru cevap verir, ama tek soruyla lokumu bulamazsınız." Kurallar:
1. Kerem bu sabah, hangi baş hareketinin "evet" olacağını kendisi seçti: aşağı indirmek mi, yukarı kaldırmak mı. Seçimini bir kâğıda yazıp katladı, kâğıt Hikmet'in cebinde; oyun bitince açılacak.
2. Kerem yalnız evet-hayır sorusuna, yalnız başını aşağı indirerek ya da yukarı kaldırarak cevap verir. Başka hiçbir şey yapmaz; eliyle, çenesiyle, gözüyle göstermez.
3. Tek soru sorulur, sonra tek el seçilir. Doğru eli seçen kutuyu kazanır.
4. Hikmet hakemdir: Kerem'in arkasında durur, lokumun el değiştirmediğini görür.

Necmi (tuzak): "Önce 'aşağı evet mi' diye sorarız." Defne (çürütme): "Olmaz. Tek soru hakkımız var; işareti öğrensek bile lokumu soracak hakkımız kalmaz." Hikmet: "Tek soru!"

**Soru (açıklama metni tabanı):** Kerem hep doğruyu söyler ve her soruyu doğru anlar, ama konuşmaz: evet-hayır sorusuna ya başını aşağı indirerek ya da yukarı kaldırarak cevap verir. Hangisinin "evet" olduğunu bu sabah kendisi seçti, kimse bilmiyor. Lokum Kerem'in sağ ya da sol elinde. Kerem'e tek bir soru sorabilirsin. Lokumun hangi elde olduğunu nasıl bulursun?

**Referans çözüm:** "Sana 'Lokum sol elinde mi?' diye sorsam, başını aşağı mı indirirdin?" Kerem başını aşağı indirirse lokum sol elinde, yukarı kaldırırsa sağ elinde.

**Kanıt:** Aşağı "evet" ise içteki ve dıştaki soru aynı yöne cevap verir. Aşağı "hayır" ise işaret iki kez ters döner ve sonuç yine aynı çıkar: bilinmeyen anlam kendini götürür.

*Dört durumun türetimi (avukat raporundaki tabloyla karşılaştırıldı, aynı):* Aşağı = evet, lokum solda → içteki cevap evet = aşağı → dıştaki önerme doğru → aşağı. Aşağı = evet, lokum sağda → içteki cevap hayır = yukarı → dıştaki önerme yanlış → yukarı. Aşağı = hayır, lokum solda → içteki cevap evet = yukarı → dıştaki önerme yanlış → hayır = aşağı. Aşağı = hayır, lokum sağda → içteki cevap hayır = aşağı → dıştaki önerme doğru → evet = yukarı. Aşağı her durumda sol demek.

**Bilinen geçerli alternatifler:** Eşdeğerlik sorusu ("Aşağı indirmenin evet demek olması ile lokumun sol elinde olması ya ikisi de doğru ya ikisi de yanlış mı?"), "yukarı" ile kurulan aynası, "sağ" ile kurulan hâli. Hepsi referansın kardeşi.

**Yorumda beklenen yanlış yöntemler:**
1. Düz soru ("Lokum sol elinde mi?"): işaretin anlamı bilinmeden hiçbir şey öğretmez.
2. Ayar sorusu ("Aşağı evet mi?", videodaki tuzak): her durumda aşağı gelir, hiçbir şey öğretmez (videoda Defne yalnız "hakkımız kalmaz" diyor; asıl çöküş sabitlenmiş yanıtta anlatılır, yorumda kendiliğinden tartışılır).
3. **İkisini tek soruda birleştirmek** ("Lokum sol elinde mi ve aşağı evet mi?"): aşağı hayır ise iki durumda da aşağı gelir, ayırmaz. Ayar sorusunu çürüten videodan sonra en çok gelecek yanlış bu.
4. "Türkiye'de yukarı hayır demektir": Kerem bu sabah kendisi seçti, gelenek bilgi vermez.
5. "Lokum hangi elinde?": evet-hayır sorusu değil, Kerem cevap vermez, hak yanar.

**İlk tepki tuzağı:** Ayar sorusu. Kör panelde ölçülmedi; tahmin.

**Kısıt sınıfı:** S11 (epistemik): bilinmeyen sözlüğü soruya gömmek. Dolu sınıf; C6 ile aynı hafta yayımlanmamalı.

### Avukat raporundaki açıkların kapanışı

| # | Avukatın açığı (`aday_havuzu_acik_2026-11-28_avukat.md`, A1) | Ağırlık | Yeni kurguda nasıl kapandı |
|---|---|---|---|
| 1 | "Çekmeceler Hikmet'in masasında, ikisini de açıp bakarsın." | Ölümcül | Çekmece yok. Lokum Kerem'in arkasındaki kapalı avuçlarında; avuçları açtırmak oyunun kuralı dışı, yalnız **tek el seçimi** hakkı var (kural 3). |
| 2 | "İki yıldır kimse evet işaretini çözemedi" gerçek hayatta tutmaz. | Ölümcül | İşaretin anlamını Kerem **bu sabah** kendisi seçti; kâğıtta yazılı, Hikmet'in cebinde (kural 1). Geçmişteki hiçbir gözlem bugünkü anlamı söylemez. |
| 3 | "Kapıyı tut, asansör düğmesine bas, sonra mesaj at; Kerem yazıyla cevap verir." | Ölümcül | Asansör ve aciliyet yok. Kısıt bir oyunun kuralı: Kerem yalnız başıyla cevap verir, tek soru, sonra tek el (kural 2–3). Kerem iddiayı kazanmak istediği için yazıyla yardım etmez; oyunun kuralını kimse dışarıdan dayatmıyor, Kerem kendisi koydu. |
| 4 | "Başıyla çekmeceyi göstersin" (Türkiye'de çeneyle işaret yaygın). | Replikle kapanmalı | Kural 2 Hikmet'in repliğinde: "Başka hiçbir şey yapmaz; eliyle, çenesiyle, gözüyle göstermez." Elleri arkasında olduğu için eliyle de gösteremez. |
| 5 | "Kerem 'sorsam ne yapardın'ı anlamaz, içteki soruya cevap verir." | Tutmuyor, söylenmeli | Açıklama metninde "her soruyu doğru anlar" cümlesi var. |
| 6 | "Türkiye'de yukarı hayır demektir" bilgisi kurgunun inandırıcılığını zorluyor. | Orta | Anlamı Kerem bu sabah seçtiği için gelenek bilgi vermez; Kerem'in bilerek ters seçmiş olabileceği, ayar sorusunun çekiciliğini artırır. |
| 7 | **047 ile aynı sahne** (anahtar, çekmece, yerini yalnız konuşmayan Kerem biliyor). | Ağır | Anahtar, çekmece ve bardak yok. Nesne lokum, yer Kerem'in kendi elleri, oyun "hangi elde" çocuk oyunu. 047'nin bilgi aktarma düzeneği (önceden anlaşma, tek seçim) burada yok. |
| 8 | Defne'nin çürütmesi ("O soruya her durumda aşağı indirir") çözümün yarısını sızdırıyor. | Sızdırma bedeli yüksek | Yeni çürütme yalnız soru hakkının bittiğini söyler; bilinmeyenin kendini götürdüğü fikrine hiç değinmez. Ayar sorusunun gerçek çöküşü sabitlenmiş yanıta kalır. |
| 9 | (Yeni kurgunun açtığı) "Kerem iddiayı kazanmak için yalan söyler ya da lokumu el değiştirir." | — | Kural: Kerem hep doğruyu söyler; oyun sonunda kâğıt açılır ve cevap doğrulanır. Hikmet Kerem'in arkasında durup elleri izler (kural 4). |
| 10 | (Yeni kurgunun açtığı) "Hikmet'e sorarız, o kâğıdı biliyor." | — | Kâğıt katlı ve açılmamış; Hikmet de bilmiyor. Hikmet yalnız lokumun yerini görüyor ve hakem olduğu için söylemez. |
| 11 | Bilinirlik: Boolos'un "ja/da" alt adımı, TED-Ed "ozo/ulu", iki bekçi kalıbı (bilinirlik raporu: sınırda). | Kapanmaz | Kurgu bu riski kapatamaz. **Dudeney satırı:** Bu sürümde yeni olan, bilinmeyen dilin tanrıların kelimesi değil bir iş arkadaşının bu sabah seçtiği baş işareti olması ve tanrısız, yalancısız, rastgele cevapçısız en saf hâli. Yorumda "bu Boolos'un sorusu" diyen birkaç kişi beklenir. |

**Kalan bilinçli bedel:** Oyun çerçevesi kuralı "uydurulmuş" gösterir (USTA_OLCUTU madde 5). Avukatın da dediği gibi, oyun olduğu açıkça söylendiği için kabul edilebilir: kuralı koyan Kerem'in kendisi, ve iddia "tek soruyla bulamazsınız" bir imkânsızlık vaadi olarak kancayı kurar.

**En güçlü "ama" (yeni):** "Sorsam ne yapardın sorusu aslında iki soru." Tutmaz: bir soru sorulur, bir cevap alınır; soru kendi içinde varsayımsal bir soruyu anıyor, sormuyor. İkinci aday: "Kerem paradoks soruya ('Bu soruya başını indirecek misin?') ne der?" Referans paradoks değil; böyle bir soru da bilgi vermez, çünkü aşağı evetse iki cevap da doğrudur.

**Ustanın tek cümlesi:** Sözlüğü bilmiyorsan soruya sözlüğün kendisini koy: iki bilinmeyen birbirini götürür.

**Protokol tablosu:**

| Kim | Ne biliyor | Nasıl öğrendi | Davranışı |
|---|---|---|---|
| Kerem | Lokumun hangi elde olduğunu; işaretlerin bugünkü anlamını | Kendisi sakladı; sabah kendisi seçti | Hep doğru; her soruyu doğru anlar; yalnız evet-hayır sorusuna, yalnız iki baş hareketiyle; anlam gün boyu değişmez |
| Hikmet | Lokumun yerini (arkadan görüyor); işaretin anlamını bilmiyor (kâğıt katlı) | Gözüyle | Hakem; söylemez; oyun sonunda kâğıdı açar |
| Defne, Necmi | İki işaretin ne olduğunu, anlamını değil | Kerem'in iddiası | Tek soru, sonra tek el |

**Karar önerisi:** Kurgu açıkları kapandı; bilinirlik "sınırda" olarak kalıyor. Kör panele C6 ile birlikte değil, tek başına girmeli.

---

## Yazılıp atılanlar (bilinirlik ön taraması)

Bu dört aday tam yazıldı; İngilizce yapısal aramada popüler kaynaklarda birebir çıktıkları için listeden çıkardım. Kullanıcının "klasiklerin adı değiştirilmiş hâli olmamalı" şartına takılıyorlar.

| Aday | Mekanizma | Neden atıldı |
|---|---|---|
| Sallanan masa (çay bahçesi, altına bir şey koymadan) | Kare masayı yerinde çeyrek tura kadar döndür; ara değer | Gardner (1973), Numberphile, Scientific American, Smithsonian'da popüler ("wobbly table theorem"). Ayrıca kanıt ara değere dayanıyor (081, 032 ile aynı ara adım) ve "ayak kısaysa çalışmaz" haklı itirazı var. |
| Tek bisiklet (servis bozuldu, terki yok) | Bisikleti yarı yolda bırak, öbürü yürüyüp alsın | Dudeney, *Modern Puzzles* #35 "Sharing a Bicycle" ve Perelman ailesi; birebir. |
| Bayram telefonları (dört kişi, her birinin bir haberi) | Önce ikişer, sonra çaprazlama: dört telefon | "Gossip problem"; Guardian bulmaca köşesi ve çok sayıda kaynakta; ayrıca "aile WhatsApp grubu" kapısı kapanmıyor. |
| Bayram zarfları | Tek-çift numara stratejisi | Listede C10 olarak tutuldu (Türk izleyici için taze olabilir) ama elenmesi beklenir. |

Ayrıca düşünülüp yazılmadan atılanlar: taksi ücreti paylaşımı (iki savunulabilir cevap: mesafe oranı ve kesim kesim paylaşım; Monty Hall değil 8÷2(2+2) tipi kamp), Fisher'ın çay tadımı (cevap olasılıksal, "kesin" değil), hesap kavgasında kart ruleti (A4 ailesi), grup ödevinde tarafsız prim bölüşümü (çelişen oranlarda bütçe tutmuyor, kanıt uzun), telefonda yazı tura (kesin referans yok).

---

## Sıralamam (en iyi 5)

Seçimi kullanıcı, avukat ve kör panel yapar; bu üreticinin görüşü.

1. **C1 Ortak makine.** Tuzak güçlü ve tek ("internet fiyatına bakarız" ya da "biri fiyat söylesin"), referans iki cümle, en az üç farklı geçerli yol var, bilinirliği düşük, açık sınıf (S1). Herkesin yaşadığı bir ortaklık ayrılığı.
   *Neden yorumda tartışma çıkar:* "Piyasa fiyatı adildir" diyen kamp ile "herkesin gözünde değeri başka" diyen kamp karşılaşır; kapalı teklif öneren üçüncü kamp ikisine de "benimki de olur" der ve hepsinin haklı olduğu yerle olmadığı yer tek ölçütle ("kendi gözünde yarı") ayrışır.
2. **C2 Yüzük kimde?** Kör panelin aradığı desen: neredeyse herkes aynı refleksle "sende mi?" der, doğruya birçok soru götürür. Yüzük oyunu Türk imgesi, açık sınıf (S5).
   *Neden yorumda tartışma çıkar:* Biri "Bugün cuma mı?" yazar, öbürü "yalancı yalnız yüzük için yalan söylüyorsa çalışmaz" der, üçüncüsü "Yüzük sende değil mi?" diye olumsuzla kurtarmaya çalışır ve çöker; hangi sorunun çalıştığı her yorumda yeniden tartılır.
3. **C3 Kare halı.** İki katlı tuzak: "dört kenar eşit" ve ondan da sinsi "köşegenden katla". Usta izleyici "çapraz ölçme"yi tanır, sıradan izleyici iki kez yanılır. Açık sayılabilecek S7.
   *Neden yorumda tartışma çıkar:* Katlama yöntemlerinin hangisinin kareyi kanıtladığı (köşegenden mi, ortadan mı, ikisi birden mi) sezgiyle değil şekil çizerek çözülür; inşaat ustaları ile "kâğıdın köşesi" diyenler aynı yorum dizisinde karşılaşır.
4. **C4 İkiye bir pide.** Herkesin bildiği "biri keser öbürü seçer" tek bir şartla çöküyor; kurtaran fikir (üçe kes, iki seç) kısa ve iki yönlü (kim keserse kessin).
   *Neden yorumda tartışma çıkar:* "Önce yarı yarıya, sonra Necmi kendi yarısının üçte birini versin" yanlışı doğru gibi görünür ve neden çöktüğünü göstermek bir yorum dizisi ister; ayrıca "Defne mi kesmeli Necmi mi" sorusunun iki doğru cevabı vardır.
5. **C5 Kitapçık türü.** ÖSYM'nin A ve B kitapçığı herkesin anısı; iki çöker, üç de çöker, dört tutar. Kolay ama temiz.
   *Neden yorumda tartışma çıkar:* "Üç yeter" diyenler desen çizip yorumda paylaşır, başkası onların desenindeki çapraz çakışmayı gösterir; "sekiz komşu var, sekiz tür" diyenle "dört yeter" diyen arasında dört masalık kare fikri elden ele geçer.

**Hemen arkasında:** C6 Necmi'nin sürprizi (A1'in aynası; ikisi "Kerem'in başı 1 ve 2" olarak iki hafta arayla güçlü bir çift olur), A1 yeniden kurgu (kurgu açıkları kapandı, bilinirlik sınırda).

**Alt sıra:** C7 ilk imza (tarihî gerçek ama "saat 12'deki imza" itirazı), C8 hesap (062 ailesi, kolay), C9 sayışma (kapılar zayıf), C10 bayram zarfları (bilinir).

**Avukata özel notlar:** C2'de dürüstlerin yüzüğün yerini bilip bilmemesi (protokol tercihi), C6'da "şimdi, burada" şartının zayıflığı, C7'de çemberin yönü, C5'in 039 ile imge yakınlığı.

## Eleme sonucu (28 Kas 2026)

Avukat `aday_havuzu_acik2_2026-11-28_avukat.md`, bilinirlik `aday_havuzu_acik2_2026-11-28_bilinirlik.md`, kör panel metinleri `kor_panel_acik2_2026-11-28.md` (sonnet, haiku, opus).

| Aday | Avukat | Bilinirlik | Kör panel (zorluk / güzellik) | Karar |
|---|---|---|---|---|
| C2 Yüzük kimde | 33 | sınırda | 5, 8, 3 / 8, 8, 6. Üç çözücü üç farklı geçerli soru buldu ("Hikmet'te mi?", "bugün pazartesi mi?", "solundakinde yüzük var mı?"); biri doğru soruya yanlış gerekçeyle vardı | **Üretim: 089.** En çok tartışma çıkaracak aday. A1 Kerem'in başı ile en az 5 bölüm ara. |
| C4 İkiye bir pide | 35 | geçer | 6, 6, 4 / 7, 7, 6. İki çözücü "Necmi keser, Defne iki seçer", biri ters rolü buldu; ikisi de doğru | **Üretim: 090.** C1 ve A3 aynı "kes-seç" tabanı: en az 10 bölüm sonra, en fazla biri. |
| C5 Kitapçık türü | 37 | geçer | 3, 5, 4 / 5, 7, 6; ilk tepki dağınık (4, 2, 3); ikisi "şah grafiği boyama" diye tanıdı | Bekler (sağlam ama kostümlü klasik hissi). |
| C3 Kare halı | 34 | geçer | 3, 4, 3 / 6, 5, 4; "her duvarcı bilir" | Elendi (kolay, çürütme cevabı veriyor). |
| C1 Ortak makine | 32 | geçer | panele girmedi | Bekler (090'dan ≥ 10 bölüm sonra). |
| A1 Kerem'in başı (lokum) | 27 | sınırda | panele girmedi | Bekler (yeni açıklar: lokum pudrası, sabah işaretleri). |
| C7 İlk imza | 24 | geçer | — | Elendi. |

**Yanıt hazırlığı için:** C4'te "önce yarı yarıya böl, sonra Necmi kendi yarısını üçe kessin, son seçimi Defne yapsın" yolu da geçerlidir; yorumda yanlış denmez. C2'de "solundakinde yüzük var mı?" gibi komşu soruları da geçerlidir (tek "hayır" diyenin sağındaki yüzüğü tutar).
