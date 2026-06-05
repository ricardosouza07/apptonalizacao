import { ALVOS } from '../data/coloracao';
import type { Alvo, FundoClareamento } from '../data/coloracao';

interface Props {
  fundo: FundoClareamento;
  onSelect: (alvo: Alvo) => void;
  onBack: () => void;
}

export function StepAlvo({ fundo, onSelect, onBack }: Props) {
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Passo 2 de 2
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
        >
          Resultado desejado
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#C5C5C2' }}>
          Fundo atual:{' '}
          <span style={{ color: '#F5F5F2', fontWeight: 600 }}>
            {fundo.altura} — {fundo.nome}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ALVOS.map((a) => {
          const viavel = fundo.altura >= a.fundoMinimo;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className="flex flex-col rounded-xl p-4 text-left transition-all active:scale-95"
              style={{
                background: '#111629',
                border: `1px solid ${viavel ? '#1e2340' : '#2a1a1a'}`,
                opacity: viavel ? 1 : 0.55,
                minHeight: 64,
              }}
            >
              <span className="flex items-center justify-between gap-2">
                <span
                  className="text-base font-semibold"
                  style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
                >
                  {a.nome}
                </span>
                {!viavel && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: '#3a1010', color: '#f87171', fontFamily: "'Saira Condensed', sans-serif" }}
                  >
                    Fundo insuficiente
                  </span>
                )}
              </span>
              <span className="text-xs mt-1" style={{ color: '#C5C5C2' }}>
                {a.descricao}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="text-sm underline underline-offset-4 mt-2"
        style={{ color: '#C5C5C2', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ← Voltar ao fundo
      </button>
    </div>
  );
}
