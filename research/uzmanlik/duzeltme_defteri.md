# Düzeltme defteri: benim hatalarım

Dudeney ve Gardner hatalarını saklamadı, okurun düzeltmesini adıyla yayımladı (`derin_5_ustalarin_hayati.md`). Bu defter benim seçim ve tasarım hatalarımı, hatanın sınıfını ve bir daha nasıl yakalanacağını tutar.

| Tarih | Ne | Hata sınıfı | Yakalayan | Önlem |
|---|---|---|---|---|
| 20 Kas | 059 "-miş / -di": cevap konuşanın kip tercihine dayanıyordu | dil bilgisi tercihi zorunlu sanıldı | kullanıcı | Gerçek konuşmacı testi (`USTA_OLCUTU.md`) |
| 26 Kas | Kapakta "CEVAP" başlığı, cevapsız formatta | kural değişti, stok yeniden denetlenmedi | kullanıcı | `denetim.mjs`, mühür, `KURAL_SURUM` |
| 27 Kas | Y1 "…ya çeyrek kala": 064'ün ortadaki adımını (ek → "altı") yeniden icat ettim | arşiv mekanizma düzeyinde taranmadı | avukat ajanı | Yeni kurgudan önce arşivde **mekanizma** araması: `grep` ile cevap kelimesi değil, kısıt sınıfı ve ara adım |
| 27 Kas | Raporlardaki R2 "yelkovansız saat" kanıtı yanlış ("aradaki her nokta bir dakika"; oysa akrep için kadrandaki iki dakika çizgisinin arası 12 dakikadır ve 2.45 ile 2.48 arasında akrep yalnız 1,5° yürür, "tam çeyrek" okunamaz) | kanıt kurgulayanın elinde doğrulanmadı | avukat ajanı | Sayısal kanıtı olan aday avukata gitmeden kendim yeniden türetirim |
| 28 Kas | 061 yorum yanıtı: "yeşil kalem kırmızı kâğıtta kaybolur" dedim; saydam mürekkep karışır ve koyu iz bırakır | algı modelini fizik sandım | okur (yorum) | Yorum yanıtında olgu iddiası varsa göndermeden önce fiziğini kontrol et |
