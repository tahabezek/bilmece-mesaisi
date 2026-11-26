# Yayın kuralları (kural sürümü 1, 26 Kas 2026)

Bu dosya, bir bölümün yayına çıkabilmesi için geçmesi gereken her kuralı tek yerde toplar. Kurallar kullanıcının bugüne kadarki kararlarından gelir; kaynakları hafızada ve `hikayeler/AJAN_BRIEF.md`'de.

## Nasıl işler

1. Bölüm bitince: `node tools/yayin.mjs --hazirla` (video `prebuilt/`'e kopyalanır).
2. `node tools/denetim.mjs <id>`: otomatik kapılar (aşağıda **[O]**). Rapor `out/denetim/<id>.md`, kareler `out/denetim/<id>_serit.png` ve `_kare0.png`.
3. Göz denetimi (aşağıda **[G]**): yapıma katılmamış bir alt ajan raporu ve kareleri bu listeyle inceler. Haklı her bulgu düzeltilir, video yeniden hazırlanır, 2. adım tekrarlanır.
4. `node tools/denetim.mjs <id> --onayla "kısa not"`: otomatik kapılar geçerse bölüme denetim mührü yazılır.
5. `tools/yayin.mjs` yalnız mührü **güncel kural sürümüyle** ve **aynı video dosyasıyla** eşleşen bölümü kuyruğa alır. Video değişirse ya da kural sürümü artarsa mühür kendiliğinden geçersizleşir.

**Kural değişince:** Kullanıcı yeni bir kural koyduğunda bu dosyaya eklenir, `tools/kurallar.mjs` içindeki `KURAL_SURUM` bir artırılır ve yayınlanmamış bütün stok yeniden denetlenir. Buffer'a zaten planlanmış gönderiler de aynı gün elle gözden geçirilir. (Bu adım 20 Kasım'da yoktu; cevap kapaklı üç Son Vapur bölümü bu yüzden yayına çıktı.)

## 1. Cevap ve ipucu

- **[O]** Videoda cevap yok: film "Buldum!"dan önce kesilmiş, sona takip kartı eklenmiş (`cevapsiz` alanı, süre = kesim + takip kartı).
- **[O]** Ekranda hiçbir anda "CEVAP: …" kapağı, "Buldum" ya da "NEDEN?" sayacı yok. Bölüm dosyasında `kapak` yok.
- **[O]** Bölüm dosyasında `sizinti` listesi var (cevabı ele veren sözler); bunlar ne ekranda ne açıklama metninde geçer.
- **[O]** Açıklama metninde "cevap kapakta / videoda / videonun sonunda / yorumlarda", "yoruma yaz" yok.
- **[G]** Görüntü cevabı söylemez: cevap olan nesne, kişi ya da seçenek renk, ışık, büyütme, yakın plan ısrarı, parmak ya da bakışla öne çıkarılmaz. Sayaçta parmak ya da bakış cevabın üstünde beklemez. Altyazı kuyruğu cevabı ok gibi göstermez.
- **[G]** İpucu (`n1`) düşündürür, cevabı söylemez; son karede okunur kalır.

## 2. Bilmecenin kendisi

- **[G]** Bütün şartlar kesilmiş filmde söz ya da görüntü olarak var; izleyici yalnız videodan çözebilir.
- **[G]** Söylenen ile görünen çelişmez (kullanıcının en sevmediği hata). Kart, altyazı, açıklama metni ve sahne aynı şeyi anlatır.
- **[G]** Tek cevaplıdır ya da açık uçluysa bilerek öyledir; ikinci makul cevap yoktur.
- **[G]** Türkçe dil bilgisi bilmecesi yalnız zorunlu biçime dayanır (ek uyumu gibi, başka seçenek olmayan); konuşanın tercihine (kip, zaman, vurgu, kibarlık sözü) dayanmaz. Test: "Gerçek bir konuşmacı öbür biçimi de kullanır mı?" Evetse bilmece çöker. (26 Kas: 059'da "yemiş/yedi" bu yüzden saçma bulundu.)
- Seçim aşamasında (`research/uzmanlik/BILMECE_USTALIK.md`): bilinen klasik yok, harf sayma yok, okul ya da fizik bilgisi yok, basit aritmetik yok, arşivle aynı mekanizma yok, zekâ kokar.

## 3. Ekran ve okunabilirlik

- **[O]** Kart 2 satır, satır ≤ 40 harf. 34 harfi aşan satır yazıyı 44 px'in altına küçültür (uyarı); yeni bölümlerde satır ≤ 33 harf.
- **[G]** Telefonda (360 px genişlik) kart, altyazı ve okunacak her yazı seçilir. Güvenli alan x 90–920, y 280–1420.
- **[G]** Kart hiçbir yüzü örtmez; altyazı, balon, sayaç ya da el okunacak yazının üstüne binmez; kesmede metinler üst üste binmez.
- **[G]** Türkçe: devrik ve eksiltili cümle yok, kesme işaretleri doğru, büyük harfte i/İ doğru, yazım hatası yok.

## 4. Hareket ve ses

- **[O]** Süre ≤ 60 sn. Ses −14 LUFS ±1, true peak ≤ −1 dBTP. Her saniye hareket var (YDIF ≥ 0,1). Sahne konsol hatası vermez.
- **[O]** `prebuilt/` dosyası son render'la aynı.
- **[G]** El dokunduğu şeye değer; yüzen nesne, yüzü kapatan kol, kenarda yarım yüz yok. Konuşan belli (konuşmayanın ağzı açık değil).
- **[G]** Sessizlik boşluğu yok, müzik kesilmez. Kerem hiç konuşmaz.
- Ses kulakla dinlenemiyorsa raporda "kulakla kontrol" diye kullanıcıya bırakılır.

## 5. Kanal

- **[O]** Açıklama "Zeka sorusu:" ile başlar; en çok 5 hashtag; "Zengin Kız Fakir Oğlan" geçmez.
- **[G]** Yasak varsayılanlar yok: parlama, rastgele parçacık, zıplayan ya da elastik hareket, boşta sallanma, gradyan üstünde ortalanmış başlık. Takip kartı yalnız en sonda; "yarın" gibi zaman vaadi yok.
- **[G]** Trajedide maskot gülmez; OK el işareti yok; Atatürk çizilmez.
