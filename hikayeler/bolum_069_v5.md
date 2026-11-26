# 069 · Adım yarışması (v5 storyboard, cevapsız tasarım, 2026-11-22)

Kaynak: `hikayeler/bolum_064-069.md` § 069. Sahne: `engine/b069.js`. Bölüm dosyası: `bolumler/069-adim.json` (`cevapsizTasarim: true`). Yayın sırası 58 (rozet "BİLMECE #58"). Sayaç 10 sn, `countdown: "n1-0.3"`. Mekanizma: bir sıra ile bir sütun tek bir koltukta kesişir; o koltuktaki kişi iki karşılaştırmayı birbirine bağlar.

- **Logline:** Eğitim salonunda on iki kişi üç sıra, dört sütun oturur. Herkesin bugünkü adım sayısı farklıdır; sayıları kimse görmez. Her sıranın en az adım atanı kalkar, aralarında en çok atan Defne'dir. Her sütunun en çok adım atanı kalkar, aralarında en az atan Necmi'dir. Hikmet sorar: Defne mi daha çok yürüdü, Necmi mi?
- **Akılda kalacak tek şey:** Bir sıra ile bir sütun tek bir koltukta buluşur.
- **Kart (26 Kas kısa kurgu):** `En çalışkan tembel mi çok yürüdü,` (33) / `en tembel şampiyon mu?` (22). h3 ile aynı cümle. (Eski kart: "Defne en azların en çoğu, Necmi en çokların en azı. Kim çok yürüdü?")

## 26 Kas 2026 kısa kurgu (usta ölçütü)
Usta editör: kurgu klasiğe bir şey katmıyor, "en azların en çoğu" bir nefeste söylenmiyor. Mantık, oturma düzeni ve sahneler aynı; değişen kelimeler. Sezgi çatışması dilde: her sıranın en az yürüyeni **tembel**, her sütunun en çok yürüyeni **şampiyon**; soru "en çalışkan tembel mi, en tembel şampiyon mu?". Kısa format: "Buldum!" öncesi 55 kelime, "Buldum!" 35,70 sn, kesilmiş film ≈ 37,9 sn.
- Kelime bütçesi için çıkanlar: "Adım yarışmasında", "On iki kişi oturuyor: üç sıra ve dört sütun" (düzen görüntüde; "üç tembel / dört şampiyon" sayıyı sözle de verir), "Oturun" (üçü sütun bantlarından önce Hikmet'in sözsüz avuç işaretiyle oturur), "ayağa".
- Düzen plânı ve h1b'deki tanım bantları çıktı: Hikmet'in plânından doğrudan telefon insertine kesilir. Sıra ve sütun bantları turlarda (h2a, h2b) aynen var.
- "Tembellerin…" satır başı T'si whisper'da "Zembellerin/Sembelerin" çıktı → "Üç tembelin…". h2b'de "kalksın" "kaksın" duyuldu → `tts` ünlemli.
- Hız: Hikmet satırları `+2%`, Necmi satırları `-4%` (070 ve 072'deki gibi), aralar 0,3–0,6 sn; sayaç 10 sn aynı, n1 aralığı 10,45; d3 öncesi okuma payı 1,1 sn.
- h3 altyazısı iki parçalı (`split h3: 6`): tek balonda "mu?" üçüncü satıra düşüyordu.
- Bağımsız göz: "İkimizi birden" Defne'nin yakın plânında, yanındaki figüranla söylenince "ikimiz" o ikisi sanılıyordu. Yakın plân "Bilinir. İkimizi" ile biter, "birden"de salona kesilir; Defne ile Necmi birbirine bakar, koltuk vurgusu yok. Tembeller sütun bantlarından önce oturur (otur1 = h2b − 0,32); dört şampiyon salonda 0,2 sn daha görünür (Necmi'nin yakın plânı "şampiyonun"da).
- Yayın sırası 58 (rozet "BİLMECE #58").
- **Oturma düzeni (değişmez; kodda tek sabit `ADIM`, kalkanlar ondan hesaplanır, belgeyle uyuşmazsa bölüm açılmaz):**

  | | sütun 1 | sütun 2 | sütun 3 | sütun 4 |
  |---|---|---|---|---|
  | sıra 3 (arka, ekranda üstte) | figüran 6 · 2 | figüran 7 · 12 | figüran 8 · 4 | figüran 9 · 6 |
  | sıra 2 (orta) | figüran 4 · 11 | figüran 5 · 1 | Kerem · 3 | **Necmi** · 8 |
  | sıra 1 (ön, ekranda altta) | **Defne** · 5 | figüran 1 · 9 | figüran 2 · 10 | figüran 3 · 7 |

  - Birinci tur (her sıranın en azı): (1,1) Defne, (2,2) figüran 5, (3,1) figüran 6.
  - İkinci tur (her sütunun en çoğu): (2,1) figüran 4, (3,2) figüran 7, (1,3) figüran 2, (2,4) Necmi.
  - Kesişim koltuğu (1,4) figüran 3'tür. Kerem (2,3)'te oturur ve hiçbir turda kalkmaz.
  - Sayılar yalnızca sıralamadır ve hiçbir karede çizilmez.
- **Cevap (arşiv, kesilir):** Necmi. Defne ≤ (1,4)'teki kişi ≤ Necmi.
- **Kadro:** Hikmet, Defne, Necmi, Kerem (`genc`, konuşmaz) ve dokuz figüran (`b069_f1 … f9`; kadro iskeletinden türetilir, hepsi aynı ölçekte ve göbeksiz, ayakkabıları koyu).
- **Mekân ve plânlar:**
  1. `b069_salon` (önden): üç basamaklı sıra, her sıranın önünde boydan boya bir masa; iki yanda merdiven. Hikmet solda, merdivende ayakta; sol elinde dosya, boynunda düdük. Herkesin elinde telefon, arkası kameraya dönük (üstünde iki ayak izi çıkartması). Duvarda saat, üstte iki pencere. Baş ekranda ≈ 120 px; on iki yüz ve Hikmet tek kadraja sığar.
  2. `b069_yakin` ikili yakın plân: konuşan kişi sıra arkadaşıyla (Defne + figüran 1, Kerem + Necmi). Kamera sıranın hizasına iner; arkada yalnız duvar ve pencere vardır. Baş ekranda ≈ 275–300 px. Kesişim koltuğu hiçbir yakın plâna girmez (kod bunu denetler).
  3. `b069_yakin` Hikmet'in tekli plânı: arkasında "ADIM YARIŞMASI" afişi (ekranda 49 px).
- **Sıra ve sütun:** "Sıra" denince üç sıra birden soldan sağa açılan krem bantla, "sütun" denince dört sütun birden yukarıdan aşağı inen krem bantla gösterilir (giriş 0,28 sn, çıkış 0,2 sn; tanımda 0,9'ar sn, turlarda kalkışa kadar 1,7–2 sn). Hikmet "sıra"da kolunu yatay süpürür, "sütun"da yukarıdan aşağı indirir. Etiket yok.
- **Kalkış:** Kalkan kişinin başı 76 px yükselir (0,4 sn, `ease.enter`; kişiler 70 ms arayla), telefonu başının yanına kalkar, arkasında krem bir ışık hücresi açılır (kalkan herkese aynı). Oturanlar en yakın kalkana bakar. "Benim" diyen telefonu göğsüne indirir, öbür elini avucu açık kaldırır.
- **Sızıntı yasağı:** Adım sayısı yok. Bantlar "Buldum!"dan önce hep üçü ya da dördü birden gelir (kod denetler). Kesişim koltuğundaki figüran sayaçta ve son plânda başka iki kişiyle aynı işi yapar (telefona bakar); ona bakış, bant, yakın plân yok. Necmi salon plânında konuşmaz (kuyruk önündeki koltuğun yüzünden geçerdi; kod yine de o kuyruğu kapatır). Sayaçta kalkıp birbirine bakan yalnızca Defne ile Necmi'dir: kendi koltukları seçilir, sıra ya da sütun değil. Figüranların boyu ve yapısı eşittir.
- **Kare 0:** Salon dolu; on iki kişi telefonuna bakıyor, yalnız Defne merakla Hikmet'e bakıyor. Hikmet düdüğü ağzında. 0,1 sn'de düdük (iki kısa ses), 0,13–0,5 sn'de başlar sırayla Hikmet'e döner; söz 0,5 sn'de başlar.

| # | ≈ sn | Plân | Ana eylem (nesneyle) | Döngüler | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–3,0 | Salon | Düdük; on iki kişi irkilir, başlar telefondan Hikmet'e döner. "Kimsenin sayısını görmeden"de herkes telefonuna bakıp onu göğsüne çeker (h1, ilk yarı). | duvar saati, martı | düdükte 0,6 sn'de 1,0x → 1,035x, sonra yavaş doğrusal | (yok) |
| 2 İddia | 3,0–5,6 | Hikmet | "Kimin çok yürüdüğünü bulacağız": işaret parmağını kaldırır; arkasında afiş (h1, ikinci yarı). | martı | 1,35x → 1,38x | sert kesme |
| 3 Düzen | 5,6–8,6 | Salon | "On iki kişi oturuyor": on iki telefon sırayla bir kalkıp iner. "Üç sıra": üç yatay bant. "Dört sütun": dört dikey bant (h1b, ilk cümle). | duvar saati, martı | 1,0x → 1,02x | sert kesme |
| 4 Telefon (insert) | 8,6–11,0 | Kerem + Necmi | "Herkesin adım sayısı farklı": Kerem, Necmi'nin telefonuna eğilir; Necmi telefonu öbür yanına çeker ve Kerem'e bakar; Kerem masum masum başka yana bakar. Ekranlar görünmez. | martı | 1,5x | sert kesme |
| 5 Birinci tur | 11,0–15,7 | Salon | "Her sıranın": üç yatay bant (kalkışa kadar, 1,7 sn). "Kalksın": üç kişi kalkar (pop ×3), telefonlarını birbirine uzatır. d1'in ilk yarısı salonda: üç kalkan görünür. | duvar saati, martı | 1,0x → 1,03x | sert kesme |
| 6 Defne | 15,7–17,6 | Defne + figüran 1 | "En çok adım atanı benim": Defne telefonu göğsüne indirir, elini kaldırır (d1, ikinci yarı). | martı | 1,35x | sert kesme |
| 7 İkinci tur | 17,6–23,2 | Salon | "Oturun": üçü oturur (knock). "Her sütunun": dört dikey bant (kalkışa kadar, 2 sn). "Kalksın": dört kişi kalkar (pop ×4), telefonlarını birbirine uzatır; salon 2,1 sn sözsüz görünür. | duvar saati, martı | 1,0x → 1,03x | sert kesme |
| 8 Necmi | 23,2–26,8 | Kerem + Necmi | n0'ın tamamı: Necmi ayakta, telefonu havada; "benim"de telefonu indirir, elini kaldırır; Kerem başını sallar. | martı | 1,35x | sert kesme |
| 9 Soru | 26,8–29,7 | Hikmet | "Defne mi" (parmak sağ aşağıyı gösterir), "Necmi mi" (sağ yukarıyı gösterir) (h3). | martı | 1,35x → 1,38x | sert kesme |
| 10 İtiraz | 29,7–31,9 | Kerem + Necmi | "Bence bu kadarla bilinemez": Necmi omuz silker (n0b). | martı | 1,5x | sert kesme |
| 11 Sayaç (10 sn) | 31,9–42,2 | Salon | İlk 3 sn'de Defne ile Necmi yerlerinde ayağa kalkıp birbirine bakar (ikisinin koltuğu bir kez daha seçilir), sonra oturur; Defne düşünür. Arka sırada iki kişi fısıldaşır, biri esner; önde biri su içer; biri saatine bakar; Hikmet dosyasına işaret koyar. Sayaç alt bantta, perde yok. | duvar saati, martı, kamera itmesi | 1,0x → 1,07x doğrusal itme | sert kesme |
| 12 İpucu | 42,2–45,6 | Defne + figüran 1 | "Bilinir": Defne başını sallar. "Tek bir koltuk": işaret parmağını kaldırır, kameraya bakar (n1). | martı | 1,5x → 1,53x | sert kesme |
| 13 Son plân | 45,6–47,4 | Salon | On iki koltuk yeniden görünür; Defne ile Necmi birbirine bakar. n1 altyazısı kesime kadar tam opak kalır (2,2 sn okuma payı). | duvar saati, martı | 1,0x → 1,01x | sert kesme |
| — Kesim | 47,43 | | `cevapsiz.mjs`: "Buldum!"dan 0,12 sn önce keser, takip kartını ekler. | | | |
| 14 Buldum (arşiv) | 47,5 | Defne + figüran 1 | sıçrama, ışınlar | | 1,35x | |
| 15 Cevap (arşiv) | 49,7–55,7 | Salon | Defne'nin sırası ve Necmi'nin sütunu bantlanır, kesişim koltuğuna halka gelir. | | 1,0x | |
| 16 Çağrı (arşiv) | 55,7–58,0 | Defne + figüran 1 | kameraya döner | | 1,35x | |

**Nasıl oynanıyor**
- **Düzenek:** On iki koltuk kare 0'dan itibaren aynı yerde durur. Salon plânı beş kez döner (kanca, düzen, iki tur, sayaç, son plân): izleyici koltukları ezberleyebilir.
- **Sıra / sütun:** Aynı bant dili iki kez kullanılır: önce tanım (h1b), sonra iş başında (h2a, h2b).
- **Sayaç:** Her saniye hareket var: doğrusal kamera itmesi, bakışlar ve küçük işler.
- **İpucu:** Defne koltuğun yerini söylemez; yalnızca "ikimizi birden ilgilendiren tek bir koltuk" der. Son plânda salon hiçbir vurgu olmadan durur.

| id | Konuşan | Replik | Kelime | sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Sayılara bakmadan kimin çok yürüdüğünü bulacağız. | 6 | 0,50–3,28 |
| h1b | Hikmet | Herkesin sayısı farklı. | 3 | 3,58–5,10 |
| h2a | Hikmet | Her sıranın en az yürüyeni kalksın. | 6 | 5,50–7,58 |
| d1 | Defne | Üç tembelin en çok yürüyeni benim. | 6 | 7,93–9,75 |
| h2b | Hikmet | Her sütunun en çok yürüyeni kalksın. | 6 | 10,15–12,35 |
| n0 | Necmi | Dört şampiyonun en az yürüyeni benim. | 6 | 12,95–15,19 |
| h3 | Hikmet | En çalışkan tembel mi çok yürüdü, en tembel şampiyon mu? | 10 | 15,49–19,02 |
| n0b | Necmi | Bence bu kadarla bilinemez. | 4 | 19,32–21,04 |
| n1 | Defne | Bilinir. İkimizi birden ilgilendiren tek bir koltuk var. | 8 | 31,49–34,60 |
| d3 | Defne | Buldum! Necmi daha çok yürüdü. (arşiv) | 5 | 35,70–37,72 |
| d4 | Defne | Benim sıramla Necmi'nin sütununun kesiştiği koltuğa bakın. O kişi benden çok, Necmi'den az yürüdü. (arşiv) | 14 | 38,07–43,30 |
| d6 | Defne | Bunu adımlarını sayan arkadaşına gönder. (arşiv) | 5 | 44,00–46,05 |

**Süre (26 Kas kısa kurgu):** "Buldum!" öncesi 55 kelime. "Buldum!" 35,70 sn; cevaplı arşiv 48,45 sn; kesilmiş film ≈ 37,9 sn. (Önceki kurgu: 75 kelime, "Buldum!" 47,55, kesilmiş ≈ 49,7 sn.)

**Şartların filmdeki yeri**
- 12 kişi, 3 sıra, 4 sütun: h1b + bantlar. Herkesin sayısı farklı: h1b. Sayıları kimse görmüyor: h1 + telefon inserti.
- Her sıranın en azı kalkar (3 kişi), en çoğu Defne: h2a, d1 + birinci tur. Herkes oturur: h2b "Oturun".
- Her sütunun en çoğu kalkar (4 kişi), en azı Necmi: h2b, n0 + ikinci tur.
- Soru: h3 ve kart. "Bilinemez" seçeneği: n0b.

**Taslağa göre değişenler (şartlar, sayılar, cevap aynı)**
- h1 "Ofiste adım yarışması var. On iki kişiyiz: üç sıra, dört sütun." → kanca ilk cümleye alındı ("kimsenin sayısını görmeden … bulacağız"); düzen cümlesi h1b'ye taşındı. "Sayıları görmedik" şartı böylece h1'de söyleniyor, h3 yalnız soruyu soruyor.
- h1b "üç sıra, dört sütun" → "üç sıra ve dört sütun": virgüllü sürümde whisper "sütüm" duydu; "ve"li sürüm ham kayıtta "sütun" çıktı.
- d1, n0 "Kalkan … kişinin" → "Ayaktaki … kişinin": Defne'nin sesinde satır başındaki "Kalkan", "Halkan" çıkıyordu.
- h2b başına "Oturun." eklendi (herkesin oturduğu sözle de söylensin); "kalksın" → "ayağa kalksın" ("kalsın" duyuluyordu). `tts` alanında "Şimdi," virgüllü.
- h1b "On iki kişiyiz" → "On iki kişi oturuyor": ekranda Hikmet'le birlikte on üç kişi var (bağımsız gözün notu); açıklama metni de "oturuyor" diyor.
- n0'dan "da" çıkarıldı (75 kelime sınırı; bağımsız göz de yersiz buldu).
- Aralar: d1 öncesi 1,0 sn, n0 öncesi 1,6 sn (dört kalkan sözsüz görünsün; salon plânında Necmi'nin balon kuyruğu kesişim koltuğunun üstünden geçeceği için n0 baştan sona yakın plânda), n1'den sonra 2,2 sn okuma payı.
- Kart: yukarıda.

**Motor için**
- Salon plânında dünya = ekran (zoom 1,0); kamera kapalı formüllü doğrusal itmedir ve çapa noktası (y 700; kancada y 1250, sayaçta y 1150) ekranda sabit kalır: üstte kart, altta altyazı payı korunur.
- Oturan ve kalkan aynı kişi çizimidir: baş `KALK` kadar yükselir, masanın altında kalan gövde kırpılır; ön sıranın ve yakın plânın masa altındaki bacakları ayrıca çizilir (hep zeminde durur).
- Yakın plân aynı kişi fonksiyonunu 1,7 kat ölçekle başka bir arka plânda çağırır; poz, bakış ve ifade salonla aynıdır.
- Sayaç bu bölüme özel: perde yok, alt bantta (y 1271–1420).
- Salon plânı 30 px sağa oturur (`SALON_CX = 510`): Hikmet ile on iki koltuk kadrajı ortalar. Hikmet'in eli koridorda kalır (sıra masasının ucunu geçmez).
- Altyazı için ayrı çizelge (`tlA`): n1'in bitişi "Buldum!"a çekilir, d3 balonu 0,12 sn geç başlar; kesim karesinde n1 balonu tam opaktır.
- Konuşmayan herkesin ifadesi ağzı kapalı çizilir (`IF.merak`, `IF.gulus`, `IF.suphe`); tek istisna sayaçtaki esneme.
- `film.uyar()` 15 sert kesmeyi ve sayaçtaki 10 sn'lik tek kamera anahtarını uyarı olarak basar (itme `kamera()` içinde).
