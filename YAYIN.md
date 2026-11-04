# Bilmece Mesaisi: yayın hattı

## Nasıl çalışır
- **Videolar:** Her bölüm bu bilgisayarda render edilir. `node tools/yayin.mjs --hazirla` komutu videoyu `prebuilt/<id>.mp4` olarak kopyalar ve dosya depoya girer. GitHub tarafında hiçbir şey render edilmez.
- **Planlama:** GitHub Actions günde 4 kez (`.github/workflows/yayin.yml`) önümüzdeki 48 saatin boş yayın yuvalarını bulur:
  - Hazır videoyu `media` dalına koyar; video oradan GitHub Pages bağlantısıyla yayına açılır.
  - Videoyu Buffer'da o saate planlar.
  - Buffer da videoyu Instagram'a Reels olarak gönderir.
- **Yayın saatleri** (Türkiye saati): her gün 12:30 ve 21:00. Açılış günü araya bir de 17:00 girer, yani ilk gün 3 Reels çıkar.
- **Kayıtlar:** Hangi bölümün hangi yuvaya gittiği `state/ledger.json` dosyasında tutulur. Buffer'da zaten dolu olan yuvaya dokunulmaz.
- **Uyarılar:** Hata ya da uyarı olursa çalıştırma başarısız sayılır ve GitHub e-postayla haber verir. Sessiz kalan hata olmaz.

## Senin yapacakların (hesap, şifre ve anahtarlar sende)
1. **Instagram:**
   - Kanal hesabını aç (öneri: `bilmecemesaisi`) ve profesyonel hesaba (İçerik Üreticisi) geçir.
   - Biyografi önerisi: `Her gün yeni bilmece · Hikmet Bey soruyor, Defne çözüyor · Seslendirme: yapay zekâ`
2. **Buffer:** Yeni Instagram hesabını mevcut Buffer hesabına kanal olarak bağla.
   - Ücretsiz planda en fazla 3 kanal var. Kaç Sıfır'ın Instagram ve YouTube kanallarıyla birlikte bu üçüncü kanal olur.
   - Bilmece için ayrıca YouTube Shorts istersen ücretli plan gerekir.
3. **API anahtarı:** Buffer'daki mevcut anahtar bu kanal için de çalışır. Proje klasörüne `.env` dosyası açıp şu satırı ekle: `BUFFER_API_KEY=...`
   - Bu dosya depoya girmez (`.gitignore`).
   - Sonra `node tools/yayin.mjs --kanallar` komutunu ben çalıştırıp `config.json` dosyasındaki kurum ve kanal kimliklerini doldururum.
4. **GitHub:** `tahabezek` hesabında `bilmece-mesaisi` adında **herkese açık** bir depo aç. Depo boş olsun (README eklemeden).
   - Haber verince yerel depoyu bağlayıp gönderirim. Gönderme dışa dönük bir adım olduğu için senden onay alacağım.
5. **Depo ayarları:**
   - **Settings → Secrets and variables → Actions → New repository secret:** adı `BUFFER_API_KEY`, değeri anahtarın.
   - **Settings → Pages:** "Deploy from a branch", dal olarak `media` ve kök dizin `/ (root)` seç. `media` dalını ilk gönderimde boş olarak ben oluşturacağım.
6. **Açılış günü:** Bana bir tarih söyle, `config.json` dosyasındaki `launchDate` alanına yazayım (ör. `2026-11-05`). Tarih boşsa yayın yuvaları hemen dolmaya başlar.

## Komutlar
| Komut | Ne yapar |
|---|---|
| `node tools/yayin.mjs --dry` | Yalnızca planı gösterir. Medya ya da Buffer adımı yok, anahtar gerekmez. |
| `node tools/yayin.mjs --status` | Kanal sağlığını, Buffer kuyruğunu ve kalan hazır bölüm sayısını gösterir. |
| `node tools/yayin.mjs --kanallar` | Buffer'daki kurum ve kanal kimliklerini listeler. |
| `node tools/yayin.mjs --hazirla` | Yeni render edilen videoları `prebuilt/` klasörüne kopyalar. |

## Acil durdurma
GitHub'da **Settings → Secrets and variables → Actions → Variables** bölümüne `BILMECE_PAUSED = true` ekle. Planlayıcı hiçbir şey yapmaz. Buffer'da zaten planlanmış gönderileri Buffer'dan silmen gerekir.

## Açıklama metinleri
- Her bölümün `bolumler/<id>.json` dosyasında `caption` ve `hashtags` alanları var.
- İlk satır "Zeka sorusu:" ile başlar ve bilmecenin tam metnini verir, çünkü açıklama Google'da indekslenir.
- Ardından cevabı ele vermeyen bir merak cümlesi gelir.
- Hashtag sayısı en fazla 5. "Yoruma yaz" gibi çağrılar yok, çünkü Meta bunları cezalandırıyor. Paylaşım çağrısını Defne videonun içinde yapıyor.
