# 094 · Çay dolabının kilidi (v5 storyboard, cevapsız tasarım, kısa format, 2026-11-28)

Kaynak: `hikayeler/bolum_092-095.md` § 094 (kart, şartlar, tuzak, referans, ipucu, sızıntı); aday `research/aday_havuzu_3_2026-11-28.md` D2, avukat `research/aday_havuzu_3_2026-11-28_avukat.md` (kilit yalnız üç tuşlu, başta boş; Defne cevabı veren gerekçeyi söylemez). Sahne: `engine/b094.js`. Bölüm dosyası: `bolumler/094-kilit.json` (`cevapsizTasarim: true`, `cdShare` yok, sayaçta yalnız "SEN DE DÜŞÜN!"). Yayın sırası 79 (rozet "BİLMECE #79"). Sayaç 10 sn, `countdown: "d3-0.3"` (ipucu repliği yok; ipucu sayaçta eylemle). Cevap türü: açık yöntem + sayı.

## Senaryo

Çay ocağı. Fayanslı duvar, üstte bardak ve çay kutusu rafı, solda duvar saati. Ortada ahşap çay dolabı; kapağının üst kısmında pirinç levha: solda üç tuş (1, 2, 3), sağda iki haneli küçük yeşil ekran ("– –", boş). Kapağın camından çay paketleri, şeker kavanozu ve bardaklar görünür; dolabın üstünde boş bardaklı tepsi. Kerem önde solda (kulp elinde), Hikmet Bey ve Defne dolabın arkasında, Necmi önde sağda, elinde son çay (buharlı).

Kerem kulpu iki kez çeker, kapak sarsılır, açılmaz. Hikmet: "Misafir geliyor, dolap kilitli ve şifreyi unuttum." (omuz silker). Kilide insert: "Kilidin üç tuşu var: bir, iki, üç." (Hikmet dolabın üst kenarından tuşları tek tek gösterir, basmaz; tuşlar hardal halkayla nabız atar.) "Şifre iki haneli," (ekranı gösterir, ekran çerçevesi yanar) "aynı rakam iki kez olabilir." ("1"in üstünde iki kez dokunmadan iner kalkar). Hikmet yakın: "Onay tuşu yok." (başını iki yana sallar) "Kilit son iki tuşa bakar," (ekranı gösterir) "yanlışta kilitlenmez." (omuz silker). Necmi yakın, emin: "Dokuz şifre, her biri iki tuş: on sekiz basış." (iki parmak; yanında "9 ŞİFRE" → "9 × 2" → "9 × 2 = 18"). Defne yakın: "Olmaz, daha azıyla açarız." (başını sallar, ekranı gösterir) "En az kaç tuşa basmalıyız?" (omuz silker).

Sayaç (grup, kilide doğrusal itme): Kerem "1"e basar, ekran "– 1" olur (kilit başta boştu); Hikmet omuz silker. Necmi eli çenede, Defne başını eğip düşünür. Kerem "2"ye basar: ekranda "1" sola kayar, "12"; sonra "3"e basar: "23". Herkes ekrana bakar; son üç saniyede ekranda "23" açıkça okunur, Kerem'in eli çekilmiştir. (Kesim.)

- **Logline:** Misafir geliyor, çay dolabı kilitli, şifre unutulmuş; kilidin üç tuşu var, onay tuşu yok, son iki tuşa bakıyor. Necmi "on sekiz basış" der; Defne "daha azıyla açarız" der ama nedenini söylemez.
- **Akılda kalacak tek şey:** Kilit her basışta yeniden bakar.
- **Kart:** `Kilit son iki tuşa bakıyor.` (27) / `Dokuz şifre: en az kaç tuş?` (27).
- **Referans cevap (arşiv, kesilir):** 10 basış, ör. 1 1 2 2 3 3 1 3 2 1. İlk basış hiçbir şifreyi denemez, sonraki her basış en çok bir yeni şifre dener: 1 + 9 = 10. Dokuz ikiliyi tekrarsız içeren 10 uzunlukta her dizi doğrudur.
- **Kadro:** Hikmet, Defne, Necmi, Kerem (konuşmaz).
- **Mekân:** `b094_ocak`. Döngüler: duvar saatinin saniye ibresi, Necmi'nin çayından yükselen buhar.
- **Nesneler:** çay dolabı ve kilit (kahraman: tuş rakamları dünya 42 px, ekran rakamları 56 px; grup plânında 55/73 px, yakın plânda 63/84 px), boş bardaklı tepsi, Necmi'nin çayı.
- **Sızıntı yasağı:** ekranda 10 haneli dizi yok, "10" yok (sayaç 9'dan sayar), "on tuş/on basış" yok. Ekranda yalnız "– –", "– 1", "12", "23" görünür. `sizinti` listesi JSON'da.
- **Kare 0:** Kart; grup plânı 1,3x; kilit ortada "– –" ekranla, Kerem'in eli kulpta; dört yüz görünür; 0,32 sn'de kapak sarsılır (knock), ses 0,30 sn'de.

| # | ≈ sn | Yer | Ana eylem (nesneyle) | Döngüler | Kamera | Kesme |
|---|---|---|---|---|---|---|
| 1 Kanca | 0–3,77 | Grup | h1: Kerem kulpu iki kez çeker (knock ×2), kapak sarsılır; "şifreyi unuttum"da Hikmet omuz silker. | saat, buhar | 1,30 → 1,32x | (yok) |
| 2 Kilit insert | 3,77–10,0 | Kilit, Hikmet, Defne | h2: tuşlar tek tek gösterilir (halka nabzı); "iki haneli"de ekran çerçevesi; "aynı rakam iki kez"de "1"in üstünde iki iniş. | saat | 1,50x | sert kesme |
| 3 Hikmet | 10,0–14,46 | Hikmet, Kerem, Defne, kilit | h3: "Onay tuşu yok" baş sallar; "son iki tuşa" ekranı gösterir; "kilitlenmez" omuz silker. | saat, buhar | 1,50x | sert kesme |
| 4 Necmi (tuzak) | 14,46–18,09 | Necmi, Defne | n0: iki parmak; adım etiketi "9 ŞİFRE" → "9 × 2" → "9 × 2 = 18". | buhar | 1,50x | sert kesme |
| 5 Çürütme ve soru | 18,09–21,61 | Defne, Hikmet, Necmi | d2: "Olmaz" başını sallar; "daha azıyla" ekranı gösterir; "En az kaç" omuz silker. | buhar | 1,50x | sert kesme |
| 6 Sayaç + ipucu (10 sn) | 21,56–31,61 | Grup | Kerem üç kez basar: 23,1 sn "1" → "– 1"; 25,8 sn "2" → "12"; 28,2 sn "3" → "23" (pop ×3); düşünme pozları. Sayaç 9'dan 0'a. | saat, buhar, doğrusal itme | 1,30 → 1,36x | sert kesme |
| — Kesim | 31,79 | | `cevapsiz.mjs` | | | |
| 7 Buldum (arşiv) | 31,91 | Defne | sıçrama, ışınlar | | 1,50x | |
| 8 Cevap (arşiv) | 34,7–41,4 | Grup | Defne anlatır; çağrı. | | 1,30x | |

| id | Konuşan | Replik | Kelime | sn (ölçülen) |
|---|---|---|---|---|
| h1 | Hikmet | Misafir geliyor, dolap kilitli ve şifreyi unuttum. | 7 | 0,30–3,67 |
| h2 | Hikmet | Kilidin üç tuşu var: bir, iki, üç. Şifre iki haneli, aynı rakam iki kez olabilir. | 15 | 3,87–9,90 |
| h3 | Hikmet | Onay tuşu yok. Kilit son iki tuşa bakar, yanlışta kilitlenmez. | 10 | 10,10–14,36 |
| n0 | Necmi | Dokuz şifre, her biri iki tuş: on sekiz basış. | 9 | 14,56–17,99 |
| d2 | Defne | Olmaz, daha azıyla açarız. En az kaç tuşa basmalıyız? | 9 | 18,19–21,61 |
| d3 | Defne | Buldum! Her yeni tuş yeni bir şifre dener. (arşiv) | 8 | 31,91–34,39 |
| d4 | Defne | İlk tuş hiçbir şeyi denemez; sonraki dokuz tuşun her biri bir şifre dener. (arşiv) | 13 | 34,74–38,62 |
| d6 | Defne | Bunu şifresini unutan birine gönder. (arşiv) | 5 | 39,32–41,28 |

**Süre:** "Buldum!" öncesi 50 kelime (sınır 55). "Buldum!" 31,91 sn (hedef ≤ 32). Kesilmiş film ≈ 34,1 sn.

**Şartların filmdeki yeri (kesilmiş sürüm)**
- Yalnız üç tuş (1, 2, 3): kilit her karede, h2 ve tuş nabızları.
- İki haneli, aynı rakam iki kez olabilir (dokuz şifre): h2, kart ("Dokuz şifre"), Necmi'nin etiketi.
- Onay tuşu yok: h3 (levhada yalnız üç tuş ve ekran var).
- Son iki tuşa bakar: kart, h3, ekranın iki hanesi.
- Yanlışta kilitlenmez: h3; sayaçta üç basışta da kilit tepki vermez, basmaya devam edilir.
- Başta boş: kare 0'dan "– –" ekran; ilk basışta "– 1".
- Hikmet şifreyi unuttu: h1.
- Tuzak ve çürütme: n0 (etiket "9 × 2 = 18"), d2 (gerekçe söylenmez).

**İpucu değerlendirmesi:** Belgedeki eylem ipucu birebir: Kerem basar, ekranda "12" sonra "23". Öncesindeki ilk basış ("– 1", yine Kerem) kilidin başta boş olduğunu ve ilk basışın hiçbir şifreyi denemediğini gösterir; "12" → "23" kayması bir basışın yeni bir ikili kurduğunu gösterir. Diziyi ve sayıyı vermez; "her basış bir deneme" sıçraması izleyiciye kalır. Ekranda yalnız iki hane göründüğü için 10 haneli dizi ya da "10" hiçbir yerde yok.

**Kritik ve bağımsız göz (28 Kas)**
- Kadraj turları (stil kareleri): dört kişi ve kilit 1,3x'e sığsın diye dizilim değişti. Kerem önde solda, Hikmet ve Defne dolabın arkasında (Defne'nin ayağı gizli, 30 px yüksekte), Necmi önde sağda. Ekran levhanın sağına alındı, böylece hiçbir kol ekranın üstünden geçmiyor. Arkadakilerin "kolunu dolabın önüne çizme" denemesi beyaz kol parçası bıraktı ve kaldırıldı; arkadakiler dolabın üst kenarından kısa parmakla gösteriyor. Elin çeneye binmemesi için Hikmet 20 px yükseltildi.
- Kendi turum (3 sorun): (1) sayaç ilk 2 sn "9"da duruyordu ve giriş karesinde bir an "10" çıkıyordu; sayı 9'dan 0'a iner, hiç 10 göstermez. (2) Hikmet yakın plânında Kerem'in başı konuşanın yüzüne biniyordu; Kerem ve Defne kadraj dışına alındı, Hikmet kilitle tek kaldı. (3) Defne'nin eli ekranın sağ ucunu örtüyordu; ekranın dışına alındı.
- Bağımsız göz (yapıma katılmamış alt ajan, 1 fps): sızıntı yok, konuşan belli, Türkçe hatasız. Puanlar: kanca 7, okunabilirlik 8, hareket 6, çeşitlilik 6, kompozisyon 6, anlaşılırlık 8. Uygulananlar: insertte Hikmet'in parmağı tuşa değip ekran değişmiyordu ("basış sayılmıyor" gibi okunuyordu), parmak artık tuşun üst kenarında, tuşa değmiyor; sayaçta kolu görünmeyen Hikmet eli kaldırıldı, üç basışı da Kerem kendi koluyla yapıyor; basışlar eşit aralıklı (23,1 / 25,8 / 28,2 sn); Defne'ye Hikmet'siz ikili yakın plân verildi; Necmi yakın plânında kenarda kırpılan "1" tuşu tam görünüyor; Necmi'nin "iki" parmağı kulağından uzaklaştırıldı. Uygulanmayanlar: takip kartı ve rozetin boyutu (ortak `endCard` ve `riddleCard`); sayaç rozetinin Kerem'in beline binmesi (okunacak yazı yok).
