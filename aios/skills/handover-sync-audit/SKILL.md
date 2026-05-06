---
name: handover-sync-audit
description: >-
  Sincronização leve do dashboard Handover v23: atualizar agora, carimbo de
  última atualização, auto-refresh com guardas e merge sem apagar rascunhos
  ou estados otimistas. Use ao falar em refresh, multi-pc, última ação ou merge
  de bundle com checklist/fila.
disable-model-invocation: true
---

# Skill: Sincronização e auditoria visual (Handover v23)

## Objetivo

Manter o painel **atualizado entre máquinas** sem colaboração tempo real complexa: polling leve, merge seguro e respeito a edição local (rascunhos).

## Comportamento v23

1. **Última atualização**
   - Exibir no topo algo como **Última atualização: HH:mm:ss** (relógio local após sucesso do refresh).

2. **Atualizar agora**
   - Botão dedicado dispara `refreshDashboardBundle` (ou fluxo equivalente) com o turno de checklist ativo.
   - Opcionalmente bloquear ou avisar se **modal** estiver aberto (formulário, operador obrigatório, reabrir histórico).

3. **Auto-refresh (~60 s)**
   - Intervalo leve; **não** deve rodar enquanto:
     - modal bloqueante estiver aberto, ou
     - usuário estiver **editando observação** do checklist (modo edição ativo).
   - Objetivo: não interromper digitação nem disparar refresh barulhento no meio de um fluxo crítico.

4. **Merge no cliente**
   - Ao aplicar bundle do servidor, **preservar** linhas em estado otimista (ex.: `__syncState === 'syncing'`, IDs `opt-*`, resolução em **Resolvendo…** quando aplicável) para não “sumir” cartões antes da confirmação do backend.

5. **Rascunhos**
   - Auto-refresh e merge **não** devem apagar `checklistObservationDrafts` nem modo edição de observação sem ação explícita do usuário.

6. **Última ação em cards**
   - Quando o modelo trouxer `Ultima_Acao_Por` / `Ultima_Acao_Em`, a UI pode resumir como **Última ação: nome às HH:mm** na próxima sincronização (aproximação multi-operador).

## Referências cruzadas

- UX de operador e modais: `handover-desktop-ux`.
- Checklist e turno: `checklist-handover`.
- Histórico: `historico-resolvidos`.

## Limitações assumidas

- Não há CRDT nem locking de edição simultânea na mesma célula; conflitos finais são **última escrita no Sheets**.
