import { RECOMENDACOES, calcularMix } from '../data/coloracao';
import type { Alvo, FundoClareamento } from '../data/coloracao';
import type { OrigemFundo } from '../data/registros';
import { CapturaResultado } from './CapturaResultado';

interface Props {
  fundo: FundoClareamento;
  alvo: Alvo;
  origemFundo: OrigemFundo;
  onReset: () => void;
}

export function StepResultado({ fundo, alvo, origemFundo, onReset }: Props) {
  const viavel = fundo.altura >= alvo.fundoMinimo;

  const rec = viavel
    ? RECOMENDACOES.find((r) => r.fundoAtual === fundo.altura && r.alvoId === alvo.id)
    : null;

  if (!viavel) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <div className="rounded-xl p-5" style={{ background: '#2a0e0e', border: '1px solid #5c1a1a' }}>
          <p
            className="text-lg font-bold mb-2"
            style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#f87171' }}
          >
            Fundo insuficiente para esse alvo
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#fca5a5' }}>
            É necessário clarear mais antes de tonalizar. Tonalizar agora resultará em tom indesejado.
          </p>
          <p className="text-sm mt-3" style={{ color: '#C5C5C2' }}>
            Fundo atual:{' '}
            <strong style={{ color: '#F5F5F2' }}>{fundo.altura} — {fundo.nome}</strong>
          </p>
          <p className="text-sm mt-1" style={{ color: '#C5C5C2' }}>
            Fundo mínimo para <strong style={{ color: '#F5F5F2' }}>{alvo.nome}</strong>:{' '}
            <strong style={{ color: '#C8932E' }}>{alvo.fundoMinimo}</strong>
          </p>
        </div>
        <ResetButton onReset={onReset} />
      </div>
    );
  }

  if (!rec) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <div className="rounded-xl p-5" style={{ background: '#1a1c2a', border: '1px solid #2a2f4a' }}>
          <p
            className="text-lg font-bold mb-2"
            style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#C8932E' }}
          >
            Combinação não mapeada
          </p>
          <p className="text-sm" style={{ color: '#C5C5C2' }}>
            Esta combinação ainda não possui recomendação cadastrada. Consulte o suporte Fenié.
          </p>
        </div>
        <ResetButton onReset={onReset} />
      </div>
    );
  }

  const isComposta  = rec.produtos.length > 1;
  const isQuente    = alvo.grupo === 'quente';
  const mixCalc     = rec.reforcoMix ? calcularMix(fundo.altura) : null;

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      {/* Cabeçalho */}
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          {isQuente ? 'Tom quente' : 'Neutralização'}
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
        >
          {alvo.nome}
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#C5C5C2' }}>
          Fundo {fundo.altura} — {fundo.nome}
        </p>
      </div>

      {/* Aviso grupo quente */}
      {isQuente && (
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
          Este tom mantém e realça o calor do fio — não neutraliza o fundo residual.
        </div>
      )}

      {/* Card principal */}
      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{ background: '#111629', border: '1px solid #1e2340' }}
      >
        {/* Produto(s) */}
        <div className="flex flex-col gap-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: '#C5C5C2', fontFamily: "'Saira Condensed', sans-serif" }}
          >
            {isComposta ? 'Fórmula composta' : 'Produto'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {rec.produtos.map((p, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="flex flex-col">
                  <span
                    className="inline-block rounded-lg px-3 py-1.5 font-bold text-base"
                    style={{
                      fontFamily: "'Saira Condensed', sans-serif",
                      background: '#1e2340',
                      color: '#C8932E',
                      border: '1px solid #C8932E',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {p.codigo}
                  </span>
                  <span className="text-xs mt-0.5 px-1" style={{ color: '#C5C5C2' }}>
                    {p.nome}
                  </span>
                </span>
                {isComposta && i < rec.produtos.length - 1 && (
                  <span
                    className="text-base font-bold mb-4"
                    style={{ color: '#C5C5C2' }}
                  >
                    +
                  </span>
                )}
              </span>
            ))}
          </div>
          {isComposta && (
            <p className="text-xs" style={{ color: '#C5C5C2', fontStyle: 'italic' }}>
              Misturar em partes iguais antes de aplicar.
            </p>
          )}
        </div>

        <div style={{ borderTop: '1px solid #1e2340' }} />

        <DataRow label="Proporção" value={rec.proporcao} />
        <DataRow label="Oxidante"  value={rec.ox} />
        <DataRow label="Tempo"     value={rec.tempo} />
      </div>

      {/* Reforço opcional — Regra do 11 */}
      {rec.reforcoMix && mixCalc && (
        <div
          className="rounded-xl p-4"
          style={{ background: '#0d1020', border: '1px solid #2a2f4a' }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: '#4a6fa5', fontFamily: "'Saira Condensed', sans-serif" }}
          >
            Reforço opcional — Regra do 11
          </p>
          <p className="text-sm" style={{ color: '#C5C5C2' }}>
            Para intensificar:{' '}
            <strong style={{ color: '#F5F5F2' }}>
              + {mixCalc.cm}cm ({mixCalc.gramas}g) de {rec.reforcoMix}
            </strong>
          </p>
          <p className="text-xs mt-1" style={{ color: '#888', fontStyle: 'italic' }}>
            Referência para 30g de coloração. Altura {fundo.altura} + {mixCalc.cm}cm = 11.
          </p>
        </div>
      )}

      {/* Alertas técnicos */}
      {rec.alertas.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{ background: '#1c1505', border: '1px solid #4a3310' }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
          >
            Alertas técnicos
          </p>
          <ul className="flex flex-col gap-1">
            {rec.alertas.map((a, i) => (
              <li key={i} className="text-sm" style={{ color: '#e8c97a' }}>
                — {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Captura de resultado — feedback de campo (opcional) */}
      <CapturaResultado
        fundoAtual={fundo.altura}
        alvoId={alvo.id}
        alvoNome={alvo.nome}
        produtos={rec.produtos.map((p) => p.codigo)}
        origemFundo={origemFundo}
      />

      <ResetButton onReset={onReset} />
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-3">
      <span
        className="text-xs uppercase tracking-wider flex-shrink-0"
        style={{ color: '#C5C5C2', fontFamily: "'Saira Condensed', sans-serif", paddingTop: 2 }}
      >
        {label}
      </span>
      <span className="text-right text-sm font-semibold" style={{ color: '#F5F5F2' }}>
        {value}
      </span>
    </div>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="w-full rounded-xl py-4 text-base font-semibold transition-all active:scale-95"
      style={{
        fontFamily: "'Saira Condensed', sans-serif",
        background: '#C8932E',
        color: '#0B0F22',
        border: 'none',
        cursor: 'pointer',
        letterSpacing: '0.05em',
      }}
    >
      Recomeçar
    </button>
  );
}
