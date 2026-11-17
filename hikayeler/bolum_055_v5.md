# 055 · Son Vapur 3: İskele lambaları (v5 storyboard, 2026-11-17)

Kaynak: `research/konsept_son_vapur.md` § Örnek bilmece 3, `hikayeler/bolum_045-057.md` § 053–055. Sahne: `engine/b055.js`. Bölüm dosyası: `bolumler/055-vapur-lambalar.json`. Yayın sırası 45 (rozet "BİLMECE #45" + "SON VAPUR" etiketi). Sayaç 10 sn (`cdSure: 10`), yazısı "NEDEN?". İpucu repliği yok (Bora konuşmaz), bu yüzden `countdown: "d3-0.3"`. Mekanizma: çift-tek değişmezi. Seri çekirdeği (kadro kartları, vapur manzarası, `svKart`, `svSayac`, ses eşlemesi) `engine/b053.js`'ten import edilir, değiştirilmez.

- **Biçim: önce cevap.** Kare 0'da büyük kapak `CEVAP: ASLA`. Kapak, Rıza soruyu sorarken ("vapur" kelimesi) bilmece kartına döner.
- **Logline:** Eski iskelede beş sönük lamba var; her gelen vapurun kaptanı tam iki düğmeye basar. Lâl yılbaşında beşinin de yanmasını ister, Kaptan Rıza bahse girer. Çaycı Bora bardakları tepsiye ikişer koyup alır; Lâl anlar: yanan lamba sayısı hep çifttir, beşe asla ulaşmaz.
- **Akılda kalacak tek şey:** İkişer ikişer değişen bir sayı, sıfırdan başladıysa hep çift kalır.
- **Kart:** `5 sönük lamba. Vapur başına 2 düğme.` (36) / `Beşi birden kaç vapurda yanar?` (30)
- **Şartlar (değişmez):** 5 lamba, hepsi sönük. Her vapurun kaptanı tam iki lambanın düğmesine basar; yanan söner, sönük yanar. Lâl yılbaşında beşinin de yanmasını istiyor. Kaç vapur gerekir?
- **Cevap (değişmez):** Asla. Bir vapur yanan sayısını 2 artırır, 2 azaltır ya da değiştirmez. 0'dan başladığı için hep çift kalır; 5 tektir. Bonus: kural "tam üç lamba" olsaydı 3 vapurda yanardı (h4).
- **Vapur listesi (sabit, `build` içinde `VAPUR`):** basış anı kelimeye kilitli; Rıza iki düğmeye iki eliyle aynı anda basar. Yanan sayısı: 0 → 2 (h2a) → 4 (d2) → 4 (hd: beşinci yanar, birinci söner) → 2 → 2 (sayaç) → 4 → 2 → 2 (d4: artırır, azaltır, değiştirmez) → 4 (d5). `build` her vapurdan sonra sayının çift olduğunu denetler; tek çıkarsa hata atar. Sonda ortadaki lamba sönük kalır.
- **Mekân:** Eski ahşap iskele, gece. Arkada seri manzarası (`svManzara`, koyu petrol gök, Kız Kulesi ve Haydarpaşa siluetleri, dalgalar, martılar). İskelenin uzak kenarında halat korkuluk ve beş fener direği. Lamba ışığı düz kehribar çokgendir, parlama yok. Rıza'nın önünde bel hizasında beş düğmeli kutu; yanında direk üstünde yanan sayısını gösteren sayaç kutusu ve Lâl'in astığı mercan "5" hedefi. Vapurlar uzakta soldan sağa geçer.
- **Yerleşim:** Rıza x 170 (düğme kutusunun arkasında), sayaç x 340, lambalar x 440–900, Lâl x 760 (tabla önünde), Bora x 940 (askılı tepsi), çay kasası x 1052.
- **Kare 0:** Beş lamba sönük, Rıza'nın elleri düğme kutusunda, Lâl şaşkın lambalara bakıyor, Bora tepsiyle bekliyor, sayaç "0". Kapak üstte. 0,3 sn'de Rıza'nın sağ eli lambaları göstermeye kalkar.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–3,6 | İskele, geniş | Rıza lambaları gösterir; "beş lamba"da tek rakam lambadan lambaya atlar (1…5). | dalgalar, martı | 0,97x → 1,0x | (yok) |
| 2 Kural | 3,6–10,1 | Düğme kutusu, lambalar yakın | Uzakta 1. vapur geçer; "basar"da Rıza iki düğmeye basar, 1. ve 2. lamba yanar, sayaç 0 → 2. h2b'de Rıza önce yanan, sonra sönük lambayı gösterir. | vapur, dalgalar | 1,2x → 1,23x | sert kesme |
| 3 Bahis, yanlış deneme, itiraz | 10,1–21,7 | İskele, geniş | "beşinin"de Lâl'in mercan "5"i sayacın üstüne asılır, Lâl gösterir. "Bahse"de Rıza elini uzatır, Lâl tabladan simit kaldırır (pay). Kart döner. d2: Lâl üç parmak gösterir; "ikişerden"de 2. vapur, 3. ve 4. lamba yanar (4). hd: kamera lambalara iter; "yakar"da 3. vapur, 5. lamba yanar ama 1. lamba söner (mercan halka), sayaç 4'te kalır, mercan 5 sarsılır + ✗. Simit tablaya döner. | vapurlar, dalgalar | 1,0x → 1,03x → 1,2x | sert kesme |
| 4 Sayaç (10 sn) | 21,7–31,7 | İskele, geniş → Bora | Lâl eli çenede düşünür, parmakla sayar; iki vapur daha geçer, Rıza basar (4 → 2 → 2). Son 4,7 sn: kamera Bora'ya kayar. Bora tepsiyi göğsüne kaldırır, kasadan iki bardak alıp tepsiye koyar (4), ikisini geri alır (2), yine iki koyar (4). Lâl bakar, şaşırır. | dalgalar, vapur | 0,97x → 1,3x | sert kesme |
| 5 Buldum! | 32,0–32,8 | Lâl | Sıçrama, ışınlar (d3). | dalgalar | 1,35x | "Buldum!" kesmesi |
| 6 Cevap | 32,8–41,5 | Lambalar ve sayaç | **Kahraman an.** Lâl sayacı gösterir. "artırır"da vapur geçer, iki sönük yanar: "+2", sayaç 4. "azaltır"da iki yanan söner: "−2", sayaç 2. "değiştirmez"de biri yanar, biri söner: "±0". d5: "daima"da bir vapur daha (4), "çift"te "HEP ÇİFT"; "Beş"te Lâl mercan 5'i gösterir, "tek"te 5 sarsılır + ✗. | vapurlar, dalgalar | 1,08x → 1,12x | sert kesme |
| 7 Espri | 41,5–47,3 | İskele, geniş | Lâl tabladan el fenerini çıkarıp sönük ortadaki lambanın altına tutar, yakar: beşinci ışık. Rıza iki elini kaldırır ("sayılmaz!"), "üç"te üç parmak gösterir (bonus). | dalgalar, martı | 1,0x → 1,05x | sert kesme |
| 8 Çağrı | 47,3–49,7 | Lâl | Lâl feneri yanık tutarak kameraya bakar (d6). | dalgalar | 1,3x → 1,34x | sert kesme |
| 9 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

| id | Konuşan (ses) | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Rıza (hikmet, −4 %, −12 Hz) | Bu eski iskelede beş lamba var, beşi de sönük. | 9 | 0,30–3,39 |
| h2a | Rıza (−6 %) | Her vapurun kaptanı gelince tam iki düğmeye basar. | 8 | 3,74–6,86 |
| h2b | Rıza | Yanan lamba söner, sönük lamba yanar. | 6 | 7,21–9,88 |
| h3 | Rıza | Lâl yılbaşında beşinin de yanmasını istiyor. Bahse girelim: kaç vapur gerekir? | 11 | 10,23–15,40 |
| d2 | Lâl (defne, +16 %, +3 Hz) | Üç vapur yeter, ikişerden altı düğme! | 6 | 15,80–17,92 |
| hd | Rıza | Üçüncü vapur beşinciyi yakar ama birinciyi söndürür. | 7 | 18,27–21,41 |
| d3 | Lâl | Buldum! Beşi asla yanmaz! | 4 | 32,01–33,97 |
| d4 | Lâl | Her vapur yanan sayıyı iki artırır, iki azaltır ya da değiştirmez. | 11 | 34,32–37,84 |
| d5 | Lâl (+12 %) | Sıfırdan başlayan sayı daima çift kalır. Beş ise tek! | 9 | 38,19–41,35 |
| h4 | Rıza | El feneri sayılmaz! Kural üç lamba olsa, üç vapurda yanardı. | 10 | 42,30–46,79 |
| d6 | Lâl | Bunu yılbaşı dileği tutan arkadaşına gönder. | 6 | 47,49–49,62 |

**Süre:** 87 kelime ("Buldum!" öncesi 47). "Buldum!" 32,01 sn, toplam yaklaşık 52 sn.

**Açıklama:** `Zeka sorusu: Eski iskelede 5 lamba var, hepsi sönük. …` (JSON `caption`).
