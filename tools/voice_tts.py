# Seslendirme: bölüm dosyasındaki "voice.lines" satırlarını karakterin sesiyle (engine/voices.json) edge-tts'e okutur.
# Zaman çizelgesi bu gerçek sürelerden kurulur (ses saattir). Sıra: voice_tts → voice_trim → voice_words → timeline.
#   py -3.14 tools/voice_tts.py bolumler/001-badana.json   → assets/voice/<id>/<satır>.mp3 + words.json
# Değişmeyen satırlar yeniden üretilmez (metin + ses + hız + perde özeti).
import asyncio, hashlib, json, os, subprocess, sys
import edge_tts

ep = json.load(open(sys.argv[1], encoding='utf-8'))
cast = json.load(open(os.path.join('engine', 'voices.json'), encoding='utf-8'))
v = ep['voice']
out = os.path.join('assets', 'voice', ep['id'])
os.makedirs(out, exist_ok=True)
words_file = os.path.join(out, 'words.json')
old = json.load(open(words_file, encoding='utf-8')) if os.path.exists(words_file) else {}

FF = os.path.join('node_modules', 'ffmpeg-static', 'ffmpeg.exe' if os.name == 'nt' else 'ffmpeg')
def post(mp3, p):
    # aynı Ahmet sesinden üç ayrı adam: formant kaydırma (asetrate + atempo, süre korunur) ve yaşlı titremesi
    af = []
    if p.get('formant'):
        k = p['formant']   # edge-tts çıktısı 24 kHz mono
        af += [f'asetrate={round(24000 * k)}', 'aresample=24000', f'atempo={1 / k:.5f}']
    if p.get('vibrato'):
        af += ['aformat=sample_fmts=dbl', 'vibrato=f={}:d={}'.format(*p['vibrato'])]   # float girişte LAME'i bozuyor
    if af:
        tmp = mp3 + '.tmp.mp3'
        subprocess.run([FF, '-v', 'error', '-y', '-i', mp3, '-af', ','.join(af), '-c:a', 'libmp3lame', '-b:a', '128k', tmp], check=True)
        os.replace(tmp, mp3)

async def say(line):
    p = {**cast[line['who']], **{k: line[k] for k in ('rate', 'pitch') if k in line}}   # satır kendi hız/perdesini taşıyabilir
    text = line.get('tts', line['text'])
    key = hashlib.sha1(f"{text}|{p['name']}|{p['rate']}|{p['pitch']}|{p.get('formant')}|{p.get('vibrato')}".encode()).hexdigest()[:12]
    mp3 = os.path.join(out, line['id'] + '.mp3')
    if old.get(line['id'], {}).get('key') == key and os.path.exists(mp3):
        return line['id'], old[line['id']]
    # servis ara sıra boş yanıt veriyor: artan beklemeyle yeniden denenir
    for k in range(30):
        try:
            audio = bytearray()
            async for ch in edge_tts.Communicate(text, p['name'], rate=p['rate'], pitch=p['pitch']).stream():
                if ch['type'] == 'audio':
                    audio += ch['data']
            if audio:
                break
        except edge_tts.exceptions.NoAudioReceived:
            pass
        await asyncio.sleep(min(2 + 2 * k, 12))
    else:
        raise SystemExit(f"{line['id']}: ses alınamadı")
    open(mp3, 'wb').write(audio)
    post(mp3, p)
    return line['id'], {'key': key}

async def main():
    res = {}
    for line in v['lines']:
        k, r = await say(line)
        res[k] = r
        print(k, line['who'], 'tamam')
    json.dump(res, open(words_file, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

asyncio.run(main())
