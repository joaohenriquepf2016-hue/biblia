import { BibleBook } from '../types';

export const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento (39 livros)
  { id: 'gn', name: 'Gênesis', abbrevs: ['gn', 'gen', 'genesis'], testament: 'VT', chaptersCount: 50, versesPerChapter: [] },
  { id: 'ex', name: 'Êxodo', abbrevs: ['ex', 'exod', 'exodo'], testament: 'VT', chaptersCount: 40, versesPerChapter: [] },
  { id: 'lv', name: 'Levítico', abbrevs: ['lv', 'lev', 'levitico'], testament: 'VT', chaptersCount: 27, versesPerChapter: [] },
  { id: 'nm', name: 'Números', abbrevs: ['nm', 'num', 'numeros'], testament: 'VT', chaptersCount: 36, versesPerChapter: [] },
  { id: 'dt', name: 'Deuteronômio', abbrevs: ['dt', 'deut', 'deuteronomio'], testament: 'VT', chaptersCount: 34, versesPerChapter: [] },
  { id: 'js', name: 'Josué', abbrevs: ['js', 'jos', 'josue'], testament: 'VT', chaptersCount: 24, versesPerChapter: [] },
  { id: 'jz', name: 'Juízes', abbrevs: ['jz', 'juiz', 'juizes'], testament: 'VT', chaptersCount: 21, versesPerChapter: [] },
  { id: 'rt', name: 'Rute', abbrevs: ['rt', 'rut', 'rute'], testament: 'VT', chaptersCount: 4, versesPerChapter: [] },
  { id: '1sm', name: '1 Samuel', abbrevs: ['1sm', '1sam', '1 samuel', '1 sam'], testament: 'VT', chaptersCount: 31, versesPerChapter: [] },
  { id: '2sm', name: '2 Samuel', abbrevs: ['2sm', '2sam', '2 samuel', '2 sam'], testament: 'VT', chaptersCount: 24, versesPerChapter: [] },
  { id: '1rs', name: '1 Reis', abbrevs: ['1rs', '1reis', '1 reis'], testament: 'VT', chaptersCount: 22, versesPerChapter: [] },
  { id: '2rs', name: '2 Reis', abbrevs: ['2rs', '2reis', '2 reis'], testament: 'VT', chaptersCount: 25, versesPerChapter: [] },
  { id: '1cr', name: '1 Crônicas', abbrevs: ['1cr', '1cron', '1 cronicas'], testament: 'VT', chaptersCount: 29, versesPerChapter: [] },
  { id: '2cr', name: '2 Crônicas', abbrevs: ['2cr', '2cron', '2 cronicas'], testament: 'VT', chaptersCount: 36, versesPerChapter: [] },
  { id: 'ed', name: 'Esdras', abbrevs: ['ed', 'esd', 'esdras'], testament: 'VT', chaptersCount: 10, versesPerChapter: [] },
  { id: 'ne', name: 'Neemias', abbrevs: ['ne', 'neem', 'neemias'], testament: 'VT', chaptersCount: 13, versesPerChapter: [] },
  { id: 'et', name: 'Ester', abbrevs: ['et', 'est', 'ester'], testament: 'VT', chaptersCount: 10, versesPerChapter: [] },
  { id: 'job', name: 'Jó', abbrevs: ['job', 'jo', 'jó'], testament: 'VT', chaptersCount: 42, versesPerChapter: [] },
  { id: 'sl', name: 'Salmos', abbrevs: ['sl', 'sal', 'ps', 'salmos', 'salmo'], testament: 'VT', chaptersCount: 150, versesPerChapter: [] },
  { id: 'pv', name: 'Provérbios', abbrevs: ['pv', 'prov', 'proverbios', 'proverbio'], testament: 'VT', chaptersCount: 31, versesPerChapter: [] },
  { id: 'ec', name: 'Eclesiastes', abbrevs: ['ec', 'ecl', 'eclesiastes'], testament: 'VT', chaptersCount: 12, versesPerChapter: [] },
  { id: 'ct', name: 'Cantares', abbrevs: ['ct', 'cant', 'cantares', 'canticos'], testament: 'VT', chaptersCount: 8, versesPerChapter: [] },
  { id: 'is', name: 'Isaías', abbrevs: ['is', 'isaias', 'isa'], testament: 'VT', chaptersCount: 66, versesPerChapter: [] },
  { id: 'jr', name: 'Jeremias', abbrevs: ['jr', 'jer', 'jeremias'], testament: 'VT', chaptersCount: 52, versesPerChapter: [] },
  { id: 'lm', name: 'Lamentações', abbrevs: ['lm', 'lam', 'lamentacoes'], testament: 'VT', chaptersCount: 5, versesPerChapter: [] },
  { id: 'ez', name: 'Ezequiel', abbrevs: ['ez', 'ezeq', 'ezequiel'], testament: 'VT', chaptersCount: 48, versesPerChapter: [] },
  { id: 'dn', name: 'Daniel', abbrevs: ['dn', 'dan', 'daniel'], testament: 'VT', chaptersCount: 12, versesPerChapter: [] },
  { id: 'os', name: 'Oseias', abbrevs: ['os', 'ose', 'oseias'], testament: 'VT', chaptersCount: 14, versesPerChapter: [] },
  { id: 'jl', name: 'Joel', abbrevs: ['jl', 'joe', 'joel'], testament: 'VT', chaptersCount: 3, versesPerChapter: [] },
  { id: 'am', name: 'Amós', abbrevs: ['am', 'amos'], testament: 'VT', chaptersCount: 9, versesPerChapter: [] },
  { id: 'ob', name: 'Obadias', abbrevs: ['ob', 'oba', 'obadias'], testament: 'VT', chaptersCount: 1, versesPerChapter: [] },
  { id: 'jn', name: 'Jonas', abbrevs: ['jn', 'jon', 'jonas'], testament: 'VT', chaptersCount: 4, versesPerChapter: [] },
  { id: 'mq', name: 'Miqueias', abbrevs: ['mq', 'miq', 'miqueias'], testament: 'VT', chaptersCount: 7, versesPerChapter: [] },
  { id: 'na', name: 'Naum', abbrevs: ['na', 'naum'], testament: 'VT', chaptersCount: 3, versesPerChapter: [] },
  { id: 'hc', name: 'Habacuque', abbrevs: ['hc', 'hab', 'habacuque'], testament: 'VT', chaptersCount: 3, versesPerChapter: [] },
  { id: 'sf', name: 'Sofonias', abbrevs: ['sf', 'sof', 'sofonias'], testament: 'VT', chaptersCount: 3, versesPerChapter: [] },
  { id: 'ag', name: 'Ageu', abbrevs: ['ag', 'ageu'], testament: 'VT', chaptersCount: 2, versesPerChapter: [] },
  { id: 'zc', name: 'Zacarias', abbrevs: ['zc', 'zac', 'zacarias'], testament: 'VT', chaptersCount: 14, versesPerChapter: [] },
  { id: 'ml', name: 'Malaquias', abbrevs: ['ml', 'mal', 'malaquias'], testament: 'VT', chaptersCount: 4, versesPerChapter: [] },

  // Novo Testamento (27 livros)
  { id: 'mt', name: 'Mateus', abbrevs: ['mt', 'mat', 'mateus'], testament: 'NT', chaptersCount: 28, versesPerChapter: [] },
  { id: 'mc', name: 'Marcos', abbrevs: ['mc', 'marc', 'marcos'], testament: 'NT', chaptersCount: 16, versesPerChapter: [] },
  { id: 'lc', name: 'Lucas', abbrevs: ['lc', 'luc', 'lucas'], testament: 'NT', chaptersCount: 24, versesPerChapter: [] },
  { id: 'joao', name: 'João', abbrevs: ['jo', 'joao', 'joão', 'joh'], testament: 'NT', chaptersCount: 21, versesPerChapter: [] },
  { id: 'at', name: 'Atos', abbrevs: ['at', 'atos', 'act'], testament: 'NT', chaptersCount: 28, versesPerChapter: [] },
  { id: 'rm', name: 'Romanos', abbrevs: ['rm', 'rom', 'romanos'], testament: 'NT', chaptersCount: 16, versesPerChapter: [] },
  { id: '1co', name: '1 Coríntios', abbrevs: ['1co', '1cor', '1 corintios', '1 cor'], testament: 'NT', chaptersCount: 16, versesPerChapter: [] },
  { id: '2co', name: '2 Coríntios', abbrevs: ['2co', '2cor', '2 corintios', '2 cor'], testament: 'NT', chaptersCount: 13, versesPerChapter: [] },
  { id: 'gl', name: 'Gálatas', abbrevs: ['gl', 'gal', 'galatas'], testament: 'NT', chaptersCount: 6, versesPerChapter: [] },
  { id: 'ef', name: 'Efésios', abbrevs: ['ef', 'efe', 'efesios'], testament: 'NT', chaptersCount: 6, versesPerChapter: [] },
  { id: 'fp', name: 'Filipenses', abbrevs: ['fp', 'fil', 'filipenses', 'flp'], testament: 'NT', chaptersCount: 4, versesPerChapter: [] },
  { id: 'cl', name: 'Colossenses', abbrevs: ['cl', 'col', 'colossenses'], testament: 'NT', chaptersCount: 4, versesPerChapter: [] },
  { id: '1ts', name: '1 Tessalonicenses', abbrevs: ['1ts', '1tes', '1 tessalonicenses', '1 tes'], testament: 'NT', chaptersCount: 5, versesPerChapter: [] },
  { id: '2ts', name: '2 Tessalonicenses', abbrevs: ['2ts', '2tes', '2 tessalonicenses', '2 tes'], testament: 'NT', chaptersCount: 3, versesPerChapter: [] },
  { id: '1tm', name: '1 Timóteo', abbrevs: ['1tm', '1tim', '1 timoteo', '1 tim'], testament: 'NT', chaptersCount: 6, versesPerChapter: [] },
  { id: '2tm', name: '2 Timóteo', abbrevs: ['2tm', '2tim', '2 timoteo', '2 tim'], testament: 'NT', chaptersCount: 4, versesPerChapter: [] },
  { id: 'tt', name: 'Tito', abbrevs: ['tt', 'tit', 'tito'], testament: 'NT', chaptersCount: 3, versesPerChapter: [] },
  { id: 'fm', name: 'Filemom', abbrevs: ['fm', 'flm', 'filemom'], testament: 'NT', chaptersCount: 1, versesPerChapter: [] },
  { id: 'hb', name: 'Hebreus', abbrevs: ['hb', 'heb', 'hebreus'], testament: 'NT', chaptersCount: 13, versesPerChapter: [] },
  { id: 'tg', name: 'Tiago', abbrevs: ['tg', 'tiag', 'tiago'], testament: 'NT', chaptersCount: 5, versesPerChapter: [] },
  { id: '1pe', name: '1 Pedro', abbrevs: ['1pe', '1ped', '1 pedro', '1 ped'], testament: 'NT', chaptersCount: 5, versesPerChapter: [] },
  { id: '2pe', name: '2 Pedro', abbrevs: ['2pe', '2ped', '2 pedro', '2 ped'], testament: 'NT', chaptersCount: 3, versesPerChapter: [] },
  { id: '1jo', name: '1 João', abbrevs: ['1jo', '1joao', '1 joão', '1 jo'], testament: 'NT', chaptersCount: 5, versesPerChapter: [] },
  { id: '2jo', name: '2 João', abbrevs: ['2jo', '2joao', '2 joão', '2 jo'], testament: 'NT', chaptersCount: 1, versesPerChapter: [] },
  { id: '3jo', name: '3 João', abbrevs: ['3jo', '3joao', '3 joão', '3 jo'], testament: 'NT', chaptersCount: 1, versesPerChapter: [] },
  { id: 'jd', name: 'Judas', abbrevs: ['jd', 'jud', 'judas'], testament: 'NT', chaptersCount: 1, versesPerChapter: [] },
  { id: 'ap', name: 'Apocalipse', abbrevs: ['ap', 'apoc', 'apocalipse', 'rv'], testament: 'NT', chaptersCount: 22, versesPerChapter: [] },
];

export function findBookByNameOrAbbrev(query: string): BibleBook | undefined {
  const normalized = query.toLowerCase().trim().replace(/[áàâã]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óôõ]/g, 'o').replace(/[ú]/g, 'u').replace(/[ç]/g, 'c');
  
  return BIBLE_BOOKS.find(b => {
    const normName = b.name.toLowerCase().replace(/[áàâã]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óôõ]/g, 'o').replace(/[ú]/g, 'u').replace(/[ç]/g, 'c');
    if (normName === normalized) return true;
    return b.abbrevs.some(ab => {
      const normAb = ab.toLowerCase().replace(/[áàâã]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óôõ]/g, 'o').replace(/[ú]/g, 'u').replace(/[ç]/g, 'c');
      return normAb === normalized;
    });
  });
}
