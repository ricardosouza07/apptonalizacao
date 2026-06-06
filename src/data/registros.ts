// ─── REGISTROS DE RESULTADO (feedback de campo) ──────────────────────────────
//
// Persistência local (localStorage) — sem backend. Quando o gating com
// Supabase entrar, esta camada migra para lá. Todas as operações tratam
// erro de quota / ausência de suporte com fallback silencioso.

export type Veredito = 'esperado' | 'parcial' | 'ruim';

export interface RegistroResultado {
  id: string;
  criadoEm: string;        // ISO
  // contexto automático da recomendação:
  fundoAtual: number;
  alvoId: string;
  alvoNome: string;
  produtos: string[];      // códigos, ex: ["8.1","8.2"]
  origemFundo: OrigemFundo;
  // feedback do colorista:
  veredito: Veredito;
  ocorrencias?: string[];
  tipoCabelo?: string[];
  observacao?: string;
}

export type OrigemFundo = 'selecao' | 'estimador';

const STORAGE_KEY = 'fenie_pro_registros_v1';

// ─── Catálogos de chips ───────────────────────────────────────────────────────

export const VEREDITOS: { id: Veredito; label: string; cor: string }[] = [
  { id: 'esperado', label: 'Ficou como esperado',           cor: '#3f9d5a' },
  { id: 'parcial',  label: 'Resultado parcial / ajustou',   cor: '#C8932E' },
  { id: 'ruim',     label: 'Não ficou bom',                 cor: '#b04a3a' },
];

export const OCORRENCIAS: { id: string; label: string }[] = [
  { id: 'esverdeou',   label: 'Esverdeou' },
  { id: 'amarelou',    label: 'Amarelou / fundo voltou' },
  { id: 'acinzentou',  label: 'Acinzentou demais' },
  { id: 'cor_fraca',   label: 'Cor fraca / não pegou' },
  { id: 'manchou',     label: 'Manchou / desigual' },
  { id: 'otimo',       label: 'Ficou ótimo' },
];

export const TIPOS_CABELO: { id: string; label: string }[] = [
  { id: 'virgem',      label: 'Virgem' },
  { id: 'com_quimica', label: 'Com química' },
  { id: 'poroso',      label: 'Poroso' },
  { id: 'resistente',  label: 'Resistente' },
];

// ─── Persistência ──────────────────────────────────────────────────────────────

export function listarRegistros(): RegistroResultado[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function salvarRegistro(r: RegistroResultado): boolean {
  try {
    const atuais = listarRegistros();
    atuais.unshift(r);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atuais));
    return true;
  } catch {
    return false;
  }
}

export function limparRegistros(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function gerarId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fallback abaixo */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Exportação ──────────────────────────────────────────────────────────────

function escaparCSV(valor: string): string {
  if (/[",\n;]/.test(valor)) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

export function registrosParaCSV(registros: RegistroResultado[]): string {
  const cabecalho = [
    'criadoEm', 'fundoAtual', 'alvoId', 'alvoNome', 'produtos',
    'origemFundo', 'veredito', 'ocorrencias', 'tipoCabelo', 'observacao',
  ];
  const linhas = registros.map((r) =>
    [
      r.criadoEm,
      String(r.fundoAtual),
      r.alvoId,
      r.alvoNome,
      (r.produtos ?? []).join(' + '),
      r.origemFundo,
      r.veredito,
      (r.ocorrencias ?? []).join(' | '),
      (r.tipoCabelo ?? []).join(' | '),
      r.observacao ?? '',
    ].map((c) => escaparCSV(c)).join(','),
  );
  return [cabecalho.join(','), ...linhas].join('\n');
}

export function exportarRegistros(formato: 'csv' | 'json' = 'csv'): boolean {
  try {
    const registros = listarRegistros();
    if (registros.length === 0) return false;

    const conteudo =
      formato === 'csv' ? registrosParaCSV(registros) : JSON.stringify(registros, null, 2);
    const tipo = formato === 'csv' ? 'text/csv;charset=utf-8' : 'application/json';
    const ext = formato === 'csv' ? 'csv' : 'json';

    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const carimbo = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fenie-pro-registros-${carimbo}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}
