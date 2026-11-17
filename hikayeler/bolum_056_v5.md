# 056 · Necmi'nin iki annesi (v5 storyboard, 2026-11-17)

Kaynak: `hikayeler/bolum_045-057.md` § 056. Sahne: `engine/b056.js`. Bölüm dosyası: `bolumler/056-iki-anne.json`. Yayın sırası 39 (rozet "BİLMECE #39"). Sayaç 10 sn (`cdSure: 10`). Mekanizma: zaman aralığı.

- **Logline:** Hikmet, Necmi'nin kaynanasının ona küs olduğunu ve sebebin bir otobüs olduğunu söyler. Necmi pazar günleri durağa rastgele gelir, ilk gelen otobüse biner; iki hat da tam 10 dakikada bir geçer. Yine de on pazarın dokuzunda annesine, Kadıköy'e gider. Durak tabelası cevabı fısıldar; cevapta iki otobüs arka arkaya geçer, direkteki saat 10 dakikalık bir daireye dönüşür: 1 dilim mavi, 9 dilim turuncu. Necmi'nin 10 pazarı daireye düşer: 9'u turuncuya, 1'i maviye.
- **Akılda kalacak tek şey:** Üsküdar otobüsü Kadıköy otobüsünden hep 1 dakika sonra geçer. Üsküdar'a binmek için o tek dakikada gelmek gerekir; kalan 9 dakikada önce Kadıköy otobüsü gelir.
- **Kart:** `İki otobüs de 10 dakikada bir geçer.` (37) / `Necmi neden hep Kadıköy'e gidiyor?` (34)
- **Şartlar (değişmez):** Annesi Kadıköy'de, kaynanası Üsküdar'da oturur. Necmi durağa rastgele bir saatte gelir, ilk gelen otobüse biner. Kadıköy otobüsü :00, :10, :20 …; Üsküdar otobüsü :01, :11, :21 … geçer (ikisi de tam 10 dakikada bir). Necmi on pazarın dokuzunda Kadıköy'e gider.
- **Cevap (değişmez):** Üsküdar otobüsü Kadıköy otobüsünden hep 1 dakika sonra gelir; 10 dakikanın 1'i Üsküdar'a, 9'u Kadıköy'e çıkar.
- **Kodda denetim:** `PAZAR` sabit listesi (10 varış saati). Modül yüklenirken `denetle()`: `ilkOtobus()` her varış için ilk gelen otobüsü tarifeden hesaplar; 9 Kadıköy + 1 Üsküdar olmalı, her varışın dilimi (dakika mod 10 ∈ (0, 1] → Üsküdar) otobüsle tutmalı, 6000 noktalık taramada Üsküdar payı %10 olmalı. Pervazdaki kutular ve daireye düşen noktalar aynı listeden ve aynı hesaptan çizilir.
- **Mekân:** İstanbul sokağında otobüs durağı (önden). Arkada apartmanlar, önde iki şeritli yol. Sığınağın üstünde iki satırlık durak tabelası (KADIKÖY turuncu bant + `:00 :10 :20 :30 :40 :50`; ÜSKÜDAR mavi bant + `:01 :11 :21 :31 :41 :51`; rakamlar dünyada 44 px, sayaçta ekranda 44 px). Sağda saatli direk. Soldan sağa Necmi (x 200, elinde ipli baklava kutusu), Defne (x 520), Hikmet (x 800). Otobüsler öndeki şeritte soldan sağa geçer; Kadıköy turuncu, Üsküdar mavi. Kısa planlar: Kadıköy'de anne, Üsküdar'da kaynana kendi pencerelerinde (bölüme özgü kartlar `b056_anne`, `b056_kaynana`).
- **Kare 0:** Necmi kutusuyla soldan durağa yürür; Defne ağzı açık, Hikmet gülümsüyor; kart üstte, tabela ve saat görünür. İlk adım 0,1 sn'de.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–3,7 | Durak → Üsküdar penceresi → durak | Necmi kutuyla yürüyüp durağa gelir. "kaynanası"nda kısa plan: kaynana penceresinde eller belde, "küsmüş"te yüzünü çevirir. "sebebi"nde durağa dönüş; "otobüs"te turuncu Kadıköy otobüsü soldan girer, durakta yavaşlar (h1). | bulutlar, saniye kolu; perde, martı | 1,0x · 1,3x · 1,0x | 2 sert kesme (kısa plan) |
| 2 Düzenek | 4,0–11,0 | Durak | "rastgele"de direk saati hızla döner, "gelir"de Necmi omuz silker; "ilk gelen"de duran otobüsü gösterir, "biner"de otobüs kalkıp sağdan çıkar (h2a). "Kadıköy" ve "Üsküdar"da tabela bantları yanar, Hikmet tabelayı gösterir; "on dakikada"da saat 10 dakika ilerler (h2b). | bulutlar, güvercin | 1,0x → 1,18x → 1,04x (kesmesiz) | (yok) |
| 3 Soru | 11,3–15,6 | İki ev | "on pazarın"da her pazarın baklava kutusu kendi evine düşer: annenin pervazında 9, kaynananın pervazında 1. "annesine"de anne el sallar; "Neden?"de kaynana başını sallar (h2c). | perde, martı | 0,96x → 0,98x | sert kesme |
| 4 Yanlış deneme | 16,0–20,6 | Durak | "Kadıköy"de Defne KADIKÖY bandını gösterir (d2). "Yemin"de Necmi elini göğsüne koyar, Defne'nin gösteren elinin yanında ✗; "ilk gelene"de Necmi başını sallar (hd). | güvercin, saniye kolu | 1,15x | sert kesme |
| 5 Sayaç (10 sn) | 20,9–30,9 | Durak, tabela üstte | Kamera geri çekilir; tabela kartın hemen altında okunur. Defne parmağıyla önce KADIKÖY satırını, sonra ÜSKÜDAR satırını saat saat gezer, saate bakar, eli çenede düşünür, son 0,6 sn'de Necmi'ye bakar. Görüntü cevabı kurmaz. | saniye kolu, güvercin | 1,17x → 1,0x (kesmesiz) | (yok) |
| 6 İpucu | 30,5–33,8 | Necmi | "tabela"da kutulu eliyle tabelayı gösterir; "hiç bakmam"da yüzünü çevirip eliyle savuşturur (n1). | bulutlar, güvercin | 1,45x | bakış kesmesi |
| 7 Buldum! | 34,1–35,2 | Defne | Sıçrama, sağ el havada, ışınlar (d3). | bulutlar | 1,35x | "Buldum!" kesmesi |
| 8 Cevap | 35,2–45,1 | Durak, geniş | d4: direk saati 13.59'dan ilerler; "Kadıköy"de turuncu otobüs girip direkten geçer (14.00), "bir dakika sonra"da mavi otobüs arkasından geçer (14.01), "+1 dk". **Kahraman an (d5):** saat direkle birlikte yükselip 10 dakikalık daireye dönüşür; tepede turuncu, :01'de mavi otobüs işareti. "bir dakikalık"ta ibre 0→1 tarar, dilim mavi boyanır ("1 dk"); "Kadıköy'e dokuz"da ibre turu tamamlar, 9 dilim turuncu ("9 dk"). Ardından Necmi'nin 10 pazarı daireye düşer: 9'u turuncuya, 1'i maviye. | saniye kolu, güvercin | 1,0x, sonra yukarı kayar | sert kesme |
| 9 Espri | 45,1–48,7 | Hikmet | Daire, boyası ve noktalarıyla direkteki saate geri dönmüştür. Hikmet sol bileğindeki saati gösterir, "saatine"de sağ parmağıyla saate vurur (h4). | bulutlar | 1,32x | sert kesme |
| 10 Çağrı | 48,7–51,3 | Defne | Kamera Defne'ye kayar; Defne ulaşım kartını yüzünün yanına kaldırır, kameraya bakar (d6). | bulutlar | 1,34x → 1,4x (kesmesiz) | (yok) |
| 11 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

**Nasıl oynanıyor**
- **Düzenek:** Durak, tabela ve saat baştan ekranda. "İlk gelen" otobüs gerçek bir otobüs olarak durağa gelir.
- **Soru:** On pazar, iki pervazdaki baklava kutularıyla sayılır (9 ve 1). Kutular aynı varış listesinden hesaplanır.
- **Yanlış deneme:** Defne'nin "bilerek bekliyor" iddiasını Necmi'nin yemini ve ✗ çürütür.
- **İpucu:** Tabela sayaç boyunca kartın altında okunur; Necmi tabelaya bakmadığını söyler. Görüntüde "1 dakika sonra" yazısı yoktur; iki otobüs sayaçta ve öncesinde arka arkaya gösterilmez.
- **Cevap:** Otobüsler arka arkaya geçer, saat 1 dakika ilerler. Daire, dakikaların 9'unun Kadıköy'e, 1'inin Üsküdar'a çıktığını boyayarak gösterir.

| id | Konuşan | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Necmi'nin kaynanası ona küsmüş, sebebi bir otobüs! | 7 | 0,30–3,70 |
| h2a | Hikmet | Necmi durağa hep rastgele gelir, ilk gelen otobüse biner. | 9 | 4,00–7,55 |
| h2b | Hikmet | Kadıköy de Üsküdar da tam on dakikada bir geçiyor. | 9 | 7,85–11,00 |
| h2c | Hikmet | Ama on pazarın dokuzunda annesine, Kadıköy'e gidiyor. Neden? | 8 | 11,30–15,59 |
| d2 | Defne | Necmi bilerek Kadıköy otobüsünü bekliyor! | 5 | 16,04–18,09 |
| hd | Hikmet | Yemin ediyor, ilk gelene biniyor. | 5 | 18,49–20,63 |
| n1 | Necmi | Durakta tabela var ama ben hiç bakmam. | 7 | 31,23–33,78 |
| d3 | Defne | Buldum! Otobüsler arka arkaya geliyor! | 4 | 34,10–36,53 |
| d4 | Defne | Üsküdar otobüsü, Kadıköy otobüsünden hep bir dakika sonra geçiyor. | 9 | 36,88–40,32 |
| d5 | Defne | Üsküdar'a bir dakikalık şans kalıyor, Kadıköy'e dokuz dakikalık! | 8 | 40,67–43,80 |
| h4 | Hikmet | Necmi, kayınvalidene giderken saatine bak. | 5 | 45,30–48,14 |
| d6 | Defne | Bunu hep aynı yere giden arkadaşına gönder. | 7 | 48,84–51,16 |

**Süre:** 83 kelime ("Buldum!" öncesi 50). "Buldum!" 34,10 sn, toplam 53,56 sn. h4 öncesindeki ara 1,5 sn'dir; kahraman anın tam dairesi noktalarla birlikte ekranda kalır.

**Taslağa göre değişen replikler**
- h1: "Necmi'nin kayınvalidesi ona küs, …" → "Necmi'nin kaynanası ona küsmüş, …": whisper iki üretimde "kayınvalidesi"ni "kayınmalidesi", "ona küs"ü "Onaküz" duydu; "kaynanası ona küsmüş" temiz çıktı.
- h2a: "Necmi durağa rastgele gelir, …" → "Necmi durağa hep rastgele gelir, …": "durağa rastgele" kaynaşıp "durar askere" duyuldu; araya "hep" girince temizlendi (+1 kelime).

**Motor için**
- İki mekân aynı dünyada: `b056_durak` (x −600…1700) ve `b056_evler` (x 2500…4000).
- Saat tek durum fonksiyonundan okunur (`saatAt`): sahnedeki an, kahraman anda merkez, yarıçap, kadran dönüşümü, ibre ve boya açısı.
- Sayacın perdesi ve çemberi ekranın ortasını (y ≈ 660–1440) kapatır. Bu yüzden tabela sığınağın üstündedir: sayaç kadrajında (1,0x, cy 1080) ekranda y ≈ 478–638'de, kartın altında ve "SEN DE DÜŞÜN!"ün üstünde kalır.

**Sağlamlık:** Sağlam. Varış anı dakika olarak m ise ilk Üsküdar otobüsü ancak m mod 10 ∈ (0, 1] iken Kadıköy'den önce gelir. Rastgele varışta bu olasılık 1/10'dur.
