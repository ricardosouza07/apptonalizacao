import { useState } from 'react';
import { FUNDOS, OPCOES_CLAREAMENTO, OPCOES_OX_COLORACAO, estimarFundo } from '../data/coloracao';
import type { FundoClareamento, OpcaoClareamento, OpcaoOxColoracao } from '../data/coloracao';
import type { OrigemFundo } from '../data/registros';

interface Props {
  onSelect: (fundo: FundoClareamento, origem: OrigemFundo) => void;
}

type Caminho = 'escolha' | 'direto' | 'estimador';
type EstimadorPasso =
  | 'quimica'
  // caminho virgem
  | 'altura' | 'ox' | 'resultado'
  // caminho coloração
  | 'col_altura_natural' | 'col_altura_cor' | 'col_ox' | 'col_resultado'
  // caminho descolorado
  | 'descolorado';

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
        onConfirmar={() => setCaminho('direto')}
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
            Comparei com a tabela física MUP e sei o número (4 a 10)
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

  // estado caminho virgem
  const [alturaNatural, setAlturaNatural] = useState<number | null>(null);
  const [opcaoOx, setOpcaoOx] = useState<OpcaoClareamento | null>(null);
  const [faixaEstimada, setFaixaEstimada] = useState<{ min: number; max: number } | null>(null);

  // estado caminho coloração
  const [colAlturaNatural, setColAlturaNatural] = useState<number | null>(null);
  const [colAlturaCor, setColAlturaCor] = useState<number | null>(null);
  const [colOx, setColOx] = useState<OpcaoOxColoracao | null>(null);

  // ── Caminho virgem ──────────────────────────────────────────────────────────

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

  // ── Caminho coloração ───────────────────────────────────────────────────────

  const handleColOx = (op: OpcaoOxColoracao) => {
    setColOx(op);
    setPasso('col_resultado');
  };

  const colAlturaAlcancada =
    colAlturaNatural !== null && colOx !== null && colAlturaCor !== null
      ? Math.max(4, Math.min(10, Math.min(colAlturaNatural + colOx.tons, colAlturaCor)))
      : null;

  // ── Passo: química ──────────────────────────────────────────────────────────

  if (passo === 'quimica') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo="Passo 1 de 3" />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Qual é o histórico do cabelo?
        </p>
        <div className="flex flex-col gap-3">
          <OpcaoBtn
            label="Virgem"
            sub="Nunca colorido nem descolorido"
            onClick={() => setPasso('altura')}
          />
          <OpcaoBtn
            label="Já recebeu coloração"
            sub="Coloração anterior sem descolorir"
            onClick={() => setPasso('col_altura_natural')}
          />
          <OpcaoBtn
            label="Descolorado / mechado"
            sub="Passou por descoloração ou mechas"
            onClick={() => setPasso('descolorado')}
          />
        </div>
        <BackLink onClick={onBack} />
      </div>
    );
  }

  // ── Passo: descolorado (bloco) ──────────────────────────────────────────────

  if (passo === 'descolorado') {
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
            Fundo visual — estimativa não aplicável
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#e8c97a' }}>
            Em cabelo descolorido ou mechado, o fundo é visual e não depende do OX da coloração. A tabela de estimativa só se aplica ao cabelo intacto.
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
        <BackLink onClick={() => setPasso('quimica')} />
      </div>
    );
  }

  // ── Passo: coloração — altura natural ───────────────────────────────────────

  if (passo === 'col_altura_natural') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo="Passo 2 de 4" />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Qual é a cor natural de partida?
        </p>
        <div className="flex flex-col gap-2">
          {[...ALTURAS_NATURAIS].reverse().map((a) => (
            <button
              key={a.altura}
              onClick={() => { setColAlturaNatural(a.altura); setPasso('col_altura_cor'); }}
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

  // ── Passo: coloração — altura da coloração aplicada ─────────────────────────

  if (passo === 'col_altura_cor') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo="Passo 3 de 4" />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Em qual altura foi aplicada a coloração?
        </p>
        <p className="text-xs" style={{ color: '#C5C5C2' }}>
          Exemplo: coloração 7.1, 8.3 → altura 7 ou 8
        </p>
        <div className="flex flex-col gap-2">
          {[...ALTURAS_NATURAIS].reverse().map((a) => (
            <button
              key={a.altura}
              onClick={() => { setColAlturaCor(a.altura); setPasso('col_ox'); }}
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
        <BackLink onClick={() => setPasso('col_altura_natural')} />
      </div>
    );
  }

  // ── Passo: coloração — OX utilizado ─────────────────────────────────────────

  if (passo === 'col_ox') {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <Header titulo="Estimador de fundo" subtitulo="Passo 4 de 4" />
        <p className="text-base" style={{ color: '#F5F5F2' }}>
          Qual OX foi usado na coloração?
        </p>
        <div className="flex flex-col gap-3">
          {OPCOES_OX_COLORACAO.map((op) => (
            <button
              key={op.id}
              onClick={() => handleColOx(op)}
              className="flex flex-col rounded-xl p-4 text-left transition-all active:scale-95"
              style={{ background: '#111629', border: '1px solid #1e2340' }}
            >
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
              >
                {op.label}
              </span>
              <span className="text-xs mt-0.5" style={{ color: '#C5C5C2' }}>
                {op.descricao}
              </span>
            </button>
          ))}
        </div>
        <BackLink onClick={() => setPasso('col_altura_cor')} />
      </div>
    );
  }

  // ── Resultado coloração ──────────────────────────────────────────────────────

  if (passo === 'col_resultado' && colAlturaAlcancada !== null && colOx !== null && colAlturaNatural !== null && colAlturaCor !== null) {
    const potencial = colAlturaNatural + colOx.tons;
    const fundoResult = FUNDOS.find((f) => f.altura === colAlturaAlcancada);

    // Mensagem contextual
    let mensagemContexto: string | null = null;
    if (colOx.tons === 0) {
      mensagemContexto = `OX 6 vol não clareia — apenas tonaliza. O fundo permanece o da cor natural (${colAlturaNatural}).`;
    } else if (potencial > colAlturaCor) {
      mensagemContexto = `OX ${colOx.label.replace('OX ', '')} poderia abrir ${colOx.tons} tons, mas a coloração aplicada na casa ${colAlturaCor} segura o clareamento nessa altura.`;
    } else if (colAlturaCor > potencial) {
      mensagemContexto = `Com ${colOx.label} e natural ${colAlturaNatural}, o cabelo alcança no máximo a casa ${potencial}. A coloração na casa ${colAlturaCor} não foi totalmente atingida.`;
    }

    return (
      <div className="flex flex-col gap-5 px-4 py-6">
        <Header titulo="Fundo estimado" />

        {/* Bloco educativo */}
        <div
          className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: '#0d1020', border: '1px solid #2a2f4a' }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: '#4a6fa5', fontFamily: "'Saira Condensed', sans-serif" }}
          >
            Como foi calculado
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#C5C5C2' }}>
            Com cor natural{' '}
            <strong style={{ color: '#F5F5F2' }}>{colAlturaNatural}</strong> e{' '}
            <strong style={{ color: '#F5F5F2' }}>{colOx.label}</strong>,
            {colOx.tons > 0
              ? ` o cabelo abre até ${colOx.tons} tons, podendo chegar à casa ${potencial}.`
              : ' o cabelo não clareia.'}
            {' '}A coloração aplicada na altura{' '}
            <strong style={{ color: '#F5F5F2' }}>{colAlturaCor}</strong> limita esse avanço — fundo revelado:{' '}
            <strong style={{ color: '#C8932E' }}>casa {colAlturaAlcancada}</strong>.
          </p>
          {mensagemContexto && (
            <p
              className="text-xs mt-1 pt-2"
              style={{ color: '#e8c97a', borderTop: '1px solid #1e2340', fontStyle: 'italic' }}
            >
              ⚠ {mensagemContexto}
            </p>
          )}
        </div>

        {/* Fundo estimado */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#111629', border: '1px solid #C8932E' }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
          >
            Fundo provável
          </p>
          <p
            className="text-3xl font-bold"
            style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
          >
            Fundo {colAlturaAlcancada}
          </p>
          {fundoResult && (
            <p className="text-sm mt-1" style={{ color: '#C5C5C2' }}>
              Pigmento residual: <strong style={{ color: '#F5F5F2' }}>{fundoResult.fundo}</strong>
            </p>
          )}
        </div>

        {/* Tabela OX colapsável */}
        <TabelaOxColapsavel />

        {/* Aviso de confirmação */}
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
            const estimado = f.altura === colAlturaAlcancada;
            return (
              <button
                key={f.altura}
                onClick={() => onSelect(f)}
                className="flex items-center gap-3 rounded-xl p-4 text-left transition-all active:scale-95"
                style={{
                  background: estimado ? '#151c35' : '#111629',
                  border: `1px solid ${estimado ? '#C8932E' : '#1e2340'}`,
                }}
              >
                <span
                  className="flex-shrink-0 rounded-full border-2"
                  style={{
                    width: 32,
                    height: 32,
                    background: f.corHex,
                    borderColor: estimado ? '#C8932E' : '#2a2f4a',
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
                {estimado && (
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

        <BackLink onClick={() => setPasso('col_ox')} />
      </div>
    );
  }

  // ── Resultado virgem ─────────────────────────────────────────────────────────

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

  // ── Passo 2 virgem — Altura natural ─────────────────────────────────────────

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

  // ── Passo 3 virgem — OX ──────────────────────────────────────────────────────

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

// ─── Tabela OX colapsável ────────────────────────────────────────────────────

function TabelaOxColapsavel() {
  const [aberta, setAberta] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid #2a2f4a' }}
    >
      <button
        onClick={() => setAberta((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: '#0d1020', cursor: 'pointer', border: 'none' }}
      >
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: '#4a6fa5', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Como o OX afeta o clareamento
        </span>
        <span style={{ color: '#4a6fa5', fontSize: 14 }}>{aberta ? '▲' : '▼'}</span>
      </button>
      {aberta && (
        <div style={{ background: '#080c1a', padding: '0 0 12px' }}>
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e2340' }}>
                <th className="text-left px-4 py-2" style={{ color: '#C5C5C2', fontFamily: "'Saira Condensed', sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>OX</th>
                <th className="text-left px-4 py-2" style={{ color: '#C5C5C2', fontFamily: "'Saira Condensed', sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tons de clareamento</th>
              </tr>
            </thead>
            <tbody>
              {OPCOES_OX_COLORACAO.map((op, i) => (
                <tr
                  key={op.id}
                  style={{ borderBottom: i < OPCOES_OX_COLORACAO.length - 1 ? '1px solid #141828' : 'none' }}
                >
                  <td className="px-4 py-2 font-semibold" style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}>{op.label}</td>
                  <td className="px-4 py-2" style={{ color: '#F5F5F2' }}>{op.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs px-4 pt-2" style={{ color: '#666', fontStyle: 'italic' }}>
            Regra aplicável apenas em cabelo não descolorido. Cabelo descolorado: fundo é visual.
          </p>
        </div>
      )}
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
