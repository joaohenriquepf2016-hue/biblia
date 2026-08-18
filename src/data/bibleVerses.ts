import { BibleVerse } from '../types';
import { findBookByNameOrAbbrev, BIBLE_BOOKS } from './bibleBooks';

// Mapeamento para busca na API de tradução Almeida (João Ferreira de Almeida)
const BOOK_ENGLISH_NAMES: Record<string, string> = {
  'gn': 'genesis', 'ex': 'exodus', 'lv': 'leviticus', 'nm': 'numbers', 'dt': 'deuteronomy',
  'js': 'joshua', 'jz': 'judges', 'rt': 'ruth', '1sm': '1 samuel', '2sm': '2 samuel',
  '1rs': '1 kings', '2rs': '2 kings', '1cr': '1 chronicles', '2cr': '2 chronicles',
  'ed': 'ezra', 'ne': 'nehemiah', 'et': 'esther', 'jo': 'job', 'sl': 'psalms',
  'pv': 'proverbs', 'ec': 'ecclesiastes', 'ct': 'song of solomon', 'is': 'isaiah',
  'jr': 'jeremiah', 'lm': 'lamentations', 'ez': 'ezekiel', 'dn': 'daniel',
  'os': 'hosea', 'jl': 'joel', 'am': 'amos', 'ob': 'obadiah', 'jn': 'jonah',
  'mq': 'micah', 'na': 'nahum', 'hc': 'habakkuk', 'sf': 'zephaniah', 'ag': 'haggai',
  'zc': 'zechariah', 'ml': 'malachi', 'mt': 'matthew', 'mc': 'mark', 'lc': 'luke',
  'joao': 'john', 'at': 'acts', 'rm': 'romans', '1co': '1 corinthians', '2co': '2 corinthians',
  'gl': 'galatians', 'ef': 'ephesians', 'fp': 'philippians', 'cl': 'colossians',
  '1ts': '1 thessalonians', '2ts': '2 thessalonians', '1tm': '1 timothy', '2tm': '2 timothy',
  'tt': 'titus', 'fm': 'philemon', 'hb': 'hebrews', 'tg': 'james', '1pe': '1 peter',
  '2pe': '2 peter', '1jo': '1 john', '2jo': '2 john', '3jo': '3 john', 'jd': 'jude',
  'ap': 'revelation'
};

// Banco offline com versículos completos na tradução Almeida Revista e Corrigida
export const OFFLINE_VERSES: Record<string, Record<number, Record<number, string>>> = {
  'hb': {
    11: {
      1: 'Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.',
      2: 'Porque por ela os antigos alcançaram testemunho.',
      3: 'Pela fé entendemos que os mundos pela palavra de Deus foram criados; de maneira que aquilo que se vê não foi feito do que é aparente.',
      4: 'Pela fé Abel ofereceu a Deus maior sacrifício do que Caim, pelo qual alcançou testemunho de que era justo, dando Deus testemunho dos seus dons, e por ela, depois de morto, ainda fala.',
      5: 'Pela fé Enoque foi trasladado para não ver a morte, e não foi achado, porque Deus o trasladara; visto como antes da sua trasladação alcançou testemunho de que agradara a Deus.',
      6: 'Ora, sem fé é impossível agradar-lhe; porque é necessário que aquele que se aproxima de Deus creia que ele existe, e que é galardoador dos que o buscam.',
      7: 'Pela fé Noé, divinamente avisado das coisas que ainda não se viam, temeu e, para salvação da sua família, preparou a arca, pela qual condenou o mundo, e foi feito herdeiro da justiça que é segundo a fé.',
      8: 'Pela fé Abraão, sendo chamado, obedeceu, indo para um lugar que havia de receber por herança; e saiu, sem saber para onde ia.',
      9: 'Pela fé habitou na terra da promessa, como em terra alheia, morando em cabanas com Isaque e Jacó, herdeiros com ele da mesma promessa.',
      10: 'Porque esperava a cidade que tem fundamentos, da qual o artífice e construtor é Deus.',
      11: 'Pela fé também a mesma Sara recebeu a virtude de conceber, e deu à luz já fora da idade; porquanto teve por fiel aquele que lho tinha prometido.',
      12: 'Por isso também de um, e esse já amortecido, descenderam tantos, em multidão, como as estrelas do céu, e como a areia inumerável que está na praia do mar.',
      13: 'Todos estes morreram na fé, sem terem recebido as promessas; mas vendo-as de longe, e crendo-as e abraçando-as, confessaram que eram estrangeiros e peregrinos na terra.',
      14: 'Porque, os que isso dizem, claramente mostram que buscam uma pátria.',
      15: 'E se, na verdade, se lembrassem daquela de onde haviam saído, teriam oportunidade de tornar.',
      16: 'Mas agora desejam uma melhor, isto é, a celestial. Por isso também Deus não se envergonha deles, de se chamar seu Deus, porque já lhes preparou uma cidade.',
      17: 'Pela fé ofereceu Abraão a Isaque, quando foi provado; sim, aquele que recebera as promessas ofereceu o seu unigênito.',
      18: 'Sendo-lhe dito: Em Isaque será chamada a tua descendência, considerou que Deus era poderoso para até dos mortos o ressuscitar;',
      19: 'E daí também em figura ele o recobrou.',
      20: 'Pela fé Isaque abençoou a Jacó e a Esaú, no tocante às coisas futuras.',
      21: 'Pela fé Jacó, próximo da morte, abençoou cada um dos filhos de José, e adorou encostado à ponta do seu bordão.',
      22: 'Pela fé José, próximo da morte, fez menção da saída dos filhos de Israel, e deu ordem acerca de seus ossos.',
      23: 'Pela fé Moisés, já nascido, foi escondido três meses por seus pais, porque viram que era um menino formoso; e não temeram o mandamento do rei.',
      24: 'Pela fé Moisés, sendo já grande, recusou ser chamado filho da filha de Faraó,',
      25: 'Escolhendo antes ser maltratado com o povo de Deus, do que por um pouco de tempo ter o gozo do pecado;',
      26: 'Tendo por maiores riquezas o vitupério de Cristo do que os tesouros do Egito; porque tinha em vista a recompensa.',
      27: 'Pela fé deixou o Egito, não temendo a ira do rei; porque ficou firme, como vendo o invisível.',
      28: 'Pela fé celebrou a páscoa e a aspersão do sangue, para que o destruidor dos primogênitos lhes não tocasse.',
      29: 'Pela fé passaram o Mar Vermelho, como por terra seca; o que intentando os egípcios, se afogaram.',
      30: 'Pela fé caíram os muros de Jericó, sendo rodeados durante sete dias.',
      31: 'Pela fé Raabe, a meretriz, não pereceu com os incrédulos, acolhendo em paz os espias.',
      32: 'E que mais direi? Faltar-me-ia o tempo contando de Gideão, e de Baraque, e de Sansão, e de Jefté, e de Davi, e de Samuel e dos profetas,',
      33: 'Os quais pela fé venceram reinos, praticaram a justiça, alcançaram promessas, fecharam as bocas dos leões,',
      34: 'Apagaram a força do fogo, escaparam do fio da espada, da fraqueza tiraram forças, na batalha se esforçaram, puseram em fuga os exércitos dos estranhos.',
      35: 'As mulheres receberam pela ressurreição os seus mortos; uns foram torturados, não aceitando o seu livramento, para alcançarem uma melhor ressurreição;',
      36: 'E outros experimentaram escárnios e açoites, e até cadeias e prisões.',
      37: 'Foram apedrejados, serrados, tentados, mortos ao fio da espada; andaram vestidos de peles de ovelhas e de cabras, desamparados, aflitos e maltratados',
      38: '(Dos quais o mundo não era digno), errantes pelos desertos, e montes, e pelas covas e cavernas da terra.',
      39: 'E todos estes, tendo tido testemunho pela fé, não alcançaram a promessa,',
      40: 'Provendo Deus alguma coisa melhor a nosso respeito, para que eles sem nós não fossem aperfeiçoados.'
    },
    4: {
      12: 'Porque a palavra de Deus é viva e eficaz, e mais penetrante do que espada alguma de dois gumes, e penetra até à divisão da alma e do espírito, e das juntas e medulas, e é apta para discernir os pensamentos e intenções do coração.',
      16: 'Cheguemos, pois, com confiança ao trono da graça, para que possamos alcançar misericórdia e achar graça, a fim de sermos ajudados em tempo oportuno.'
    },
    12: {
      1: 'Portanto nós também, pois que estamos rodeados de uma tão grande nuvem de testemunhas, deixemos todo o embaraço, e o pecado que tão de perto nos rodeia, e corramos com paciência a carreira que nos está proposta,',
      2: 'Olhando para Jesus, autor e consumador da fé, o qual, pelo gozo que lhe estava proposto, suportou a cruz, desprezando a afronta, e assentou-se à destra do trono de Deus.'
    }
  },
  'joao': {
    3: {
      1: 'E havia entre os fariseus um homem, chamado Nicodemos, príncipe dos judeus.',
      2: 'Este foi ter de noite com Jesus, e disse-lhe: Rabi, bem sabemos que és Mestre, vindo de Deus; porque ninguém pode fazer estes sinais que tu fazes, se Deus não for com ele.',
      3: 'Jesus respondeu, e disse-lhe: Na verdade, na verdade te digo que aquele que não nascer de novo, não pode ver o reino de Deus.',
      4: 'Disse-lhe Nicodemos: Como pode um homem nascer, sendo velho? Pode, porventura, tornar a entrar no ventre de sua mãe, e nascer?',
      5: 'Jesus respondeu: Na verdade, na verdade te digo que aquele que não nascer da água e do Espírito, não pode entrar no reino de Deus.',
      6: 'O que é nascido da carne é carne, e o que é nascido do Espírito é espírito.',
      7: 'Não te maravilhes de te ter dito: Necessário vos é nascer de novo.',
      8: 'O vento assopra onde quer, e ouves a sua voz, mas não sabes de onde vem, nem para onde vai; assim é todo aquele que é nascido do Espírito.',
      9: 'Nicodemos respondeu, e disse-lhe: Como pode ser isso?',
      10: 'Jesus respondeu, e disse-lhe: Tu és mestre de Israel, e não sabes isto?',
      11: 'Na verdade, na verdade te digo que nós dizemos o que sabemos, e testificamos o que vimos; e não aceitais o nosso testemunho.',
      12: 'Se vos falei de coisas terrestres, e não crestes, como crereis, se vos falar das celestiais?',
      13: 'Ora, ninguém subiu ao céu, senão o que desceu do céu, o Filho do homem, que está no céu.',
      14: 'E, como Moisés levantou a serpente no deserto, assim importa que o Filho do homem seja levantado;',
      15: 'Para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
      16: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
      17: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.',
      18: 'Quem crê nele não é condenado; mas quem não crê já está condenado, porquanto não crê no nome do unigênito Filho de Deus.',
      19: 'E a condenação é esta: Que a luz veio ao mundo, e os homens amaram mais as trevas do que a luz, porque as suas obras eram más.',
      20: 'Porque todo aquele que faz o mal odeia a luz, e não vem para a luz, para que as suas obras não sejam reprovadas.',
      21: 'Mas quem pratica a verdade vem para a luz, a fim de que as suas obras sejam manifestas, porque são feitas em Deus.',
      36: 'Aquele que crê no Filho tem a vida eterna; mas aquele que não crê no Filho não verá a vida, mas a ira de Deus sobre ele permanece.'
    },
    1: {
      1: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
      2: 'Ele estava no princípio com Deus.',
      3: 'Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.',
      4: 'Nele estava a vida, e a vida era a luz dos homens.',
      5: 'E a luz resplandece nas trevas, e as trevas não a compreenderam.',
      11: 'Veio para o que era seu, e os seus não o receberam.',
      12: 'Mas, a todos quantos o receberam, deu-lhes o poder de serem feitos filhos de Deus, aos que creem no seu nome;',
      13: 'Os quais não nasceram do sangue, nem da vontade da carne, nem da vontade do homem, mas de Deus.',
      14: 'E o Verbo se fez carne, e habitou entre nós, e vimos a sua glória, como a glória do unigênito do Pai, cheio de graça e de verdade.'
    },
    10: {
      9: 'Eu sou a porta; se alguém entrar por mim, salvar-se-á, e entrará, e sairá, e achará pastagens.',
      10: 'O ladrão não vem senão a roubar, a matar, e a destruir; eu vim para que tenham vida, e a tenham com abundância.',
      11: 'Eu sou o bom Pastor; o bom Pastor dá a sua vida pelas ovelhas.',
      14: 'Eu sou o bom Pastor, e conheço as minhas ovelhas, e das minhas sou conhecido.',
      27: 'As minhas ovelhas ouvem a minha voz, e eu conheço-as, e elas me seguem;',
      28: 'E dou-lhes a vida eterna, e nunca hão de perecer, e ninguém as arrebatará da minha mão.'
    },
    14: {
      1: 'Não se turbe o vosso coração; credes em Deus, crede também em mim.',
      2: 'Na casa de meu Pai há muitas moradas; se não fosse assim, eu vo-lo teria dito. Vou preparar-vos lugar.',
      3: 'E quando eu for, e vos preparar lugar, virei outra vez, e vos levarei para mim mesmo, para que onde eu estiver estejais vós também.',
      6: 'Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.',
      27: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.'
    },
    15: {
      1: 'Eu sou a videira verdadeira, e meu Pai é o lavrador.',
      5: 'Eu sou a videira, vós as varas; quem está em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.',
      7: 'Se vós estiverdes em mim, e as minhas palavras estiverem em vós, pedireis tudo o que quiserdes, e vos será feito.',
      13: 'Ninguém tem maior amor do que este, de dar alguém a sua vida pelos seus amigos.'
    }
  },
  'sl': {
    23: {
      1: 'O SENHOR é o meu pastor, nada me faltará.',
      2: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.',
      3: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.',
      4: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.',
      5: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.',
      6: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.'
    },
    91: {
      1: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.',
      2: 'Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.',
      3: 'Porque ele te livrará do laço do passarinheiro, e da peste perniciosa.',
      4: 'Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel.',
      5: 'Não terás medo do terror de noite nem da seta que voa de dia,',
      6: 'Nem da peste que anda na escuridão, nem da mortandade que assola ao meio-dia.',
      7: 'Mil cairão ao teu lado, e dez mil à tua direita, mas não chegará a ti.',
      8: 'Somente com os teus olhos contemplarás, e verás a recompensa dos ímpios.',
      9: 'Porque tu, ó Senhor, és o meu refúgio. No Altíssimo fizeste a tua habitação.',
      10: 'Nenhum mal te sucederá, nem praga alguma chegará à tua tenda.',
      11: 'Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos.',
      12: 'Eles te sustentarão nas suas mãos, para que não tropeces com o teu pé em pedra.',
      13: 'Pisarás o leão e a cobra; calcarás aos pés o filho do leão e a serpente.',
      14: 'Porquanto tão encarecidamente me amou, também eu o livrarei; pô-lo-ei num alto retiro, porque conheceu o meu nome.',
      15: 'Ele me invocará, e eu lhe responderei; estarei com ele na angústia; dela o retirarei, e o glorificarei.',
      16: 'Fartá-lo-ei com longura de dias, e lhe mostrarei a minha salvação.'
    },
    121: {
      1: 'Levantarei os meus olhos para os montes, de onde vem o meu socorro.',
      2: 'O meu socorro vem do Senhor que fez o céu e a terra.',
      3: 'Não deixará vacilar o teu pé; aquele que te guarda não tosquenejará.',
      4: 'Eis que não tosquenejará nem dormirá o guarda de Israel.',
      5: 'O Senhor é quem te guarda; o Senhor é a tua sombra à tua direita.',
      6: 'O sol não te molestará de dia nem a lua de noite.',
      7: 'O Senhor te guardará de todo o mal; guardará a tua alma.',
      8: 'O Senhor guardará a tua entrada e a tua saída, desde agora e para sempre.'
    },
    1: {
      1: 'Bem-aventurado o homem que não anda segundo o conselho dos ímpios, nem se detém no caminho dos pecadores, nem se assenta na roda dos escarnecedores.',
      2: 'Antes tem o seu prazer na lei do Senhor, e na sua lei medita de dia e de noite.',
      3: 'Pois será como a árvore plantada junto a ribeiros de águas, a qual dá o seu fruto na estação própria, e cujas folhas não caem, e tudo quanto fizer prosperará.',
      4: 'Não são assim os ímpios; mas são como a moinha que o vento espalha.',
      5: 'Por isso os ímpios não subsistirão no juízo, nem os pecadores na congregação dos justos.',
      6: 'Porque o Senhor conhece o caminho dos justos; porém o caminho dos ímpios perecerá.'
    }
  },
  'rm': {
    8: {
      1: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus, que não andam segundo a carne, mas segundo o Espírito.',
      2: 'Porque a lei do Espírito de vida, em Cristo Jesus, me livrou da lei do pecado e da morte.',
      14: 'Porque todos os que são guiados pelo Espírito de Deus, esses são filhos de Deus.',
      15: 'Porque não recebestes o espírito de escravidão, para outra vez estardes em temor, mas recebestes o Espírito de adoção de filhos, pelo qual clamamos: Aba, Pai.',
      16: 'O mesmo Espírito testifica com o nosso espírito que somos filhos de Deus.',
      17: 'E, se nós somos filhos, somos logo herdeiros também, herdeiros de Deus, e coerdeiros de Cristo;',
      18: 'Porque para mim tenho por certo que as aflições deste tempo presente não são para comparar com a glória que em nós há de ser revelada.',
      26: 'E da mesma maneira também o Espírito ajuda as nossas fraquezas; porque não sabemos o que havemos de pedir como convém, mas o mesmo Espírito intercede por nós com gemidos inexprimíveis.',
      28: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
      29: 'Porque os que dantes conheceu também os predestinou para serem conformes à imagem de seu Filho, a fim de que ele seja o primogênito entre muitos irmãos.',
      30: 'E aos que predestinou a estes também chamou; e aos que chamou a estes também justificou; e aos que justificou a estes também glorificou.',
      31: 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?',
      32: 'Aquele que nem mesmo a seu próprio Filho poupou, antes o entregou por todos nós, como nos não dará também com ele todas as coisas?',
      33: 'Quem intentará acusação contra os escolhidos de Deus? É Deus quem os justifica.',
      34: 'Quem é que condena? Pois é Cristo quem morreu, ou antes quem ressuscitou dentre os mortos, o qual está à direita de Deus, e também intercede por nós.',
      35: 'Quem nos separará do amor de Cristo? A tribulação, ou a angústia, ou a perseguição, ou a fome, ou a nudez, ou o perigo, ou a espada?',
      36: 'Como está escrito: Por amor de ti somos entregues à morte todo o dia; Fomos reputados como ovelhas para o matadouro.',
      37: 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.',
      38: 'Porque estou certo de que, nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir,',
      39: 'Nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus nosso Senhor.'
    },
    12: {
      1: 'Rogo-vos, pois, irmãos, pela compaixão de Deus, que apresenteis os vossos corpos em sacrifício vivo, santo e agradável a Deus, que é o vosso culto racional.',
      2: 'E não sede conformados com este mundo, mas sede transformados pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus.',
      9: 'O amor seja não fingido. Aborrecei o mal e apegai-vos ao bem.',
      12: 'Alegrai-vos na esperança, sede pacientes na tribulação, perseverai na oração;',
      21: 'Não te deixes vencer do mal, mas vence o mal com o bem.'
    }
  },
  'ef': {
    6: {
      10: 'No demais, irmãos meus, fortalecei-vos no Senhor e na força do seu poder.',
      11: 'Revesti-vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo.',
      12: 'Porque não temos que lutar contra a carne e o sangue, mas, sim, contra os principados, contra as potestades, contra os príncipes das trevas deste século, contra as hostes espirituais da maldade, nos lugares celestiais.',
      13: 'Portanto, tomai toda a armadura de Deus, para que possais resistir no dia mau e, havendo feito tudo, ficar firmes.',
      14: 'Estai, pois, firmes, tendo cingidos os vossos lombos com a verdade, e vestida a couraça da justiça;',
      15: 'E calçados os pés na preparação do evangelho da paz;',
      16: 'Tomando sobretudo o escudo da fé, com o qual podereis apagar todos os dardos inflamados do maligno.',
      17: 'Tomai também o capacete da salvação, e a espada do Espírito, que é a palavra de Deus;',
      18: 'Orando em todo o tempo com toda a oração e súplica no Espírito, e vigiando nisto com toda a perseverança e súplica por todos os santos,',
      19: 'E por mim; para que me seja dada, no abrir da minha boca, a palavra com confiança, para fazer notório o mistério do evangelho,',
      20: 'Pelo qual sou embaixador em cadeias; para que possa falar dele livremente, como me convém falar.'
    },
    2: {
      8: 'Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.',
      9: 'Não vem das obras, para que ninguém se glorie;',
      10: 'Porque somos feitura sua, criados em Cristo Jesus para as boas obras, as quais Deus preparou para que andássemos nelas.'
    }
  },
  'fp': {
    4: {
      4: 'Regozijai-vos sempre no Senhor; outra vez digo, regozijai-vos.',
      5: 'Seja a vossa equidade notória a todos os homens. Perto está o Senhor.',
      6: 'Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças.',
      7: 'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.',
      8: 'Quanto ao mais, irmãos, tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai.',
      13: 'Posso todas as coisas em Cristo que me fortalece.',
      19: 'O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.'
    }
  },
  '1co': {
    13: {
      1: 'Ainda que eu falasse as línguas dos homens e dos anjos, e não tivesse amor, seria como o metal que soa ou como o sino que tine.',
      2: 'E ainda que tivesse o dom de profecia, e conhecesse todos os mistérios e toda a ciência, e ainda que tivesse toda a fé, de maneira tal que transportasse os montes, e não tivesse amor, nada seria.',
      3: 'E ainda que distribuísse toda a minha fortuna para sustento dos pobres, e ainda que entregasse o meu corpo para ser queimado, e não tivesse amor, nada disso me aproveitaria.',
      4: 'O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece.',
      5: 'Não se porta com indecência, não busca os seus interesses, não se irrita, não suspeita mal;',
      6: 'Não folga com a injustiça, mas folga com a verdade;',
      7: 'Tudo sofre, tudo crê, tudo espera, tudo suporta.',
      8: 'O amor nunca falha; mas havendo profecias, serão aniquiladas; havendo línguas, cessarão; havendo ciência, desaparecerá.',
      13: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três, mas o maior destes é o amor.'
    }
  },
  '2co': {
    5: {
      17: 'Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.',
      18: 'E tudo isto provém de Deus, que nos reconciliou consigo mesmo por Jesus Cristo, e nos deu o ministério da reconciliação;',
      20: 'De sorte que somos embaixadores da parte de Cristo, como se Deus por nós rogasse. Rogamos-vos, pois, da parte de Cristo, que vos reconcilieis com Deus.'
    }
  },
  'tg': {
    1: {
      2: 'Meus irmãos, tende grande gozo quando cairdes em várias tentações;',
      3: 'Sabendo que a prova da vossa fé opera a paciência.',
      4: 'Tenha, porém, a paciência a sua obra perfeita, para que sejais perfeitos e completos, sem faltar em coisa alguma.',
      5: 'E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e o não lança em rosto, e ser-lhe-á dada.',
      6: 'Peça-a, porém, com fé, em nada duvidando; porque o que duvida é semelhante à onda do mar, que é levada pelo vento, e lançada de uma para outra parte.',
      12: 'Bem-aventurado o homem que suporta a tentação; porque, quando for provado, receberá a coroa da vida, a qual o Senhor tem prometido aos que o amam.',
      22: 'E sede cumpridores da palavra, e não somente ouvintes, enganando-vos com falsos discursos.'
    }
  },
  '2tm': {
    3: {
      16: 'Toda a Escritura é divinamente inspirada, e proveitosa para ensinar, para redarguir, para corrigir, para instruir em justiça;',
      17: 'Para que o homem de Deus seja perfeito, e perfeitamente instruído para toda a boa obra.'
    },
    4: {
      2: 'Que pregues a palavra, instes a tempo e fora de tempo, redarguas, repreendas, exortes, com toda a longanimidade e doutrina.',
      7: 'Combati o bom combate, acabei a carreira, guardei a fé.'
    }
  },
  '1jo': {
    1: {
      9: 'Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados, e nos purificar de toda a injustiça.'
    },
    5: {
      4: 'Porque qualquer que é nascido de Deus vence o mundo; e esta é a vitória que vence o mundo, a nossa fé.',
      14: 'E esta é a confiança que temos nele, que, se pedirmos alguma coisa, segundo a sua vontade, ele nos ouve.'
    }
  },
  'is': {
    40: {
      29: 'Dá força ao cansado, e multiplica as forças ao que não tem nenhum vigor.',
      30: 'Os jovens se cansarão e se fatigarão, e os moços certamente cairão;',
      31: 'Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.'
    },
    53: {
      4: 'Verdadeiramente ele tomou sobre si as nossas enfermidades, e as nossas dores levou sobre si; e nós o reputávamos por aflito, ferido de Deus, e oprimido.',
      5: 'Mas ele foi ferido por causa das nossas transgressões, e moído por causa das nossas iniquidades; o castigo que nos traz a paz estava sobre ele, e pelas suas pisaduras fomos sarados.',
      6: 'Todos nós andávamos desgarrados como ovelhas; cada um se desviava pelo seu caminho; mas o Senhor fez cair sobre ele a iniquidade de nós todos.'
    }
  },
  'mt': {
    5: {
      3: 'Bem-aventurados os pobres de espírito, porque deles é o reino dos céus;',
      4: 'Bem-aventurados os que choram, porque eles serão consolados;',
      5: 'Bem-aventurados os mansos, porque eles herdarão a terra;',
      6: 'Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos;',
      7: 'Bem-aventurados os misericordiosos, porque eles alcançarão misericórdia;',
      8: 'Bem-aventurados os limpos de coração, porque eles verão a Deus;',
      9: 'Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus;',
      14: 'Vós sois a luz do mundo; não se pode esconder uma cidade edificada sobre um monte;',
      16: 'Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus.'
    },
    6: {
      9: 'Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome;',
      10: 'Venha o teu reino, seja feita a tua vontade, assim na terra como no céu;',
      11: 'O pão nosso de cada dia nos dá hoje;',
      12: 'E perdoa-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores;',
      13: 'E não nos induzas à tentação; mas livra-nos do mal; porque teu é o reino, e o poder, e a glória, para sempre. Amém.',
      33: 'Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.',
      34: 'Não vos inquieteis, pois, pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal.'
    },
    28: {
      18: 'E, chegando-se Jesus, falou-lhes, dizendo: É-me dado todo o poder no céu e na terra.',
      19: 'Portanto ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo;',
      20: 'Ensinando-os a guardar todas as coisas que eu vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação dos séculos. Amém.'
    }
  },
  'gn': {
    1: {
      1: 'No princípio criou Deus o céu e a terra.',
      2: 'E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.',
      3: 'E disse Deus: Haja luz; e houve luz.'
    },
    12: {
      1: 'Ora, o Senhor disse a Abrão: Sai-te da tua terra, da tua parentela e da casa de teu pai, para a terra que eu te mostrarei.',
      2: 'E far-te-ei uma grande nação, e abençoar-te-ei e engrandecerei o teu nome; e tu serás uma bênção.'
    }
  },
  'pv': {
    3: {
      5: 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.',
      6: 'Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.'
    }
  },
  'js': {
    1: {
      9: 'Não to mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.'
    }
  },
  'jr': {
    29: {
      11: 'Porque eu bem sei os pensamentos que tenho a respeito de vós, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.',
      12: 'Então me invocareis, e ireis, e orareis a mim, e eu vos ouvirei.',
      13: 'E buscar-me-eis, e me achareis, quando me buscardes com todo o vosso coração.'
    },
    33: {
      3: 'Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes que não sabes.'
    }
  },
  'gl': {
    5: {
      22: 'Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança.',
      23: 'Contra estas coisas não há lei.',
      25: 'Se vivemos em Espírito, andemos também em Espírito.'
    },
    2: {
      20: 'Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim; e a vida que agora vivo na carne, vivo-a na fé do Filho de Deus, o qual me amou, e se entregou a si mesmo por mim.'
    }
  },
  'ap': {
    21: {
      4: 'E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas.',
      5: 'E o que estava assentado sobre o trono disse: Eis que faço novas todas as coisas.'
    },
    3: {
      20: 'Eis que estou à porta, e bato; se alguém ouvir a minha voz, e abrir a porta, entrarei em sua casa, e com ele cearei, e ele comigo.'
    }
  }
};

// Storage local para permitir que o usuário salve e adicione versículos personalizados offline
const CUSTOM_VERSES_STORAGE_KEY = 'pulpito_custom_verses_v1';

export function getCustomVerses(): Record<string, Record<number, Record<number, string>>> {
  try {
    const raw = localStorage.getItem(CUSTOM_VERSES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomVerse(bookId: string, chapter: number, verse: number, text: string) {
  try {
    const custom = getCustomVerses();
    if (!custom[bookId]) custom[bookId] = {};
    if (!custom[bookId][chapter]) custom[bookId][chapter] = {};
    custom[bookId][chapter][verse] = text;
    localStorage.setItem(CUSTOM_VERSES_STORAGE_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Failed to save custom verse', e);
  }
}

export function getVerseText(bookIdOrName: string, chapter: number, verse: number): string | null {
  const book = findBookByNameOrAbbrev(bookIdOrName);
  const bookId = book ? book.id : bookIdOrName.toLowerCase();

  // 1. Tenta pegar do storage personalizado/cache permanente
  const custom = getCustomVerses();
  if (custom[bookId]?.[chapter]?.[verse]) {
    return custom[bookId][chapter][verse];
  }

  // 2. Tenta pegar do banco estático embutido
  if (OFFLINE_VERSES[bookId]?.[chapter]?.[verse]) {
    return OFFLINE_VERSES[bookId][chapter][verse];
  }

  return null;
}

/**
 * Busca o texto real da Bíblia na tradução Almeida (João Ferreira de Almeida)
 * e armazena permanentemente em cache local offline.
 */
export async function fetchAndCachePassage(
  bookIdOrName: string, 
  chapter: number, 
  verseStart: number, 
  verseEnd?: number
): Promise<boolean> {
  const book = findBookByNameOrAbbrev(bookIdOrName);
  if (!book) return false;
  
  const englishBookName = BOOK_ENGLISH_NAMES[book.id] || book.name.toLowerCase();
  const end = verseEnd && verseEnd >= verseStart ? verseEnd : verseStart;
  const passageQuery = `${englishBookName}+${chapter}:${verseStart}${end > verseStart ? '-' + end : ''}`;

  try {
    const res = await fetch(`https://bible-api.com/${passageQuery}?translation=almeida`);
    if (!res.ok) return false;

    const data = await res.json();
    if (data && Array.isArray(data.verses)) {
      data.verses.forEach((v: { verse: number; text: string }) => {
        saveCustomVerse(book.id, chapter, v.verse, v.text.trim());
      });
      return true;
    }
  } catch (err) {
    console.warn('Could not fetch online verse from bible-api.com', err);
  }
  return false;
}

export function getPassageVerses(
  bookIdOrName: string, 
  chapter: number, 
  verseStart: number, 
  verseEnd?: number
): BibleVerse[] {
  const book = findBookByNameOrAbbrev(bookIdOrName);
  const bookName = book ? book.name : bookIdOrName;
  const bookId = book ? book.id : bookIdOrName.toLowerCase();
  const end = verseEnd && verseEnd >= verseStart ? verseEnd : verseStart;
  const list: BibleVerse[] = [];

  for (let v = verseStart; v <= end; v++) {
    const foundText = getVerseText(bookId, chapter, v);
    list.push({
      book: bookName,
      chapter,
      verse: v,
      text: foundText || ''
    });
  }

  return list;
}
