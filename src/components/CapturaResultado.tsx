import { useState } from 'react';
import {
  VEREDITOS,
  OCORRENCIAS,
  TIPOS_CABELO,
  salvarRegistro,
  gerarId,
} from '../data/registros';
import type { Veredito, OrigemFundo, RegistroResultado } from '../data/registros';

interface Props {
  fundoAtual: number;
  alvoId: string;
  alvoNome: string;
  produtos: string[];
  origemFundo: OrigemFundo;
}

export function CapturaResultado({ fundoAtual, alvoId, alvoNome, produtos, origemFundo }: Props) {
  const [aberto, setAberto] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [veredito, setVeredito] = useState<Veredito | null>(null);
  const [ocorrencias, setOcorrencias] = useState<string[]>([]);
  const [tipoCabelo, setTipoCabelo] = useState<string[]>([]);
  const [observacao, setObservacao] = useState('');

  const toggle = (lista: string[], set: (v: string[]) => void, id: string) => {
    set(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);
  };

  const handleVeredito = (v: Veredito) => {
    setVeredito(v);
    if (!aberto) setAberto(true);
  };

  const handleSalvar = () => {
    if (!veredito) return;
    const registro: RegistroResultado = {
      id: gerarId(),
      criadoEm: new Date().toISOString(),
      fundoAtual,
      alvoId,
      alvoNome,
      produtos,
      origemFundo,
      veredito,
      ocorrencias: ocorrencias.length ? ocorrencias : undefined,
      tipoCabelo: tipoCabelo.length ? tipoCabelo : undefined,
      observacao: observacao.trim() ? observacao.trim() : undefined,
    };
    salvarRegistro(registro);
    setSalvo(true);
  };

  if (salvo) {
    return (
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: '#0f1f14', border: '1px solid #2a4a32' }}
      >
        <p
          className="text-base font-bold"
          style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#5fbf7a' }}
        >
          Registrado
        </p>
        <p className="text-xs mt-1" style={{ color: '#C5C5C2' }}>
          Obrigado — seu retorno ajuda a aprimorar as recomendações.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: '#0d1020', border: '1px solid #1e2340' }}
    >
      <p
        className="text-sm font-bold"
        style={{ fontFamily: "'Saira Condensed', sans-serif", color: '#F5F5F2' }}
      >
        Esse resultado funcionou?
      </p>
      <p className="text-xs" style={{ color: '#888' }}>
        Opcional — leva poucos segundos e ajuda a melhorar o guia.
      </p>

      {/* Veredito — 1 toque */}
      <div className="flex flex-col gap-2">
        {VEREDITOS.map((v) => {
          const ativo = veredito === v.id;
          return (
            <button
              key={v.id}
              onClick={() => handleVeredito(v.id)}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all active:scale-95"
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                background: ativo ? v.cor : '#111629',
                color: ativo ? '#0B0F22' : '#F5F5F2',
                border: `1px solid ${ativo ? v.cor : '#1e2340'}`,
              }}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Detalhamento opcional */}
      {aberto && veredito && (
        <div className="flex flex-col gap-4 pt-1">
          <div style={{ borderTop: '1px solid #1e2340' }} />

          <ChipGroup
            titulo="O que aconteceu? (opcional)"
            opcoes={OCORRENCIAS}
            selecionados={ocorrencias}
            onToggle={(id) => toggle(ocorrencias, setOcorrencias, id)}
          />

          <ChipGroup
            titulo="Tipo de cabelo (opcional)"
            opcoes={TIPOS_CABELO}
            selecionados={tipoCabelo}
            onToggle={(id) => toggle(tipoCabelo, setTipoCabelo, id)}
          />

          <div className="flex flex-col gap-1.5">
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: '#C5C5C2', fontFamily: "'Saira Condensed', sans-serif" }}
            >
              Observação (opcional)
            </span>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
              maxLength={280}
              placeholder="Ex.: precisou de mais 5 min de pausa…"
              className="rounded-lg px-3 py-2 text-sm resize-none"
              style={{
                background: '#111629',
                border: '1px solid #1e2340',
                color: '#F5F5F2',
                outline: 'none',
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>

          <button
            onClick={handleSalvar}
            className="w-full rounded-xl py-3 text-base font-semibold transition-all active:scale-95"
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              background: '#C8932E',
              color: '#0B0F22',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            Salvar registro
          </button>
        </div>
      )}
    </div>
  );
}

function ChipGroup({
  titulo,
  opcoes,
  selecionados,
  onToggle,
}: {
  titulo: string;
  opcoes: { id: string; label: string }[];
  selecionados: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-xs uppercase tracking-wider"
        style={{ color: '#C5C5C2', fontFamily: "'Saira Condensed', sans-serif" }}
      >
        {titulo}
      </span>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((o) => {
          const ativo = selecionados.includes(o.id);
          return (
            <button
              key={o.id}
              onClick={() => onToggle(o.id)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: ativo ? '#1e2340' : '#111629',
                color: ativo ? '#C8932E' : '#C5C5C2',
                border: `1px solid ${ativo ? '#C8932E' : '#1e2340'}`,
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
