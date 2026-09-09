import { systems, getText } from '../index';
import { diagramRegistry } from '../../components/diagrams';

describe('content integrity', () => {
  for (const sys of systems) {
    for (const text of sys.texts) {
      describe(`${sys.id}/${text.id}`, () => {
        it('has no duplicate verse ids', () => {
          const ids = text.verses.map((v) => v.id);
          const unique = new Set(ids);
          expect(unique.size).toBe(ids.length);
        });

        it('every verse.diagramId (if set) exists in the diagram registry', () => {
          const missing = text.verses.filter((v) => v.diagramId && !diagramRegistry[v.diagramId]).map((v) => v.id);
          expect(missing).toEqual([]);
        });

        it('every verse.conceptIds (if set) reference a concept that exists', () => {
          const conceptIds = new Set(text.concepts.map((c) => c.id));
          const bad: string[] = [];
          text.verses.forEach((v) => {
            (v.conceptIds ?? []).forEach((cid) => {
              if (!conceptIds.has(cid)) bad.push(`${v.id} -> ${cid}`);
            });
          });
          expect(bad).toEqual([]);
        });

        it('every concept.diagramId (if set) exists in the diagram registry', () => {
          const missing = text.concepts.filter((c) => c.diagramId && !diagramRegistry[c.diagramId]).map((c) => c.id);
          expect(missing).toEqual([]);
        });

        test(`${text.title} concept diagrams are registered and cross-linked correctly`, () => {
          text.concepts.forEach((concept) => {
            if (concept.diagramId) {
              // Must be a known diagram
              expect(Object.keys(diagramRegistry)).toContain(concept.diagramId);
            }
            // Must link to valid verses
            (concept.relatedVerseIds || []).forEach((vId) => {
              const verseExists = text.verses.some((v) => v.id === vId);
              expect(verseExists).toBe(true);
            });
          });
        });

        if (text.contentDepth === 'concepts-only') {
          it('has no verses', () => {
            expect(text.verses.length).toBe(0);
          });
        } else {
          it('every concept.relatedVerseIds points at a verse that actually exists', () => {
            const verseIds = new Set(text.verses.map((v) => v.id));
            const bad: string[] = [];
            text.concepts.forEach((c) => {
              (c.relatedVerseIds || []).forEach((vid) => {
                if (!verseIds.has(vid)) bad.push(`${c.id} -> ${vid}`);
              });
            });
            expect(bad).toEqual([]);
          });

          it('every verse has non-empty translation, commentary, and at least one key point (if complete)', () => {
            if (text.contentStatus === 'partial') return; // Skip strict content checks for texts still being compiled
            
            const bad = text.verses
              .filter((v) => !v.content.en?.translation?.trim() || !v.content.en?.commentary?.trim() || !v.content.en?.keyPoints || v.content.en.keyPoints.length === 0)
              .map((v) => v.id);
            expect(bad).toEqual([]);
          });
        }
        
        it('every concept has non-empty title and summary in English', () => {
          const bad = text.concepts
            .filter((c) => !c.content.en?.title?.trim() || !c.content.en?.summary?.trim())
            .map((c) => c.id);
          expect(bad).toEqual([]);
        });
      });
    }

    describe(`${sys.id} thread`, () => {
      it('has no duplicate step ids', () => {
        const ids = sys.thread.map((t) => t.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('every step has non-empty title and narrative in English', () => {
        const bad = sys.thread
          .filter((t) => !t.content.en?.title?.trim() || !t.content.en?.narrative?.trim())
          .map((t) => t.id);
        expect(bad).toEqual([]);
      });

      it('every step.textId names a text that actually belongs to this system', () => {
        const textIds = new Set(sys.texts.map((t) => t.id));
        const bad = sys.thread.filter((t) => !textIds.has(t.textId)).map((t) => t.id);
        expect(bad).toEqual([]);
      });

      it('every step references a concept that exists in its named text (when conceptId is set)', () => {
        const bad = sys.thread
          .filter((t) => t.conceptId && !getText(sys.id, t.textId)?.concepts.some((c) => c.id === t.conceptId))
          .map((t) => t.id);
        expect(bad).toEqual([]);
      });

      it('every step.verseIds (if set) point at verses that exist in its named text', () => {
        const bad: string[] = [];
        sys.thread.forEach((t) => {
          const verseIds = new Set(getText(sys.id, t.textId)?.verses.map((v) => v.id));
          (t.verseIds ?? []).forEach((vid) => {
            if (!verseIds.has(vid)) bad.push(`${t.id} -> ${vid}`);
          });
        });
        expect(bad).toEqual([]);
      });
    });
  }

  it('getText resolves every registered text by its own systemId/textId', () => {
    for (const sys of systems) {
      for (const text of sys.texts) {
        expect(getText(sys.id, text.id)?.id).toBe(text.id);
      }
    }
  });

  it('getText returns undefined for an unknown system or text rather than throwing', () => {
    expect(getText('not-a-system', 'not-a-text')).toBeUndefined();
    expect(getText('samkhya', 'not-a-text')).toBeUndefined();
  });
});
