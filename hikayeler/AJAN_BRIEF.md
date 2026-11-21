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
   - `cdShare: "Bunu bir arkadaşına sor!"`, `v4: true`, `coverAt: 0`, `music.style: "yumusak"`.
   - **`disabled` alanı koyma.** "Zengin Kız Fakir Oğlan" hiçbir yerde geçmez.
   - Kesme işaretli ve tırnaklı repliklerde `tts` alanını işaretsiz yaz.
3. **Ses** (rehber § 9; argümanları betiklerden oku): `py -3.14 tools/voice_tts.py` → `py -3.13 tools/voice_trim.py` → `py -3.13 tools/voice_words.py` → `node tools/ses.mjs bolumler/<id>.json`.
   - Her satırın whisper çıktısını kontrol et. Bozuk satırı yeniden yaz ve üret.
   - Süre ≤ 60 sn olmalı (hedef 45–55).
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
