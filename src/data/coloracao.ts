export interface FundoClareamento {
  altura: number;
  nome: string;
  fundo: string;
  corHex: string;
}

export interface Alvo {
  id: string;
  nome: string;
  fundoMinimo: number;
  descricao: string;
}

export interface Recomendacao {
  fundoAtual: number;
  alvoId: string;
  produto: string;
  reflexo: string;
  proporcao: string;
  ox: string;
  tempo: string;
  alertas: string[];
}

export const FUNDOS: FundoClareamento[] = [
  { altura: 5, nome: 'Castanho claro', fundo: 'Vermelho-alaranjado', corHex: '#B03A2E' },
  { altura: 6, nome: 'Louro escuro',   fundo: 'Laranja',             corHex: '#D4622A' },
  { altura: 7, nome: 'Louro médio',    fundo: 'Laranja-amarelado',   corHex: '#D4922A' },
  { altura: 8, nome: 'Louro claro',    fundo: 'Amarelo',             corHex: '#D4C23A' },
  { altura: 9, nome: 'Louro muito claro', fundo: 'Amarelo-claro',   corHex: '#E0D870' },
  { altura: 10, nome: 'Louro claríssimo', fundo: 'Amarelo-pálido',  corHex: '#F0EDB8' },
];

export const ALVOS: Alvo[] = [
  { id: 'morena_iluminada',  nome: 'Morena iluminada',        fundoMinimo: 6,  descricao: 'Reflexo neutro / leve acinzentado, calor controlado' },
  { id: 'loiro_dourado',     nome: 'Loiro dourado / mel',     fundoMinimo: 7,  descricao: 'Reflexo dourado (.3) — mantém calor, matização leve' },
  { id: 'loiro_natural',     nome: 'Loiro natural / médio',   fundoMinimo: 7,  descricao: 'Reflexo neutro (.0/.1)' },
  { id: 'loiro_perola',      nome: 'Loiro pérola / frio',     fundoMinimo: 8,  descricao: 'Reflexo violeta (.2)' },
  { id: 'loiro_acinzentado', nome: 'Loiro acinzentado / fumê',fundoMinimo: 9,  descricao: 'Reflexo azul + violeta (.1/.2)' },
  { id: 'platinado',         nome: 'Platinado',               fundoMinimo: 10, descricao: 'Reflexo violeta intenso (.2)' },
];

export const RECOMENDACOES: Recomendacao[] = [
  // fundo 6 — Morena iluminada
  {
    fundoAtual: 6, alvoId: 'morena_iluminada',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.1', proporcao: '1:2', ox: 'OX 10 vol', tempo: '20 min',
    alertas: ['Cheque o fio sobre superfície branca antes de aplicar.'],
  },
  // fundo 7 — Morena iluminada
  {
    fundoAtual: 7, alvoId: 'morena_iluminada',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.1', proporcao: '1:2', ox: 'OX 10 vol', tempo: '20 min',
    alertas: [],
  },
  // fundo 7 — Loiro dourado
  {
    fundoAtual: 7, alvoId: 'loiro_dourado',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.3', proporcao: '1:2', ox: 'OX 10 vol', tempo: '20 min',
    alertas: ['Matização leve — monitore para não perder calor.'],
  },
  // fundo 7 — Loiro natural
  {
    fundoAtual: 7, alvoId: 'loiro_natural',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.0', proporcao: '1:2', ox: 'OX 10 vol', tempo: '20 min',
    alertas: [],
  },
  // fundo 8 — Morena iluminada
  {
    fundoAtual: 8, alvoId: 'morena_iluminada',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.1', proporcao: '1:2', ox: 'OX 10 vol', tempo: '15 min',
    alertas: [],
  },
  // fundo 8 — Loiro dourado
  {
    fundoAtual: 8, alvoId: 'loiro_dourado',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.3', proporcao: '1:2', ox: 'OX 10 vol', tempo: '20 min',
    alertas: [],
  },
  // fundo 8 — Loiro natural
  {
    fundoAtual: 8, alvoId: 'loiro_natural',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.0', proporcao: '1:2', ox: 'OX 10 vol', tempo: '20 min',
    alertas: [],
  },
  // fundo 8 — Loiro pérola
  {
    fundoAtual: 8, alvoId: 'loiro_perola',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.2', proporcao: '1:2', ox: 'OX 7 vol', tempo: '20 min',
    alertas: ['Não ultrapassar o tempo — risco de esverdear.'],
  },
  // fundo 9 — todos os alvos abaixo do mínimo são bloqueados pela regra 3.3
  {
    fundoAtual: 9, alvoId: 'morena_iluminada',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.1', proporcao: '1:2', ox: 'OX 7 vol', tempo: '15 min',
    alertas: [],
  },
  {
    fundoAtual: 9, alvoId: 'loiro_dourado',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.3', proporcao: '1:2', ox: 'OX 7 vol', tempo: '15 min',
    alertas: [],
  },
  {
    fundoAtual: 9, alvoId: 'loiro_natural',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.0', proporcao: '1:2', ox: 'OX 7 vol', tempo: '15 min',
    alertas: [],
  },
  {
    fundoAtual: 9, alvoId: 'loiro_perola',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.2', proporcao: '1:2', ox: 'OX 7 vol', tempo: '20 min',
    alertas: ['Não ultrapassar o tempo — risco de esverdear.'],
  },
  {
    fundoAtual: 9, alvoId: 'loiro_acinzentado',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.1/.2', proporcao: '1:2', ox: 'OX 7 vol', tempo: '20 min',
    alertas: ['Fundo 9 permite resultado fumê. Monitore o tempo.'],
  },
  // fundo 10 — todos os alvos viáveis
  {
    fundoAtual: 10, alvoId: 'morena_iluminada',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.1', proporcao: '1:2', ox: 'OX 7 vol', tempo: '15 min',
    alertas: [],
  },
  {
    fundoAtual: 10, alvoId: 'loiro_dourado',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.3', proporcao: '1:2', ox: 'OX 7 vol', tempo: '15 min',
    alertas: [],
  },
  {
    fundoAtual: 10, alvoId: 'loiro_natural',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.0', proporcao: '1:2', ox: 'OX 7 vol', tempo: '15 min',
    alertas: [],
  },
  {
    fundoAtual: 10, alvoId: 'loiro_perola',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.2', proporcao: '1:2', ox: 'OX 7 vol', tempo: '20 min',
    alertas: ['Não ultrapassar o tempo — risco de esverdear.'],
  },
  {
    fundoAtual: 10, alvoId: 'loiro_acinzentado',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.1/.2', proporcao: '1:2', ox: 'OX 7 vol', tempo: '20 min',
    alertas: [],
  },
  {
    fundoAtual: 10, alvoId: 'platinado',
    produto: '[PRODUTO FENIÉ — preencher]',
    reflexo: '.2', proporcao: '1:2', ox: 'OX 7 vol', tempo: '25 min',
    alertas: [
      'Fundo 10 obrigatório para platinado.',
      'Não ultrapassar o tempo — risco de esverdear.',
      'Produto de alta intensidade de violeta — use dosagem correta.',
    ],
  },
];
