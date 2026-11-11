# Bölüm 032 · Kerem'in iki günü (v5 storyboard, 2026-11-12)

Kaynak: `hikayeler/bolum_029-034.md` § 032. Sahne: `engine/b032.js`. Bölüm dosyası: `bolumler/032-iki-gun.json`. Yayın sırası 22 (rozet "BİLMECE #22"), yayın 15 Kasım 12:30.

## 032 · Kerem'in iki günü

- **Logline:** Kerem dün yokuşu çıkıp depoya gitti, bugün aynı yoldan indi. Hikmet, yolda bir noktadan iki gün de aynı saatte geçtiğinden emindir. Defne iki günü üst üste koyar.
- **Akılda kalacak tek şey:** Dünkü Kerem ile bugünkü Kerem aynı yolda karşılıklı yürüse mutlaka karşılaşırlar.
- **Kart:** `Dün 9'dan 5'e çıktı, bugün indi.` (32) / `Aynı saatte aynı yerden geçti mi?` (33)
- **Şartlar (değişmez):** Aynı yol kullanılır. Dün 09.00'da ofisten çıktı, 17.00'de depoya vardı. Bugün 09.00'da depodan çıktı, 17.00'de ofise vardı. Yolda istediği kadar durur, hızı değişir. Kerem konuşmaz.
- **Cevap (değişmez):** İki gün üst üste konur. Dünkü Kerem aşağıdan çıkarken bugünkü Kerem yukarıdan iner. Aynı yolda karşılıklı yürüyen iki kişi mutlaka karşılaşır; karşılaştıkları yer ve saat aranan noktadır.
- **Kare 0:** Ofis kapısının önü. Şövalede yokuşun maketi duruyor: sol altta ofis, sağ üstte depo; yolda çaycı, çınar ve bank. Maketin iki ucunda hardal (dün) ve petrol (bugün) raptiye var. Hikmet kırmızı raptiyeyi maketin üstünde tutuyor ve 0,32 sn'de yola bastırıyor ("tak"). Sağda Kerem elinde çay bardağıyla sırıtıyor, solda Defne'nin gözleri açılmış.

## Mekân

İki set aynı dünyada:
- **Ofis kapısı (`b032_kapi`, x 0 civarı, tam boy):** ofis cephesi, kapı ve "OFİS" levhası, cephede 09:40'ı gösteren duvar saati. Kapının önünde şövale ve maket, tablasında işaret çubuğu yatıyor. x 780'den sonra yokuş başlıyor (eğim 0,22); arkada taş duvar, çimenli yamaç ve bayrak.
- **Yokuş (`b032_yokus`, x 4000'den başlar, karakterler BOY × 0,5):** yandan görülen yol, ofis sahanlığından (y 1170) depo sahanlığına (y 850) çıkıyor (eğim ≈ 23°). Yolun üstünde sırasıyla çaycı tezgâhı (semaver), çınar ve bank var. Sol üst köşede analog saat ve dijital hap duruyor; kurulumda hap "DÜN 09:00" (hardal) ya da "BUGÜN 09:00" (petrol), cevapta yalnız saati gösteriyor.

**Yokuşta yürüyüş:** `yuru()` pozu `ayakla()` ile eğime oturur. Yokuş aşağıdaki ayak pozunu ve salınım payını korur. Yokuş yukarıdaki ayak iki kemikli ters kinematikle yola kadar bükülür, ardından gövde referans ayak yolda kalacak biçimde kaydırılır. Gövde yukarı çıkarken öne (≈ 6°), inerken hafif arkaya (≈ 3°) eğilir. Yol bandı 52 px kalınlığındadır ve ayaklar bandın ortasına basar.

## Vuruş tablosu (ölçülen sürelerle)

| # | sn | Mekân | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme / taşınan |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–4,3 | Ofis kapısı | 0,32 sn: Hikmet kırmızı raptiyeyi bastırır ("tak"). "Kerem"de sağ eliyle Kerem'i gösterir. "noktasından"da raptiyeye dokunur. "iki gün de"de Kerem başını sallar. | martılar, bulutlar · çay buharı · bayrak | 1,0x → 1,04x | (yok) |
| 2 Düzenek (dün) | 4,3–8,9 | Yokuş, geniş | Zaman atlaması, kadraj sabit. Saat "DÜN 09:00"dan ilerler. Kerem ofis kapısından çıkar, çaycıda durur, tezgâhtan bardağı alıp göğsünde tutar ve geri koyar ("keyfince oyalandı"). Sonra depoya kadar tırmanır ("beşte depoya vardı", 17:00). | güneşin yayı ve bulutlar; semaver buharı, çınar yaprakları | 0,96x → 0,97x | sert kesme (ilk kadraj değişimi 4,3 sn) |
| 2b Gece atlaması | 8,7–9,1 | Yokuş | Saat 17:00'den ertesi gün 09:00'a döner; gök kararıp aydınlanır. Hap "BUGÜN"e döner, Kerem depo kapısında arkasını döner. | gök ışığı | sabit | (yok) |
| 2c Düzenek (bugün) | 9,1–12,6 | Yokuş | Kerem iner, bankta oturur ("aynı yoldan indi"), kalkar ve ofis kapısına iner ("beşte ofise vardı", 17:00). | güneş, semaver, yapraklar | sabit | (yok) |
| 2d Soru | 12,6–13,8 | Ofis kapısı | "Neden eminim?": Hikmet kırmızı raptiyeye dokunur. Defne tabladaki işaret çubuğunu alır. | martılar · bayrak | Hikmet 1,2x | sert kesme |
| 3 Bahis | (yok) | | Bütçe şartlara harcandı (030, 031 gibi). | | | |
| 4 Yanlış deneme | 14,3–19,5 | Maket | d2: Defne çubuğun ucuyla hardal raptiyeyi çınara kadar iter ("DÜN 11:00"), sonra petrol raptiyeyi yukarıdan çınara indirir ("BUGÜN 15:00"). Saatler tutmaz: ✗. hd: Hikmet petrol raptiyeyi eliyle aşağı yukarı sürer ("Ne hızla yürürse yürüsün"), "kesin"de kırmızı raptiyeye dokunur ("tok"). | martılar · bayrak | 1,2x → 1,22x → 1,24x | kesmesiz yaklaşma |
| 5 Sayaç | 19,6–25,9 | Ofis kapısı | Defne sessizce raptiyeleri yeniden dener: hardalı banka, petrolü çaycıya iter. Hikmet eli belinde bekler. Son 1,5 sn'de Necmi yokuştan iner, yokuşun başında durur; ikisi de ona bakar. | martılar · bayrak | 1,0x → 1,03x → 1,1x | sert kesme |
| 6 İpucu | 25,1–30,0 | Ofis kapısı → yokuş, akşam | Necmi "Geçen hafta" der, parmağıyla yokuşu gösterir; saat rozeti 0,4 sn geri sarar. Sert kesmeyle geri dönüşe geçilir ("GEÇEN HAFTA" hapı, 1,9 sn). Akşam ışığında Necmi yukarıdan iner, kasketli bekçi aşağıdan çıkar. "burun buruna"da ikisi yüz yüze durup irkilir, sonra güler. Necmi'nin ağzı oynamaz, balon kuyruksuzdur. | güneş batıyor, bulutlar; semaver, yapraklar | 1,3x, sağdan sola 60 px kayma | geri dönüş kesmesi |
| 7 Buldum! | 30,0–32,3 | Ofis kapısı | Defne sıçrar, işaret çubuğunu havaya kaldırır; başının çevresinde 9 ışın. | martılar · bayrak | Defne 1,35x | "Buldum!" kesmesi (kısa plan) |
| 8 Cevap | 32,3–40,8 | Yokuş, geniş | **Kahraman an.** Ofis kapısında yarı saydam, hardal tonlu dünkü Kerem, depo kapısında bugünkü Kerem durur. Saat 09:00. "Kerem"de (d4:1) ikisi aynı anda yola çıkar ve saat ilerler. Dünkü Kerem çaycıda durup bardağı alır. Bugünkü Kerem bankta oturur. İkisi yeniden yürür ve "karşılaşırlar"da çınarın altında burun buruna gelir. Saat 13:40'ta durur ve hapı kabarır. d5: yoldaki buluşma noktasına halka konur, oradan kesik çizgi çıkar. Çizginin ucunda "DÜN 13:40" (hardal) ve "BUGÜN 13:40" (petrol) etiketleri durur; "aynı" ve "saatte"de nabız atarlar. | güneşin yayı; semaver, yapraklar | 0,96x → 1,03x (buluşmaya) | sert kesme |
| 9 Espri | 40,8–43,7 | Ofis kapısı | Kerem elinde çayla yokuştan iner. "dakik"te Hikmet cephedeki 09:40'ı gösteren saati işaret eder, Kerem omuz silker. | martılar · çay buharı · bayrak | 0,96x → 0,99x | sert kesme |
| 10 Çağrı | 43,7–46,0 | aynı | Defne kameraya döner, parmağını kaldırır (d6). | martılar · bayrak | Defne 1,4x → 1,44x | kesmesiz yaklaşma |
| 11 Takip kartı | 46,0–48,3 | | `endCard` | | | sert kesme |

Sert kesme sayısı 7 (yokuş, soru, sayaç, geri dönüş, Buldum, cevap, espri).

**Nasıl oynanıyor**
- **Şartlar:** Dün ve bugün, gerçek yolda ve saatle hızlandırılmış oynanır. Oyalanma da görünür: dün çaycıda çay, bugün bankta oturma.
- **Yanlış deneme:** Defne'nin "hızına bağlı" fikri maketteki iki raptiyeyle denenir. Raptiyeler çınara farklı saatlerde varır, ✗ alır. Hikmet raptiyeyi rastgele hızlarla sürer, sonra kendi kırmızı raptiyesine dokunur: yer kesin var.
- **Sayaç:** Defne raptiyelerle sessizce yeniden dener, Necmi yokuştan iner; sahne durmaz.
- **İpucu:** Necmi cevabı söylemez. Geri dönüşte iki kişi aynı yolda karşılıklı yürür ve burun buruna gelir.
- **Cevap:** Şema yok. Aynı yol ve aynı iki durak üst üste oynanır. Dünkü Kerem'in hayaleti ile bugünkü Kerem aynı anda yürür, karşılaştıkları anda saat durur. İki etiket aynı noktaya bağlıdır.
- **Espri:** Bu kadar dakik olan Kerem işe 09:40'ta gelir.

| id | Konuşan | Replik | Kelime | sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Kerem yokuşun bir noktasından iki gün de aynı saatte geçti! | 10 | 0,30–4,06 |
| h2a | Hikmet | Dün dokuzda ofisten çıktı, keyfince oyalandı, beşte depoya vardı. | 9 | 4,36–8,83 |
| h2b | Hikmet | Bugün dokuzda aynı yoldan indi, beşte ofise vardı. Neden eminim? | 10 | 9,13–13,77 |
| d2 | Defne | Bence şans eseri, hızına bağlı! | 5 | 14,27–16,17 |
| hd | Hikmet | Ne hızla yürürse yürüsün, o yer kesin var. | 8 | 16,62–19,49 |
| n1 | Necmi | Geçen hafta ben inerken bekçi çıkıyordu. Yolda burun buruna geldik! | 10 | 25,09–29,76 |
| d3 | Defne | Buldum! İki günü üst üste koyalım! | 6 | 30,08–32,29 |
| d4 | Defne | Dünkü Kerem çıksın, bugünkü Kerem aynı anda insin. Mutlaka karşılaşırlar! | 10 | 32,64–36,93 |
| d5 | Defne | Karşılaştıkları yerden iki gün de aynı saatte geçti. | 8 | 37,28–40,11 |
| h4 | Hikmet | Keşke işe de bu kadar dakik gelse. | 7 | 41,01–43,24 |
| d6 | Defne | Bunu yokuşta oturan arkadaşına gönder. | 5 | 43,84–45,90 |

**Süre:** 88 kelime ("Buldum!" öncesi 52). "Buldum!" 30,08 sn, toplam 48,30 sn.

**Taslağa göre değişen replikler**
- h1: "Kerem bu yolda bir yerden…" → "Kerem yokuşun bir noktasından…" (mekân ilk cümlede kurulur; 10 kelime).
- h2a: "Dün dokuzda yokuşu çıkmaya başladı…" → "Dün dokuzda ofisten çıktı, keyfince oyalandı, beşte depoya vardı." (bütçe; varış yeri söylenir).
- h2b: "Nereden bu kadar eminim?" → "Neden eminim?". Whisper "Nereden"i "Nelerden" duydu; bütçe de daraldı.
- d2: "Emin olamazsınız, hızına bağlı!" → "Bence şans eseri, hızına bağlı!" (tuzak cümlesi doğrudan söylenir).
- hd: "Hızı ne olursa olsun…" → "Ne hızla yürürse yürüsün, o yer kesin var." (whisper "Hızı"yı "Hızlı" duydu).
- n1: "Geçen hafta ben yukarıdan indim, bekçi aşağıdan çıktı." → "Geçen hafta ben inerken bekçi çıkıyordu." (Necmi bütçesi ≤ 10).
- d3: "İki günü üst üste koyun!" → "koyalım!" ("koyun" vurgu kayması riski).
- d4: "…iniyor sayın." → "Dünkü Kerem çıksın, bugünkü Kerem aynı anda insin. Mutlaka karşılaşırlar!" ("sayın" hitap gibi okunabilir).
- d5 eklendi: "Karşılaştıkları yerden iki gün de aynı saatte geçti." (cevabın son halkası).
- h4: "Keşke işe gelirken de bu kadar dakik olsa." → "Keşke işe de bu kadar dakik gelse." (bütçe).
- d6: aynen.

**Motor için**
- Mekânlar `b032_kapi`, `b032_yokus`. Nesneler: `sovale` (yol maketi), `raptiye` (kırmızı, hardal, petrol), `cubuk` (işaret çubuğu; tutan el `elUcu` ile omuz çemberi ve çubuk boyu çemberinin kesişiminden bulunur), `cay`, `caySatici`, `cinar`, `bank`, `kasket`.
- Bekçi, kadro kartlarına dokunmadan bölüm içinde tanımlanan `b032_bekci` kartıdır (Hikmet oranları, yeşil üniforma yeleği, kalın bıyık; kasket çizimle eklenir).
- Dünkü Kerem ayrı bir tuvalde çizilir, hardal tonla boyanır ve tek parça olarak %80 saydamlıkla basılır; uzuvlar birbirinin içinden görünmez.
- Yokuş saati `iz()` ile kurulur ve kelime çapalarına bağlıdır (kurulumda 9 → 17 → 33 → 41, cevapta 9 → 13:40).
- Etiketler (aynı anda en çok 2): "DÜN 11:00" + "BUGÜN 15:00" + ✗ (d2), "DÜN 13:40" + "BUGÜN 13:40" (d5). Köşedeki saat sahnenin nesnesidir.
- Ses: raptiye `pop`, dokunma `knock`, raptiye sürme `zip`, ✗ `buzz`, gece atlaması ve geri dönüş `swish`, bank `knock`, burun buruna `knock`, buluşma `pop`, halka `ding`, etiketler `pop`, omuz silkme `womp`.

**Sağlamlık:** Sağlam (ara değer teoremi). Kerem'in yürüyüşü süreklidir, şartlarda ışınlanma yoktur. Dünkü Kerem'in konumu aşağıdan yukarıya, bugünkü Kerem'in konumu yukarıdan aşağıya sürekli değişir. Aradaki fark işaret değiştirdiği için bir anda sıfır olur.
