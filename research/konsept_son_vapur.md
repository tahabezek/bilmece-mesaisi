# Bağımsız konsept: "Son Vapur" (16 Kas 2026)

Kullanıcı, Bilmece Mesaisi evreninden ve bu konuşmadaki fikirlerden tamamen bağımsız bir konsept istedi. Bu belge o konsepti tanımlıyor.

## Konsept

**Dünya:** Karaköy–Kadıköy arasındaki gece yarısı son vapuru. Yolculuk 20 dakika sürüyor. Martılar, simit, çay, Haydarpaşa'nın ışıkları.

**Kadro:**
- **Kaptan Rıza:** Altmışlarında, yorgun, iddiacı. Her gece bir bahse girer.
- **Simitçi Lâl:** On dokuz yaşında, hızlı düşünür, çözen o.
- **Çaycı Bora:** On iki yaşında, çırak. Konuşmaz, yalnız tepsiyle iletişir.
- **Uykucu yolcu:** Her bölümde başka bir köşede uyur, süren espri o.

**Biçim: "Önce cevap gelir".** Normal bilmece kalıbının tersi.
- **0,0 sn:** Ekranda kocaman cevap durur, örneğin "CEVAP: ÜÇ KEZ". Kare 0 aynı zamanda kapaktır.
- **Kurulum:** Hikâye vapurda oynar. İzleyici cevabı bildiği hâlde "Nasıl olur da bu olur?" diye izler. Merak boşluğu, bilmece sorulana kadar kapanmaz.
- **Soru:** Kaptan bahse girer ve soruyu sorar.
- **10 sn:** "NEDEN?" sayacı.
- **Çözüm:** Lâl'in açıklaması. Cevap zaten bilindiği için açıklama saf bir "aha" anıdır.

**Neden çalışır:**
- Kanca, imkânsız görünen bir iddiadır ve ilk kareye yazılıdır.
- İzleyicinin bilmeceyi sorudan sonra bırakıp gitme sorunu tersine döner: cevap elinde olduğu için "nedeni" kalmak için tek sebeptir.
- Biçim tüm bilmecelerde tekrar eder, bu da markayı kurar: her bölüm "CEVAP: …" kapağıyla açılır.

**Görsel dil:**
- Gece laciverdi yerine koyu petrol ve kehribar fener ışığı.
- Vapurun sürekli hafif yalpası. Bu, karakterler değil, kameranın tek döngüsüdür.
- İskele ışıkları, martı siluetleri.
- Her bölüm bir iskeleden diğerine geçer; yön soldan sağa (Karaköy → Kadıköy).

---

## Örnek bilmece 1 · Uykucu yolcu
- **Kapak:** `CEVAP: ÜÇ KEZ`
- **Soru:** Bir yolcu 07.20'de Karaköy'de vapura bindi ve iki kol saatini ayarladı. Saatlerden biri saatte 1 dakika ileri gider, öbürü saatte 1 dakika geri kalır. Kadıköy'de indiğinde biri 08.21'i, öbürü 08.19'u gösteriyordu. Yolculuk 20 dakika sürüyor. Vapur kaç kez karşıya geçti?
- **Cevap:** Üç kez. İki saatin ortalaması gerçek saati verir: 08.20. Yani bir saat geçmiş. 20 dakikalık yolculuktan üç tane: yolcu uyumuş, vapur Karaköy–Kadıköy–Karaköy–Kadıköy gitmiş. Tek sayıda geçiş yaptığı için Kadıköy'de inmiş.
- **Kanıt:** Bir saatte ileri giden saat +1, geri kalan −1 dakika sapar. 08.21 ve 08.19, 08.20'den ±1 uzaktır. Geçen süre 60 dakika, 60 ÷ 20 = 3.

## Örnek bilmece 2 · Tanıdık sayısı
- **Kapak:** `CEVAP: KESİN VAR`
- **Soru:** Son vapurda 30 yolcu var. Kaptan bahse giriyor: "Bu vapurda vapurdaki tanıdığının sayısı aynı olan iki yolcu yoktur." Lâl saymadan bahsi kazanıyor. Nasıl?
- **Cevap:** Bir yolcunun vapurdaki tanıdığı 0 ile 29 arasında olabilir. Ama 0 ile 29 aynı vapurda birlikte olamaz: 29 tanıdığı olan herkesi tanır, o zaman 0 tanıdıklı kimse kalmaz. Geriye 29 olası sayı kalır, yolcu ise 30 kişidir. İki kişi aynı sayıda olmak zorundadır.
- **Kanıt:** Güvercin yuvası ilkesi. Ya {0…28} ya da {1…29} kullanılabilir; her durumda 29 sayı 30 kişiye dağıtılır.

## Örnek bilmece 3 · İskele lambaları
- **Kapak:** `CEVAP: ASLA`
- **Soru:** Eski iskelede 5 lamba var, hepsi sönük. Kural şu: her gelen vapurun kaptanı tam iki lambanın düğmesine basar, yanıyorsa söner, sönükse yanar. Lâl yılbaşı gecesi beş lambanın hepsinin yanmasını istiyor. Kaç vapur gelmesi gerekir?
- **Cevap:** Asla yanmaz. Her vapur yanan lamba sayısını ya 2 artırır, ya 2 azaltır ya da değiştirmez. Sayı 0'dan başladığı için hep çift kalır. 5 ise tek sayıdır.
- **Kanıt:** Bütün durumlar programla denendi; 5 lambanın hepsinin yandığı duruma hiçbir yoldan ulaşılmıyor. Karşılaştırma: kural "tam üç lamba" olsaydı üç vapurda olurdu. Bu, bölümün bonus sorusu olabilir.

---

## Üretim notu
Bilmece Mesaisi'nin motoru (2B çizgi, `hikaye.js`, `mekan.js`) aynen kullanılabilir. Yeni olanlar: kadro kartları (Rıza, Lâl, Bora), vapur mekânı (güverte, iskele, deniz döngüsü) ve "CEVAP:" kapak şablonu. Ayrı bir hesap olarak açılabilir ya da Bilmece Mesaisi'nde "Son Vapur" adıyla dönemlik bir seri olabilir.
