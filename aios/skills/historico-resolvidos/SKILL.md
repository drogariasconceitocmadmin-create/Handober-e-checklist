---
name: historico-resolvidos
description: >-
  Histórico Handover (aba Arquivo_Resolvidos): carregamento sob demanda,
  filtros cliente, reabrir/reverter para pendente e trilha de auditoria v23.
  Use quando o usuário falar em histórico, resolvidos, reabrir, filtros de
  arquivo ou campos Estado_Arquivo / Reaberto_Por.
disable-model-invocation: true
---

# Skill: Histórico / Resolvidos (Handover v23)

## Escopo

- Projeto: **Handover** — `Handover/` isolado do POP.
- Dados: registros arquivados na planilha (histórico unificado); UI usa filtro **Histórico / Resolvidos** na fila.
- Relatórios: `reports/validacao-handover-atual.md` e `.json`.

## Carregamento e filtros (v23)

1. **Sob demanda** — ao selecionar o filtro de histórico, os dados são buscados no backend (limite configurável no servidor; cliente pode pedir mais linhas para suportar filtros).
2. **Filtros na UI** (sem poluir a fila principal):
   - Criação: todos / hoje / últimos 7 dias.
   - Resolução: todos / hoje / últimos 7 dias.
   - Categoria: todos / Geral / Medicamentos.
   - Estado: todos / Arquivado (resolvido no arquivo) / Reaberto (quando aplicável).
   - Operador / responsável: texto livre sobre campos de auditoria carregados.

## Reabrir / reverter

- Cards elegíveis mostram ação do tipo **Reverter para pendente** (ou equivalente), com **modal próprio** de confirmação e motivo opcional.
- Exige **Operador atual** no fluxo (consistente com skill `handover-desktop-ux`).
- Backend cria registro ativo novo quando aplicável e **audita** a linha arquivada (ex.: `Estado_Arquivo`, `Reaberto_Por`, `Data_Reabertura`, `Motivo_Reabertura`, vínculos ao ID ativo), **sem apagar** o histórico nem apagar quem resolveu originalmente.

## Trilha exibida / auditoria

- Cards e meta devem permitir entender: **quem resolveu**, **quando**, **quem reabriu** (se houver), **quando**, **estado atual no arquivo**.
- Campos defensivos no arquivo são aditivos; schema legado tolerante — ver `sheets-schema`.

## Segurança e governança

- Seguir `gas-safety`: sem `clear()` em abas de dados; operações idempotentes quando possível.
- Deploy: apenas quando autorizado; esta skill não ordena deploy automático.
