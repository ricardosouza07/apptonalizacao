import { useState } from 'react';
import { FUNDOS, OPCOES_CLAREAMENTO, estimarFundo } from '../data/coloracao';
import type { FundoClareamento, OpcaoClareamento } from '../data/coloracao';

interface Props {
  onSelect: (fundo: FundoClareamento) => void;
}

type Caminho = 'escolha' | 'direto' | 'estimador';
type EstimadorPasso = 'quimica' | 'altura' | 'ox' | 'resultado';

const ALTURAS_NATURAIS = [
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
    return <SelecaoDireta onSelect={onSelect} onBack={() => setCaminho('escolha')} />;
  }
  if (caminho === 'estimador') {
    return (
      <Estimador
        onConfirmar={() => setCaminho('direto')}
        onBack={() => setCaminho('escolha')}
        onSelect={onSelect}
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
            Estimativa guiada baseada na altura natural e no processo de clareamento
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
  preselect,
}: {
  onSelect: (f: FundoClareamento) => void;
  onBack: () => void;
  preselect?: number;
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

      <div className="flex flex-col gap-2">
        {[...FUNDOS].reverse().map((f) => {
          const destacado = preselect !== undefined && f.altura >= preselect - 1 && f.altura <= preselect;
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

      <p className="text-xs text-center" style={{ color: '#666', fontStyle: 'italic' }}>
        As amostras de cor são referência aproximada. A tabela física MUP é a fonte oficial.
      </p>

      <button
        onClick={onBack}
        className="text-sm underline underline-offset-4"
        style={{ color: '#C5C5C2', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ← Voltar
      </button>
    </div>
  );
}

// ─── Estimador guiado ────────────────────────────────────────────────────────

function Estimador({
  onConfirmar,
  onBack,
  onSelect,
}: {
  onConfirmar: () => void;
  onBack: () => void;
  onSelect: (f: FundoClareamento) => void;
}) {
  const [passo, setPasso] = useState<EstimadorPasso>('quimica');
  const [alturaNatural, setAlturaNatural] = useState<number | null>(null);
  const [opcaoOx, setOpcaoOx] = useState<OpcaoClareamento | null>(null);
  const [faixaEstimada, setFaixaEstimada] = useState<{ min: number; max: number } | null>(null);

  const handleQuimica = (virgem: boolean) => {
    if (!virgem) {
      setPasso('resultado');
      setFaixaEstimada(null);
    } else {
      setPasso('altura');
    }
  };

  const handleAltura = (n: number) => {
    setAlturaNatural(n);
    setPasso('ox');
  };

  const handleOx = (op: OpcaoClareamento) => {
    setOpcaoOx(op);
    const faixa = estimarFundo(alturaNatural!, op.tonsClareados);
    setFaixaEstimada(faixa);
    setPasso('resultado');
  };

  const fundosDaFaixa = faixaEstimada
    ? FUNDOS.filter((f) => f.altura >= faixaEstimada.min && f.altura <= faixaEstimada.max)
    : [];

  // Cabelo com química → bloqueio
  if (passo === 'resultado' && faixaEstimada === null) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" />
        <div
          className="rounded-xl p-5"
          style={{ background: '#1a1205', border: '1px solid #4a3310' }}
        >
          <p
            className="text-base font-bold mb-2"
            style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#C8932E' }}
          >
            Estimativa não aplicável
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#e8c97a' }}>
            A tabela de fundo de clareamento só é confiável em cabelo virgem. Coloração não revela fundo como cabelo natural — coloração não colore coloração.
          </p>
          <p className="text-sm mt-3" style={{ color: '#C5C5C2' }}>
            Faça um teste de mecha para identificar o fundo real, depois selecione manualmente.
          </p>
        </div>
        <button
          onClick={onConfirmar}
          className="w-full rounded-xl py-4 text-base font-semibold transition-all active:scale-95"
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            background: '#C8932E',
            color: '#0B0F22',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Selecionar fundo manualmente
        </button>
        <BackLink onClick={onBack} />
      </div>
    );
  }

  // Resultado da estimativa
  if (passo === 'resultado' && faixaEstimada !== null) {
    const pigmentos = fundosDaFaixa.map((f) => f.fundo).filter((v, i, a) => a.indexOf(v) === i).join(' / ');
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Faixa estimada" />

        <div
          className="rounded-xl p-5"
          style={{ background: '#0d1020', border: '1px solid #2a2f4a' }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: '#4a6fa5', fontFamily: "'Saira Condensed', sans-serif" }}
          >
            Fundo provável
          </p>
          <p
            className="text-3xl font-bold"
            style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
          >
            {faixaEstimada.min === faixaEstimada.max
              ? `Fundo ${faixaEstimada.min}`
              : `Fundo ${faixaEstimada.min} – ${faixaEstimada.max}`}
          </p>
          <p className="text-sm mt-1" style={{ color: '#C5C5C2' }}>
            Pigmento residual provável: <strong style={{ color: '#F5F5F2' }}>{pigmentos}</strong>
          </p>
          <p className="text-xs mt-1" style={{ color: '#888' }}>
            Altura natural {alturaNatural} + {opcaoOx?.label}
          </p>
        </div>

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
          Estimativa de apoio. CONFIRME na sua tabela física MUP, com o fio sobre superfície branca e luz natural, antes de seguir.
        </div>

        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#C5C5C2' }}
        >
          Confirme o fundo exato:
        </p>

        <div className="flex flex-col gap-2">
          {[...FUNDOS].reverse().map((f) => {
            const naFaixa = f.altura >= faixaEstimada.min && f.altura <= faixaEstimada.max;
            return (
              <button
                key={f.altura}
                onClick={() => onSelect(f)}
                className="flex items-center gap-3 rounded-xl p-4 text-left transition-all active:scale-95"
                style={{
                  background: naFaixa ? '#151c35' : '#111629',
                  border: `1px solid ${naFaixa ? '#C8932E' : '#1e2340'}`,
                }}
              >
                <span
                  className="flex-shrink-0 rounded-full border-2"
                  style={{
                    width: 32,
                    height: 32,
                    background: f.corHex,
                    borderColor: naFaixa ? '#C8932E' : '#2a2f4a',
                    opacity: 0.75,
                  }}
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
                {naFaixa && (
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

        <p className="text-xs text-center" style={{ color: '#666', fontStyle: 'italic' }}>
          As amostras de cor são referência aproximada. A tabela física MUP é a fonte oficial.
        </p>

        <BackLink onClick={() => setPasso('ox')} />
      </div>
    );
  }

  // Passo 1 — Química?
  if (passo === 'quimica') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo="Passo 1 de 3" />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          O cabelo é virgem ou tem coloração / química anterior?
        </p>
        <div className="flex flex-col gap-3">
          <OpcaoBtn
            label="Virgem"
            sub="Nunca colorido nem descolorido"
            onClick={() => handleQuimica(true)}
          />
          <OpcaoBtn
            label="Tem coloração / química anterior"
            sub="Qualquer processo químico anterior"
            onClick={() => handleQuimica(false)}
            destaque={false}
          />
        </div>
        <BackLink onClick={onBack} />
      </div>
    );
  }

  // Passo 2 — Altura natural
  if (passo === 'altura') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo="Passo 2 de 3" />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Qual é a altura de tom natural de partida?
        </p>
        <div className="flex flex-col gap-2">
          {[...ALTURAS_NATURAIS].reverse().map((a) => (
            <button
              key={a.altura}
              onClick={() => handleAltura(a.altura)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all active:scale-95"
              style={{ background: '#111629', border: '1px solid #1e2340' }}
            >
              <span
                className="text-sm font-bold flex-shrink-0"
                style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#C8932E', width: 20 }}
              >
                {a.altura}
              </span>
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
              >
                {a.nome}
              </span>
            </button>
          ))}
        </div>
        <BackLink onClick={() => setPasso('quimica')} />
      </div>
    );
  }

  // Passo 3 — OX utilizado
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <Header titulo="Estimador de fundo" subtitulo="Passo 3 de 3" />
      <p className="text-base" style={{ color: '#F5F5F2' }}>
        Qual oxidante foi usado no clareamento?
      </p>
      <div className="flex flex-col gap-3">
        {OPCOES_CLAREAMENTO.map((op) => (
          <OpcaoBtn key={op.id} label={op.label} onClick={() => handleOx(op)} />
        ))}
      </div>
      <BackLink onClick={() => setPasso('altura')} />
    </div>
  );
}

// ─── Subcomponentes utilitários ──────────────────────────────────────────────

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
  destaque = true,
}: {
  label: string;
  sub?: string;
  onClick: () => void;
  destaque?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-xl p-4 text-left transition-all active:scale-95"
      style={{ background: '#111629', border: `1px solid ${destaque ? '#1e2340' : '#1e2340'}` }}
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
