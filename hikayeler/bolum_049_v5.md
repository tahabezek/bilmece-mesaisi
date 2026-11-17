# 049 · Yüz çay (v5 storyboard, 2026-11-17)

Kaynak: `hikayeler/bolum_045-057.md` § 049. Sahne: `engine/b049.js`. Bölüm dosyası: `bolumler/049-yuz-cay.json`. Yayın sırası 36 (rozet "BİLMECE #36"). Sayaç 10 sn (`cdSure: 10`). Mekanizma: en küçük toplam.

- **Logline:** Çay ocağında Hikmet, Necmi'nin bugün tam 100 bardak çay dağıttığını söyler. Ofiste 14 kişi var; herkes en az bir çay içmiş, kimse aynı sayıda içmemiş. Defne tepsiyi alır ve tezgâhtaki 14 tabağa gelişigüzel kuleler diker, iki kez aynı sayıya düşer. Necmi yan tezgâhta kesme şekerden merdiven yapar. Cevapta 14 bardak kulesi merdiven gibi yükselir; Necmi'nin tepsisi 100'de biter, son kule 9'da kalır.
- **Akılda kalacak tek şey:** Herkes farklı sayıda içtiyse en az 1 + 2 + … + 14 = 105 bardak gerekir. 100 bardak yetmez.
- **Kart:** `100 çay, 14 kişi. Herkes en az bir,` (35) / `kimse aynı sayıda değil. Olur mu?` (33)
- **Şartlar (değişmez):** Necmi 100 çay dağıttı. Ofiste 14 kişi var. Herkes en az bir çay içti, kimse aynı sayıda içmedi.
- **Cevap (değişmez):** Olmaz; 1 + 2 + … + 14 = 105 çay gerekir. Build anında `denetle(plan)` her kulenin bardak sayısını (1…13 tam, 14. kule 9 + 5 boş yer), dağıtılan toplamı (100) ve eksiği (5) denetler.
- **Mekân:** Çay ocağı (önden). Tezgâhın arkasında soldan sağa Necmi (x 110, elinde tepsi), Defne (x 360), Hikmet (x 1000, elinde çay bardağı). Kuleler x 286–858. Tezgâhta 14 tabak; duvarda "100 ÇAY" yazılı kara tahta, pencere, saat. Aynı odanın sol ucunda yan tezgâh: semaver, şeker kâsesi (ipucu).
- **Kare 0:** Necmi'nin tepsisinde bardak yığını, sol elinde son bardak; Defne ağzı açık, Hikmet gülümsüyor; kart üstte, kara tahta ortada. 0,3 sn'de son bardak yığına iner ("pop").

| # | ≈ sn | Yer | Ana eylem (nesneyle) | İki döngü | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–3,0 | Çay ocağı | 0,3 sn: Necmi 100. bardağı yığına koyar. "yüz"de Hikmet sol eliyle "100 ÇAY" tahtasını gösterir (h1). | çaydanlık buharı; pencerede martı, saat | 1,06x → 1,12x | (yok) |
| 2 Düzenek | 3,3–8,4 | Tezgâh, geniş | "On dört kişiyiz": sayı 14 tabağın üstünden atlar (1 … 14). "bir"de Necmi'nin tepsisinden her tabağa birer bardak uçar. "kimse aynı"da Hikmet parmak sallar (h2a). | buhar; saat | 1,0x | sert kesme |
| 3 Soru, bahis | 8,7–12,3 | Tezgâh | "saymış"ta Necmi gururla başını sallar (h2b). "çay"da Hikmet bardağını kaldırır (h3). | buhar; saat | 1,04x → 1,15x, kesmesiz | (yok) |
| 4 Yanlış deneme | 12,7–17,4 | Defne + Necmi | "Olur!"da Necmi tepsiyi Defne'ye verir, sola yürüyüp çıkar. Defne sol elinde tepsi, sağ eliyle bardak taşır: "az"da 2. tabağa 1, "çok"ta 6. tabağa 3 bardak; hd'de 6. tabağa 2, 5. tabağa 2 (d2, hd). | buhar; martı | 1,3x → 1,32x | sert kesme |
| 5 Sayaç (10 sn) | 17,6–27,6 | Geniş → Defne yakın | Defne taşımaya devam eder; 3. kule 2'ye çıkınca 2. kuleyle aynı olur, iki kule mercan, ✗; Hikmet parmak sallar. Aynısı 5. ve 6. kulede (6 ile 6). Son durum 1, 3, 2, 1, 7, 6, 4: merdiven değil. Defne kulelerin tepesine dokunarak sayar, tepsiyi tezgâha bırakır, eli çenede düşünür, son 0,6 sn'de sola bakar. Görüntü merdiven kurmaz. | buhar; saat | 1,0x → 1,28x (kesmesiz) | sert kesme |
| 6 İpucu | 27,6–31,2 | Yan tezgâh | Necmi kâseden kesme şeker alıp basamak dizer: 1, 2, 3 hazır; 3. sütunu tamamlar, "basamak … şeker … ister"de 4. sütunu tek tek yükseltir (n1). | semaver buharı; çay buharı | 1,45x | bakış kesmesi |
| 7 Buldum! | 31,5–32,7 | Defne | Sıçrama, sağ el havada, ışınlar (d3). | buhar; saat | 1,35x | "Buldum!" kesmesi |
| 8 Cevap | 32,7–42,2 | Tezgâh, geniş | **Kahraman an.** Necmi tepsiyle döner; Defne'nin kuleleri tepsiye uçar. "bir"de 1. kule, "iki"de 2. kule, sonra 3–13 dalga hâlinde yükselir; "on dört"te 14. kule bardak bardak dolar ve 9'da durur: tepsi boş, sayaç "100 bardak" mercan. Beş boş yer kesik çizgiyle belirir, "−5" gelir. Her kulenin tepesinde sayısı (46 px). d5: sayılar soldan sağa kabarır, "yüz beş"te `1 + 2 + … + 14 = 105`; "Yüz bardak yetmez"de Necmi boş tepsiyi kameraya çevirir. | buhar; saat | 1,0x → 1,04x | sert kesme |
| 9 Espri | 42,9–45,5 | Hikmet | Hikmet eliyle 14. kulenin boş yerlerini gösterir, "nerede"de Necmi'ye döner (h4). | buhar; saat | 1,32x → 1,35x | sert kesme |
| 10 Çağrı | 46,0–48,6 | Defne | Defne 1. kulenin bardağını alıp kaldırır (ödül çayı), kameraya bakar (d6). | buhar; martı | 1,36x → 1,4x | sert kesme |
| 11 Takip kartı | +2,4 | | `endCard` | | | sert kesme |

**Nasıl oynanıyor**
- **Düzenek:** 14 kişi 14 tabaktır; "herkes en az bir" her tabağa uçan bir bardaktır.
- **Yanlış deneme:** Defne gelişigüzel kule diker (yüzünün önündeki 1–4. tabaklar alçak kalır, uzun kuleler 5–7'de) ve iki kez aynı sayıya düşer: nesne "olmaz" der. Tepsi bitmez, merdiven kurulmaz; cevap görüntüde söylenmez.
- **İpucu:** Necmi cevabı söylemez; şekerden merdiven yapar, her basamak bir fazla.
- **Cevap:** En az bardakla farklı sayılar 1, 2, … 14'tür. Tepsi 100. bardakta biter; son kulede 5 boş yer kalır.
- **Espri:** Eksik beş bardağın hesabı Necmi'ye sorulur.

| id | Konuşan | Replik | Kelime | ≈ sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Necmi bugün tam yüz bardak çay dağıtmış! | 7 | 0,30–3,02 |
| h2a | Hikmet | On dört kişiyiz. Herkes en az bir çay içti, kimse aynı sayıda içmedi. | 13 | 3,32–8,40 |
| h2b | Hikmet | Necmi doğru mu saymış? | 4 | 8,70–10,32 |
| h3 | Hikmet | Bilirsen bir çay da sana. | 5 | 10,62–12,29 |
| d2 | Defne | Olur! Kimine az, kimine çok verir. | 6 | 12,74–14,98 |
| hd | Hikmet | Hadi bakalım, dağıt da görelim. | 5 | 15,38–17,35 |
| n1 | Necmi | Her basamak bir öncekinden bir şeker fazla ister. | 8 | 27,95–31,22 |
| d3 | Defne | Buldum! Necmi yanlış saymış! | 4 | 31,54–33,55 |
| d4 | Defne | Herkes farklıysa biri bir, biri iki, biri de on dört bardak içmiştir. | 12 | 33,90–37,73 |
| d5 | Defne | Birden on dörde kadar toplarsan yüz beş çıkar. Yüz bardak yetmez! | 11 | 38,09–42,17 |
| h4 | Hikmet | Necmi, eksik beş bardak nerede? | 5 | 43,12–45,46 |
| d6 | Defne | Bunu hesabı hiç tutmayan arkadaşına gönder. | 6 | 46,16–48,57 |

**Süre:** 86 kelime ("Buldum!" öncesi 48). "Buldum!" 31,54 sn, toplam 50,97 sn.

**Taslağa göre değişen replikler**
- hd: "Dağıt bakalım, başla." → "Hadi bakalım, dağıt da görelim.": whisper "başla"yı "başta" duydu; üç kelimelik satır yutulma riski de vardı.
- n1: "Merdivenin her basamağı bir öncekinden bir tuğla fazla ister." → "Her basamak bir öncekinden bir şeker fazla ister.": ipucu çay ocağındaki nesneye (kesme şeker) bağlandı, bütçe 9 → 8.
- d5: "… toplarsan yüz beş eder." → "… toplarsan yüz beş çıkar.": iki üretimde whisper "yüz beş eder"i "150 eder" ve "150 der" duydu; "çıkar" ile "105" temiz duyuldu.

**Motor için**
- Tek mekân `b049_ocak`; ipucu aynı odanın sol ucundaki yan tezgâhta (x −900…−230).
- Bütün bardaklar tek durum fonksiyonundan okunur (`kuleler(S, t)`): h2a'daki 14 taban bardağı, Defne'nin elde taşıdığı yığınlar (`tm.trip`), cevaptaki geri dönüş ve 100 bardaklık plan (`tm.plan`). Kule yükseklikleri ve tepsideki bardak sayısı aynı olaylardan hesaplanır.
- Kuleler tezgâhın üstünde, altyazı bandının (y ≈ 1255) üstünde kalır: geniş planda tezgâh ekranda y 1150'dedir. Kule adımı 44 px, bardak 40 px; sayılar kontur yazıyla 46 px, merdiven sırasıyla dikeyde kaydığından komşu sayılar çakışmaz.

**Sağlamlık:** Sağlam. Sayılar küçükten büyüğe dizilirse k'inci kişi en az k bardak içmiştir; toplam en az 14 · 15 / 2 = 105. 100 < 105.
