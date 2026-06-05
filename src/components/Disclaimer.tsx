export function Disclaimer() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-2 text-center"
      style={{ background: 'rgba(11,15,34,0.95)', borderTop: '1px solid #1e2340' }}
    >
      <p
        className="text-xs leading-snug"
        style={{ color: '#C5C5C2', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
      >
        Recomendação de apoio. Sempre faça teste de mecha antes da aplicação total.
        A leitura do fundo deve ser feita com o fio sobre superfície branca, sob luz natural.
      </p>
    </footer>
  );
}
