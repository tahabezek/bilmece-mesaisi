// Bölüm 23–28 (kısa kalıp v3, 2026-11-10): JSON üretici. Yeniden çalıştırınca sira/disabled korunur.
//   node tools/yeni_bolumler_023_028.mjs
import fs from 'node:fs';

const TAGS = ['#bilmece', '#zekasorusu', '#akıloyunları', '#bulmaca', '#ofis'];
const L = (id, who, gap, text, tts) => ({ id, who, gap, text, ...(tts ? { tts } : {}) });
const MUSIC = { think: ['h3>', 'd3'], riser: ['n1', 'd3'], hit: 'd3', end: 'd6>', style: 'yumusak' };

const EPS = [
  {
    id: '023-mum', num: 23, sira: 20, slug: 'dogum-gunu-mumlari',
    card: ["Pastada 10 mum yanıyordu, 4'ü söndü.", 'Sabah kaç mum kaldı?'],
    caption: 'Zeka sorusu: Doğum günü pastasında 10 mum yanıyordu. Rüzgârda 4\'ü söndü, kimse yeniden yakmadı. Pasta sabaha kadar masada kaldı. Sabah pastada kaç mum vardı?\n\nZengin Kız Fakir Oğlan\'ın bilmecelerinden. Cevap videonun sonunda.',
    lines: [
      L('h1', 'hikmet', 0.4, 'Defneciğim, doğum günü pastama on mum yaktık.'),
      L('d1', 'defne', 0.25, 'İyi ki doğdunuz Müdür Bey!'),
      L('h2a', 'hikmet', 0.3, 'Rüzgâr esti, mumların dördü söndü. Kimse yeniden yakmadı.'),
      L('h2b', 'hikmet', 0.3, 'Sabaha kadar kimse pastaya dokunmadı. Sabah kaç mum vardı?'),
      L('h3', 'hikmet', 0.4, 'Bilirsen kalan pasta senin.'),
      L('d2', 'defne', 0.6, 'Kolay! On eksi dört, altı mum!'),
      L('hd', 'hikmet', 0.45, 'Hayır! Altı değil.'),
      L('n1', 'necmi', 5.6, 'Hanım akşam mum yaktı. Sabah baktım, şamdanda mum yok, bir avuç erimiş mum var!'),
      L('d3', 'defne', 0.35, 'Buldum! Dört mum!'),
      L('d4', 'defne', 0.4, 'Yanan altı mum gece boyunca eriyip bitti.'),
      L('d5', 'defne', 0.45, 'Sönen dört mum sabaha kaldı!'),
      L('h4', 'hikmet', 1.1, 'Kalan pasta senin. Biraz mum tadı var ama.'),
      L('d6', 'defne', 0.55, 'Bunu doğum günü mumunu üfleyemeyen arkadaşına gönder.'),
    ],
    sfx: [['buzz', 'hd:0'], ['swish', 'd4:0'], ['pop', 'd5:1'], ['ding', 'd5:3'], ['womp', 'd5>+0.15']],
  },
  {
    id: '024-uc-gun', num: 24, sira: 21, slug: 'art-arda-uc-gun',
    card: ['Salı, Perşembe, Cumartesi yasak.', 'Art arda üç gün say.'],
    caption: 'Zeka sorusu: Art arda üç gün say. Ama Salı, Perşembe ve Cumartesi demek yasak. Haftanın hangi üç gününü seçsen biri yasak çıkıyor. Nasıl sayarsın?\n\nZengin Kız Fakir Oğlan\'ın bilmecelerinden. Cevap videonun sonunda.',
    lines: [
      L('h1', 'hikmet', 0.4, 'Defneciğim, bana art arda üç gün söyle.'),
      L('d1', 'defne', 0.25, 'Çarşamba, Perşembe, Cuma!'),
      L('h2a', 'hikmet', 0.3, 'Olmaz! Salı, Perşembe ve Cumartesi demek yasak.'),
      L('h2b', 'hikmet', 0.3, 'Bu üçünü söylemeden art arda üç gün sayacaksın.'),
      L('h3', 'hikmet', 0.4, 'Bilirsen yarın öğleden sonra izinlisin.'),
      L('d2', 'defne', 0.6, 'O zaman Pazar, Pazartesi, Çarşamba!'),
      L('hd', 'hikmet', 0.45, 'Hayır! Pazartesiden sonra Salı gelir. Haftadaki her üçlüde bir yasak gün var.'),
      L('n1', 'necmi', 5.6, 'Müdür Bey, ben işi asla yarına bırakmam. Dün yapamadıysam bugün yaparım!'),
      L('d3', 'defne', 0.35, 'Buldum! Dün, bugün, yarın!'),
      L('d4', 'defne', 0.4, 'Üçü de gün, üçü de art arda. Hiçbiri yasak değil!'),
      L('h4', 'hikmet', 1.1, 'Yarın izinlisin… Ama bugün daha bitmedi.', 'Yarın izinlisin. Ama bugün daha bitmedi.'),
      L('d6', 'defne', 0.55, 'Bunu her işi yarına bırakan arkadaşına gönder.'),
    ],
    sfx: [['buzz', 'hd:0'], ['pop', 'd3:1'], ['pop', 'd3:2'], ['pop', 'd3:3'], ['ding', 'd4:8'], ['womp', 'd4>+0.15']],
  },
  {
    id: '025-kayip-lira', num: 25, sira: 22, slug: 'kayip-on-lira',
    card: ['Herkes 90 ödedi: 270. Kuryede 20.', '290 eder. Kayıp 10 lira nerede?'],
    caption: 'Zeka sorusu: Üç kişi 300 liralık yemek söyledi, herkes 100 verdi. Restoran 50 lira geri yolladı. Kurye 20\'sini aldı, 30\'unu herkese 10\'ar dağıttı. Herkes 90 ödedi: 270. Kuryedeki 20 ile 290. Kayıp 10 lira nerede?\n\nZengin Kız Fakir Oğlan\'ın bilmecelerinden. Cevap videonun sonunda.',
    lines: [
      L('h1', 'hikmet', 0.4, 'Defneciğim, on lira kayıp! Hesap tutmuyor.'),
      L('h2a', 'hikmet', 0.3, 'Yemek üç yüz liraydı, üçümüz yüzer verdik. Restoran indirim yapıp elli lira geri yolladı.'),
      L('h2b', 'hikmet', 0.3, 'Kerem yirmisini aldı, bize onar lira dağıttı.'),
      L('h2c', 'hikmet', 0.35, "Herkes doksan ödedi, iki yüz yetmiş. Kerem'deki yirmiyle iki yüz doksan. On lira nerede?", 'Herkes doksan ödedi, iki yüz yetmiş. Keremdeki yirmiyle iki yüz doksan. On lira nerede?'),
      L('h3', 'hikmet', 0.3, 'Bulursan on lira senin.'),
      L('d2', 'defne', 0.45, 'Parayı Kerem mi sakladı?'),
      L('hd', 'hikmet', 0.45, "Hayır! Kerem'de sadece yirmi var.", 'Hayır! Keremde sadece yirmi var.'),
      L('n1', 'necmi', 5.6, 'Hanım kızdı: Çayı hem harcamaya hem kasaya yazmışsın, iki kere saymışsın!'),
      L('d3', 'defne', 0.35, 'Buldum! Kayıp para yok!'),
      L('d4', 'defne', 0.4, "Kerem'in yirmisi o iki yüz yetmişin içinde zaten. İki yüz elli restorana, yirmi Kerem'e.", 'Keremin yirmisi o iki yüz yetmişin içinde zaten. İki yüz elli restorana, yirmi Kereme.'),
      L('d5', 'defne', 0.45, 'Yirmiyi bir daha eklemek, onu iki kere saymak. Doğrusu: iki yüz yetmiş artı otuz, üç yüz!'),
      L('h4', 'hikmet', 1.1, 'Kerem! O yirmiyi geri getir!'),
      L('d6', 'defne', 0.55, 'Bunu hesabı hep yanlış bölen arkadaşına gönder.'),
    ],
    sfx: [['buzz', 'hd:0'], ['swish', 'd4:0'], ['pop', 'd4:8'], ['pop', 'd4:12'], ['ding', 'd5:14'], ['womp', 'd5>+0.15']],
  },
  {
    id: '026-armut', num: 26, sira: 23, slug: 'sisedeki-armut',
    card: ['Şişenin ağzı dar, armut kocaman.', 'Armut şişeye nasıl girdi?'],
    caption: 'Zeka sorusu: Ağzı dar bir şişenin içinde koca bir armut var. Şişe kesilmemiş, yapıştırılmamış. Armut bütün, ezik bile değil. Armut şişeye nasıl girdi?\n\nZengin Kız Fakir Oğlan\'ın bilmecelerinden. Cevap videonun sonunda.',
    lines: [
      L('h1', 'hikmet', 0.4, "Defneciğim, Necmi'nin şişesinde koskoca bir armut var!", 'Defneciğim, Necminin şişesinde koskoca bir armut var!'),
      L('h2a', 'hikmet', 0.3, 'Şişenin ağzı dar, armut kocaman. Şişe kesilmemiş, yapıştırılmamış.'),
      L('h2b', 'hikmet', 0.3, 'Armut da bütün, ne kesik ne ezik. Bu armut şişeye nasıl girdi?'),
      L('h3', 'hikmet', 0.4, 'Bilirsen bu hafta çay benden.'),
      L('d2', 'defne', 0.6, 'Armudu ısıtıp yumuşattılar mı?'),
      L('hd', 'hikmet', 0.45, 'Hayır! Armut hiç ezilmemiş.'),
      L('n1', 'necmi', 5.6, 'Hanım kabağı kutunun içinde büyüttü. Kabak kutunun şeklini aldı: kare kabak!'),
      L('d3', 'defne', 0.35, 'Buldum! Armut şişede büyüdü!'),
      L('d4', 'defne', 0.4, 'Armut daha minicikken dalına şişe geçirdiler.'),
      L('d5', 'defne', 0.45, 'Armut şişenin içinde büyüdü. Sonra dalından kestiler!'),
      L('h4', 'hikmet', 1.1, 'Necmi, o kare kabağı da getir, görelim.'),
      L('d6', 'defne', 0.55, 'Bunu her şeyi zorla sığdırmaya çalışan arkadaşına gönder.'),
    ],
    sfx: [['buzz', 'hd:0'], ['swish', 'd4:0'], ['pop', 'd4:4'], ['ding', 'd5:6'], ['womp', 'd5>+0.15']],
  },
  {
    id: '027-yilbasi', num: 27, sira: 24, slug: 'evvelsi-gun-25-yasindaydim',
    card: ['Evvelsi gün 25 yaşındaydım,', 'seneye 28 olacağım. Nasıl?'],
    caption: 'Zeka sorusu: Kerem diyor ki: "Evvelsi gün 25 yaşındaydım, seneye 28 olacağım." Kerem yalan söylemiyor, "seneye" de gelecek yıl demek. Bu nasıl olur?\n\nZengin Kız Fakir Oğlan\'ın bilmecelerinden. Cevap videonun sonunda.',
    lines: [
      L('h1', 'hikmet', 0.4, 'Defneciğim, Kerem dedi ki: Evvelsi gün yirmi beş yaşındaydım, seneye yirmi sekiz olacağım.'),
      L('d1', 'defne', 0.25, 'Nasıl yani? Bir yılda üç yaş mı büyüyecek?'),
      L('h2a', 'hikmet', 0.3, 'Kerem yalan söylemiyor, kimliğine baktım.'),
      L('h2b', 'hikmet', 0.3, 'Seneye dediği de gelecek yıl. Bu nasıl olur?'),
      L('h3', 'hikmet', 0.4, 'Bilirsen doğum gününde pasta benden.'),
      L('d2', 'defne', 0.6, 'Kerem yaşını yanlış mı sayıyor?'),
      L('hd', 'hikmet', 0.45, 'Hayır! Kerem çok iyi sayar.'),
      L('n1', 'necmi', 5.6, 'Benim oğlan otuz bir Aralık doğumlu. Pastasını keser, ertesi sabah yeni yıl!'),
      L('d3', 'defne', 0.35, "Buldum! Kerem bunu bir Ocak'ta söyledi!", 'Buldum! Kerem bunu bir Ocakta söyledi!'),
      L('d4', 'defne', 0.4, "Doğum günü otuz bir Aralık. Otuz Aralık'ta yirmi beş yaşındaydı, otuz bir Aralık'ta yirmi altı oldu.", 'Doğum günü otuz bir Aralık. Otuz Aralıkta yirmi beş yaşındaydı, otuz bir Aralıkta yirmi altı oldu.'),
      L('d5', 'defne', 0.45, 'Bu yılın sonunda yirmi yedi olacak, seneye de yirmi sekiz!'),
      L('h4', 'hikmet', 1.1, "Kerem'e söyleyin, pastası benden.", 'Kereme söyleyin, pastası benden.'),
      L('d6', 'defne', 0.55, 'Bunu yaşını hep yanlış söyleyen arkadaşına gönder.'),
    ],
    sfx: [['buzz', 'hd:0'], ['swish', 'd4:0'], ['pop', 'd4:5'], ['pop', 'd4:10'], ['pop', 'd5:3'], ['ding', 'd5:8'], ['womp', 'd5>+0.15']],
  },
  {
    id: '028-cita', num: 28, sira: 25, slug: 'cita-ve-kargo',
    card: ['Hiçbir kenar 1 metreyi geçemez.', '1,5 metrelik çıta nasıl gider?'],
    caption: 'Zeka sorusu: Kargo kuralına göre paketin hiçbir kenarı 1 metreyi geçemez. 1,5 metrelik ince bir çıtayı kırmadan, kesmeden, bükmeden nasıl gönderirsin?\n\nZengin Kız Fakir Oğlan\'ın bilmecelerinden. Cevap videonun sonunda.',
    lines: [
      L('h1', 'hikmet', 0.4, 'Defneciğim, bu bir buçuk metrelik ince çıtayı kargolayacağız.'),
      L('h2a', 'hikmet', 0.3, 'Kargo kuralı: paketin hiçbir kenarı bir metreyi geçemez.'),
      L('h2b', 'hikmet', 0.3, 'Çıtayı kırmak, kesmek, bükmek yok. Nasıl göndereceğiz?'),
      L('h3', 'hikmet', 0.4, 'Bilirsen bu hafta erken çıkarsın.'),
      L('d2', 'defne', 0.6, 'Bir metrelik kutunun kapağına çapraz yatırırız!'),
      L('hd', 'hikmet', 0.45, 'Olmaz! Kapağın çaprazı bir metre kırk bir. Yetmez!'),
      L('n1', 'necmi', 5.6, 'Şemsiyem dolaba ne düz sığdı ne çapraz. Köşeden köşeye yatırdım, sığdı!'),
      L('d3', 'defne', 0.35, 'Buldum! Köşeden köşeye!'),
      L('d4', 'defne', 0.4, 'Bir metrelik küp kutu alırız. Çıtayı alt köşeden karşı üst köşeye yatırırız.'),
      L('d5', 'defne', 0.45, 'O köşegen bir metre yetmiş üç. Çıta rahat sığar!'),
      L('h4', 'hikmet', 1.1, 'Necmi, şemsiyeni dolaptan çıkar. Yağmur başladı.'),
      L('d6', 'defne', 0.55, 'Bunu bavulu hiç kapanmayan arkadaşına gönder.'),
    ],
    sfx: [['buzz', 'hd:0'], ['swish', 'd4:0'], ['pop', 'd4:8'], ['ding', 'd5:7'], ['womp', 'd5>+0.15']],
  },
];

for (const e of EPS) {
  const f = `bolumler/${e.id}.json`;
  const old = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
  const out = {
    id: e.id, num: e.num, sira: old.sira ?? e.sira, bpm: 120, slug: e.slug, coverAt: 0, hashtags: TAGS,
    card: e.card, caption: e.caption,
    voice: { tight: 0.28, tail: 2.4, lines: e.lines },
    countdown: 'n1-0.3', music: MUSIC, sfx: e.sfx,
    ...(old.disabled ? { disabled: old.disabled } : {}),
  };
  fs.writeFileSync(f, JSON.stringify(out, null, 1) + '\n');
  console.log(f, e.lines.reduce((s, l) => s + l.text.split(/\s+/).length, 0), 'kelime');
}
