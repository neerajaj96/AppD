import { useEffect, useState } from 'react';
import { getRepository } from './repository';
import type { GlobalManifest, TextManifestFile } from './chunks';
import type { CanonicalUnit, V2Concept, V2Thread } from './schema';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'ok'; data: T }
  | { status: 'missing' | 'offline' | 'error'; message: string };

/** Global catalog for navigation chrome (traditions + text summaries). */
export function useCatalog(): AsyncState<GlobalManifest> {
  const [state, setState] = useState<AsyncState<GlobalManifest>>({ status: 'loading' });
  useEffect(() => {
    let live = true;
    getRepository()
      .getCatalog()
      .then((result) => {
        if (!live) return;
        setState(result.status === 'ok' ? { status: 'ok', data: result.data } : result);
      });
    return () => {
      live = false;
    };
  }, []);
  return state;
}

export interface V2TextData {
  manifest: TextManifestFile;
  units: CanonicalUnit[];
  concepts: V2Concept[];
  threads: V2Thread[];
}

/** Full chunk set for one text (units + concepts + per-text threads). */
export function useV2Text(textId: string | undefined): AsyncState<V2TextData> {
  const [state, setState] = useState<AsyncState<V2TextData>>({ status: 'loading' });
  useEffect(() => {
    if (!textId) {
      setState({ status: 'missing', message: 'No text id' });
      return;
    }
    let live = true;
    setState({ status: 'loading' });
    const repo = getRepository();
    Promise.all([
      repo.getText(textId),
      repo.getUnits(textId),
      repo.getConcepts(textId),
      repo.getThreads(textId),
    ]).then(([manifest, units, concepts, threads]) => {
      if (!live) return;
      if (manifest.status !== 'ok') {
        setState(manifest);
        return;
      }
      if (units.status !== 'ok') {
        setState(units);
        return;
      }
      if (concepts.status !== 'ok') {
        // Concepts are optional for compilation-in-progress texts.
        if (concepts.status === 'missing') {
          setState({
            status: 'ok',
            data: { manifest: manifest.data, units: units.data, concepts: [], threads: threads.status === 'ok' ? threads.data : [] },
          });
          return;
        }
        setState(concepts);
        return;
      }
      setState({
        status: 'ok',
        data: {
          manifest: manifest.data,
          units: units.data,
          concepts: concepts.data,
          threads: threads.status === 'ok' ? threads.data : [],
        },
      });
    });
    return () => {
      live = false;
    };
  }, [textId]);
  return state;
}

/** Full tradition thread across all its texts. */
export function useTraditionThread(traditionId: string | undefined): AsyncState<V2Thread[]> {
  const [state, setState] = useState<AsyncState<V2Thread[]>>({ status: 'loading' });
  useEffect(() => {
    if (!traditionId) {
      setState({ status: 'missing', message: 'No tradition id' });
      return;
    }
    let live = true;
    setState({ status: 'loading' });
    getRepository()
      .getTraditionThread(traditionId)
      .then((result) => {
        if (!live) return;
        if (result.status === 'missing') {
          setState({ status: 'ok', data: [] });
          return;
        }
        setState(result.status === 'ok' ? { status: 'ok', data: result.data } : result);
      });
    return () => {
      live = false;
    };
  }, [traditionId]);
  return state;
}
