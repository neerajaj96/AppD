import { System, SystemId } from '../../types/content';
import { brahmaSutrasText, brahmaSutrasThread } from './brahma-sutras';
import { adhyatmaTexts, adhyatmaThread } from './adhyatma-ramayana/adhyatma-ramayana';

export const vedantaSystem: System = {
  id: 'vedanta' as SystemId,
  title: 'Vedanta',
  subtitle: 'The End of the Vedas (Advaita)',
  texts: [brahmaSutrasText, ...adhyatmaTexts],
  thread: [...brahmaSutrasThread, ...adhyatmaThread],
};
