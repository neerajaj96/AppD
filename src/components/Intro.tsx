import { Link } from 'react-router';
import { Compass, Library, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { introSchools, introSections, introSchoolName, introText } from '../content/introduction';

// General introduction to Indian philosophy: the nine-school map,
// common ground, means of knowledge, and how to use the app.
// Schools present in this app link into their systems.
export default function Intro() {
  const { language } = useLanguage();
  const nastika = introSchools.filter((s) => s.stance === 'nastika');
  const astika = introSchools.filter((s) => s.stance === 'astika');

  const schoolCard = (s: (typeof introSchools)[number]) => (
    <div key={s.id} className="bg-avyakta-2 rounded-xl border border-tamas-deep p-5 shadow-xs flex flex-col">
      <h3 className="font-serif font-bold text-sattva text-lg mb-1.5">
        {introSchoolName(s, language)}
      </h3>
      <p className="text-sm text-sattva-dim leading-relaxed flex-1">
        {introText(s.summary, language)}
      </p>
      {s.systemId && (
        <Link
          to={`/system/${s.systemId}`}
          className="mt-3 text-xs font-semibold text-rajas-dim hover:underline self-start"
        >
          {t(language, 'openSystemLabel')}
        </Link>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-3xl mx-auto">
      <div className="py-6 border-b border-tamas-deep text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-avyakta-2 border border-tamas-deep mb-4">
          <Compass className="w-6 h-6 text-sattva" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-sattva mb-2">{t(language, 'introTab')}</h1>
        <p className="text-lg text-sattva-dim max-w-2xl mx-auto">
          {language === 'ml'
            ? 'ഒമ്പത് ശാഖകൾ, പൊതുവായ ചോദ്യങ്ങൾ, അറിയാനുള്ള ഉപകരണങ്ങൾ — ദർശനങ്ങളിലേക്കുള്ള വഴികാട്ടി.'
            : 'Nine schools, shared questions, instruments of knowing — a guide into the darśanas.'}
        </p>
      </div>

      {introSections.slice(0, 1).map((sec) => (
        <section key={sec.id} className="bg-avyakta-2 rounded-2xl border border-tamas-deep p-6 shadow-xs">
          <h2 className="text-xl font-serif font-bold text-sattva mb-2">{introText(sec.title, language)}</h2>
          <p className="text-sattva-dim leading-relaxed">{introText(sec.body, language)}</p>
        </section>
      ))}

      <section className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-sattva flex items-center">
          <Library className="w-6 h-6 mr-2 text-sattva-dim" />
          {language === 'ml' ? 'ഒമ്പത് ശാഖകൾ' : 'The Nine Schools'}
        </h2>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sattva-dim">
          {t(language, 'nastikaLabel')} (3)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{nastika.map(schoolCard)}</div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sattva-dim pt-2">
          {t(language, 'astikaLabel')} (6)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{astika.map(schoolCard)}</div>
      </section>

      {introSections.slice(1).map((sec) => (
        <section key={sec.id} className="bg-avyakta-2 rounded-2xl border border-tamas-deep p-6 shadow-xs">
          <h2 className="text-xl font-serif font-bold text-sattva mb-2">{introText(sec.title, language)}</h2>
          <p className="text-sattva-dim leading-relaxed">{introText(sec.body, language)}</p>
        </section>
      ))}

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-rajas-dim hover:underline"
        >
          {language === 'ml' ? '← ദർശനങ്ങൾ കാണുക' : '← Browse the darśanas'}
          <ChevronRight className="w-4 h-4 ml-1 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
