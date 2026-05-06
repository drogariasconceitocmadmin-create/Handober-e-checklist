# Cursor — Handover (atualização de sessão)

## Contexto

- Projeto: **Handover — Drogarias Conceito** (`Handover/` isolado).
- Base funcional: **v25** publicada e aprovada.
- Objetivo desta entrega: **Fase 1 — layout desktop base** (header, cards de resumo, abas, separação Pendências/Medicamentos, dropdown Novo registro), **sem** auditoria lateral completa nem mudanças de backend/schema.

## Arquivos tocados (previsto / efetivo)

- `tasks/current.md` — Fase 1 (layout desktop base): estado atualizado para **Concluído** nesta entrega.
- `reports/cursor-atual.md` — este arquivo.
- `Index.html` — UI/CSS/JS da Fase 1 (preferencialmente só front).
- `Code.gs` — apenas se indispensável (evitar na Fase 1).

## Entrega Cursor (Fase 1 layout desktop)

- Implementado em **`Index.html`** apenas: header compacto com marca + Handover, operador + última atualização + última ação derivada dos registros, botão **Atualizar agora**, dropdown **Novo registro** (Pendência da loja / Medicamento solicitado), faixa de **5 cards de resumo** clicáveis, **abas** Pendências / Medicamentos / Checklist / Histórico com separação da fila (Geral só em Pendências; medicamentos só em Medicamentos), filtros por aba (incl. Urgentes, Faltas, Encomendas), busca simples em Medicamentos, menu ⋮ nos cards (detalhes / copiar / trilha desabilitada), tokens visuais (--bg #F6F9FE, texto #0B1B3A, etc.).
- **Não** inclui: auditoria lateral completa, checklist premium, histórico premium, backend novo.
- **Sem** alteração de `Code.gs`, **sem** deploy/`clasp push`, **sem** POP.

## Anti-regressão citada pelo usuário

- Checklist: preservar rascunho de observação e fluxo Enter / Shift+Enter.
- Novo registro: modal otimista, Enter salva, Shift+Enter em textarea.
- Falta / Encomenda: regras de campos e WhatsApp conforme v25.
