# Ateliê Botânico — PRD v1.0

## 1. Visão Geral

PWA para pintoras decorativas, artesãs, professoras de pintura e entusiastas DIY. Três módulos:

1. **Estúdio de Riscos** — espelho radial + motivos botânicos SVG
2. **Projetor Virtual** — câmera do celular sobrepõe risco na parede em tempo real
3. **Simulador de Parede** — cores, texturas, cálculo de tinta e orçamento

## 2. Problema

| Dor | Solução |
|-----|---------|
| Riscos manuais demoram horas, saem tortos | Estúdio com espelho radial automático |
| Projetor físico custa R$400-2000 | Projetor virtual via câmera do celular |
| Cálculo de tinta no "olho" = desperdício | Simulador com orçamento detalhado |

## 3. Público-Alvo

| Perfil | Características | Tamanho (BR) |
|--------|----------------|--------------|
| Pintoras decorativas | 30-55 anos, cursos presenciais, materiais premium | ~2,5M |
| Professoras de pintura | Ateliês/online, referências profissionais | ~180K |
| Decoradoras DIY | Pinterest/Instagram, personalizar paredes | ~8M |
| Artesãs avançadas | Vendem peças, riscos exclusivos e repetíveis | ~650K |

## 4. Módulos — Input/Output

### Módulo 1 — Estúdio de Riscos
- Escolhe motivo → SVG gerado no canvas
- Espelho (4 eixos, radial 8x) → traço replica automaticamente
- Desenho livre com dedo/mouse → suavização
- Escala 50%-200% → redimensiona exportação
- Exportar → PNG alta resolução

### Módulo 2 — Projetor Virtual
- Carrega foto/preset → thumbnail na aba referência
- Iniciar câmera → getUserMedia stream
- Aponta para parede → canvas overlay em tempo real
- Opacidade 5%-95% → globalAlpha
- Filtro Contorno → Sobel edge detection
- Drag com dedo → reposiciona
- Pinch zoom → amplia/reduz
- Capturar → PNG da projeção salvo

### Módulo 3 — Simulador de Parede
- Largura × altura → área bruta m²
- Subtrai janelas/portas → área líquida
- Tipo tinta (acrílica/látex/premium) → rendimento m²/L
- Demãos 1-3 → total de tinta e latas
- Cor + textura → simulação visual no canvas
- Calcular → orçamento completo R$

## 5. Stack Técnica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + Vite (PWA) |
| Canvas 2D | HTML5 Canvas API nativa |
| Câmera | MediaDevices.getUserMedia() |
| Estilo | Tailwind CSS |
| Hospedagem | Vercel |
| Pagamentos | Stripe Checkout |
| Auth | Supabase Auth |
| DB | Supabase PostgreSQL |
| Storage | Supabase Storage |

## 6. Planos e Preços

| Feature | Florzinha (Grátis) | Artista (R$49/mês) | Ateliê Pro (R$497/ano) |
|---------|-------------------|----------------------|-------------------------|
| Motivos | 5 presets | Biblioteca 50+ | 50+ + novos mensais |
| Projetor | Marca d'água | HD sem marca | 4K sem marca |
| Espelhos | V + H | Todos 5 modos | Todos 5 modos |
| Exportação | PNG 800px | PNG 3000px | PNG/SVG 6000px |
| Simulador | 1 textura | 4 texturas | 4 + paletas extra |
| Orçamento | Só quantidade | Completo | Completo + PDF |
| Upload | Não | 10MB/img | Ilimitado |

## 7. Custos Infraestrutura

**Fase inicial (até 500 usuárias):** ~R$45-90/mês (Vercel free, Supabase free, Stripe pay-as-you-go)

**Fase crescimento (500-5000):** ~R$440-850/mês (Vercel Pro, Supabase Pro, Cloudflare)

## 8. Projeção Financeira

| Mês | Grátis | Artista | Pro | Receita |
|-----|--------|---------|-----|---------|
| 1 | 200 | 15 | 8 | R$1.874 |
| 3 | 800 | 70 | 25 | R$8.848 |
| 6 | 2.500 | 220 | 60 | R$23.558 |
| 12 | 9.000 | 850 | 120 | R$90.215 |

Break-even: mês 2-3. Conversão grátis→pago: 10-12%. Churn: 8%/mês.

## 9. Sprints Planejados

### Sprint 1 — MVP (1-2 semanas)
- Projeto React + Vite
- Canvas module (estúdio)
- Câmera module (projetor)
- PWA manifest + icons
- Deploy Vercel

### Sprint 2 — Auth + Pagamentos (1-2 semanas)
- Supabase auth (email + Google)
- Stripe products (Artista mensal, Pro único)
- Webhook Stripe → Supabase
- Middleware de acesso por plano
- Página checkout 3 planos

### Sprint 3 — Polimento + Lançamento (1 semana)
- Landing page hero
- SEO (meta tags, og:image, sitemap)
- Analytics (Vercel)
- Teste iOS Safari + Android Chrome
- Lançamento Instagram + emails
