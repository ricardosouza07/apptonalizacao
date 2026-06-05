import { RECOMENDACOES } from '../data/coloracao';
import type { Alvo, FundoClareamento } from '../data/coloracao';

interface Props {
  fundo: FundoClareamento;
  alvo: Alvo;
  onReset: () => void;
}

export function StepResultado({ fundo, alvo, onReset }: Props) {
  const viavel = fundo.altura >= alvo.fundoMinimo;

  const rec = viavel
    ? RECOMENDACOES.find((r) => r.fundoAtual === fundo.altura && r.alvoId === alvo.id)
    : null;

  if (!viavel) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6">
        <div
          className="rounded-xl p-5"
          style={{ background: '#2a0e0e', border: '1px solid #5c1a1a' }}
        >
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
            <strong style={{ color: '#F5F5F2' }}>
              {fundo.altura} — {fundo.nome}
            </strong>
          </p>
          <p className="text-sm mt-1" style={{ color: '#C5C5C2' }}>
            Fundo mínimo para{' '}
            <strong style={{ color: '#F5F5F2' }}>{alvo.nome}</strong>:{' '}
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
        <div
          className="rounded-xl p-5"
          style={{ background: '#1a1c2a', border: '1px solid #2a2f4a' }}
        >
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

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Recomendação
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

      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{ background: '#111629', border: '1px solid #1e2340' }}
      >
        <DataRow label="Produto" value={rec.produto} highlight />
        <DataRow label="Reflexo" value={rec.reflexo} />
        <DataRow label="Proporção" value={rec.proporcao} />
        <DataRow label="Oxidante" value={rec.ox} />
        <DataRow label="Tempo" value={rec.tempo} />
      </div>

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

      <ResetButton onReset={onReset} />
    </div>
  );
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-3">
      <span
        className="text-xs uppercase tracking-wider flex-shrink-0"
        style={{ color: '#C5C5C2', fontFamily: "'Saira Condensed', sans-serif", paddingTop: 2 }}
      >
        {label}
      </span>
      <span
        className="text-right text-sm font-semibold"
        style={{ color: highlight ? '#C8932E' : '#F5F5F2' }}
      >
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
