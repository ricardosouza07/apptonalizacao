import { useState } from 'react';
import {
  FUNDOS,
  OPCOES_CLAREAMENTO,
  OPCOES_OX_COLORACAO,
  PIGMENTOS_CONTRIBUINTES,
  estimarFundo,
  estimarAlturaAlcancada,
} from '../data/coloracao';
import type { FundoClareamento, OpcaoClareamento, OpcaoOxColoracao } from '../data/coloracao';
import type { OrigemFundo } from '../data/registros';

interface Props {
  onSelect: (fundo: FundoClareamento, origem: OrigemFundo) => void;
}

type Caminho = 'escolha' | 'direto' | 'estimador';
type Historico = 'virgem' | 'coloracao' | 'descolorido';
type EstimadorPasso =
  | 'historico'
  | 'corNatural'
  | 'alturaColoracao'
  | 'oxColoracao'
  | 'oxDescoloracao'
  | 'resultado';

const CORES_NATURAIS = [
  { altura: 1,  nome: 'Preto' },
  { altura: 2,  nome: 'Castanho muito escuro' },
  { altura: 3,  nome: 'Castanho escuro' },
  { altura: 4,  nome: 'Castanho médio' },
  { altura: 5,  nome: 'Castanho claro' },
  { altura: 6,  nome: 'Louro escuro' },
  { altura: 7,  nome: 'Louro médio' },
  { altura: 8,  nome: 'Louro claro' },
  { altura: 9,  nome: 'Louro muito claro' },
  { altura: 10, nome: 'Louro claríssimo' },
];

export function StepFundo({ onSelect }: Props) {
  const [caminho, setCaminho] = useState<Caminho>('escolha');

  if (caminho === 'direto') {
    return (
      <SelecaoDireta
        onSelect={(f) => onSelect(f, 'selecao')}
        onBack={() => setCaminho('escolha')}
      />
    );
  }
  if (caminho === 'estimador') {
    return (
      <Estimador
        onBack={() => setCaminho('escolha')}
        onSelect={(f) => onSelect(f, 'estimador')}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Passo 1 de 2
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
        >
          Fundo de clareamento
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#C5C5C2' }}>
          Qual é o fundo de clareamento do fio?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => setCaminho('direto')}
          className="flex flex-col rounded-xl p-5 text-left transition-all active:scale-95"
          style={{ background: '#111629', border: '1px solid #1e2340' }}
        >
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
          >
            Já sei o fundo
          </span>
          <span className="text-sm mt-0.5" style={{ color: '#C5C5C2' }}>
            Comparei com a tabela física MUP e sei o número (5 a 10)
          </span>
        </button>

        <button
          onClick={() => setCaminho('estimador')}
          className="flex flex-col rounded-xl p-5 text-left transition-all active:scale-95"
          style={{ background: '#111629', border: '1px solid #1e2340' }}
        >
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#C8932E' }}
          >
            Me ajude a descobrir
          </span>
          <span className="text-sm mt-0.5" style={{ color: '#C5C5C2' }}>
            Estimativa guiada baseada no histórico do fio e na cor natural de partida
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Seleção direta ──────────────────────────────────────────────────────────

function SelecaoDireta({
  onSelect,
  onBack,
}: {
  onSelect: (f: FundoClareamento) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Passo 1 de 2
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
        >
          Selecione o fundo
        </h1>
      </div>

      <div
        className="rounded-lg px-3 py-2 text-xs"
        style={{
          background: '#0d1020',
          border: '1px solid #2a2f4a',
          color: '#C5C5C2',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
        }}
      >
        Compare a mecha com sua tabela física MUP, sobre superfície branca e sob luz natural, e selecione o fundo.
      </div>

      <ListaFundos onSelect={onSelect} />

      <p className="text-xs text-center" style={{ color: '#666', fontStyle: 'italic' }}>
        As amostras de cor são referência aproximada. A tabela física MUP é a fonte oficial.
      </p>

      <BackLink onClick={onBack} />
    </div>
  );
}

// ─── Estimador guiado ────────────────────────────────────────────────────────

function Estimador({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (f: FundoClareamento) => void;
}) {
  const [passo, setPasso] = useState<EstimadorPasso>('historico');
  const [historico, setHistorico] = useState<Historico | null>(null);
  const [corNatural, setCorNatural] = useState<number | null>(null);
  const [alturaColoracao, setAlturaColoracao] = useState<number | null>(null);
  const [oxColoracao, setOxColoracao] = useState<OpcaoOxColoracao | null>(null);
  const [oxDescoloracao, setOxDescoloracao] = useState<OpcaoClareamento | null>(null);

  const totalPassos = historico === 'coloracao' ? 4 : historico === 'descolorido' ? 3 : historico === 'virgem' ? 2 : 4;

  const handleHistorico = (h: Historico) => {
    setHistorico(h);
    setPasso('corNatural');
  };

  const handleCorNatural = (n: number) => {
    setCorNatural(n);
    if (historico === 'virgem') setPasso('resultado');
    else if (historico === 'coloracao') setPasso('alturaColoracao');
    else setPasso('oxDescoloracao');
  };

  // ── Passo 1 — Histórico químico ──
  if (passo === 'historico') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo="Passo 1" />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          O cabelo já passou por algum processo químico?
        </p>
        <div className="flex flex-col gap-3">
          <OpcaoBtn
            label="Cabelo virgem"
            sub="Nunca teve química — nem coloração, nem descoloração"
            onClick={() => handleHistorico('virgem')}
          />
          <OpcaoBtn
            label="Já recebeu coloração"
            sub="Tem coloração aplicada sobre a cor natural"
            onClick={() => handleHistorico('coloracao')}
          />
          <OpcaoBtn
            label="Já foi descolorido"
            sub="Passou por descoloração (pó descolorante + OX)"
            onClick={() => handleHistorico('descolorido')}
          />
        </div>
        <BackLink onClick={onBack} />
      </div>
    );
  }

  // ── Passo 2 — Cor natural de partida ──
  if (passo === 'corNatural') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo={`Passo 2 de ${totalPassos}`} />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Qual é a cor natural de partida?
        </p>
        <div className="flex flex-col gap-2">
          {[...CORES_NATURAIS].reverse().map((a) => (
            <BotaoAltura key={a.altura} altura={a.altura} nome={a.nome} onClick={() => handleCorNatural(a.altura)} />
          ))}
        </div>
        <BackLink onClick={() => setPasso('historico')} />
      </div>
    );
  }

  // ── Caminho COLORAÇÃO: Passo 3 — altura da coloração aplicada ──
  if (passo === 'alturaColoracao') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo={`Passo 3 de ${totalPassos}`} />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Qual a altura da coloração aplicada?
        </p>
        <p className="text-xs" style={{ color: '#C5C5C2' }}>
          É o número antes do ponto: para um 7.1, a altura é 7.
        </p>
        <div className="flex flex-col gap-2">
          {[...CORES_NATURAIS].reverse().map((a) => (
            <BotaoAltura
              key={a.altura}
              altura={a.altura}
              nome={a.nome}
              onClick={() => {
                setAlturaColoracao(a.altura);
                setPasso('oxColoracao');
              }}
            />
          ))}
        </div>
        <BackLink onClick={() => setPasso('corNatural')} />
      </div>
    );
  }

  // ── Caminho COLORAÇÃO: Passo 4 — OX usado ──
  if (passo === 'oxColoracao') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo={`Passo 4 de ${totalPassos}`} />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Qual OX foi usado com a coloração?
        </p>
        <div className="flex flex-col gap-3">
          {OPCOES_OX_COLORACAO.map((op) => (
            <OpcaoBtn
              key={op.id}
              label={op.label}
              onClick={() => {
                setOxColoracao(op);
                setPasso('resultado');
              }}
            />
          ))}
        </div>
        <BackLink onClick={() => setPasso('alturaColoracao')} />
      </div>
    );
  }

  // ── Caminho DESCOLORAÇÃO: Passo 3 — OX usado ──
  if (passo === 'oxDescoloracao') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo={`Passo 3 de ${totalPassos}`} />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Qual oxidante foi usado na descoloração?
        </p>
        <div className="flex flex-col gap-3">
          {OPCOES_CLAREAMENTO.map((op) => (
            <OpcaoBtn
              key={op.id}
              label={op.label}
              onClick={() => {
                setOxDescoloracao(op);
                setPasso('resultado');
              }}
            />
          ))}
        </div>
        <BackLink onClick={() => setPasso('corNatural')} />
      </div>
    );
  }

  // ── Resultados ──

  if (historico === 'virgem') {
    return (
      <ResultadoVirgem
        corNatural={corNatural!}
        onSelect={onSelect}
        onBack={() => setPasso('corNatural')}
      />
    );
  }

  if (historico === 'coloracao') {
    const faixa = estimarAlturaAlcancada(corNatural!, alturaColoracao!, oxColoracao!);
    return (
      <ResultadoFaixa
        faixa={faixa}
        contexto={`Cor natural ${corNatural} + coloração ${alturaColoracao} com ${oxColoracao!.label.split(' (')[0]}`}
        explicacao={montarExplicacao(corNatural!, alturaColoracao!, oxColoracao!, faixa)}
        mostrarExemplos
        onSelect={onSelect}
        onBack={() => setPasso('oxColoracao')}
      />
    );
  }

  // descolorido
  const faixa = estimarFundo(corNatural!, oxDescoloracao!.tonsClareados);
  return (
    <ResultadoFaixa
      faixa={faixa}
      contexto={`Cor natural ${corNatural} + descoloração com ${oxDescoloracao!.label}`}
      onSelect={onSelect}
      onBack={() => setPasso('oxDescoloracao')}
    />
  );
}

function montarExplicacao(
  natural: number,
  coloracao: number,
  ox: OpcaoOxColoracao,
  faixa: { min: number; max: number },
): string {
  const pigMin = PIGMENTOS_CONTRIBUINTES[faixa.min];
  const pigMax = PIGMENTOS_CONTRIBUINTES[faixa.max];
  const oxNome = ox.label.split(' (')[0];
  const casa =
    faixa.min === faixa.max ? `a casa do ${faixa.min}` : `a casa de ${faixa.min} a ${faixa.max}`;
  const pigmento =
    pigMin === pigMax ? pigMin.toLowerCase() : `${pigMin.toLowerCase()} a ${pigMax.toLowerCase()}`;
  const teto =
    natural + ox.tonsMax > coloracao
      ? ` A coloração ${coloracao} é o teto — "o ${coloracao} segura o clareamento".`
      : '';
  return `Natural ${natural} + coloração ${coloracao} com ${oxNome} → o cabelo alcança ${casa}, contribuindo com ${pigmento}.${teto}`;
}

// ─── Resultado: cabelo virgem ────────────────────────────────────────────────

function ResultadoVirgem({
  corNatural,
  onSelect,
  onBack,
}: {
  corNatural: number;
  onSelect: (f: FundoClareamento) => void;
  onBack: () => void;
}) {
  const nomeNatural = CORES_NATURAIS.find((c) => c.altura === corNatural)?.nome ?? '';
  const pigmento = PIGMENTOS_CONTRIBUINTES[corNatural];
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <Header titulo="Cabelo virgem" />

      <div className="rounded-xl p-5" style={{ background: '#0d1020', border: '1px solid #2a2f4a' }}>
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#4a6fa5', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Pigmento contribuinte
        </p>
        <p
          className="text-3xl font-bold"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
        >
          {pigmento}
        </p>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: '#C5C5C2' }}>
          Em cabelo natural não existe fundo de clareamento ainda — ele só se revela quando o fio é
          clareado. O que existe é o <strong style={{ color: '#F5F5F2' }}>pigmento contribuinte</strong> da
          cor natural {corNatural} ({nomeNatural}): ao clarear, é esse pigmento que vai aparecer primeiro.
        </p>
      </div>

      <AvisoConfirmacao texto="Após o clareamento, CONFIRME o fundo real na sua tabela física MUP e faça teste de mecha antes de tonalizar." />

      <p
        className="text-sm font-semibold"
        style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#C5C5C2' }}
      >
        Se o fio já foi clareado, confirme o fundo exato:
      </p>

      <ListaFundos onSelect={onSelect} />

      <NotaTabela />
      <BackLink onClick={onBack} />
    </div>
  );
}

// ─── Resultado: faixa estimada (coloração / descoloração) ───────────────────

const EXEMPLOS_EDUCATIVOS = [
  'Natural 4 + coloração 7 com OX 30 → contribui com laranja',
  'Natural 4 + coloração 6 com OX 20 → contribui com vermelho-alaranjado',
  'Natural 4 + coloração 5 com OX 30 → não chega à casa do 7; o 5 segura o clareamento',
];

function ResultadoFaixa({
  faixa,
  contexto,
  explicacao,
  mostrarExemplos = false,
  onSelect,
  onBack,
}: {
  faixa: { min: number; max: number };
  contexto: string;
  explicacao?: string;
  mostrarExemplos?: boolean;
  onSelect: (f: FundoClareamento) => void;
  onBack: () => void;
}) {
  const pigMin = PIGMENTOS_CONTRIBUINTES[faixa.min];
  const pigMax = PIGMENTOS_CONTRIBUINTES[faixa.max];
  const pigmentos = pigMin === pigMax ? pigMin : `${pigMin} / ${pigMax}`;
  const abaixoDe5 = faixa.max < 5;

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <Header titulo="Faixa estimada" />

      <div className="rounded-xl p-5" style={{ background: '#0d1020', border: '1px solid #2a2f4a' }}>
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#4a6fa5', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Altura alcançada
        </p>
        <p
          className="text-3xl font-bold"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
        >
          {faixa.min === faixa.max ? `Casa do ${faixa.min}` : `Casa de ${faixa.min} a ${faixa.max}`}
        </p>
        <p className="text-sm mt-1" style={{ color: '#C5C5C2' }}>
          Pigmento contribuinte: <strong style={{ color: '#F5F5F2' }}>{pigmentos}</strong>
        </p>
        <p className="text-xs mt-2" style={{ color: '#888' }}>{contexto}</p>
        {explicacao && (
          <p
            className="text-sm mt-3 leading-relaxed"
            style={{ color: '#C5C5C2', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
          >
            {explicacao}
          </p>
        )}
      </div>

      {abaixoDe5 && (
        <div className="rounded-xl p-4" style={{ background: '#2a0e0e', border: '1px solid #5c1a1a' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#fca5a5' }}>
            A altura alcançada está abaixo de 5 — fora da faixa de tonalização do guia. É necessário
            clarear mais antes de tonalizar.
          </p>
        </div>
      )}

      {mostrarExemplos && (
        <div className="rounded-xl p-4" style={{ background: '#111629', border: '1px solid #1e2340' }}>
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
          >
            Para entender a regra
          </p>
          <ul className="flex flex-col gap-1">
            {EXEMPLOS_EDUCATIVOS.map((e, i) => (
              <li key={i} className="text-xs leading-relaxed" style={{ color: '#C5C5C2' }}>
                — {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      <AvisoConfirmacao texto="Estimativa de apoio. CONFIRME na sua tabela física MUP, com o fio sobre superfície branca e luz natural, e faça teste de mecha antes de seguir." />

      <p
        className="text-sm font-semibold"
        style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#C5C5C2' }}
      >
        Confirme o fundo exato:
      </p>

      <ListaFundos
        onSelect={onSelect}
        destaque={(altura) => altura >= faixa.min && altura <= faixa.max}
      />

      <NotaTabela />
      <BackLink onClick={onBack} />
    </div>
  );
}

// ─── Subcomponentes utilitários ──────────────────────────────────────────────

function ListaFundos({
  onSelect,
  destaque,
}: {
  onSelect: (f: FundoClareamento) => void;
  destaque?: (altura: number) => boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {[...FUNDOS].reverse().map((f) => {
        const destacado = destaque ? destaque(f.altura) : false;
        return (
          <button
            key={f.altura}
            onClick={() => onSelect(f)}
            className="flex items-center gap-3 rounded-xl p-4 text-left transition-all active:scale-95"
            style={{
              background: destacado ? '#151c35' : '#111629',
              border: `1px solid ${destacado ? '#C8932E' : '#1e2340'}`,
            }}
          >
            <span
              className="flex-shrink-0 rounded-full border-2"
              style={{
                width: 32,
                height: 32,
                background: f.corHex,
                borderColor: destacado ? '#C8932E' : '#2a2f4a',
                opacity: 0.75,
              }}
              title="Referência aproximada — use a tabela física MUP"
            />
            <span className="flex flex-col flex-1">
              <span
                className="text-base font-semibold leading-tight"
                style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
              >
                {f.altura} — {f.nome}
              </span>
              <span className="text-xs mt-0.5" style={{ color: '#C5C5C2' }}>
                Pigmento residual: {f.fundo}
              </span>
            </span>
            {destacado && (
              <span
                className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: '#2a1f00', color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
              >
                Estimado
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function BotaoAltura({ altura, nome, onClick }: { altura: number; nome: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all active:scale-95"
      style={{ background: '#111629', border: '1px solid #1e2340' }}
    >
      <span
        className="text-sm font-bold flex-shrink-0"
        style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#C8932E', width: 20 }}
      >
        {altura}
      </span>
      <span
        className="text-base font-semibold"
        style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
      >
        {nome}
      </span>
    </button>
  );
}

function AvisoConfirmacao({ texto }: { texto: string }) {
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        background: '#1c1505',
        border: '1px solid #4a3310',
        color: '#e8c97a',
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
      }}
    >
      {texto}
    </div>
  );
}

function NotaTabela() {
  return (
    <p className="text-xs text-center" style={{ color: '#666', fontStyle: 'italic' }}>
      As amostras de cor são referência aproximada. A tabela física MUP é a fonte oficial.
    </p>
  );
}

function Header({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <div className="text-center">
      {subtitulo && (
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          {subtitulo}
        </p>
      )}
      <h1
        className="text-3xl font-bold leading-tight"
        style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
      >
        {titulo}
      </h1>
    </div>
  );
}

function OpcaoBtn({
  label,
  sub,
  onClick,
}: {
  label: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-xl p-4 text-left transition-all active:scale-95"
      style={{ background: '#111629', border: '1px solid #1e2340' }}
    >
      <span
        className="text-base font-semibold"
        style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
      >
        {label}
      </span>
      {sub && (
        <span className="text-xs mt-0.5" style={{ color: '#C5C5C2' }}>
          {sub}
        </span>
      )}
    </button>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm underline underline-offset-4 mt-2"
      style={{ color: '#C5C5C2', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      ← Voltar
    </button>
  );
}
