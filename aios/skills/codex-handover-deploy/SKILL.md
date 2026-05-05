# Skill: Codex — deploy / publicação Handover

## Papel do Codex

- **Validar e publicar** o Web App Handover quando houver autorização explícita.
- **Não** desenvolver funcionalidades novas “por hábito”; só alterações necessárias e pequenas correções acordadas.

## Confirmações obrigatórias (antes de publicar)

| Item | Ação |
|------|------|
| **scriptId** | Igual ao `Handover/.clasp.json` e ao `AGENTS.md` Handover. |
| **spreadsheetId** | Confirmado em Script Properties (`HANDOVER_SPREADSHEET_ID`) — planilha **Handover Drogarias Conceito**, não POP. |
| **deploymentId** | Igual ao registrado em `AGENTS.md`; após novo deploy, atualizar documentação se política do time exigir. |

## URL oficial

Manter alinhamento com o deployment atual:

```
https://script.google.com/macros/s/AKfycbxD_MjbqUgr3XLZno6DX_M8k3o6vlrhkYtOcBN2Mwfi5hEjhbglOEytFlKSpoRGsOPL/exec
```

(Substituir o segmento `/s/DEPLOYMENT_ID/` se o deployment oficial mudar.)

## Processo

1. Rodar smoke desktop (skill `smoke-handover`) ou checklist mínimo acordado.
2. **Salvar relatório** em `Handover/reports/` (ex.: data, versão/commit, resultado, incidentes).
3. **Publicar só se passar** nos critérios combinados com o solicitante.
4. **Não** misturar commit/deploy com POP.

## O que não fazer

- Deploy sem confirmar IDs.
- `git add .` ou alterações fora de `Handover/` nesta linha de trabalho.
- Publicar com smoke falhando sem registro explícito de risco aceito.
