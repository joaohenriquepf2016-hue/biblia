import { Sermon } from '../types';

export const DEFAULT_SERMONS: Sermon[] = [
  {
    id: 'sermon_armo_de_deus',
    title: 'A Armadura de Deus para os Dias Atuais',
    theme: 'Vida Cristã e Guerra Espiritual',
    mainScripture: 'Efésios 6:10-18',
    targetDurationMinutes: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Pregar com ênfase na dependência do Espírito Santo e oração contínua.',
    tags: ['Guerra Espiritual', 'Fé', 'Vitória', 'Efésios'],
    sections: [
      {
        id: 'sec_1',
        title: 'Introdução: A Fonte do Nosso Poder',
        type: 'intro',
        content: 'Não lutamos com forças humanas nem com estratégias deste mundo. O apóstolo Paulo nos exorta a buscar fortaleza unicamente no Senhor e na força do Seu soberano poder.',
        estimatedMinutes: 5,
        scriptures: [
          {
            id: 'scr_1',
            rawText: 'Efésios 6:10',
            book: 'Efésios',
            bookAbbrev: 'EF',
            chapter: 6,
            verseStart: 10,
            verseEnd: 11,
            note: 'Leitura inicial: Fortalecei-vos no Senhor',
            status: 'pending'
          }
        ]
      },
      {
        id: 'sec_2',
        title: '1. A Natureza da Batalha (Invisível mas Real)',
        type: 'point',
        content: 'Nossa luta não é contra carne e sangue, ou seja, pessoas ao nosso redor não são nossos verdadeiros inimigos espirituais. Há principados e hostes do mal que tentam desanimar a igreja.',
        estimatedMinutes: 8,
        scriptures: [
          {
            id: 'scr_2',
            rawText: 'Efésios 6:12',
            book: 'Efésios',
            bookAbbrev: 'EF',
            chapter: 6,
            verseStart: 12,
            verseEnd: 13,
            note: 'Destaque: Tomai toda a armadura',
            status: 'pending'
          },
          {
            id: 'scr_3',
            rawText: '2 Coríntios 10:4',
            book: '2 Coríntios',
            bookAbbrev: '2CO',
            chapter: 10,
            verseStart: 4,
            note: 'Armas espirituais poderosas em Deus',
            status: 'pending'
          }
        ]
      },
      {
        id: 'sec_3',
        title: '2. As Peças da Armadura: Verdade, Justiça e Fé',
        type: 'point',
        content: 'O cinto da verdade nos protege contra mentiras. A couraça da justiça guarda o coração. E o escudo da fé apaga todos os dardos inflamados do maligno (dúvidas, desespero e medo).',
        estimatedMinutes: 10,
        scriptures: [
          {
            id: 'scr_4',
            rawText: 'Efésios 6:14',
            book: 'Efésios',
            bookAbbrev: 'EF',
            chapter: 6,
            verseStart: 14,
            verseEnd: 16,
            note: 'O escudo da fé apaga todos os dardos inflamados',
            status: 'pending'
          },
          {
            id: 'scr_5',
            rawText: '1 João 5:4',
            book: '1 João',
            bookAbbrev: '1JO',
            chapter: 5,
            verseStart: 4,
            note: 'Esta é a vitória que vence o mundo: a nossa fé',
            status: 'pending'
          }
        ]
      },
      {
        id: 'sec_4',
        title: '3. A Espada do Espírito e a Oração Perseverante',
        type: 'application',
        content: 'A Palavra de Deus é nossa arma de ataque infalível. Jesus venceu as tentações no deserto declarando "Está Escrito". E tudo isso é sustentado pela oração contínua no Espírito Santo!',
        estimatedMinutes: 7,
        scriptures: [
          {
            id: 'scr_6',
            rawText: 'Efésios 6:17',
            book: 'Efésios',
            bookAbbrev: 'EF',
            chapter: 6,
            verseStart: 17,
            verseEnd: 18,
            note: 'A espada do Espírito e orando em todo o tempo',
            status: 'pending'
          },
          {
            id: 'scr_7',
            rawText: 'Hebreus 4:12',
            book: 'Hebreus',
            bookAbbrev: 'HB',
            chapter: 4,
            verseStart: 12,
            note: 'A palavra de Deus é viva e eficaz',
            status: 'pending'
          }
        ]
      },
      {
        id: 'sec_5',
        title: 'Conclusão e Apelo: Firmes na Promessa',
        type: 'conclusion',
        content: 'Quem está revestido com a armadura divina não recua diante das provações. Permaneça firme, pois em Cristo Jesus somos mais do que vencedores!',
        estimatedMinutes: 5,
        scriptures: [
          {
            id: 'scr_8',
            rawText: 'Romanos 8:37',
            book: 'Romanos',
            bookAbbrev: 'RM',
            chapter: 8,
            verseStart: 37,
            verseEnd: 39,
            note: 'Mais do que vencedores por aquele que nos amou',
            status: 'pending'
          }
        ]
      }
    ]
  },
  {
    id: 'sermon_o_bom_pastor',
    title: 'O Bom Pastor e o Cuidado Divino',
    theme: 'Confiança, Provisão e Paz',
    mainScripture: 'Salmos 23:1-6',
    targetDurationMinutes: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: 'Mensagem de refrigério para pessoas ansiosas ou passando por vales.',
    tags: ['Consolo', 'Salmos', 'Confiança', 'Paz'],
    sections: [
      {
        id: 'sec_p1',
        title: '1. A Certeza da Provisão Completa',
        type: 'point',
        content: 'Quando o Senhor é o nosso pastor, a palavra "nada me faltará" não é presunção, mas uma declaração de fé na soberania e suficiência de Deus para nossas vidas.',
        estimatedMinutes: 10,
        scriptures: [
          {
            id: 'scr_p1',
            rawText: 'Salmos 23:1',
            book: 'Salmos',
            bookAbbrev: 'SL',
            chapter: 23,
            verseStart: 1,
            verseEnd: 3,
            note: 'O Senhor é o meu pastor; nada me faltará',
            status: 'pending'
          },
          {
            id: 'scr_p2',
            rawText: 'Filipenses 4:19',
            book: 'Filipenses',
            bookAbbrev: 'FP',
            chapter: 4,
            verseStart: 19,
            note: 'Meu Deus suprirá todas as necessidades',
            status: 'pending'
          }
        ]
      },
      {
        id: 'sec_p2',
        title: '2. A Presença Consoladora no Vale',
        type: 'point',
        content: 'O vale não é moradia perpétua, é passagem ("ainda que eu ande pelo vale"). A presença pessoal de Deus conosco dissipa todo medo e solidão.',
        estimatedMinutes: 10,
        scriptures: [
          {
            id: 'scr_p3',
            rawText: 'Salmos 23:4',
            book: 'Salmos',
            bookAbbrev: 'SL',
            chapter: 23,
            verseStart: 4,
            note: 'Não temerei mal algum, porque tu estás comigo',
            status: 'pending'
          },
          {
            id: 'scr_p4',
            rawText: 'João 10:11',
            book: 'João',
            bookAbbrev: 'JOAO',
            chapter: 10,
            verseStart: 11,
            verseEnd: 14,
            note: 'Eu sou o bom pastor; conheço as minhas ovelhas',
            status: 'pending'
          }
        ]
      },
      {
        id: 'sec_p3',
        title: '3. A Mesa no Deserto e o Cálice que Transborda',
        type: 'conclusion',
        content: 'Deus prepara banquete onde o inimigo esperava ver derrota. A bondade e a misericórdia do Senhor nos acompanharão todos os dias.',
        estimatedMinutes: 10,
        scriptures: [
          {
            id: 'scr_p5',
            rawText: 'Salmos 23:5',
            book: 'Salmos',
            bookAbbrev: 'SL',
            chapter: 23,
            verseStart: 5,
            verseEnd: 6,
            note: 'Unges minha cabeça e meu cálice transborda',
            status: 'pending'
          }
        ]
      }
    ]
  }
];
