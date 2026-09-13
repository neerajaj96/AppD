# One-shot: inserts authored EN keyPoints into the 7 keyPoint-less verses of
# devi-mahatmya-ch01.ts. Run from repo root: python3 scripts/add-dm-keypoints.py
import io

KP = {
'dm-1-33': ["**Knowing Without Escaping**: Naming confusion as confusion still leaves one inside it — information is not transformation.", "**The Precise Gap**: Intellect versus embodiment; Medhas's coming Mahāmāyā teaching addresses exactly this interval.", "**Vivekāndha**: Blindness despite discrimination — the verse coins the seeker's condition as its key compound."],
'dm-1-35': ["**Knowledge Is Universal**: Beasts, birds and deer all know — human beings hold no monopoly on awareness.", "**Day-Blind, Night-Blind**: Every creature sees in its own element and is blind outside it; standpoint governs sight.", "**Same Hunger, Same Bond**: Care for young driven by hunger binds animal and human alike — one mohā, different scales."],
'dm-1-41': ["**No Wonder Needed**: The pattern itself is Her — Yoganidrā, the Mahāmāyā of Hari, by whom the universe is deluded.", "**Sleep as Goddess**: Cosmic sleep is not absence but a Person — the first naming of the veil as divine.", "**Cause Located**: Suratha's 'what is this?' receives its single source before the battle-narrative resumes."],
'dm-1-43': ["**One Power, Two Jobs**: The same Goddess brings forth the triple world and, when gracious, becomes the cause of liberation.", "**Grace as Causality**: Bondage and freedom share one author — fortune turns on Her favour, not on technique alone.", "**Bhoga and Mokṣa, One Hand**: Boons and liberation both hers — enjoyment and freedom from the same giver."],
'dm-1-55': ["**Ardhamātrā**: The eternal half-measure even knowers of its nature cannot utter — sound's edge where speech fails.", "**Sāvitrī as Mother**: The Gāyatrī-source named supreme Mother — mantra and maternity are one power.", "**Held, Born, Sustained**: By Her the universe is held, brought forth and maintained — and at the end, reabsorbed."],
'dm-1-59': ["**Prakṛti of the Guṇas**: She manifests the three guṇas of everything — Sāṃkhya's evolute owned as Goddess.", "**Three Nights**: Kālarātri, Mahārātri, dread Moharātri — time's dread faces gathered into Her.", "**Virtues as Powers**: Śrī, Hrī, intellect, shame, nourishment, contentment, peace — excellences are Her, not ornaments."],
'dm-1-64': ["**Even He Sleeps**: Creator, preserver, consumer move only by Her — Viṣṇu himself lies under the sway of Her sleep.", "**Praise Disarmed**: If the gods are Her instruments, what power has the praiser? — humility itself as method.", "**Office as Gift**: Viṣṇu's embodied form and Brahmā's lordship both made by Her — rank itself is Her doing."],
}

def main():
    path = 'src/content/devi-mahatmya/chapters/devi-mahatmya-ch01.ts'
    lines = io.open(path, encoding='utf-8').read().split('\n')
    starts = [i for i, l in enumerate(lines) if l == '{']
    assert len(starts) > 0
    # locate each id
    import re
    id_at = {}
    for s in starts:
        m = re.match(r"    id: '([^']+)',", lines[s + 1])
        if m:
            id_at[m.group(1)] = s
    assert set(KP) <= set(id_at), f'missing ids: {set(KP) - set(id_at)}'
    out = list(lines)
    for vid, s in sorted(id_at.items(), key=lambda kv: -kv[1]):
        if vid not in KP:
            continue
        c = s + 1
        while out[c] not in ('  },', '  }'):
            c += 1
        blk = '\n'.join(out[s:c])
        assert 'translation:' in blk and 'commentary:' in blk, vid
        assert 'keyPoints' not in blk, f'{vid} already has keyPoints'
        kp_items = ',\n'.join(f'    "{k}"' for k in KP[vid])
        out[c - 1] = out[c - 1] + ','
        out.insert(c, f'    keyPoints: [\n{kp_items}\n    ]')
    io.open(path, 'w', encoding='utf-8').write('\n'.join(out))
    print(f'inserted keyPoints into {len(KP)} verses')

if __name__ == '__main__':
    main()
