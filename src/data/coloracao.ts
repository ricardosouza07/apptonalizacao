// ─── TIPOS ───────────────────────────────────────────────────────────────────

export type GrupoAlvo = 'neutralizacao' | 'quente';

export interface FundoClareamento {
  altura: number;
  nome: string;
  fundo: string;
  corHex: string;
}

export interface Alvo {
  id: string;
  nome: string;
  grupo: GrupoAlvo;
  fundoMinimo: number;
  descricao: string;
}

export interface Produto {
  codigo: string;  // ex: "8.2", "/99", "12.12"
  nome: string;    // nome comercial exato da cartela MUP
}

export interface Recomendacao {
  fundoAtual: number;
  alvoId: string;
  produtos: Produto[];   // >1 item = fórmula composta (misturar partes iguais)
  proporcao: string;
  ox: string;
  tempo: string;
  reforcoMix?: string;   // código do Mix para reforço opcional (ex: '/12 Pérola')
  alertas: string[];
}

// ─── ESTIMADOR DE FUNDO ──────────────────────────────────────────────────────

export interface OpcaoClareamento {
  id: string;
  label: string;
  tonsClareados: number;
}

export const OPCOES_CLAREAMENTO: OpcaoClareamento[] = [
  { id: 'tonalizou', label: 'Tonalizou apenas (OX 6 vol)',  tonsClareados: 0.5 },
  { id: 'ox20',      label: 'OX 20 vol',                    tonsClareados: 1.5 },
  { id: 'ox30',      label: 'OX 30 vol',                    tonsClareados: 2.5 },
  { id: 'ox40',      label: 'OX 40 vol',                    tonsClareados: 3.5 },
];

export function estimarFundo(alturaNatural: number, tonsClareados: number): { min: number; max: number } {
  const base = Math.round(alturaNatural + tonsClareados);
  const clamp = (n: number) => Math.max(5, Math.min(10, n));
  return { min: clamp(base - 1), max: clamp(base) };
}

// ─── UTILITÁRIO — REGRA DO 11 ────────────────────────────────────────────────

// Para cada 30g de coloração. Regra: altura + cm de Mix = 11.
export function calcularMix(alturaCor: number): { cm: number; gramas: number } {
  const tabela: Record<number, { cm: number; gramas: number }> = {
    10: { cm: 1,  gramas: 0.5 },
    9:  { cm: 2,  gramas: 1.0 },
    8:  { cm: 3,  gramas: 1.5 },
    7:  { cm: 4,  gramas: 2.0 },
    6:  { cm: 5,  gramas: 2.5 },
    5:  { cm: 6,  gramas: 3.0 },
    4:  { cm: 7,  gramas: 3.5 },
    3:  { cm: 8,  gramas: 4.0 },
    1:  { cm: 10, gramas: 5.0 },
  };
  return tabela[alturaCor] ?? { cm: 11 - alturaCor, gramas: (11 - alturaCor) * 0.5 };
}

// ─── FUNDOS DE CLAREAMENTO ───────────────────────────────────────────────────

export const FUNDOS: FundoClareamento[] = [
  { altura: 5,  nome: 'Castanho claro',    fundo: 'Vermelho-alaranjado', corHex: '#B03A2E' },
  { altura: 6,  nome: 'Louro escuro',      fundo: 'Vermelho-alaranjado', corHex: '#C84A28' },
  { altura: 7,  nome: 'Louro médio',       fundo: 'Laranja',             corHex: '#D4622A' },
  { altura: 8,  nome: 'Louro claro',       fundo: 'Amarelo-alaranjado',  corHex: '#D4A030' },
  { altura: 9,  nome: 'Louro muito claro', fundo: 'Amarelo',             corHex: '#D4C23A' },
  { altura: 10, nome: 'Louro claríssimo',  fundo: 'Amarelo claro',       corHex: '#F0EDB8' },
];

// ─── ALVOS ───────────────────────────────────────────────────────────────────

export const ALVOS: Alvo[] = [
  // Grupo A — Neutralização (resultado frio/neutro)
  {
    id: 'morena_iluminada',
    nome: 'Morena iluminada',
    grupo: 'neutralizacao',
    fundoMinimo: 6,
    descricao: 'Cinza + Verde — neutraliza fundo vermelho-alaranjado',
  },
  {
    id: 'loiro_natural',
    nome: 'Loiro natural / neutro',
    grupo: 'neutralizacao',
    fundoMinimo: 7,
    descricao: 'Cinza (.1) — neutraliza fundo laranja, resultado equilibrado',
  },
  {
    id: 'loiro_perola',
    nome: 'Loiro pérola / frio',
    grupo: 'neutralizacao',
    fundoMinimo: 8,
    descricao: 'Cinza + Violeta (8.1 + 8.2) — neutralização composta do amarelo-alaranjado',
  },
  {
    id: 'loiro_acinzentado',
    nome: 'Loiro acinzentado / fumê',
    grupo: 'neutralizacao',
    fundoMinimo: 9,
    descricao: 'Violeta (.2) — neutraliza fundo amarelo, resultado frio e elegante',
  },
  {
    id: 'platinado',
    nome: 'Platinado',
    grupo: 'neutralizacao',
    fundoMinimo: 10,
    descricao: 'Pérola 10.12 ou Cinza 10.1 — fundo 10 obrigatório',
  },
  {
    id: 'platinado_avancado',
    nome: 'Platinado avançado',
    grupo: 'neutralizacao',
    fundoMinimo: 10,
    descricao: 'Super Clareadores 12.xx — altíssima neutralização, fundo 10 limpo obrigatório',
  },

  // Grupo B — Tons quentes / luminosos (deposita calor, NÃO neutraliza)
  {
    id: 'dourado_mel',
    nome: 'Loiro dourado / mel',
    grupo: 'quente',
    fundoMinimo: 7,
    descricao: 'Série Dourado (.3) — mantém e realça calor natural do fio',
  },
  {
    id: 'louro_luminoso',
    nome: 'Loiro luminoso (Série L)',
    grupo: 'quente',
    fundoMinimo: 5,
    descricao: 'Série exclusiva MUP — bases quentes com assinatura própria',
  },
  {
    id: 'caramelo',
    nome: 'Caramelo',
    grupo: 'quente',
    fundoMinimo: 8,
    descricao: '8.34 Caramelo / 10.34 Caramelo Suave — tons mel intensos',
  },
  {
    id: 'baunilha',
    nome: 'Baunilha',
    grupo: 'quente',
    fundoMinimo: 10,
    descricao: '10.37 — loiro claríssimo de toque baunilha, fundo 10 obrigatório',
  },
  {
    id: 'marrom_cafe',
    nome: 'Marrom café',
    grupo: 'quente',
    fundoMinimo: 7,
    descricao: '7.73 Marrom Café — tom quente terroso para fundo médio',
  },
];

// ─── PROTOCOLO PADRÃO ────────────────────────────────────────────────────────

const PROTOCOLO = { proporcao: '1:2', ox: '6 vol (ou 8 vol)', tempo: '15–20 min' } as const;

// ─── MATRIZ DE RECOMENDAÇÕES ─────────────────────────────────────────────────
//
// GRUPO A — NEUTRALIZAÇÃO
// Tabela oficial MUP: Altura de Tom × Fundo × Neutralização
// Produtos confirmados pelos técnicos master Vitor Pinho e Márcio Fiorucci.
//
// GRUPO B — TONS QUENTES
// Deposita calor — NÃO neutraliza fundo. Protocolo idêntico (1:2, 6vol, 15-20min).
//
// Fórmulas compostas (>1 produto): misturar em partes iguais antes de aplicar.

export const RECOMENDACOES: Recomendacao[] = [

  // ══════════════════════════════════════════════════════════════════════
  //  GRUPO A — NEUTRALIZAÇÃO
  // ══════════════════════════════════════════════════════════════════════

  // ── morena_iluminada (fundo mín. 6) ──────────────────────────────────

  {
    fundoAtual: 6, alvoId: 'morena_iluminada',
    produtos: [
      { codigo: '6.1', nome: 'Louro Escuro Cinza' },
      { codigo: '/99', nome: 'Verde (Mix)' },
    ],
    ...PROTOCOLO,
    reforcoMix: '/99 Verde',
    alertas: [
      'Fórmula composta — misturar 6.1 e /99 em partes iguais.',
      'Fundo vermelho-alaranjado exige neutralização composta: cinza (azul) + verde.',
      'Tempo visual — acompanhe a cada 5 minutos.',
    ],
  },
  {
    fundoAtual: 7, alvoId: 'morena_iluminada',
    produtos: [{ codigo: '7.1', nome: 'Louro Médio Cinza' }],
    ...PROTOCOLO,
    reforcoMix: '/11 Cinza',
    alertas: ['Fundo laranja — cinza (azul) é suficiente para neutralizar.'],
  },
  {
    fundoAtual: 8, alvoId: 'morena_iluminada',
    produtos: [{ codigo: '8.1', nome: 'Louro Claro Cinza' }],
    ...PROTOCOLO,
    reforcoMix: '/11 Cinza',
    alertas: [],
  },
  {
    fundoAtual: 9, alvoId: 'morena_iluminada',
    produtos: [{ codigo: '9.1', nome: 'Louro Muito Claro Cinza' }],
    ...PROTOCOLO,
    reforcoMix: '/11 Cinza',
    alertas: [],
  },
  {
    fundoAtual: 10, alvoId: 'morena_iluminada',
    produtos: [{ codigo: '10.1', nome: 'Louro Claríssimo Cinza' }],
    ...PROTOCOLO,
    reforcoMix: '/11 Cinza',
    alertas: [],
  },

  // ── loiro_natural (fundo mín. 7) ─────────────────────────────────────

  {
    fundoAtual: 7, alvoId: 'loiro_natural',
    produtos: [{ codigo: '7.1', nome: 'Louro Médio Cinza' }],
    ...PROTOCOLO,
    reforcoMix: '/11 Cinza',
    alertas: [],
  },
  {
    fundoAtual: 8, alvoId: 'loiro_natural',
    produtos: [{ codigo: '8.1', nome: 'Louro Claro Cinza' }],
    ...PROTOCOLO,
    reforcoMix: '/11 Cinza',
    alertas: [],
  },
  {
    fundoAtual: 9, alvoId: 'loiro_natural',
    produtos: [{ codigo: '9.1', nome: 'Louro Muito Claro Cinza' }],
    ...PROTOCOLO,
    reforcoMix: '/11 Cinza',
    alertas: [],
  },
  {
    fundoAtual: 10, alvoId: 'loiro_natural',
    produtos: [{ codigo: '10.1', nome: 'Louro Claríssimo Cinza' }],
    ...PROTOCOLO,
    reforcoMix: '/11 Cinza',
    alertas: ['Fundo pálido — cinza leve equilibra o tom sem frieza excessiva.'],
  },

  // ── loiro_perola (fundo mín. 8) ──────────────────────────────────────

  {
    fundoAtual: 8, alvoId: 'loiro_perola',
    produtos: [
      { codigo: '8.1', nome: 'Louro Claro Cinza' },
      { codigo: '8.2', nome: 'Louro Claro Violeta' },
    ],
    ...PROTOCOLO,
    reforcoMix: '/12 Pérola',
    alertas: [
      'Fórmula composta — misturar 8.1 e 8.2 em partes iguais.',
      'Fundo amarelo-alaranjado exige neutralização composta: azul (cinza) + violeta.',
      'Não ultrapassar o tempo — risco de esverdear.',
    ],
  },
  {
    fundoAtual: 9, alvoId: 'loiro_perola',
    produtos: [{ codigo: '9.2', nome: 'Louro Muito Claro Violeta' }],
    ...PROTOCOLO,
    reforcoMix: '/12 Pérola',
    alertas: [
      '9.2 é o representante correto do violeta em altura 9.',
      'Usar 9.12 apenas na ausência do 9.2 — tem concentração maior de cinza.',
      'Não ultrapassar o tempo — risco de esverdear.',
    ],
  },
  {
    fundoAtual: 10, alvoId: 'loiro_perola',
    produtos: [{ codigo: '10.12', nome: 'Louro Claríssimo Pérola' }],
    ...PROTOCOLO,
    reforcoMix: '/12 Pérola',
    alertas: ['Não ultrapassar o tempo — risco de esverdear.'],
  },

  // ── loiro_acinzentado (fundo mín. 9) ─────────────────────────────────

  {
    fundoAtual: 9, alvoId: 'loiro_acinzentado',
    produtos: [{ codigo: '9.2', nome: 'Louro Muito Claro Violeta' }],
    ...PROTOCOLO,
    reforcoMix: '/12 Pérola',
    alertas: [
      '9.2 para resultado acinzentado; 9.1 para resultado mais neutro.',
      'Não ultrapassar o tempo — risco de esverdear.',
    ],
  },
  {
    fundoAtual: 10, alvoId: 'loiro_acinzentado',
    produtos: [{ codigo: '10.12', nome: 'Louro Claríssimo Pérola' }],
    ...PROTOCOLO,
    reforcoMix: '/12 Pérola',
    alertas: ['Não ultrapassar o tempo — risco de esverdear.'],
  },

  // ── platinado (fundo mín. 10) ─────────────────────────────────────────

  {
    fundoAtual: 10, alvoId: 'platinado',
    produtos: [{ codigo: '10.12', nome: 'Louro Claríssimo Pérola' }],
    ...PROTOCOLO,
    reforcoMix: '/12 Pérola',
    alertas: [
      'Fundo 10 obrigatório para platinado.',
      'Não ultrapassar o tempo — risco de esverdear.',
      'Para resultado mais frio: usar 10.1 + 10.12 em partes iguais.',
    ],
  },

  // ── platinado_avancado (fundo mín. 10) ───────────────────────────────

  {
    fundoAtual: 10, alvoId: 'platinado_avancado',
    produtos: [{ codigo: '12.12', nome: 'Louro Claríssimo Pérola Especial' }],
    ...PROTOCOLO,
    alertas: [
      'Super Clareador — altíssima neutralização.',
      'Exige fundo 10 limpo e uniforme.',
      'Alternativas: 12.10 (Cinza Especial) ou 12.89 (Pérola Especial Ultra).',
      'Excesso pode acinzentar ou esverdear — TESTE DE MECHA OBRIGATÓRIO.',
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  //  GRUPO B — TONS QUENTES (deposita calor, NÃO neutraliza)
  // ══════════════════════════════════════════════════════════════════════

  // ── dourado_mel (fundo mín. 7) ────────────────────────────────────────

  {
    fundoAtual: 7, alvoId: 'dourado_mel',
    produtos: [{ codigo: '7.3', nome: 'Louro Médio Dourado' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 8, alvoId: 'dourado_mel',
    produtos: [{ codigo: '8.3', nome: 'Louro Claro Dourado' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 9, alvoId: 'dourado_mel',
    produtos: [{ codigo: '9.3', nome: 'Louro Muito Claro Dourado' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 10, alvoId: 'dourado_mel',
    produtos: [{ codigo: '9.3', nome: 'Louro Muito Claro Dourado' }],
    ...PROTOCOLO,
    alertas: ['Não há 10.3 na cartela MUP — usar 9.3 em função tonalizante.'],
  },

  // ── louro_luminoso — Série L (fundo mín. 5) ───────────────────────────

  {
    fundoAtual: 5, alvoId: 'louro_luminoso',
    produtos: [{ codigo: '5L', nome: 'Castanho Claro Luminoso' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 6, alvoId: 'louro_luminoso',
    produtos: [{ codigo: '6L', nome: 'Louro Escuro Luminoso' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 7, alvoId: 'louro_luminoso',
    produtos: [{ codigo: '7L', nome: 'Louro Médio Luminoso' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 8, alvoId: 'louro_luminoso',
    produtos: [{ codigo: '8L', nome: 'Louro Claro Luminoso' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 9, alvoId: 'louro_luminoso',
    produtos: [{ codigo: '9L', nome: 'Louro Muito Luminoso' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 10, alvoId: 'louro_luminoso',
    produtos: [{ codigo: '9L', nome: 'Louro Muito Luminoso' }],
    ...PROTOCOLO,
    alertas: ['Não há 10L na cartela — usar 9L em função tonalizante.'],
  },

  // ── caramelo (fundo mín. 8) ───────────────────────────────────────────

  {
    fundoAtual: 8, alvoId: 'caramelo',
    produtos: [{ codigo: '8.34', nome: 'Caramelo' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 9, alvoId: 'caramelo',
    produtos: [{ codigo: '8.34', nome: 'Caramelo' }],
    ...PROTOCOLO,
    alertas: ['8.34 aplicado em fundo 9 — resultado mais suave e luminoso.'],
  },
  {
    fundoAtual: 10, alvoId: 'caramelo',
    produtos: [{ codigo: '10.34', nome: 'Caramelo Suave' }],
    ...PROTOCOLO,
    alertas: [],
  },

  // ── baunilha (fundo mín. 10) ──────────────────────────────────────────

  {
    fundoAtual: 10, alvoId: 'baunilha',
    produtos: [{ codigo: '10.37', nome: 'Baunilha' }],
    ...PROTOCOLO,
    alertas: ['Fundo 10 obrigatório para resultado baunilha puro.'],
  },

  // ── marrom_cafe (fundo mín. 7) ────────────────────────────────────────

  {
    fundoAtual: 7, alvoId: 'marrom_cafe',
    produtos: [{ codigo: '7.73', nome: 'Marrom Café' }],
    ...PROTOCOLO,
    alertas: [],
  },
  {
    fundoAtual: 8, alvoId: 'marrom_cafe',
    produtos: [{ codigo: '7.73', nome: 'Marrom Café' }],
    ...PROTOCOLO,
    alertas: ['7.73 aplicado em fundo 8 — resultado marrom mais claro e suave.'],
  },
  {
    fundoAtual: 9, alvoId: 'marrom_cafe',
    produtos: [{ codigo: '7.73', nome: 'Marrom Café' }],
    ...PROTOCOLO,
    alertas: ['7.73 aplicado em fundo 9 — resultado mel acastanhado, calor intenso.'],
  },
  {
    fundoAtual: 10, alvoId: 'marrom_cafe',
    produtos: [{ codigo: '7.73', nome: 'Marrom Café' }],
    ...PROTOCOLO,
    alertas: ['7.73 em fundo 10 — resultado quente e luminoso, contraste marcante.'],
  },
];
