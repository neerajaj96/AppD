import React from 'react';
import { Link } from 'react-router';
import { systems } from '../content';
import { getSystemAccent } from '../utils/theme';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-serif font-bold text-sattva mb-4">Darśana</h1>
        <p className="text-lg text-sattva-dim max-w-2xl mx-auto">
          An exploration of classical Indian philosophical systems (Darśanas), 
          their foundational texts, and core concepts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systems.map((system) => {
          const accent = getSystemAccent(system.id);
          return (
            <Link
              key={system.id}
              to={`/system/${system.id}`}
              className={`block group bg-avyakta-2 rounded-xl shadow-xs border border-tamas-deep hover:shadow-md transition-all p-6 relative overflow-hidden`}
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1 opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: accent.primary }}
              />
              <h2
                className="text-2xl font-serif font-bold text-sattva transition-colors mb-2"
              >
                {system.title}
              </h2>
              <p className="text-sattva-dim mb-4 h-12 overflow-hidden">
                {system.subtitle}
              </p>
              <div className="text-sm font-medium text-sattva-dim uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Texts</span>
                <span className="text-xs font-normal text-tamas lowercase">
                  {system.texts.reduce((acc, t) => acc + (t.concepts?.length || 0), 0)} concepts
                </span>
              </div>
              <ul className="space-y-1">
                {system.texts.map((text) => (
                  <li key={text.id} className="text-sattva flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span 
                        className="w-1.5 h-1.5 rounded-full mr-2"
                        style={{ backgroundColor: accent.primary }}
                      ></span>
                      {text.transliteratedTitle}
                    </div>
                  </li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

