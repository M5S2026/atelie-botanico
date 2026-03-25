# 🌿 Ateliê Botânico

App PWA completo para pintoras decorativas.

## Módulos
- **Biblioteca** — 65 riscos botânicos SVG (rosas, peônias, monstera, sakura, bambu, lisianto, passiflora, bromélias, lavanda)
- **Referências** — 16 fotos reais de flores + upload de foto própria
- **Projetor Virtual** — câmera + overlay em tempo real (funciona como projetor físico)
- **Simulador de Parede** — cor, textura e cálculo de tinta com orçamento

## Instalação e execução

```bash
cd atelie-botanico
npm install
npm run dev
```

Acesse: http://localhost:5173

## Build para produção (Vercel/Netlify)

```bash
npm run build
```

A pasta `dist/` contém o app pronto. Deploy:

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Pagamento PayPal

Na landing page (`atelie_botanico_landing.html`), substitua `SEU_EMAIL_PAYPAL` pelo seu email do PayPal.

## Planos
- **Florzinha** — Grátis (5 riscos, projetor com marca d'água)
- **Artista** — R$49/mês (biblioteca completa, sem marca d'água)
- **Ateliê Pro** — R$497/ano (tudo + acesso completo)

## Estrutura do projeto
```
src/
  App.jsx              — navegação principal (5 abas)
  components/
    Home.jsx           — tela inicial
    Biblioteca.jsx     — galeria de 65 riscos SVG
    Referencias.jsx    — fotos de referência + upload
    Projetor.jsx       — projetor virtual com câmera
    Simulador.jsx      — simulador de parede
  data/
    library.js         — dados dos riscos e referências
    svgRiscos.js       — 65 riscos SVG inline
```
