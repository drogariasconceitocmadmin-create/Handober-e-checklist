# Skill: Handover — Drogarias Conceito

## Identidade

- **Projeto:** Handover (painel operacional de turno: solicitações gerais, medicamentos, checklist e histórico).
- **Não confundir com:** Portal de POPs (projeto e planilha diferentes).

## Pasta correta

- Trabalhar **somente** em:  
  `C:\Users\Marco\Desktop\Sis Drogaria\Handover`
- **Branch:** `master`
- **Clasp:** usar apenas `Handover/.clasp.json` (nunca o `.clasp.json` da raiz do monorepo POP).

## IDs oficiais (Handover)

| Campo | Valor |
|--------|--------|
| **scriptId** | `1U-1UOlud99m4NHPdaSUoL9yz4GNV193NW9mhw2t8aB-ypx9AcvfsbNSd` |
| **deploymentId** | `AKfycbxD_MjbqUgr3XLZno6DX_M8k3o6vlrhkYtOcBN2Mwfi5hEjhbglOEytFlKSpoRGsOPL` |
| **spreadsheetId** | Armazenado nas **Script Properties** do projeto Handover, chave `HANDOVER_SPREADSHEET_ID`. Não está fixo no repositório; confirmar no Apps Script (Projeto → Configurações do projeto → propriedades do script) ou via log/`setupSpreadsheet` quando aplicável. Título esperado da planilha criada pelo script: **Handover Drogarias Conceito**. |

## URL oficial (Web App)

```
https://script.google.com/macros/s/AKfycbxD_MjbqUgr3XLZno6DX_M8k3o6vlrhkYtOcBN2Mwfi5hEjhbglOEytFlKSpoRGsOPL/exec
```

(Manter esta URL como referência de deployment atual; se houver novo deployment, atualizar `deploymentId`, skill e `AGENTS.md` em conjunto.)

## Fluxos principais (abas / domínio)

1. **Geral** — solicitações operacionais do dia; resolução e arquivamento quando aplicável.
2. **Medicamentos** — tipos Encomenda / Falta; status comprado/entregue; WhatsApp de aviso quando elegível.
3. **Arquivo_Resolvidos** — histórico unificado de registros arquivados (origem + auditoria).
4. **Checklist_Turnos** — checklist do turno (manhã), itens por categoria, status e responsável.

## Uso típico

- **Computador na loja** como principal: fluxos rápidos, poucos cliques, leitura clara de pendências e checklist.
- **Prioridade:** simplicidade operacional **acima** de complexidade técnica ou cosmética.

## Ao usar esta skill

- Validar pasta, branch e IDs antes de editar ou orientar deploy.
- Qualquer dúvida entre Handover e POP: **parar** e confirmar projeto/planilha/script.
