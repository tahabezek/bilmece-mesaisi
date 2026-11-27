# Bölüm üretim brifi (ortak, tüm ajanlar)

Bilmece Mesaisi Instagram Reels için yapılan, Türkçe çizgi animasyonlu bir bilmece kanalı. Proje klasörü `C:\wamp64\www\bilmece`. Ortam Windows; Bash için Git Bash var, PowerShell de var.

## Önce oku
1. **`ANIMATION_GUIDE.md`.** Bağlayıcı rehber. İçinde: vuruş tablosu, kare 0, kamera ve kesme, hareket sayıları, yazı ≥ 44 px, nesneyle etkileşim, **Motor API**, ses hattı (§ 9), kapılar, kritik.
2. **Kendi bölümünün bölümü** (belge adı görev mesajında): şartlar, cevap, sahne, replik taslağı, açıklama metni.
3. **Bitmiş v4 bölümleri.** `engine/b029.js … b040.js` (044 varsa onu da oku), `bolumler/0NN-*.json`, `hikayeler/bolum_0NN_v5.md`. Yapıyı, JSON alanlarını ve storyboard biçimini bunlardan al. Kullanıcının en beğendiği bölüm `engine/b128.js`. Kopyalamak serbest; mekân, nesne ve figüran adların `b0NN_` ile başlar.
4. **`~/.claude/CLAUDE.md` animasyon bölümü** üst kuraldır. Çelişki olursa rehber ve şu kullanıcı kuralları kazanır:
   - Sessizlik boşluğu yok, müzik hiç kesilmez.
   - Olay karakterlerin elinde, nesneyle oynanır. Karartılmış şema ekranı yok.
   - Görüntü cevabı önceden söylemez: ipucu gösterilir, cevap gösterilmez.
   - Yasak varsayılanlar: zıplayan ya da elastik easing, rastgele parçacık patlaması, parlama (glow), boşta sallanma.

## İş sırası
1. **Storyboard.** `hikayeler/bolum_0NN_v5.md` dosyasına 029–040'taki biçimde yaz.
   - Replik taslağını bütçeye (≤ 88 kelime, "Buldum!" öncesi ≤ 52) ve TTS tuzaklarına göre düzeltebilirsin. **Şartlar, sayılar ve cevap değişmez.**
   - Kart iki satırdır, her satır ≤ 40 harf.
   - Sayılar replikte yazıyla, ekranda rakamla yazılır.
2. **JSON.** 029–040 düzeninde.
   - `caption`: belgedeki açıklama metni (`\n\n` ile).
   - 5 hashtag.
   - `cdSure: 10`. İpucu repliği varsa `countdown: "n1-0.3"`, yoksa `"d3-0.3"`.
   - `cdShare` 084 ve sonrasında yazılmaz (`research/uzmanlik/USTALIK_DEFTERI.md` § 5, deney); `v4: true`, `coverAt: 0`, `music.style: "yumusak"`.
   - **`disabled` alanı koyma.** "Zengin Kız Fakir Oğlan" hiçbir yerde geçmez.
   - Kesme işaretli ve tırnaklı repliklerde `tts` alanını işaretsiz yaz.
3. **Ses** (rehber § 9; argümanları betiklerden oku): `py -3.14 tools/voice_tts.py` → `py -3.13 tools/voice_trim.py` → `py -3.13 tools/voice_words.py` → `node tools/ses.mjs bolumler/<id>.json`.
   - Her satırın whisper çıktısını kontrol et. Bozuk satırı yeniden yaz ve üret.
   - Süre ≤ 60 sn olmalı (hedef 45–55).
   - **Formant kaydırma, asetrate/pitch-shift ya da benzeri hiçbir ses son işlemi yapılmaz.** Kullanıcı formantlı sesi iki kez "robotik" diye reddetti (4 Kas, 28 Kas: 086 Rıza Usta). Yan karakter sesi yalnız edge-tts `pitch` ve `rate` ile ayrıştırılır. İstisna: Necmi'nin `engine/voices.json`'daki titremesi (vibrato) onaylı karakter sesidir, kalır.
   - **Satır hızı tavanı:** Ahmet sesli satırlarda (Hikmet, Necmi, yan karakter) `rate` en fazla +4%. Kullanıcı +12–14% hızlı Hikmet'i "robotik ve kötü" buldu (28 Kas, 084–086). Kısa formata sığmak için hız değil kelime kırpılır.
4. **Sahne.** `engine/b0NN.js`. Her kare t'nin saf fonksiyonudur; `Math.random` yok, rastgelelik gerekiyorsa tohumlu üreteç ya da sabit liste kullan.
5. **Stil kareleri.** `node tools/render.mjs <id> --sheet --at …` ile al, Read ile açıp kendin bak. 360 px genişlikte okunabilirliği kontrol et.
   - Yarım çözünürlük taslak: `--s 0.5 --j 3`.
6. **Tam render ve kapılar.** Tam render `--j 3` (`timeout 2400` ile sar), ardından `node tools/kapi.mjs <id>`. Sayaç süresince de her saniye hareket olmalı (YDIF ≥ 0,1).
7. **Kritik** (rehber § 12), en az bir tur. Avlanacaklar:
   - nesneye değmeyen el, yüzen nesne;
   - yüzü kapatan kol;
   - kesmede üst üste binen metin;
   - okunurken kayan etiket;
   - Türkçe büyük harf (i/İ, `K.up()`);
   - güvenli alan dışına taşma (x 90–920, y 280–1420);
   - sayaç perdesinin örttüğü önemli olay.

   En kötü 3 sorunu düzelt, yeniden render et, yeniden bak.
8. **Bağımsız göz.** Mümkünse bitmiş filmi yapıma katılmamış bir alt ajana izlet; haklı bulgularını uygula. 1 fps kare verirsen "kare N ≈ (N − 1) + 0,5 sn" bilgisini de ver.

## Cevapsız tasarım (21 Kas 2026'dan itibaren yeni bölümler)
Videoda cevap gösterilmez. Film yine `d3` ("Buldum!") ve kısa bir cevap bölümüyle üretilir (arşiv), sonra `node tools/cevapsiz.mjs <id>` "Buldum!"dan önce keser ve takip kartını ekler. JSON'a `"cevapsizTasarim": true` koy: kapı Buldum sınırını 50 sn yapar, süre kapısını kesilmiş sürüme uygular. Sıra: tam render → `kapi.mjs` → `cevapsiz.mjs` → kesilmiş `out/bolum_<id>.mp4` üzerinde tekrar `kapi.mjs` ve son 3 sn'ye bak (ipucu okunur mu, kart temiz mi). Kritik ve bağımsız göz kesilmiş film üzerinde yapılır. Cevap bölümüne emek harcama; kurulumu acelesiz ve zengin anlat. "Cevap yorumlarda / yorumlara yaz" hiçbir yerde yok.

## Kadraj kuralları (22 Kas 2026, 058–063'te her ajanda tekrarlanan hatalar)
- Boş zemin ya da boş masa yüzü en çok %15. Kamerayı masaya ve nesneye göre kur; karakterler ve nesneler kadrajı doldursun.
- Kart hiçbir yüzün hiçbir parçasını örtmez: başlar kartın alt kenarının ≥ 30 px altından başlar.
- Altyazı, balon, sayaç ya da el, okunacak bir yazının (not, pul, etiket) üstüne binmez; arada en az 24 px boşluk kalır. Kadrajdaki etiket ya tam görünür ya hiç görünmez.
- Aşırı düzeltme yapma: grup planı 1,25–1,3x, yakın plan 1,5–1,7x.
- Her konuşmacıya yakın plan, nesneye en az bir insert, sayaç boyunca doğrusal itme.

## Kısa format (26 Kas 2026, `research/analiz_2026-11-26.md`)
Kanalın en çok izlenen cevapsız videosu 27 sn; 35–50 sn'lik videolar ortalama 12–17 sn izleniyor. 070'ten itibaren:
- Kesilmiş film 30–38 sn; "Buldum!" öncesi en çok 55 kelime; `d3` en geç 32. saniyede (cevapsız kapıda sınır 50 sn kalıyor, hedef bu).
- Kart satırı en çok **33 harf** (boşluk ve noktalama dahil). 34 ve üstü yazıyı 44 px'in altına küçültür.
- Kanca ilk 2 saniyede soruyu kurar; nefes araları 0,3–0,5 sn.

## Yayın denetimi (26 Kas 2026, `YAYIN_KURALLARI.md`)
Bölüm dosyasına `"sizinti": [...]` yazılır (cevabı ele veren sözler; belgede verilir). Teslimden önce: `node tools/yayin.mjs --hazirla` → `node tools/denetim.mjs <id>`; bütün kapılar ✅ olmalı. Rapor `out/denetim/<id>.md` ekranda yazan her şeyi listeler; ona bak. Mührü (`--onayla`) ajan yazmaz, koordinatör göz denetiminden sonra yazar.

Bu sette bağımsız gözün en sık bulduğu hatalar, baştan önle:
- **Konuşan belli değil:** dudak konuşmayan karakterde oynuyor ya da konuşmayanın ağzı açık (şaşkınlık ifadesi dahil). Her replikte yalnız konuşanın ağzı oynar.
- **Cevap olan kişi ya da nesne tek başına plan alıyor**, sayaçta kamera ya da parmak cevabın üstünde bekliyor, altyazı kuyruğu cevabı ok gibi gösteriyor.
- **Okunacak balon ya da etiket kenarda kırpılıyor**, kenarda yarım yüz kalıyor.
- **İşaret eden el nesneyi değil boşluğu gösteriyor.**
- **Kart eksiltili ya da iki anlamlı** ("Yalnız…" = "ama"); kart kapaktır, tek başına anlaşılmalı.

## Sınırlar
- **Paylaşılan dosyalara yazma:**
  - `engine/hikaye.js, mekan.js, cast.js, office.js, sahne.js, kalip.js, core.js, bolum.html`
  - `tools/*`
  - başka bölümlerin dosyaları

  Bir eksik bulursan kendi dosyanda çöz ve raporda yaz.
- **git commit / push yapma.** Buffer'a ve `tools/yayin.mjs`'e dokunma, `prebuilt/`'e kopyalama.
- Başkasının chrome süreçlerini öldürme. Taslakları ve denemeleri iş bitince sil.
- **Türkçe yazım:** devrik ya da eksiltili cümle yok, kesme işaretleri doğru.

## Rapor (son mesajın)
Kısa ve somut olsun. Şunları yaz:
- dosya yolları;
- `kapi.mjs` çıktısı;
- süre ve "Buldum!" anı;
- son replik metinleri;
- temas kâğıdının yolu;
- düzelttiğin 3 sorun;
- bilinen zayıflıklar;
- kulakla kontrol edilecek satırlar.

Yapılamayan bir şey varsa açıkça yaz.
