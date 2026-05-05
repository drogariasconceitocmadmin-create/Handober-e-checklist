# Skill: Apps Script / Google Sheets — segurança Handover

## Preflight obrigatório

Antes de editar `Code.gs`, `push` ou orientar deploy:

1. Confirmar **diretório:** `Handover/` (não raiz do repositório POP).
2. Confirmar **`Handover/.clasp.json`** — `scriptId` do **Handover** apenas.
3. Confirmar **branch** (`master` ou a branch acordada) e **escopo do commit** (somente Handover).

## Isolamento POP

- **Não** usar URL, `scriptId`, `deploymentId` ou planilha do **Portal de POPs** em tarefas Handover.
- **Não** misturar arquivos POP e Handover no mesmo commit.

## Padrões defensivos no código

- **Não** usar `SpreadsheetApp.getActiveSpreadsheet()` em fluxo de **Web App standalone** como fonte da verdade — o Handover usa planilha via ID em propriedades (`HANDOVER_SPREADSHEET_ID`) / `openById`.
- **Não** usar `sheet.clear()` para “arrumar” schema — risco de perda de dados.
- Novas colunas / cabeçalhos: apenas **defensivos** (migração incremental, sem wipe).

## Deploy e ferramentas

- **Cursor:** não executa deploy do Handover por padrão.
- **Codex:** pode validar/publicar quando autorizado e seguindo skill `codex-handover-deploy`.
- **Nunca** `git add .` — adicionar arquivos explicitamente.

## Diffs e revisão

- Diffs **grandes** (ordem de milhares de linhas ou mudança ampla sem pedido): **avisar** o solicitante e pedir confirmação antes de prosseguir.

## Em caso de dúvida

Parar e pedir: pasta alvo, `scriptId`, `spreadsheetId` (properties), ou `deploymentId`.
