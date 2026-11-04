# Bilmece kanalı: öneri v1 (2026-11-03)

**Logline:** Bilmeceye bağımlı bir müdür, herkesin saf sandığı memura her gün bir bilmece soruyor; cevaba bir pazarlık bağlı.
**Akılda kalacak tek şey:** Soruyu duyan izleyici bir arkadaşına göndermeden duramaz.
**Hedef:** En kısa sürede en yüksek takipçi sayısı. Ölçüt: erişim başına gönderme (DM).

## Kimlik (öneri)
- **Ad:** Bilmece Mesaisi (@bilmecemesaisi). Hesap adının müsait olup olmadığı kontrol edilmedi.
- **Müdür Hikmet Bey:** Bıyıklı, kravatlı ve ukala, bilmece bağımlısı. Her gün kendi bulduğu bilmeceyi sorar. Ses: Ahmet, perde düşürülmüş, ağır tempolu.
- **Memur Defne:** Herkes saf sanır ama her bilmeceyi gündelik bir ipucundan çözer. Tarzı belli, kızların seveceği bir karakter. Ses: Emel.
  - İki karakterden biri kadın, çünkü Türkçe yalnızca iki edge-tts sesi (Ahmet ve Emel) var. Aynı sesten çıkarılan iki erkek karakter birbirinden ayrışmaz.
- **Necmi Abi'nin çekmecesi:** Ofisin en eski memuru. Her bilmecenin aleti onun çekmecesinden çıkar. Tekrar eden gag budur.
- **Dizi ile sınır:** Bilmeceler serbest. Dizinin karakter adları, görünüşleri, replikleri ve bankası kullanılmaz; mekân bir şirketin muhasebe servisi.

## Üç yapı seçeneği

### A) Mesai: müdür soruyor, memur çözüyor (önerim)
Dizinin grameri, kendi karakterlerimizle.

| Süre | Ne olur |
|---|---|
| 0–2 sn | Müdür arkada beliriyor: "Defne'ciğim…" Soru kare 0'da büyük yazıyla. |
| 2–8 sn | Soru, ardından pazarlık: "Bilirsen erken çık." |
| 8–15 sn | Defne'nin yanlış ama komik akıl yürütmesi. Ekranda 5 sn'lik düşünme sayacı. |
| 15–25 sn | Gündelik bir an ipucu veriyor (çekmece, müşteri, telefon), Defne "Buldum!" diyor. Cevap görsel olarak kanıtlanıyor. |
| 25–35 sn | Müdürün yenilgisi. Kapanış cümlesi: "Bunu müdürüne gönder, o da bilemez." |

- **Artısı:** Kalıcı karakterler takip sebebi yaratır. Seri gag'ler (rüyada bilmece, sahte kalp krizi, alarm) her hafta tazelik getirir.
- **Riski:** Karakter animasyonu en emek isteyen yol; film başına yaklaşık 6 dk render ve kritik gerekir.

### B) Sofra: aile büyüğü soruyor
- Teyze ya da dede bayram sofrasında soruyor, yeğenler uğraşıyor. Kapanış: "Bunu annene sor."
- Paylaşım potansiyeli çok yüksek, ama her bölüm 3–4 karakter demek; animasyon yükü daha fazla.

### C) Tek sahne, izleyiciye doğrudan soru (TED-Ed tarzı)
- Karakter yok ya da tek anlatıcı. Bilmece görsel olarak canlandırılır: 5 sn düşünme, sonra çözüm animasyonu.
- En hızlı üretilen seçenek. Ancak kullanıcının geçmiş geri bildirimine göre karaktersiz ve kişisiz bilgi kırıntıları zayıf kalıyor.

**Kararım:** A ana evren olsun. B, haftada bir "teyze konuk" bölümü olarak eklensin. C hiç kullanılmasın.

## Teknik kararlar
- **Animasyon:** 2B çizgi motoru (instagram/engine/cizgi kopyalanacak). 1080×1920, 30 fps. Hızlı harekette tmix ile bulanıklık. Palet: sıcak ofis (hardal, petrol yeşili, krem kâğıt değil); tek vurgu rengi.
- **Ses:** edge-tts ile seslendirme. Kelime zamanlaması Whisper `--language tr` ile; TTS çıktısı ASR ile geri kontrol edilir. Müzik tek tonalitede ve hiç kesilmez. Efektler gerçek tepe noktasına yerleştirilir. Hedef −14 LUFS.
- **Mantık kapısı:** Her bilmece research/ dosyasındaki şart cümlesiyle yazılır. Dizinin yanlış cevapları düzeltilir.
- **Paylaşım temposu:** Gün 1'de 3 reel, sonra günde 2 (12:30 ve 21:00). Aynı dosya TikTok ve Shorts'a da yüklenir.

## İlk 14 bölüm (Türkçe imzalar önde)
1. BADANA → ADANA → DANA → ANA
2. "İşi olmayan giremez" tabelasına ihtiyacı olmayan tek kurum: İŞKUR
3. Yunanistan ile Bulgaristan arasında ne var: İstanbul
4. Çanta alım-satımı: "Dizi bile yanlış bildi", cevap 3 kâr
5. Dakikada iki, saniyede bir: A harfi
6. Tuğçe 10, Ataberk 14, Efe 6; Rasim Bayrakoğlu kaç yaşında: 30
7. Patates, salatalık, çavdar, pekmez, domates: hangisi farklı
8. İzmir'de iki, İstanbul'da bir, Ankara'da hiç: "i" harfi
9. "Yalan dersem zam yapacağım" paradoksu
10. Zehirli buz
11. Salı, perşembe, cumartesi demeden üç gün: dün, bugün, yarın
12. Yalan günleri: cevap perşembe
13. Cuma nerede Salı'dan önce gelir: sözlükte
14. Şişedeki armut
