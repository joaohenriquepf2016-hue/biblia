import React from 'react';
import { Sermon } from '../types';
import { formatScriptureDisplay } from '../utils/bibleParser';
import { Printer, X, Download } from 'lucide-react';

interface PrintOutlineProps {
  sermon: Sermon;
  onClose: () => void;
}

export const PrintOutline: React.FC<PrintOutlineProps> = ({ sermon, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white text-stone-900 overflow-y-auto p-6 sm:p-12 print:p-0">
      
      {/* Print Controls (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between p-4 bg-stone-100 rounded-2xl border border-stone-300 print:hidden">
        <div className="flex items-center gap-2 font-serif font-bold text-stone-900">
          <Printer className="w-5 h-5 text-amber-600" />
          <span>Visualização de Impressão / Folha de Púlpito</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Imprimir / Salvar em PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-3xl mx-auto space-y-6 font-serif bg-white p-8 border border-stone-200 rounded-2xl shadow-xs print:border-none print:shadow-none print:p-0">
        
        {/* Sermon Title Header */}
        <div className="border-b-2 border-stone-900 pb-4 text-center">
          <span className="text-xs uppercase font-sans font-bold tracking-widest text-stone-500">
            ESBOÇO DE PREGAÇÃO
          </span>
          <h1 className="text-3xl font-bold text-stone-950 mt-1">
            {sermon.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-sans text-stone-600 mt-2 font-medium">
            {sermon.theme && <span>Tema: <strong>{sermon.theme}</strong></span>}
            {sermon.mainScripture && <span>Texto Base: <strong>{sermon.mainScripture}</strong></span>}
            <span>Duração: <strong>{sermon.targetDurationMinutes} min</strong></span>
          </div>
        </div>

        {/* Notes */}
        {sermon.notes && (
          <div className="p-3 bg-stone-50 border-l-4 border-amber-600 text-xs italic font-sans text-stone-700">
            <strong>Nota Pastoral:</strong> {sermon.notes}
          </div>
        )}

        {/* Outline Sections */}
        <div className="space-y-6">
          {sermon.sections.map((section, idx) => (
            <div key={section.id} className="space-y-2">
              <div className="flex items-baseline justify-between border-b border-stone-300 pb-1">
                <h2 className="text-xl font-bold text-stone-900">
                  {idx + 1}. {section.title}
                </h2>
                {section.estimatedMinutes && (
                  <span className="text-xs font-sans text-stone-500 font-bold">
                    ({section.estimatedMinutes} min)
                  </span>
                )}
              </div>

              {section.content && (
                <p className="text-base text-stone-800 leading-relaxed whitespace-pre-wrap pl-2">
                  {section.content}
                </p>
              )}

              {section.scriptures.length > 0 && (
                <div className="pl-2 pt-1">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Passagens de Apoio:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-sm font-medium text-amber-900">
                    {section.scriptures.map(sc => (
                      <li key={sc.id}>
                        <strong>{formatScriptureDisplay(sc)}</strong>
                        {sc.note ? ` - ${sc.note}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-stone-200 text-center text-xs font-sans text-stone-400">
          Gerado pelo aplicativo Púlpito - Auxiliar de Pregação & Bíblia Sagrada
        </div>
      </div>
    </div>
  );
};
