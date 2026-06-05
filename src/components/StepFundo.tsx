import { FUNDOS } from '../data/coloracao';
import type { FundoClareamento } from '../data/coloracao';

interface Props {
  onSelect: (fundo: FundoClareamento) => void;
}

export function StepFundo({ onSelect }: Props) {
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
          Identifique a cor residual do fio e selecione abaixo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FUNDOS.map((f) => (
          <button
            key={f.altura}
            onClick={() => onSelect(f)}
            className="flex items-center gap-3 rounded-xl p-4 text-left transition-all active:scale-95"
            style={{
              background: '#111629',
              border: '1px solid #1e2340',
              minHeight: 72,
            }}
          >
            <span
              className="flex-shrink-0 rounded-full border-2"
              style={{
                width: 36,
                height: 36,
                background: f.corHex,
                borderColor: '#2a2f4a',
              }}
            />
            <span className="flex flex-col">
              <span
                className="text-base font-semibold leading-tight"
                style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
              >
                {f.altura} — {f.nome}
              </span>
              <span className="text-xs mt-0.5" style={{ color: '#C5C5C2' }}>
                {f.fundo}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
