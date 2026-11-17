# 047 · Kerem'in bardakları (v5 storyboard, 2026-11-17)

Kaynak: `hikayeler/bolum_045-057.md` § 047, kanıt `research/ozgun_bilmeceler.md` Ö1. Sahne: `engine/b047.js`. Bölüm dosyası: `bolumler/047-bardaklar.json`. Yayın sırası 37 (rozet "BİLMECE #37").

- **Logline:** Kerem anahtarı arşivdeki 2×2 dolabın bir çekmecesine koyar; hiç konuşmaz. Çay ocağındaki 2×2 tepsiyi Hikmet dizmiştir. Kerem tek bardak çevirip çıkacak, Necmi tepsiye bakıp doğru çekmeceyi bulacak. Defne "denk gelen bardak" der; Hikmet "hangisinin çevrildiğini nereden bilecek?" diye itiraz eder. Necmi tepsiyi dolabın yanına koyar: "iki üstte, iki altta".
- **Akılda kalacak tek şey:** Tepsi dolabın haritasıdır. Tek bir bardak, iki sayının (sağ sütun, alt sıra) tek/çiftini istediğin gibi ayarlar.
- **Kart:** `Kerem tek bardak çevirebilir.` (29) / `Necmi anahtarı nasıl bulur?` (27)
- **Şartlar (değişmez):** dolap 2×2, tepsi 2×2; dizilişi Hikmet yapar; Kerem tam bir bardak çevirir; Kerem konuşmaz, yazmaz, işaret etmez; önceden anlaşabilirler.
- **Cevap (değişmez):** Sağ sütunda ters bardak sayısı tekse anahtar sağ sütunda, alt sırada tekse alt sırada. Sağ-alt bardak ikisini birden, sağ-üst yalnız sütunu, sol-alt yalnız sırayı, sol-üst hiçbirini değiştirir. 16 × 4 = 64 durumun hepsi build anında denetlenir (`b047.js` başı).
- **Sahnedeki örnek (kodda denetli):** Hikmet sağ-üstü ve sol-altı ters dizer. Anahtar sol-üstte. Defne yanlış denemede sol-üstü (anahtarın çekmecesine denk gelen) içip ters çevirir; tepsi bundan sonra hiç değişmez: üç ters, sağ-alt düz. Bu diziliş sağ-altı gösterir (sağ sütun 1 = TEK, alt sıra 1 = TEK). Kerem sağ-alt bardağı içip ters çevirir: sağ sütun 2 = ÇİFT, alt sıra 2 = ÇİFT → sol-üst. Sayaçta, ipucunda ve cevapta tepsi aynıdır (bağımsız gözün bulduğu tutarsızlık böyle giderildi).
- **Bardaklar:** ince belli çay bardağı, tabakta. Düz: içinde çay. Ters: tabanı yukarıda, koyu siluet. Dolu bardak ters çevrilmeden önce içilir (Defne yanlış denemede, Kerem cevapta); boş bardak ters döndükçe koyulaşır.
- **Mekânlar:** çay ocağı (ön tezgâh, karakterler arkasında; pencere, raf, demlik buharı, duvar saati) · arşiv (2×2 çekmeceli dolap, sehpa, klasör rafları, tavan lambasının ışık çokgeni, saat).
- **Kare 0:** Arşivde Kerem anahtarı sol-üst çekmecenin üstünde tutuyor, çekmece açık. Hikmet ortada, Defne solda şaşkın. Üstte kart. 0,3 sn'de anahtar çekmeceye iner, 0,62'de çekmece kapanır ("tok").

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–3,6 | Arşiv | Kerem anahtarı sol-üst çekmeceye koyar, kapatır (h1). Hikmet Kerem'i gösterir; "konuşmaz"da Kerem gülümser. | lamba ışığı, saat | 1,02x → 1,1x | (yok) |
| 2 Düzenek | 3,6–7,9 | Çay ocağı | Hikmet son bardağı (sol-alt, ters) yuvasına koyar ("dizdim"). Kamera Kerem'e kayar, Kerem başını sallar; "tek"te Hikmet bir parmak kaldırır (h2a). | demlik buharı, pencerede martı | 1,26x → 1,18x | sert kesme |
| 3 Soru | 8,1–11,7 | Arşiv | Necmi dört çekmeceyi parmağıyla tek tek gösterir, "Nasıl?"ta omuz silker (h2b). | lamba, saat | 1,22x | sert kesme |
| 4 Yanlış deneme | 12,1–20,1 | Çay ocağı | d2: Defne sol-üst bardağı (anahtarın çekmecesine denk gelen) içer, ters çevirir. hd: Hikmet üç ters bardağa dokunur, üçünün üstünde "?" çıkar; "karıştırdım"da eli tepsinin üstünde gezer, ✗. | buhar, martı | 1,2x | sert kesme |
| 5 Sayaç (10 sn) | 20,3–30,4 | Çay ocağı geniş → Defne | Hikmet tezgâhtaki kendi bardağına demlikten çay doldurur (tepsiye dokunmaz); Kerem başını sallar. Kamera Defne'ye kayar: Defne sessizce dört bardağa tek tek dokunur, eli çenede düşünür, sonunda sağa (arşive) bakar. | buhar, saat | 1,0x → 1,3x (kesmesiz) | sert kesme |
| 6 İpucu | 30,7–33,9 | Arşiv | Necmi tepsiyi dolabın yanındaki sehpaya bırakır, dolaba bakar; "üstte"de arka iki bardağı, "altta"da ön iki bardağı parmağıyla gösterir, bardaklar kabarır (n1). | lamba, saat | 1,16x → 1,2x | bakış kesmesi |
| 7 Buldum! | 34,2–34,9 | Çay ocağı, Defne | Sıçrama, ışınlar (d3). | buhar, martı | 1,35x | "Buldum!" kesmesi |
| 8 Cevap | 34,9–44,7 | Arşiv: tepsi ve dolap yan yana | **Kahraman an.** "haritası"nda tepsinin dört hücresi ve dolabın dört çekmecesi birlikte hardal çerçeve alır. d4: "Sağ sütunda"da sağ sütun çerçevesi ve üstünde sayaç (1 · TEK), "Alt sırada"da alt sıra çerçevesi ve yanında sayaç (1 · TEK); "altta"da şu an gösterilen sağ-alt çekmece hardal. d5: Kerem sağ-alt bardağı içer, ters çevirip yuvaya koyar ("ayarlar"); iki sayaç birden döner (2 · ÇİFT, 2 · ÇİFT), vurgu sol-üst çekmeceye geçer ve yeşil yanar. Necmi sağdan kadraja girer, çekmeceyi çeker, anahtarı alıp kaldırır. | lamba, saat | 1,1x | sert kesme |
| 9 Espri | 44,7–47,8 | Arşiv, klasör rafı | Hikmet Kerem'in bardağını doğrultup içine bakar: boş. "konuşkan"da yüzü düşer, Kerem omuz silker (h4). | lamba, saat | 1,3x → 1,34x | sert kesme |
| 10 Çağrı | 47,8–50,6 | Arşiv, Defne | Defne anahtarı kameraya kaldırır (d6). | lamba, saat | 1,36x → 1,4x | kesmesiz kayma |
| 11 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

**Nasıl oynanıyor**
- **Düzenek:** Anahtar çekmeceye girer, bardaklar tepsiye dizilir. Görüntü kodu söylemez.
- **Yanlış deneme:** Defne'nin çevirdiği bardak ters bardakların arasında kaybolur. Necmi hangisinin çevrildiğini bilemez: üç "?".
- **İpucu:** Necmi cevabı söylemez; tepsiyi dolabın yanına koyar, sıraları gösterir.
- **Cevap:** Sayaçlar ve tepsi–dolap eşleşmesi yalnız "Buldum!"dan sonra görünür. Kerem'in tek bardağı iki sayacı birden döndürür, doğru çekmece açılır.
- **Espri:** Kerem konuşmadan her şeyi anlattı; Hikmet'in elinde boş bir bardak kaldı.

| id | Konuşan | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Kerem anahtarın yerini biliyor ama hiç konuşmaz. | 7 | 0,30–3,34 |
| h2a | Hikmet | Dört bardağı tepsiye ben dizdim. Kerem tek bardak çevirip çıkacak. | 11 | 3,64–7,85 |
| h2b | Hikmet | Necmi tepsiye bakıp doğru çekmeceyi bulacak. Nasıl? | 7 | 8,15–11,72 |
| d2 | Defne | Kerem anahtarın çekmecesine denk gelen bardağı çevirir! | 7 | 12,17–14,90 |
| hd | Hikmet | Necmi hangisinin çevrildiğini nereden bilecek? Bardakları ben karıştırdım. | 8 | 15,30–20,07 |
| n1 | Necmi | Bu tepsi de dolap gibi: iki üstte, iki altta. | 9 | 30,67–33,90 |
| d3 | Defne | Buldum! Bu tepsi dolabın haritası! | 5 | 34,22–36,36 |
| d4 | Defne | Sağ sütunda ters bardak tekse anahtar sağda. Alt sırada tekse altta. | 12 | 36,71–40,95 |
| d5 | Defne | Kerem tek bardakla iki sayıyı istediği gibi ayarlar! | 8 | 41,30–44,04 |
| h4 | Hikmet | Kerem, sen bu kadar konuşkan mıydın? | 6 | 44,94–47,31 |
| d6 | Defne | Bunu az konuşup çok anlatan arkadaşına gönder. | 7 | 48,01–50,49 |

**Süre:** 87 kelime ("Buldum!" öncesi 49). "Buldum!" 34,22 sn, toplam 52,89 sn.

**Taslağa göre değişen replikler**
- h2a: "Tepsideki dört bardağı ben dizdim. Kerem yalnız bir bardak çevirip çıkacak." → "Dört bardağı tepsiye ben dizdim. Kerem tek bardak çevirip çıkacak.": satır T ile başlamasın, bütçe.
- h2b: "… dört çekmeceden doğrusunu bulacak." → "… doğru çekmeceyi bulacak.": bütçe (dört çekmece sahnede görünüyor).
- n1: "Tepsi de dolap gibi …" → "Bu tepsi de dolap gibi …": satır T ile başlamasın.
- d3: "Buldum! Tepsi dolabın haritası!" → "Buldum! Bu tepsi dolabın haritası!": iç cümle T ile başlamasın.
- d5: "… iki sayıyı da istediği gibi …" → "… iki sayıyı istediği gibi …": bütçe.
- whisper d3'te "Buldum!"u duymadı; kelime zamanları ses enerjisinden elle düzeltildi (`words.json`, Buldum 0,05–0,45).

**Motor için**
- Kod `coz`, Kerem'in seçimi `kerem`, 64 durum denetimi dosyanın başında.
- İçip ters çevirme tek fonksiyon: `icme(t, t0, kişi, poz, yuva)`; Defne ve Kerem aynı fonksiyonu kullanır, bardak yuvaya `t0 + 1,75`'te iner.
- Diziliş `DIZ0` (Hikmet), `DIZ` (Defne'den sonra); tepsi durumu `ocakTepsi(t)` ve `arsivTepsi(t)`; demlik `demlikAt(t)`; sayaçlar `sayaclar` (ekran uzayı, sabit yer, değişimde kâğıt gibi döner).
