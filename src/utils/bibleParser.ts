import { ScriptureRef } from '../types';
import { findBookByNameOrAbbrev } from '../data/bibleBooks';

// Regex que captura padrões como "João 3:16", "1 João 1:9", "1 Co 13:1-8", "Sl 23:1-6", "Rm 8:28", "Gênesis 1:1"
const MAIN_REF_PATTERN = /(?:([1-3]\s*)?([a-zA-ZáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]+))\s*([0-9]{1,3})\s*[:,\.vV]\s*([0-9]{1,3})(?:\s*[-–—aA]\s*([0-9]{1,3}))?/g;

export function generateUniqueId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `ref_${crypto.randomUUID()}`;
  }
  return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function parseScriptureString(text: string): ScriptureRef | null {
  if (!text) return null;
  const regex = new RegExp(MAIN_REF_PATTERN);
  const match = regex.exec(text);
  if (!match) return null;

  const prefix = match[1] ? match[1].trim() + ' ' : '';
  const bookNameRaw = (prefix + match[2]).trim();
  const book = findBookByNameOrAbbrev(bookNameRaw);

  if (!book) return null;

  const chapter = parseInt(match[3], 10);
  const verseStart = parseInt(match[4], 10);
  const verseEnd = match[5] ? parseInt(match[5], 10) : undefined;

  return {
    id: generateUniqueId(),
    rawText: match[0],
    book: book.name,
    bookAbbrev: book.abbrevs[0].toUpperCase(),
    chapter,
    verseStart,
    verseEnd: verseEnd && verseEnd >= verseStart ? verseEnd : undefined,
    status: 'pending',
  };
}

/**
 * Extrai TODAS as referências bíblicas de um texto.
 * Suporta múltiplos formatos:
 * - "João 3:16, Romanos 8:28, Salmos 23:1-6"
 * - "João 3:16, 17, 18" (múltiplos versículos no mesmo livro/capítulo)
 * - "Ef 6:10-18; 2 Tm 3:16; 1 Jo 1:9"
 * - "Gênesis 1:1, Mt 28:19-20"
 */
export function extractAllScriptures(text: string): ScriptureRef[] {
  if (!text || typeof text !== 'string') return [];
  const results: ScriptureRef[] = [];

  // Dividir por quebras de linha ou pontuação maior
  const cleanText = text.replace(/[\n\r]+/g, ' ; ');

  // 1. Extração de padrões completos: [Livro] [Cap]:[Vers]
  const fullRegex = new RegExp(MAIN_REF_PATTERN);
  let match: RegExpExecArray | null;

  while ((match = fullRegex.exec(cleanText)) !== null) {
    const prefix = match[1] ? match[1].trim() + ' ' : '';
    const bookNameRaw = (prefix + match[2]).trim();
    const book = findBookByNameOrAbbrev(bookNameRaw);

    if (book) {
      const chapter = parseInt(match[3], 10);
      const verseStart = parseInt(match[4], 10);
      const verseEnd = match[5] ? parseInt(match[5], 10) : undefined;
      const rawText = match[0];

      // Verifica se já adicionou exatamente essa referência
      const alreadyExists = results.some(
        r => r.book === book.name && r.chapter === chapter && r.verseStart === verseStart && r.verseEnd === verseEnd
      );

      if (!alreadyExists) {
        results.push({
          id: generateUniqueId(),
          rawText,
          book: book.name,
          bookAbbrev: book.abbrevs[0].toUpperCase(),
          chapter,
          verseStart,
          verseEnd: verseEnd && verseEnd >= verseStart ? verseEnd : undefined,
          status: 'pending',
        });
      }

      // 2. Verificar se logo após este versículo há outros versículos no mesmo capítulo separados por vírgula (ex: "João 3:16, 17, 18" ou "3:16, 18-20")
      const remainingIndex = match.index + match[0].length;
      const subText = cleanText.substring(remainingIndex, remainingIndex + 60);
      const followUpRegex = /^\s*,\s*([0-9]{1,3})(?:\s*[-–—aA]\s*([0-9]{1,3}))?/g;
      let followMatch: RegExpExecArray | null;
      let offset = 0;

      while ((followMatch = followUpRegex.exec(subText.substring(offset))) !== null) {
        const extraVStart = parseInt(followMatch[1], 10);
        const extraVEnd = followMatch[2] ? parseInt(followMatch[2], 10) : undefined;

        // Se o número for razoável para versículo e não for outro capítulo/livro
        if (extraVStart > 0 && extraVStart <= 176) {
          const extraExists = results.some(
            r => r.book === book.name && r.chapter === chapter && r.verseStart === extraVStart && r.verseEnd === extraVEnd
          );

          if (!extraExists) {
            results.push({
              id: generateUniqueId(),
              rawText: `${book.name} ${chapter}:${extraVStart}${extraVEnd ? '-' + extraVEnd : ''}`,
              book: book.name,
              bookAbbrev: book.abbrevs[0].toUpperCase(),
              chapter,
              verseStart: extraVStart,
              verseEnd: extraVEnd && extraVEnd >= extraVStart ? extraVEnd : undefined,
              status: 'pending',
            });
          }
        }

        offset += followMatch.index + followMatch[0].length;
        if (offset >= subText.length) break;
      }
    }
  }

  return results;
}

export function formatScriptureDisplay(ref: ScriptureRef | { book: string; chapter: number; verseStart: number; verseEnd?: number }): string {
  if (ref.verseEnd && ref.verseEnd !== ref.verseStart) {
    return `${ref.book} ${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`;
  }
  return `${ref.book} ${ref.chapter}:${ref.verseStart}`;
}
