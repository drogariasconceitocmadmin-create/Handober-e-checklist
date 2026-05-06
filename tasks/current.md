# Task atual — Handover

## Título

**Fase 1 — Layout desktop base do Handover**

---

## Status da task

| Campo | Valor |
|--------|--------|
| **Estado** | **Concluído (Fase 1 layout desktop em Index.html)** |
| **Versão base** | **25** (publicada e estável; preservar fluxos) |
| **Relatórios (referência)** | `reports/validacao-handover-atual.md`, `reports/validacao-handover-atual.json`, `reports/cursor-atual.md` |

---

## Escopo

- Header novo (marca + Handover, operador, última atualização, última ação, Atualizar agora, Novo registro com dropdown).
- Cards de resumo operacional no topo (clicáveis quando seguro).
- Abas principais: **Pendências**, **Medicamentos**, **Checklist**, **Histórico**.
- Separação visual e funcional: Pendências = apenas Geral; Medicamentos = apenas Falta/Encomenda.
- Dropdown Novo registro: Pendência da loja (modal Geral) e Medicamento solicitado (modal Medicamentos).
- Checklist e Histórico como áreas por aba (sem redesign profundo do checklist).
- Preservar todos os fluxos atuais (operador modal, otimista, checklist rascunho, WhatsApp, reversão, filtros existentes onde aplicável).

---

## Fora de escopo (Fase 1)

- Trilha de Auditoria lateral completa.
- Timeline antes/depois.
- Checklist “premium”.
- Histórico “premium”.
- `Auditoria_JSON` nova ou reestruturação de backend.
- Real-time complexo.
- Mudança profunda de schema.

---

## Confirmações de isolamento

- **POP:** não alterar Portal de POPs nem usar clasp/recursos do POP nesta pasta Handover.
- **Deploy:** apenas quando autorizado explicitamente; esta task não inclui deploy nem `clasp push` pela governança atual.
