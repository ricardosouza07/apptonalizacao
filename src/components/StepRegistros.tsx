import { useState } from 'react';
import {
  listarRegistros,
  limparRegistros,
  exportarRegistros,
  VEREDITOS,
} from '../data/registros';
import type { RegistroResultado } from '../data/registros';

interface Props {
  onBack: () => void;
}

const COR_VEREDITO: Record<string, string> = Object.fromEntries(
  VEREDITOS.map((v) => [v.id, v.cor]),
);
const LABEL_VEREDITO: Record<string, string> = Object.fromEntries(
  VEREDITOS.map((v) => [v.id, v.label]),
);

export function StepRegistros({ onBack }: Props) {
  const [registros, setRegistros] = useState<RegistroResultado[]>(() => listarRegistros());
  const [confirmandoLimpar, setConfirmandoLimpar] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const handleExportar = (formato: 'csv' | 'json') => {
    const ok = exportarRegistros(formato);
    setAviso(ok ? 'Arquivo gerado — envie para a Fenié.' : 'Nada para exportar.');
    setTimeout(() => setAviso(null), 3000);
  };

  const handleLimpar = () => {
    limparRegistros();
    setRegistros([]);
    setConfirmandoLimpar(false);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#C8932E', fontFamily: "'Saira Condensed', sans-serif" }}
        >
          Teste de campo
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
        >
          Meus registros
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#C5C5C2' }}>
          {registros.length} {registros.length === 1 ? 'registro salvo' : 'registros salvos'} neste dispositivo
        </p>
      </div>

      {aviso && (
        <div
          className="rounded-lg px-3 py-2 text-xs text-center"
          style={{ background: '#0f1f14', border: '1px solid #2a4a32', color: '#5fbf7a' }}
        >
          {aviso}
        </div>
      )}

      {registros.length === 0 ? (
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: '#111629', border: '1px solid #1e2340' }}
        >
          <p className="text-sm" style={{ color: '#C5C5C2' }}>
            Nenhum registro ainda. Ao final de uma recomendação, marque se o resultado funcionou.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {registros.map((r) => (
            <div
              key={r.id}
              className="rounded-xl p-3 flex flex-col gap-1.5"
              style={{ background: '#111629', border: '1px solid #1e2340' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
                >
                  Fundo {r.fundoAtual} → {r.alvoNome}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: '#0d1020',
                    color: COR_VEREDITO[r.veredito] ?? '#C5C5C2',
                    border: `1px solid ${COR_VEREDITO[r.veredito] ?? '#1e2340'}`,
                    fontFamily: "'Saira Condensed', sans-serif",
                  }}
                >
                  {LABEL_VEREDITO[r.veredito] ?? r.veredito}
                </span>
              </div>
              <span className="text-xs" style={{ color: '#C8932E' }}>
                {r.produtos.join(' + ')}
              </span>
              {(r.ocorrencias?.length || r.observacao) && (
                <span className="text-xs" style={{ color: '#C5C5C2' }}>
                  {[r.ocorrencias?.join(', '), r.observacao].filter(Boolean).join(' — ')}
                </span>
              )}
              <span className="text-xs" style={{ color: '#666' }}>
                {formatarData(r.criadoEm)} · {r.origemFundo === 'estimador' ? 'estimador' : 'seleção'}
              </span>
            </div>
          ))}
        </div>
      )}

      {registros.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleExportar('csv')}
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all active:scale-95"
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                background: '#C8932E',
                color: '#0B0F22',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Exportar CSV
            </button>
            <button
              onClick={() => handleExportar('json')}
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all active:scale-95"
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                background: '#111629',
                color: '#F5F5F2',
                border: '1px solid #1e2340',
                cursor: 'pointer',
              }}
            >
              Exportar JSON
            </button>
          </div>

          {confirmandoLimpar ? (
            <div
              className="rounded-xl p-3 flex flex-col gap-2"
              style={{ background: '#2a0e0e', border: '1px solid #5c1a1a' }}
            >
              <p className="text-sm text-center" style={{ color: '#fca5a5' }}>
                Apagar todos os registros deste dispositivo?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleLimpar}
                  className="flex-1 rounded-lg py-2 text-sm font-semibold"
                  style={{
                    fontFamily: "'Saira Condensed', sans-serif",
                    background: '#b04a3a',
                    color: '#F5F5F2',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Sim, apagar
                </button>
                <button
                  onClick={() => setConfirmandoLimpar(false)}
                  className="flex-1 rounded-lg py-2 text-sm font-semibold"
                  style={{
                    fontFamily: "'Saira Condensed', sans-serif",
                    background: '#111629',
                    color: '#C5C5C2',
                    border: '1px solid #1e2340',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmandoLimpar(true)}
              className="text-xs underline underline-offset-4"
              style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Limpar registros
            </button>
          )}
        </div>
      )}

      <button
        onClick={onBack}
        className="text-sm underline underline-offset-4 mt-1"
        style={{ color: '#C5C5C2', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ← Voltar ao início
      </button>
    </div>
  );
}

function formatarData(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
