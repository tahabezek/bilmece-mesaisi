# Amiral gemisi: "Şerbetli yüzler" (taslak, 16 Kas 2026)

**İstek:** Kullanıcı hikâyeli, senaryolu bir bilmece istedi: tek ekran ve iki poz yerine bilmeceyi yaşatan, izleyiciyi tutan bir video ve iyi bir kanca. "Yeteneğini konuştur."

## Bilmece

- **Logline:** Hikmet Bey'in doğum gününde Defne'nin de Necmi'nin de yanağına baklava şerbeti bulaşır. Ayna yoktur, konuşmak yasaktır. Hikmet "En az birinizin yüzünde şerbet var" der ve üçe kadar sayar. İlk sayışta kimse kıpırdamaz. İkinci sayışta ikisi aynı anda elini kaldırır.
- **Akılda kalacak tek şey:** Kimsenin kıpırdamaması da bir bilgidir.
- **Soru:** Ayna yok, konuşma yok. İkisi aynı anda nasıl anladı?

**Şartlar** (söylenir ve görünür):
- İkisi birbirinin yüzünü görür, kendi yüzünü göremez.
- Ayna yoktur, konuşmak ve dokunmak yasaktır.
- Hikmet herkesin önünde "En az birinizin yüzünde şerbet var" der.
- "Yüzünde şerbet olduğundan **emin olan**, ben üçe kadar sayınca elini kaldırsın" der. Sayışlar tekrarlanır ve eller aynı anda kalkar.
- İkisi de çok zekidir; emin olmadan el kaldırmaz.

**Tuzak:** "Birbirlerini gördüler, anladılar." Ama Necmi'nin yüzündeki şerbeti görmek Defne'ye kendi yüzü hakkında hiçbir şey söylemez.

**Cevap:**
1. Defne şöyle düşünür: "Benim yüzüm temiz olsaydı, Necmi bana bakıp temiz bir yüz görürdü. 'En az biri' dendiğine göre şerbetin kendi yüzünde olduğunu anlar, ilk sayışta elini kaldırırdı."
2. Necmi ilk sayışta elini kaldırmadı. Demek ki benim yüzümde de şerbet var.
3. Necmi de aynı şeyi düşünür. Bu yüzden ikinci sayışta ikisi birden elini kaldırır.

**Sağlamlık:**
- Mantıkta "ortak bilgi" bulmacası olarak bilinir (çamurlu çocuklar). Türkiye'de genel izleyici bilmez.
- Fizik ya da ders bilgisi gerekmez.
- Hikmet'in cümlesi gereklidir. Herkes zaten en az bir lekeli yüz görüyor, ama bunun **herkesin bildiğinin herkesçe bilinmesini** bu cümle sağlar. İsteyen için açıklama metninde ikinci soru olarak kullanılabilir.

## Neden amiral gemisi

- **Kanca hazır:** iki el aynı anda kalkar ve "NASIL?" Sondan başlamaya uygun.
- **Yaşatılabilir:** bakış açısı (POV) çekimleri, düşünce içinde "ya temiz olsaydım" dünyası (hayalet sahne), sayımın gerilimi.
- **Paylaşılır:** "Kimsenin kıpırdamaması bilgi verir" fikri insanı rahatsız eder, yorumlarda tartışma çıkarır.

## Üç yapı önerisi

### A · Sondan başla (önerilen)
- **0,0 sn:** Hikmet'in ağzında "…ÜÇ!" sözü, iki el aynı karede kalkar. Kare donar, büyük harflerle "NASIL?" belirir. Kare 0 aynı zamanda kapak olur.
- **0,8 sn:** Saat ibresi geri sarar, "1 DAKİKA ÖNCE" hapı. Mum üfleme, baklava tepsisi, şerbetin yanaklara bulaşması (yavaş çekim damla).
- Kurallar konur.
- **İlk sayış:** "Bir… iki… üç…" ve kimse kıpırdamaz. Sessizlik yok, müzik sürer. Sadece gözler oynar.
- **Sayaç:** "SEN DE DÜŞÜN".
- **Cevap:** Ekran ikiye bölünür. Solda "ya Defne temiz olsaydı" dünyası: yarı saydam hayalet Necmi ilk sayışta elini kaldırır. Sağda gerçek: Necmi kıpırdamamış. Hayalet söner, gerçek Defne'nin eli kalkar. Aynısı Necmi tarafında aynalanır. İki el, kancadaki kareye bağlanır (döngü dikişi).

### B · İçeriden (bakış açısı gerilimi)
- Bütün film Defne'nin gözünden.
- **0,0 sn:** Necmi'nin yanağında parlayan şerbet damlasına yakın çekim. İç ses: "Benim yüzümde de var mı?"
- Kalp atışıyla senkron sayım.
- **Cevap:** Defne'nin kafasında kurulan hayalet sahne.
- **Artısı:** Çok sürükleyici.
- **Eksisi:** Defne'nin yüzü az görünür. Kullanıcının "karakter görünmeli" kuralıyla çatışır.

### C · Tekrar oynatma (spor yorumu)
- Olay 6 saniyede hızlı oynanır. Hikmet spiker gibi anlatır.
- Sonra "TEKRAR İZLEYELİM": yavaş çekim, oklar, göz izleri, "burada Necmi kıpırdamadı" işaretleri.
- **Artısı:** Komik, ikinci izlemeyi kışkırtır.
- **Eksisi:** Analiz ekranına (şemaya) kayma riski taşır.

## Teknik dil (seçilen yapı için)

- **Yeni anlatım araçları:**
  - Sondan başlama ve geri sarma.
  - Yavaş çekim damla.
  - Bakış açısı çekimi ve göz izi.
  - Bölünmüş ekran.
  - Hayalet "ya öyle olsaydı" dünyası (`lekele` + `globalAlpha`).
  - Kalp atışıyla senkron kamera nabzı.
- **Kesme sayısı** rehberdeki 3–8 sınırını aşabilir (10–12). Bu bölüm için istisna; vektör kuralı ve nesne taşıma korunur.
- **Ses:** Müzik kesilmez. Sayımda müzik incelir, saat tıkırtısı öne çıkar; sessizlik yoktur.
- **Kapılar aynı:** ≤ 60 sn, kart ≤ 2 satır, −14 LUFS.
