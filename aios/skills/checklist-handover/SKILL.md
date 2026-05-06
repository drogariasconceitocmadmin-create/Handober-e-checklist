---
name: checklist-handover
description: >-
  Orienta trabalho no checklist operacional do Handover v23 (turnos, filtros de
  visualização, observações em modo leitura/edição e preservação de rascunho).
  Use quando o usuário pedir checklist Handover, turno Manhã/Tarde/Noite,
  filtros do checklist, observação de item ou anti-regressão após sync.
disable-model-invocation: true
---

# Skill: Checklist Handover (v23)

## Escopo

- Projeto: **Handover** — pasta `Handover/` apenas (não POP).
- Versão de referência validada: **23**.
- Relatórios canônicos: `reports/validacao-handover-atual.md` e `reports/validacao-handover-atual.json`.

## Comportamento esperado (v23)

1. **Turno**
   - UI expõe turno (**Manhã**, **Tarde**, **Noite**) com rótulo explícito (ex.: checklist do turno atual).
   - Troca de turno recarrega dados daquele turno/data via backend (`generateChecklistForTurno` / bundle com `activeChecklistTurno`).
   - Manhã permanece o fluxo principal estável; outros turnos seguem a mesma estrutura quando houver itens.

2. **Filtros de visualização** (checklist)
   - Filtros locais: todos, pendentes, feitos, N/A, feitos hoje — não substituem dados no servidor; apenas filtram a lista renderizada.

3. **Observação do item**
   - **Sem observação salva:** botão **Adicionar observação** (abre modo edição).
   - **Com observação salva:** bloco somente leitura **Observação:** … e botão **Editar observação**.
   - Em edição: campo + **Salvar** / **Cancelar**; cancelar descarta rascunho e volta ao texto salvo.
   - **Rascunho:** captura via delegação em inputs `data-check-obs-input`; não deve sumir ao alterar status (**Feito** / **N/A** / **Pendente**) de **outro** item enquanto o foco/edição segue o fluxo v23.

4. **Operador**
   - Salvar observação ou mudar status exige **Operador atual** (modal próprio / barra superior — ver skill `handover-desktop-ux`).

## O que o agente deve evitar

- Não misturar POP e Handover (planilha, `.clasp.json`, deploy).
- Não propor `sheet.clear()` nem apagar dados.
- Alinhar mudanças com `gas-safety` e `sheets-schema` quando tocar em Apps Script ou schema.

## Smoke / regressão

- Para checklist integrado ao Web App, usar `aios/skills/smoke-handover/SKILL.md` como complemento.
