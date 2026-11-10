# ANIMATION_GUIDE: Bilmece Mesaisi "hikâye" dili (v4)

Bu rehberi 019–027'yi kodlayan herkes okur. Amaç: dokuz bölümün aynı elden çıkmış görünmesi.

- Üst kurallar: `~/.claude/CLAUDE.md` (animasyon bölümü). Çelişki olursa hafızadaki `kullanici-video-zevki` kazanır: **sessizlik boşluğu yok, müzik kesilmez.**
- Referans uygulama: `engine/b128.js` (028F "Çıta ve kargo"). Yeni bölümler bu dosyanın yöntemini izler; `engine/kalip.js` kalıbı kullanılmaz.
- Storyboard: `hikayeler/bolum_019-027_v4.md`. Replik, kart ve sahne sırası oradan alınır.

## 1. Dilin özü

1. Her vuruşta tek soru sorulur: **"Bu olay sahnede nasıl oynanır?"** Yanlış deneme, ipucu ve cevap bir karakterin elinde, nesneyle oynanır.
2. Yazı ve şema yalnızca destektir. Ekranda aynı anda kart + en fazla 2 etiket olur.
3. Bölüm bir hikâyedir: 2–3 mekân, 3–8 kesme, gerekirse zaman atlaması. Kadro sabit: Hikmet, Defne, Necmi. Kerem `genc` kartıdır ve konuşmaz.

Eski kalıpta olup artık **yapılmayanlar:**
- karartılmış "kanıt" ekranı (şema ortada, iki karakter alt köşede seyirci);
- ✓/✗ tablosu, çubuk grafik, satır satır tarih listesi;
- "NECMİ'NİN …" başlıklı ipucu kutusu (ipucu anlatılmaz, Necmi onu elindeki nesneyle yapar);
- kartın altında akan hap etiketlerle hesap anlatmak;
- bütün bölüm boyunca aynı iki poz (Hikmet işaret eder, Defne kolunu uzatır).

## 2. Sahne yapısı ve zaman bütçesi

| # | Vuruş | Replik | Hedef an | Kelime | Sahnede ne olur |
|---|---|---|---|---|---|
| 1 | Kanca | h1 | 0–3,5 sn | ≤ 10 | Kare 0'daki düzenek ilk 0,3 sn'de hareket eder. Soru ya da imkânsız iddia burada söylenir. |
| 2 | Soru düzeneği | (d1) h2a h2b | 3,5–11 | ≤ 20 | Koşullar nesneyle gösterilir. Soru cümlesi en geç h2b'de biter. |
| 3 | Bahis | h3 | 11–13 | ≤ 5 | Ödül görünür bir nesnedir (kupa, dilim, armut). |
| 4 | Yanlış deneme | d2, hd | 13–19 | ≤ 14 | Defne tahminini nesneyle dener; nesne "olmaz" der (taşar, kalkmaz, düşer). Hikmet itirazını aynı nesne üstünde gösterir. |
| 5 | Sayaç | (sessiz) | 5 sn | 0 | "SEN DE DÜŞÜN!" + "Bunu bir arkadaşına sor!". Sahne durmaz: Defne sessiz bir ikinci deneme yapar. |
| 6 | İpucu | n1 | sayaç biter bitmez | ≤ 10 | Necmi gündelik bir işi elindeki nesneyle yapar. Cevabı söylemez. |
| 7 | Buldum! | d3 | **≤ 33 sn** | ≤ 5 | Müzik vuruşuna sert kesme. Cevap tek nefeste söylenir. |
| 8 | Cevap oynanır | d4 (d5) | +7–10 sn | ≤ 25 | Bölümün kahraman anı. Nesne cevabı kendisi gösterir. |
| 9 | Espri | h4 | +3,5 sn | ≤ 8 | Hikmet'in yenilgisi, yine nesneyle. Her espri bir kez yapılır. |
| 10 | Paylaşım çağrısı | d6 | +3 sn | ≤ 9 | "Bunu … arkadaşına gönder." Defne nesneyle birlikte kameraya döner. |
| 11 | Takip kartı | (yok) | 2,4 sn | 0 | `endCard`. Yalnız en sonda. |

Bütçe:
- **Toplam ≤ 88 kelime** (hedef 40–50 sn, sert sınır 60 sn). **"Buldum!" öncesi ≤ 52 kelime** (hedef ≤ 33 sn, kapı 38 sn). Tek istisna 025: hesap kurulumu yüzünden 93 kelime, "Buldum!" öncesi 55.
- Tahmin: `süre ≈ kelime ÷ 2,1 + 5,6 (sayaç) + 0,35 × (replik − 1) + 2,4`. Bu formül 028F için 52,3 sn veriyor, ölçülen 49,5 sn: yaklaşık %5 temkinli.
- Her 2–4 sn'de ekranda yeni bir şey olur. Hiçbir şey 1 sn'den uzun tamamen durmaz. Durağan kart en fazla 3,5 sn.
- Her sahnede bir ana eylem ve iki sürekli döngü bulunur. Döngü sahneye aittir (alev, buhar, egzoz, martı, saat); karakterlerin boşta sallanması döngü sayılmaz.
- Filmde tek kahraman an (vuruş 8), tek yükselen ses (n1 → d3) ve tek büyük vuruş (d3) vardır.

## 3. Kare 0

Kare 0 kapaktır (`coverAt: 0`). Altı şart:
1. Bilmecenin fiziksel düzeneği sahnede hazırdır ve bir karakterin elinde ya da elinin altındadır.
2. Bilmece kartı ekrandadır (y = 300). En fazla 2 etiket eşlik eder.
3. En az iki karakterin yüzü görünür. Biri izleyicinin şaşkınlığını taşır.
4. İlk hareket 0,3 sn'de (nesne), ses en geç 0,4 sn'de başlar.
5. Karartma, logo, boş kare, "hoş geldiniz" yoktur.
6. Kare tek cümleyle anlatılabilir ("iki araba çizgide bekliyor").

Test: kare 0'ı 360 px genişliğe küçült. Soru nesnesi 3 saniyede seçilmiyorsa kadraj değişir.

## 4. Kamera ve kesme

Kamera tek dönüşümdür: `[t, zoom, cx, cy, 'cut'?]`, zoom logaritmik uzayda ara değerlenir, yay 170/26 (`camAt`).

| Kural | Sayı |
|---|---|
| Zoom aralığı | 0,94–1,46 (yüz yakın planı en çok 1,45) |
| Bekleyişte kayma | `camAt(..., 0.009–0.018)`; aynı hedefte en çok 7 sn, sonra ara hedef |
| Sert kesme sayısı | bölüm başına 3–8 (aynı mekânda kadraj sıçraması da kesmedir) |
| İki kesme arası | ≥ 1,2 sn |
| Mekânda kalış | ≥ 2,5 sn (araya giren kısa plan 0,8–1,6 sn) |
| İlk kadraj değişimi | en geç 8. saniyede |
| Zaman atlaması | 1,2–2,2 sn, kadraj sabit |

Kesme türleri (yalnız bunlar; çapraz karartma ve silme geçişi yok):
- **Nesne taşıma:** kesmenin iki yanında aynı nesne durur. Ekran konumu ±40 px, açı ±10°, ölçek ±%15 tutar.
- **Yön eşleme (vektör kuralı):** baskın yön soldan sağadır. Sahneden sağdan çıkan nesne, sonraki sahneye soldan ve aynı hızla (±%15) girer.
- **Bakış kesmesi:** karakter bir yere bakar, 4–6 kare sonra baktığı şeye kesilir.
- **"Buldum!" kesmesi:** müzik vuruşuna oturur, Defne'ye 1,35x.
- **Geri dönüş:** saat ibresi 0,4 sn geri sarar, ardından sert kesme ve 48 px'lik zaman hapı ("DÜN GECE", "YARIM SAAT ÖNCE") en az 1,25 sn. Çerçeve ya da renk filtresi yok. Geri dönüşe girerken kamera sağdan sola kayar, çıkarken soldan sağa. Anlatan karakterin ağzı oynamaz, balon kuyruksuzdur.
- **Zaman atlaması:** kesme değildir. Aynı kadrajda saat ibresi, pencere ışığı ve nesnenin durumu (erime, büyüme) tek `u` parametresiyle ilerler.

Kesme karesinde kart, sayaç ve rozet aynı karede değişir. Kesmeden sonraki ilk 6 karede yeni etiket açılmaz.

## 5. Hareket sayıları

| Ne | Değer |
|---|---|
| Giriş / çıkış / durum değişimi | `ease.enter` / `ease.exit` (girişin %50–75'i) / `ease.state` |
| Yaylar (sertlik/sönüm) | etiket ve damga 320/30 · kamera 170/26 · büyük yazı 120/24 |
| Ele uzanma | 0,25–0,30 sn, `ease.state` |
| Alma, kaldırma | 0,30–0,45 sn, `ease.enter` |
| Taşıma | 0,6–0,9 sn, `ease.state`, yolun ortasında 40–150 px yükselir |
| Bırakma, çarpma | temas karesinde durur; sekme yok; efekt 2–3 kare önce başlar |
| Elden ele verme | iki el nesnede en az 4 kare birlikte durur |
| Poz geçişi | 0,25–0,45 sn |
| "Buldum!" | 64 px sıçrama, 0,46 sn; baş çevresinde 9 hardal ışın, 0,55 sn |
| Etiket | giriş yay 320/30, çıkış 0,2 sn, vurgu nabzı %16 / 0,34 sn |
| Art arda gelen öğeler | 55–90 ms arayla, grup toplamı ≤ 500 ms |
| Okunacak öğe | kelimesinden 0,04 sn önce gelir; vuruş kelimenin üstüne düşer |

Zıplayan ve elastik easing, parlama (glow), rastgele parçacık patlaması, boşta sallanma yoktur. Işık düz renkli bir çokgendir.

## 6. Yazı ve etiket (1080 genişlik; telefonda üçte biri)

| Öğe | Boyut | Kural |
|---|---|---|
| Bilmece kartı | 54–66 px | ≤ 2 satır, satır ≤ 40 harf. Kare 0'dan "Buldum!"un sonuna kadar ekranda. |
| Altyazı balonu | 48 px (56 harften uzunsa 44 px) | y ≈ 1255, en fazla 3 satır, ≥ 1,25 sn. 60 harften uzun replik cümle cümle bölünür. |
| Ekran etiketi (`tag`) | 44–50 px, 900 | Nesneye bağlıdır ama okunurken yerinden oynamaz. ≥ 1,25 sn. |
| Sayı vurgusu | 56–70 px | Tek sayı, tek anlam. |
| Mekân içi yazı (pankart, plaka, yaprak, fiş) | ekranda ≥ 44 px | `K.up()` ile tr-TR büyük harf. Kamera zoom'undan sonraki boyut ölçülür. |
| Zaman hapı | 48 px | Yalnız geri dönüş ve zaman atlamasında. |

- Güvenli alan: x 90–920, y 280–1420. Bunun altı (y > 1420) Instagram arayüzünün altında kalır; oraya yalnız zemin, ayak ve gölge düşer.
- Aynı anda kart + en fazla 2 etiket. Alt alta üç etiket, yüzün üstünde etiket, 44 px'ten küçük yazı olmaz.
- Okunacak metin okunurken hareket etmez ve ölçeklenmez.
- Etikete gerek olup olmadığını şu test belirler: etiketi kapatınca sahne hâlâ anlaşılıyor mu? Anlaşılıyorsa etiket kalkar.

## 7. Karakterin nesneyle etkileşimi

Yöntem `b128.js`'teki gibidir:
1. **Her nesnenin tek durum fonksiyonu olur:** `nesneAt(t)` konumu, açıyı, katmanı ve kimin tuttuğunu döndürür (örnek: `stickAt`). Parçalar arası geçiş `mixStick` mantığıyla yapılır: orta nokta, açı ve boy ayrı ayrı ara değerlenir.
2. **El nesneye gider, nesne ele gelmez:** `reach(key, pose, 'L'|'R', hedef, w)` iki kemikli ters kinematiktir. `w` 0,25–0,30 sn'de 0'dan 1'e çıkar. El nesneye, nesne kıpırdamadan 0,1 sn önce varır.
3. **Tutan el nesnenin üstüne çizilir** (`grip`). Tutuş noktası nesnenin üstünde tanımlı bir aralıktadır (`nearOn`).
4. **Bakış:** karakter tuttuğu ya da gösterdiği nesneye bakar. Dinleyen, konuşana bakar.
5. **Gövde katılır:** uzanırken 13–20° eğilir, ağır nesnede zorlanma ifadesi (`STRAIN`) kullanılır.
6. **Kollar yüze binmez.** Konuşmayan karakterin kolu dış tarafa kalkar. Önden görünüşte `armR` ekranın sağıdır.
7. **Nesne tepki verir:** yanlış denemede nesne "olmaz" der (taşar, düşer, ezilir, geri kayar) ve olmayan kısım mercan olur; doğru cevapta nesne yerine oturur ve yeşil işaret alır.
8. **Kimlik kilitli:** `CARDS` değişmez; kıyafet, palet ve oran sahneye göre değişmez. Yeni aksesuar yalnız elde tutulan nesnedir. Hastalık, şaşkınlık gibi durumlar ifade ve duruşla verilir; ten rengi değişmez.
9. Her yeni etkileşimden sonra 12 karelik şerit çıkarılır ve sorulur: **"El, dokunduğu şeye değiyor mu?"**

Kerem: `genc` kartı, ofisin stajyeri. 019, 020, 022, 025 ve 027'de görünür. Konuşmaz; baş sallar, omuz silker, gösterir.

## 8. Mekânlar

Art arda iki bölüm aynı mekânı ya da aynı yerleşimi kullanmaz. Her bölümün kendi görsel metaforu vardır.

| Bölüm | Ana mekân | İkinci mekân | Işık | Metafor nesnesi |
|---|---|---|---|---|
| 019 | Şirket otoparkı, start çizgisi | Bitiş takı (kısa plan) | gündüz, açık hava | megafon, iki araba |
| 020 | Çay ocağı, şüpheli sırası | Aynı yer, dün gece | iç, gündüz / gece | boş tepsi, üç pankart |
| 021 | Hikmet'in odası | Arşiv odası | iç, gündüz | iki basamaklı kürsü, sözlük |
| 022 | Ofis terası | Aynı yer, yarım saat önce | gündüz, gölgelik | iki bardak, buz |
| 023 | Toplantı odası, akşam | Aynı yer, sabah | akşam → sabah | pasta ve on mum |
| 024 | Koridor | Koridorun takvim köşesi | iç, gündüz | hafta şeridi, koparmalı takvim |
| 025 | Bina kapısının önü | Restoran kasası (kısa plan) | gündüz, sokak | banknotlar, fiş |
| 026 | Necmi'nin masası | Armut bahçesi | iç → açık hava | şişe ve armut |
| 027 | Pencere önü, yılbaşı sabahı | Aynı yer, dün gece | sabah / gece | sayı balonları |
| 028 | Ofis, koli ve Necmi'nin dolabı | (yok) | iç, gündüz | çıta ve kutu (hazır: `b128.js`) |

- Palet `office.js` içindeki `PAL`'dan çıkar. Açık hava: gökyüzü `PAL.sky`, asfalt `#5D6A61`. Gece: `#1C3638` ve `PAL.wallDark`; lacivert ve mor kullanılmaz, yüzler okunur kalır.
- Ortak oda iskeleti, ışık ön ayarları ve mekân kaydı `engine/mekan.js`'tedir (örnek mekân: `cayOcagi`). Her bölüm kendi mekânını kendi `engine/b0NN.js` dosyasında `mekanEkle` ile tanımlar; her mekân `t`'nin saf fonksiyonudur. Biçim ve fonksiyonlar § 10 "Motor API"de.

## 9. Ses ve replik

- **Ses saattir.** Sıra: `py -3.14 tools/voice_tts.py` → `py -3.13 tools/voice_trim.py` → `py -3.13 tools/voice_words.py` → `node tools/ses.mjs bolumler/<id>.json`. Sahnedeki her an `at(tl, 'h2a:3')` gibi kelime çapasından okunur; sabit saniye yazılmaz.
- Replik kimlikleri: `h1, (d1), h2a, h2b, h3, d2, hd, n1, d3, d4, (d5), h4, d6`. `countdown: "n1-0.3"`, `cdShare: "Bunu bir arkadaşına sor!"`.
- Aralar: n1 öncesi 5,6 sn (sayaç); d3 öncesi 0,30–0,35; h4 öncesi 0,85–1,1; d6 öncesi 0,55–1,0; kuyruk 2,4.
- Müzik `yumusak`, hiç kesilmez; düşünme `h3>` → `d3`, yükselen ses `n1` → `d3`, vuruş `d3`.
- Efektler nesnenin temas karesine bağlanır, görselden 2–3 kare önce başlar. Mevcut efektler: `knock, pop, swish, zip, stamp, buzz, ding, womp`. Yeni efekt gerekiyorsa `ses.mjs`'e eklenir; eklenmezse en yakını kullanılır.
- Yazım: devrik ve eksiltili cümle yok. Sayılar replikte yazıyla, ekranda rakamla. Kesme işaretli kelimenin `tts` alanı kesmesiz yazılır. Küçültme eki kesme almaz: "Defneciğim".
- TTS tuzakları: satır T ya da P ile başlamaz (mümkünse satır içindeki cümleler de); 3 kelimeden kısa satır yutulabilir; ikinci tekil geçmiş zaman ("atladın") birinci tekile kayabilir; tek harf adı söyletilmez. Her satır whisper çıktısından kontrol edilir, bozuk satır yeniden yazılır.
- Dinlenemeyen şeyler (telaffuz, ton, müzik dengesi) raporda "kulakla kontrol et" diye kullanıcıya bırakılır.

## 10. Dosya düzeni ve iş sırası

- Sahne: `engine/b0NN.js` (`build(ep, tl)` + `draw(K, t, ep, tl, S)`), eski kalıp sürümünün yerine yazılır. Her kare `t`'nin saf fonksiyonudur; `Math.random` ve kareler arası durum yoktur.
- Ortak motor hazır: `engine/hikaye.js` (yardımcılar, sahne/kesme, zaman, madde, etkileşim) ve `engine/mekan.js` (ışık, oda iskeleti, mekân kaydı). Kullanımı aşağıda "Motor API". `b128.js` bu motoru kullanır; 028F'in görüntüsü 46 karede bayt bayt aynı kaldı.
- Aynı anda iki ajan çalışır: **paylaşılan dosyalara (`hikaye.js`, `mekan.js`, `cast.js`, `office.js`, `sahne.js`, `kalip.js`, `tools/*`) yazılmaz.** Bölümün mekânı ve nesneleri kendi `engine/b0NN.js` dosyasında tanımlanır. Motorda eksik görülen şey raporda yazılır.
- Bölüm başına sıra:
  1. Storyboard'daki replikler ve kart `bolumler/<id>.json` dosyasına işlenir.
  2. Ses üretilir, her satır dinlenir, `timeline.json` çıkar.
  3. Yedi stil karesi alınır (`tools/still.mjs`): kare 0, yanlış deneme, sayaç, ipucu, "Buldum!", cevap, espri. Her biri 360 px'te de bakılır.
  4. Yarım çözünürlükte taslak: `node tools/render.mjs <id> --s 0.5`.
  5. Tam render, kapılar, kritik döngüsü.
  6. Kullanıcı izler. Commit ve yayın kuyruğu ondan sonra.

### Motor API

Bölüm dosyası yalnız iki modülden alır: `import * as H from './hikaye.js'` ve `import * as M from './mekan.js'`. `hikaye.js`, `core.js` / `cast.js` / `office.js` / `sahne.js` / `kalip.js` / `zaman.js` içinden gerekenleri de yeniden dışa verir (`ease, seg, spring, clamp01, lerp, mulberry32, INK, CARDS, PAL, LW, at, UI, poseAt, charBase, drawChar, talkAt, glance, pill, stamp, pop, clock, riddleCard`).

- Canlı örnekler: `engine/motor_test.html?p=<parça>&t=<sn>` (parçalar: `kesme, yon, yuruyus, atlama, geri, sivi, alev, erime, buyume, isik, verme, tasima, pankart, sayma, kerem, etiket, bolum`). Her gösterimin kodu aynı çağrıları kullanır; `bolum` tam bir bölüm iskeletidir.
- Kâğıtlar: `out/motor_kagidi.png` (her parça 4 an), `out/poz_kagidi.png` (4 karakter × 14 poz). Yeniden üretmek için: `node tools/still.mjs "engine/motor_test.html?kagit=motor" out/motor_kagidi.png 4100 5800` ve `node tools/still.mjs "engine/motor_test.html?kagit=poz" out/poz_kagidi.png 2600 9700`.
- Şerit (etkileşim kontrolü): `node tools/still.mjs "engine/motor_test.html?serit=tasima&t0=0.9&t1=1.9&n=12" out/serit.png 2400 1400`. Bölümün kendi şeridi `tools/render.mjs <id> --sheet --at t1,t2,…` ile alınır.
- Uzay: **dünya** = kameranın içi (`h.dunya`), **ekran** = 1080 × 1920 (`h.ekran`). Dünya noktası ekrana `B.ekr(p)` ile çevrilir. Aşağıda (D) dünya, (E) ekran demektir.

Bölüm iskeleti:

```js
import * as H from './hikaye.js'; import * as M from './mekan.js';
const { ease, seg, kisi, oyna, POZ } = H;
M.mekanEkle('b021_arsiv', { gen: [0, 1700], capa: { masa: [900, 1290] }, kadraj: { genis: [0.96, 850, 1222] },
  arka(K, t, { isik, durum }) { M.oda(K, { x0: -400, x1: 2100, isik }); /* mobilya, iki döngü */ } });
export function build(ep, tl) {
  const T = e => H.at(tl, e);
  const tm = { cd: T(ep.countdown), buldum: T('d3'), proof: T('d3>') + 0.05, end: T('d6>') + 0.1 /* … kelime çapaları */ };
  const film = H.sahneler([
    { id: 'oda', t0: 0, cam: [[0, ...M.kadraj('b021_arsiv', 'genis')], [T('h2a') - 0.05, 1.2, 760, 1180]] },
    { id: 'buldum', t0: tm.buldum - 0.05, cam: [[0, 1.35, 905, 1040]] },          // sert kesme
    { id: 'son', t0: tm.end, cam: [[0, 1, 540, 960]] },
  ]); film.uyar();
  const defBase = kisi('defne', { x: 905, expr: 'saskin', ...POZ.dur }), def = [[tm.buldum - 0.05, { expr: 'mutlu', ...POZ.yukari }, 0.25, ease.enter]];
  return { tm, film, defBase, def };
}
export const draw = (K, t, ep, tl, S) => H.cerceve(K, t, ep, tl, S, {
  dunya(K, t, { sc, heads }) {                       // sıra: mekân arka → karakter → nesne → tutan el → mekân ışık / ön
    M.mekanCiz(K, 'b021_arsiv', 'arka', t);
    const dp = H.poseAt(H.CARDS.defne, S.defBase, S.def, t); dp.y -= H.buldumHop(t, S.tm.buldum);
    H.buldumIsin(K, t, S.tm.buldum, H.eklem('defne', dp, 'head'), { son: S.tm.proof });
    const d = oyna(K, t, tl, 'defne', dp, { heads, R: [kitap(t).tutus, w(t)] });   // el nesneye gider
    kitapCiz(K, kitap(t)); d.tut('R');                                             // nesne, sonra el
  },
  ekran(K, t, { ekr, top, sc }) { H.tag(K, t, a, b, ekr(nokta), 'etiket', H.PAL.mustard, H.INK); },
});
```

**Çerçeve, sahne, kamera**

| İmza | Ne yapar | Örnek |
|---|---|---|
| `cerceve(K, t, ep, tl, S, h)` | Bölümün `draw`'ı. Sıra sabit: takip kartı → kamera → `h.dunya` → kart → `h.ekran` → sayaç → altyazı. `S = { tm: { cd, end, proof }, film }`. `h = { dunya(K,t,B), ekran?(K,t,B), kartSon? = tm.proof, kartBoy? = 54, split?, drift? = 0.009, kamera?(cam,t,B), kuyruksuz?(t,B), kilavuz? }`. `B = { cam, heads, sc, ekr(p), kart, top }` | yukarıdaki iskelet |
| `sahneler(liste)` → `{ at(t), cam(t, drift), kesmeler, kontrol(), uyar() }` | Sahne listesi. Öğe: `{ id, t0, cam: [[t, zoom, cx, cy, _, [k, c]?]…], kesme?: false, kay?: [dx, dy], kisa?, …kendi alanların }`. Sahnenin ilk kamera anahtarı `t0`'a çekilir ve **sert kesme** olur; diğer anahtarlar mutlak zamandır. `kesme: false` kesmesiz geçiştir. `kay` sahne boyunca doğrusal kaymadır. `at(t)` → `{ …sahne, lt, kalan, taze }` (`taze`: kesmeden sonraki ilk 6 kare). `kontrol()` § 4 sayılarını denetler | `if (sc.id === 'dun') …` |
| `esle(camA, pA, pB, zoomB?)` → `[zoom, cx, cy]` | Nesne taşıma kesmesi: A'da `pA`'daki nesne, yeni sahnede `pB`'deyken ekranda aynı yerde kalır | `cam: [[0, ...H.esle(camK, pA, pB, 1.1)]]` |
| `esFark(camA, pA, camB, pB)` → `[dx, dy]` | Kesmenin iki yanındaki ekran farkı (≤ 40 px olmalı) | `H.esFark(cA, pA, film.cam(tK), pB)` |
| `cikis(cam, t, tKes, v, yari)` / `giris(…)` → dünya x | Yön eşleme: nesne `tKes`'te sağ kenardan `v` px/sn ile çıkar, yeni sahneye sol kenardan aynı hızla girer | `araba(K, H.cikis(cA, t, tK, 2400, 260))` |
| `kamKaris(a, b, u)` | İki kameranın karışımı (zoom logaritmik); `h.kamera` içinde yürüyeni izlemek için | `Object.assign(cam, H.kamKaris(cam, { cx: p.x + 60 }, w))` |

Bakış kesmesi ayrı fonksiyon değildir: karakterin bakışı `tm.bak`'ta döner, sahne `t0: tm.bak + 5 / 30` ile başlar.

**Karakter ve el**

| İmza | Ne yapar | Örnek |
|---|---|---|
| `kisi(key, o)` | Standart yerleşim: zemin 1500, ölçek `BOY` (`hikmet 250, defne 245, necmi 225, genc 232`), `head.nod = 0`. Kerem = `'genc'` (`H.KEREM`) | `kisi('genc', { x: 420, ...POZ.dur })` |
| `oyna(K, t, tl, key, p, o)` → `{ handL, handR, head, p, tut(side), parmak(side, n, o), isaret(side, hedef) }` | Uzanış + dudak + çizim. `o = { L / R: [hedef, w = 1, dirsek = 'oto'], heads, sessiz }`. `tut / parmak / isaret` nesneden SONRA çağrılır | `const a = oyna(K, t, tl, 'necmi', np, { heads, R: [kol, w] }); a.tut('R')` |
| `reach(key, p, side, hedef, w = 1, dirsek = 'oto')` | İki kemikli ters kinematik (önden ve yandan). Hedef uzaksa kol o yöne düz uzanır; hedef omza yakınsa kol kısalır. `dirsek`: `'oto'`, `'A'` (aşağıda/içte), `'B'` (dışarıda); `1 / −1` yalnız `b128.js` içindir | `H.reach('defne', dp, 'L', p, w, 'A')` |
| `elYeri(key, p, side, ad)` → nokta | Orana göre hazır el yeri: `'asagi'`, `'gogus'`, `'yan'`, `'yukari'` (başın yanında; yüze binmez) | `lerp` ile `asagi → yukari` |
| `eklem(key, p, ad)` / `shoulder(key, p, side)` → nokta | İskelet eklemi dünyada: `head neck pelvis shL shR elL elR handL handR kneeL kneeR ankleL ankleR` | `H.eklem('defne', dp, 'head')` |
| `grip(K, key, pt, s)` | Tutan eli nesnenin üstüne çizer (`oyna().tut` bunu çağırır) | `H.grip(K, 'hikmet', hk.handR, 250)` |
| `parmaklar(K, key, pt, s, n, { yon, ac, boy, toplam })` | Elden yelpaze açan parmaklar; `n` kesirli olabilir; `toplam` sayarken sabit tutulur | `a.parmak('R', n, { toplam: 3 })` |
| `isaret(K, key, el, s, hedef)` | Elden hedefe tek parmak (gösterme, dokunma, basma) | `a.isaret('L', kupa)` |
| `POZ` / `IFADE` | Kısmi pozlar (önden): `dur, rahat, dusun, yukari, ikiEl, teslim, belde, yana, ikaz, omuz`. İfadeler: `dusun, dusun2, zorlanma` | `{ ...POZ.dusun, expr: IFADE.dusun }` |
| `onayla(p, t, t0, n = 2, d = 0.32)` | Baş sallama (önden `head.nod`, yandan baş eğilir) | `H.onayla(kp, t, tm.evet)` |
| `omuzSilk(p, t, t0, tut = 0.5)` | Omuz silkme: 0,25 sn açılır, `tut` sn durur, 0,3 sn iner | `H.omuzSilk(kp, t, tm.bilmem)` |
| `otur(key, o)` / `oturak(key, p)` → `{ y, x, diz }` | Yandan oturma (`kalca, diz, el, facing, lean`); oturağın yeri | `const p = H.otur('hikmet', { x: 500 }), s = H.oturak('hikmet', p); M.sandalye(K, s.x, s.y)` |
| `yuru(key, t, { t0, x0, x1, t1?, hiz = 330, geri?, poz? })` → poz | Yandan yürüyüş; adım yola kilitli, uçlarda ayakta durur; `p.yuruyor`, `p.u`. `geri: true` geri geri yürür | `const p = t >= W.t0 && t < t1 ? H.yuru('defne', t, W) : onden` |
| `yanAdim(p, t, { t0, x0, x1, adim = 3 })` | Önden görünüşte yan yan kayma | `H.yanAdim(np, t, { t0, x0: 1300, x1: 1560 })` |
| `poseAt(card, base, keys, t)` · `glance(p, t, tm.cd)` · `talkAt` | `sahne.js`: poz izi `[t, kısmi poz, süre = 0.35, eğri]` (zamana göre sıralı), sayaçta gezinen bakış, dudak | `H.poseAt(H.CARDS.defne, S.defBase, S.def, t)` |

**Nesne yolu ve zamanlama**

| İmza | Ne yapar | Örnek |
|---|---|---|
| `iz(keys, t)` | Değer izi: `[t, sayı \| [x, y], süre = 0.35, eğri = ease.state, lift = 0]`; ilk anahtar başlangıç değeridir | `H.iz([[0, 500], [tm.al, 630, 0.8]], t)` |
| `yay(a, b, u, lift)` · `tasi(t, t0, d, a, b, lift = 90, eğri)` | Yay üstünde nokta; taşıma (0,6–0,9 sn, yolun ortasında yükselir) | `H.tasi(t, tm.al, 0.8, A, B, 60)` |
| `dus(t, t0, t1, a, b)` | Bırakma/düşme: `t1` temas karesinde durur, sekme yok | `H.dus(t, 0, 0.3, [900, 1120], [900, 1183])` |
| `nabiz(t, a, d = 0.34)` · `sars(t, a, d = 0.45, f = 11)` | Tek nabız 0→1→0 (kabarma, esneme) · sönen titreme −1..1 (çarpma tepkisi) | `r * (1 + 0.24 * H.nabiz(t, tm.kupa))` |
| `along(s, u)` · `unit(p, q)` · `nearOn(s, pt, a, b)` · `mixStick(a, b, u, lift)` | Doğru parçası `s = [[x0, y0], [x1, y1]]` araçları: nokta, birim yön, tutuş noktası, iki konum arası geçiş | `H.nearOn(sap, omuz, 0.4, 0.6)` |
| `mixHex(a, b, u)` · `strokeLine(ctx, a, b, w, renk)` | Renk karışımı (`#hex` ya da `rgb()`) · düz çizgi | `H.mixHex(PAL.cream, '#B9B4A8', u)` |

**Etkileşim**

| İmza | Ne yapar | Örnek |
|---|---|---|
| `elVer(t, t0, A, B, { bulus?, uzat = 0.32, ortak = 0.17, cek = 0.4 })` → `{ p, verW, alW, ortak, tK, tB, tS }` | Elden ele verme: veren uzatır, iki el ≥ 5 kare nesnede, veren bırakır, alan çeker. `p` nesnenin yeri; ağırlıklar `reach`'e verilir | `const v = H.elVer(t, tm.ver, A, B); oyna(…, { R: [[v.p[0] - 88, v.p[1]], v.verW] })` |
| `kaldir(t, [[kalkış, iniş?]…], { cik = 0.36, inis = 0.26 })` → 0..1 | Kaldırma–indirme (pankart, eldeki para, bayrak) | `const u = H.kaldir(t, [[tm.kal, tm.in]])` |
| `pankart(K, el, { satir, w = 320, h = 160, sap = 150, boy = 50, durum, rot })` → `{ merkez, ust }` (D) | Saplı pankart; `el` sapın tutulduğu nokta. `durum`: 1 yeşil kenar + ✓, 0 nötr, −1 gri | `H.pankart(K, el, { satir: ['Kerem', 'yedi'], durum: u })` |
| `dokunYolu(t, [[t, [x, y]]…], { yuksel = 46, sure = 0.2 })` → nokta | Dokunarak sayarken elin hedefi: her durağa kendi anında varır | `const h = H.dokunYolu(t, dur); oyna(…, { L: [[h[0] + 34, h[1] - 30]] }); d.isaret('L', h)` |
| `sayiAtla(K, t, [[t, [x, y], metin]…], { son, size = 60, fill, col })` (E) | Tek rakam duraktan durağa atlar (0,16 sn), indiği yerde kabarır | `H.sayiAtla(K, t, dur.map(([tt, p], i) => [tt, ekr(p), String(i + 1)]))` |

**Etiket, işaret, altyazı, "Buldum!"**

| İmza | Ne yapar | Örnek |
|---|---|---|
| `tag(K, t, a, b, [x, y], metin, dolgu, yazı = PAL.paper, boy = 46, nabız = [])` → yarı genişlik (E) | Hap etiket: `a`'da yayla (320/30) gelir, `b`'de 0,2 sn'de çıkar | `H.tag(K, t, tm.a, tm.b, ekr(p), '1,5 m', PAL.mustard, INK, 46, [tm.vurgu])` |
| `mark(K, t, a, b, [x, y], ok)` (E) | Yuvarlak ✓ (yeşil) / ✗ (mercan) rozeti | `H.mark(K, t, a, b, [x + hw + 34, y], false)` |
| `ring(K, [x, y], t, a, renk)` (D) · `dimLine(K, p, q, v, renk, w = 8)` (D) | Nokta işareti (halka + nokta) · çentikli ölçü çizgisi (`v` çizilen oran) | `H.dimLine(K, p, q, ease.enter(seg(t, a, 0.3)), PAL.coral)` |
| `adimEtiket(K, t, [[t, metin, dolgu?, yazı?]…], b, [x, y], boy = 60)` (E) | Yeri sabit, adım adım değişen tek etiket (sayaç) | `H.adimEtiket(K, t, [[t1, '90'], [t2, '180'], [t3, '290 ?', PAL.coral]], b, [330, 760])` |
| `zamanHapi(K, t, a, b, metin, { x = 540, y = 600, size = 48, saat })` (E) | Zaman hapı (yalnız geri dönüş ve zaman atlaması; ≥ 1,25 sn) | `H.zamanHapi(K, t, tm.geri + 0.2, tm.don - 0.25, 'DÜN GECE', { y: top + 70 })` |
| `buldumHop(t, t0, h = 64)` · `buldumIsin(K, t, t0, basMerkezi, { son, k })` (D) | "Buldum!" sıçraması (px) ve 9 hardal ışın; `t0 = at(tl, 'd3')` | iskelette |
| `altyazi(K, tl, t, cam, heads, { split, y = 1255, kuyruksuz })` (E) | Altyazı balonu (`cerceve` çağırır). `split = { d4: 5 }` uzun tek cümleyi 5. kelimeden böler | `H.cerceve(…, { split: { d4: 5 } })` |
| `guvenliAlan(K)` (E) | Güvenli alan kılavuzu (yalnız stil karesinde; `h.kilavuz: true`) | |

**Zaman: atlama ve geri dönüş**

| İmza | Ne yapar | Örnek |
|---|---|---|
| `atlama(t, t0, d)` → `u` | Zaman atlamasının tek parametresi (1,2–2,2 sn; kadraj sabit) | `const u = H.atlama(t, tm.gece, 2.2)` |
| `saatSar(h0, h1, u)` → ondalık saat | Saat sarma (19.5 = 19:30; geri için `h1 < h0`) | `M.duvarSaati(K, x, y, r, H.saatSar(19.5, 31.5, u), t)` |
| `geriDonus(t, tGir, tCik?)` → `{ sar, icinde, lt, kalan }` | Geri dönüş: `sar` kesmeden önceki 0,4 sn'lik geri sarma (0..1) | `saat: H.saatSar(10.25, 8.25, g.icinde ? 0 : g.sar)` |
| `saatRozet(K, t, tKes, { x, y, r, saat, tur = 1.5, yon = −1 })` (E) | Duvar saati yoksa: kesmeden 0,4 sn önce beliren, ibreleri saran rozet | `H.saatRozet(K, t, tm.geri, { y: top + 150 })` |
| `gecmisTonu(K, a)` (E) | Düz renkli geçmiş tonu. Varsayılan kullanılmaz (§ 4: filtre yok); aynı ışıkta geçen geri dönüşte en çok 0.12 | `if (sc.geri) H.gecmisTonu(K, 0.1)` |

**Madde: sıvı, alev, duman, erime, büyüme, ışık** (hepsi D)

| İmza | Ne yapar | Örnek |
|---|---|---|
| `sivi(K, yol, [x, y, w, h], { seviye, renk, egim, yuzey, bulut: { renk, u, p, tohum, guc } })` | Kabın iç hattına (`yol(ctx)`) kırpılmış sıvı; `egim` kabın açısı (yüzey yatay kalır); `bulut` kaynaktan yayılıp karışan renk. Kap çizgisi sonra çizilir | `motor_test.html` → `bardak`, `surahi` |
| `akis(K, a, b, w, renk, u0, u1)` · `damla(K, x, y, r, renk)` · `damlaDongu(K, x, y0, y1, t, { periyot })` | Akan şerit · tek damla · damlayan musluk döngüsü | `H.akis(K, agiz, yuzey, 15, renk, 0, seg(t, a, 0.2))` |
| `alev(K, x, y, k, t, { i, yat, guc })` | Titreyen alev; `yat` −1..1 rüzgârda yatma, `guc` 0..1 | `H.alev(K, x, y, 1, t, { i, yat: -r })` |
| `duman(K, x, y, t, t0, { sure = 1.3, k, yat })` | Sönme dumanı: `t0`'da çıkar, yükselip kaybolur | `H.duman(K, x, y, t, tm.sondu)` |
| `buhar(K, x, y, t, { k, n = 2 })` · `puf(K, x, y, t, { k, n = 3, yon, periyot })` | Sürekli döngüler: buhar telleri (çay, yemek) · pufçuklar (egzoz, toz) | `H.buhar(K, 756, 1092, t)` |
| `mum(K, x, y, k, { h, on, t, i, duman, yat, guc, renk })` → fitil ucu | Mum: `h` kalan boy (eridikçe dibinde göl), `duman` sönme anı | `H.mum(K, x, 1290, 2.3, { h: 1 - u, on: u < 0.97, t, i })` |
| `erime(u)` → `{ boy, en, gol }` · `eriyen(K, x, y, w, h, u, { renk, gol })` | Erime eğrileri · eriyen blok (buz; sıvının içindeyse `gol: false`) | `H.eriyen(K, x, y, 62, 62, u, { gol: false })` |
| `buyume(u, i, n, pay = 0.45)` → 0..1 · `yaprak(K, x, y, L, açı, renk, k)` | Tek `u` ile `n` parçanın sırayla açılması · yaprak | `H.yaprak(K, x, y, 120, a, PAL.green, H.buyume(u, i, 9))` |
| `isikSeridi(K, pts, { renk, a = 0.5 })` · `zeminIsigi(x0, x1, zemin, { uz, kay, ac })` → çokgen | Düz renkli ışık çokgeni · açıklıktan zemine düşen ışığın çokgeni | `H.isikSeridi(K, H.zeminIsigi(x0, x1, 1500, { kay: -220 }), { a: 0.42 })` |
| `karart(K, a)` | Dünyanın üstüne düz koyu petrol (`a ≈ isik.k`); ışıklı kalacak şeyler sonra çizilir | `H.karart(K, isik.k)` |
| `lekele(K, fn(K2), renk, a = 1)` | `fn`'in çizdiğini boyar: `a = 1` siluet, `a < 1` koyulaştırma. `fn` kendisine verilen `K2`'yi kullanır | `H.lekele(K, K2 => oyna(K2, t, null, 'necmi', np), '#0C1D1F', 1)` |

**Mekân (`engine/mekan.js`)**

| İmza | Ne yapar | Örnek |
|---|---|---|
| `ISIK.gunduz \| sabah \| aksam \| gece` | Işık ön ayarı: duvar, zemin, gök renkleri ve `k` (karartma). Gece koyu petrol; lacivert ve mor yok | `{ isik: M.ISIK.gece }` |
| `isikKaris(a, b, u)` · `isikYolu([[u, ad]…], u)` · `isikSaat(saat)` → `{ isik, gunes, ay }` | İki ışığın karışımı · ışık yolu (zaman atlaması) · saate göre ışık ve gök cisimlerinin yay konumu | `M.isikYolu([[0, 'aksam'], [0.3, 'gece'], [0.8, 'gece'], [1, 'sabah']], u)` |
| `oda(K, { x0, x1, floorY = 1500, isik, duvar: 'cizgili' \| 'duz' \| 'fayans', zemin: 'ahsap' \| 'karo' \| 'duz' })` | Oda iskeleti: duvar, alt bant, süpürgelik, zemin | `M.oda(K, { x0: -400, x1: 2100, isik })` |
| `acikHava(K, { x0, x1, floorY, isik, zemin: 'asfalt' \| 'kaldirim' \| 'cim' \| 'teras', gunes, ay, siluet, bulutlar, t })` | Açık hava iskeleti: gök, güneş/ay yayı, bulut döngüsü, uzak siluet, zemin | `M.acikHava(K, { zemin: 'asfalt', t })` |
| `pencere(K, x, y, w, h, { isik, t, gunes, ay, manzara: 'istanbul' \| null \| fn, marti, kayit })` → iç dikdörtgen | Pencere: gök ışığa göre, manzara, martı döngüsü | `M.pencere(K, 180, 700, 420, 520, { isik, t, gunes: g.gunes, ay: g.ay })` |
| `gok(K, x, y, w, h, { isik, gunes, ay, r })` | Yalnız gökyüzü (yay konumu 0 doğuş, 0.5 tepe, 1 batış) | `M.gok(K, x, y, w, h, { gunes: u })` |
| `kapi(K, x, y, w, h, { acik, yon, ic, renk, isik, levha, cam })` → `{ kol, agiz }` | Açılan kapı; `kol` el hedefi, `agiz` ışığın düştüğü açıklık | `const k = M.kapi(K, 1500, 770, 300, 730, { acik: u })` |
| `duvarSaati(K, x, y, r, saat, t)` · `sandalye(K, x, y, { w, sirt, yon })` · `bolme(K, x)` · `bulut(K, x, y, k)` | Ondalık saatli duvar saati · yandan sandalye (karakterden önce çizilir) · iki mekân arası duvar kesiti · bulut | `M.duvarSaati(K, 900, 800, 70, saat, t)` |
| `mekanEkle(ad, def)` · `mekanCiz(K, ad, katman, t, o)` | Mekân kaydı ve çizimi. `def = { gen: [x0, x1], zemin, capa: { ad: [x, y] \| durum => [x, y] }, kadraj: { ad: [zoom, cx, cy] }, dongu: […], arka(K, t, o), isik?(K, t, o), on?(K, t, o) }`. `o = { isik, durum, ox }`. Katman sırası: `'arka'` → karakterler ve nesneler → `'isik'` → `'on'` | `M.mekanCiz(K, 'b020_ocak', 'arka', t, { isik, durum: { dolap: u } })` |
| `capa(ad, capaAdi, ox = 0, durum)` · `kadraj(ad, kadrajAdi, ox = 0)` | Adlandırılmış el/nesne hedefi · hazır kadraj (`[t, ...kadraj]` kamera anahtarıdır) | `M.capa('cayOcagi', 'kapiKolu', 0, durum)` |
| `yanYana([[ad, o]…], { duvar = 56 })` → `{ ciz(K, katman, t, ek), capa(i, ad), kadraj(i, ad), gecit(i), D }` | Yan yana mekânlar (kesmesiz yürüyüş geçişi): her mekân kendi genişliğine kırpılır, aralarına bölme girer | `D.ciz(K, 'arka', t); …; D.ciz(K, 'on', t)` |

Örnek mekân `MEKAN.cayOcagi`: çapalar `tezgah, tezgahSol, caydanlik, musluk, lavabo, dolapRaf, dolapKulp, dolapOnu, kapiKolu, kapiOnu, sira, saat`; kadrajlar `genis, tezgah, dolap, kapi`; `durum = { dolap, kapi, saat }`; ışık gündüz ve gece.

**Tuzaklar**

1. **Katman sırası.** Mekân `arka` → karakter → nesne → `tut` (el nesnenin üstünde) → mekân `isik` → siluet ve alev → mekân `on`. Karanlık sahnede `karart`'tan önce çizilen her şey koyulaşır. `lekele` içindeki fonksiyon dışarıdaki `K`'yi değil kendisine verilen `K2`'yi kullanır.
2. **Dirsek.** `reach`'in `'oto'` kipi kare kare karar verir: hedef omzun iç ve dış yanı arasında gezen bir harekette dirsek bir karede yer değiştirebilir. O harekete sabit `'A'` ya da `'B'` verilir ve şeride bakılır. El yüz hizasına gidecekse (megafon ağızda, el çenede) `reach` kullanılmaz: hazır poz verilir (`POZ.dusun`), nesne dönen ele çizilir. Taşıma yayı yüzün önünden geçmez (nesnenin üst kenarı çenenin altında kalır).
3. **Görünüş.** Önden ↔ yandan geçiş tek karede olur; `yuru` yalnız yandan pozu verir, başı ve sonu bölümde seçilir (`t < t0 ? onden : H.yuru(…)`). Yandan görünüşte nesne yakın elde (`'R'`) tutulur; uzak el gövdenin arkasında kalır. `kisi` yerine `charBase` kullanılırsa `head.nod` ve ölçek gelmez.
4. **Uzay ve zaman.** `tag, mark, adimEtiket, sayiAtla, zamanHapi, saatRozet` ekran uzayındadır; `ring, dimLine, pankart, isikSeridi` ve bütün madde parçaları dünya uzayındadır. Etiket, nesnenin oturduğu sabit noktaya bağlanır (hareket eden ele değil). Sahnenin kamera anahtarları mutlak zamandır ve sonraki sahnenin `t0`'ından önce biter; `film.uyar()` build'in sonunda çağrılır. Kesmeden sonraki ilk 6 karede (`sc.taze`) yeni etiket açılmaz.
5. **Paylaşılan dosyalar.** Mekân ve nesne adları bölüm numarasıyla başlar (`'b021_arsiv'`); `MEKAN` tek kayıttır, aynı ad ötekini ezer. `hikaye.js`, `mekan.js` ve `cast.js` değiştirilmez.
6. **Geri dönüş.** Anlatan karakter geçmiş sahnede çizilse bile konuşmaz (`oyna(…, { sessiz: true })`), balon kuyruksuzdur (`kuyruksuz: (t, B) => !!B.sc.geri`). Zaman hapı kesmeden 0,2 sn sonra gelir ve en az 1,25 sn kalır. `saatRozet` yüzün üstüne konmaz.
7. **Pankart ve kaldırılan el.** El başın yanına kalkar (`elYeri(…, 'yukari')`); düz yukarı kaldırılan kol yüzü kapatır. Yan yana duran karakterlerde pankart genişliği karakter aralığından küçük tutulur.

## 11. Kapılar

`node tools/kapi.mjs <id>` şunları ölçer; biri kırmızıysa teslim edilmez:

| Kapı | Sınır | Hedef |
|---|---|---|
| Süre | ≤ 60 sn | 40–50 sn |
| "Buldum!" anı (`d3.t0`) | ≤ 38 sn | ≤ 33 sn |
| Kart | ≤ 2 satır, satır ≤ 40 harf | |
| Ses | −14 LUFS ±1, true peak ≤ −1 dBTP | |
| Hareket | her saniyenin YDIF ortalaması ≥ 0,1 | |

Elle bakılan kapılar:
- determinizm: aynı an iki kez `still.mjs` ile alınır, dosyalar bayt bayt eşittir;
- temas kâğıdı: `node tools/render.mjs <id> --sheet`;
- telefon testi: 360 px genişlikte kart, pankart ve etiket okunuyor mu;
- güvenli alan ve etiket çakışması;
- 0,3 sn'den uzun boş kare yok;
- altyazı en az 1,25 sn ekranda;
- kesmelerde yön ve nesne tutuyor mu (kesmenin iki yanından birer kare).

## 12. Kritik döngüsü

1. Temas kâğıdı (her replikten 0,3 sn sonra bir kare) ve her etkileşimden 12 karelik şerit çıkar.
2. Puan ver (1–10): kanca, telefonda okunabilirlik, hareket, çeşitlilik, kompozisyon, marka doğruluğu, ses senkronu, dilin doğallığı. Ek ölçüt: **"Olay elde mi oynanıyor?"**
3. En kötü 3 sorunu zaman damgasıyla yaz, düzelt, yalnız o saniyeleri yeniden render et (`--from --to`), yeniden bak.
4. Durma kuralı: her ölçüt ≥ 7 ve bariz hata yok. Genelde tek tur yeter.
5. Son bakışı yapıma katılmamış, yalnız bitmiş filmi gören bir alt ajan yapar. Ona 1 fps kare veriliyorsa "kare N ≈ (N − 1) + 0,5 sn" bilgisi de verilir.
6. Yeniden render edip bakmadan "düzeldi" denmez.

Avlanacaklar: elin değmediği nesne, yüzen (zemine basmayan) nesne, yüzü kapatan kol, kesmede üst üste binen metin, okunurken kayan etiket, sayaçta duran sahne, Türkçe büyük harf hatası (i/İ).

## 13. 028F'ten iki ders

- Cevap anında (d5) 3 saniyelik karartılmış tel kafes şemaya kesiliyor ve "1 m" etiketleri 38 px: oyun şemaya kaçıyor. Yeni bölümlerde cevap gerçek nesnede kalır, yazı 44 px'in altına inmez.
- Hikâye tek odada geçiyor, ilk 7,8 sn aynı geniş kadraj ve Necmi'nin dolabındaki "köşeden köşeye" telefonda küçük kalıyor. Yeni bölümlerde en geç 8. saniyede kadraj değişir, ipucu nesnesi kadrajın en az üçte birini kaplar.
