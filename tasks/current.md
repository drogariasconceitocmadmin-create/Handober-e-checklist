# Task atual — Handover

## Título

**Validar e publicar P0 de performance operacional do Handover**

## Contexto

- **Commit de referência:** `e9e78d8` (P0 UX: UI otimista, Falta sem preço, WhatsApp imediato, checklist com operador/responsável, histórico/resolvidos lazy, payloads mínimos no backend).
- **Foco:** **desktop** na loja (fluxo real do balcão / backoffice).

## Critérios de validação

1. **UI otimista** — salvamentos Geral/Medicamentos: feedback imediato (Salvando… / Sincronizando… / erro claro).
2. **Medicamento Falta** — sem campo de preço na prática; sem “R$” no card; persistência ok.
3. **Medicamento Encomenda** — preço opcional; negativo bloqueado.
4. **WhatsApp** — abertura imediata do `wa.me`; tentativa registrada em background; UI atualiza sem travar a fila.
5. **Checklist** — filtros; Feito visível em **Todos**; responsável e horário; próximo item sem espera global de ~10s.
6. **Operador atual** — nome obrigatório ou prompt em ações críticas; persistência em `localStorage`.
7. **Histórico / Resolvidos** — filtro carrega arquivo; cards legíveis.

## Artefato de saída

Gerar relatório em:

**`reports/cursor-atual.md`**

Incluir: data, ambiente (URL deployment), commit, navegador, resultado por critério, falhas com passos para reproduzir.

## Deploy

Publicação (Codex / clasp) **somente** após validação explícita e relatório — seguir skill `codex-handover-deploy`.
