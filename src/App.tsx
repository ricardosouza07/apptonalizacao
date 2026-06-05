import { useState } from 'react';
import type { FundoClareamento, Alvo } from './data/coloracao';
import { StepFundo } from './components/StepFundo';
import { StepAlvo } from './components/StepAlvo';
import { StepResultado } from './components/StepResultado';
import { Disclaimer } from './components/Disclaimer';
import './index.css';

type Step = 'fundo' | 'alvo' | 'resultado';

export default function App() {
  const [step, setStep] = useState<Step>('fundo');
  const [fundo, setFundo] = useState<FundoClareamento | null>(null);
  const [alvo, setAlvo] = useState<Alvo | null>(null);

  const handleFundoSelect = (f: FundoClareamento) => {
    setFundo(f);
    setStep('alvo');
  };

  const handleAlvoSelect = (a: Alvo) => {
    setAlvo(a);
    setStep('resultado');
  };

  const handleReset = () => {
    setFundo(null);
    setAlvo(null);
    setStep('fundo');
  };

  return (
    <div
      style={{
        background: '#0B0F22',
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid #1e2340',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#C8932E',
            fontFamily: "'Saira Condensed', sans-serif",
          }}
        >
          Fenié Cosméticos
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "'Saira Condensed', sans-serif",
            color: '#F5F5F2',
            letterSpacing: '0.02em',
          }}
        >
          Guia de Tonalização PRO
        </span>
      </header>

      <main style={{ flex: 1, paddingBottom: 72 }}>
        {step === 'fundo' && <StepFundo onSelect={handleFundoSelect} />}
        {step === 'alvo' && fundo && (
          <StepAlvo fundo={fundo} onSelect={handleAlvoSelect} onBack={() => setStep('fundo')} />
        )}
        {step === 'resultado' && fundo && alvo && (
          <StepResultado fundo={fundo} alvo={alvo} onReset={handleReset} />
        )}
      </main>

      <Disclaimer />
    </div>
  );
}
