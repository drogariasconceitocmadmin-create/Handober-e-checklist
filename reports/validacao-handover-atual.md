# Validacao Handover - commit 9541ea6

Projeto: Handover - Drogarias Conceito

Pasta: `C:\Users\Marco\Desktop\Sis Drogaria\Handover`

Branch: `master`

Commit validado: `9541ea6 - Handover: rascunho checklist preservado, modal novo registro, Geral titulo/urgencia, atalhos data, comprado otimista`

ScriptId: `1U-1UOlud99m4NHPdaSUoL9yz4GNV193NW9mhw2t8aB-ypx9AcvfsbNSd`

SpreadsheetId informado: `1tHDX3I5yVx2UioNki695UIoNxHjXxpxCuKZwv2l7Dv8`

Deployment oficial: `AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw`

URL oficial: `https://script.google.com/macros/s/AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw/exec`

## Resultado

Status geral: FALHA

Pre-deploy: OK.

Publicacao: versao 20 criada e aplicada ao deployment oficial.

Smoke desktop real: FALHA na abertura.

Rollback operacional: deployment oficial revertido para versao 19.

POP tocado: NAO.

## Pre-deploy

- Pasta Handover confirmada.
- Branch `master` confirmada.
- `.clasp.json` confirmado com scriptId do Handover.
- Commit `9541ea6` presente no HEAD.
- Diff do commit alterou apenas `Code.gs` e `Index.html`.
- `Code.gs` preserva `doGet()` com `addMetaTag('viewport', 'width=device-width, initial-scale=1')`.
- `Code.gs` nao contem `sheet.clear()`.
- `Code.gs` preserva `ensureHeaders_`, `saveData`, `markAsPurchased`, `registerWhatsAppAttempt` e `updateChecklistItemStatus`.
- `Index.html` contem modal de novo registro, Titulo/Urgencia para Geral, atalhos de data, rascunho de observacao do checklist e feedback otimista.

## Publicacao

- `clasp status`: OK.
- `clasp push`: OK, 3 arquivos enviados.
- `clasp version`: criada versao 20.
- `clasp deploy`: deployment oficial atualizado para versao 20.
- Apos falha critica no smoke, o deployment oficial foi revertido para versao 19.

## Falha critica

Ao abrir a URL oficial publicada em `@20`, o Web App nao carregou a interface. A pagina retornou:

```text
Error: Estrutura de cabecalho incompativel na aba "Geral". Ajuste manualmente os cabecalhos para: ID, Timestamp, Autor, Titulo, Urgencia, Descricao, Resolvido, Ultima_Acao_Por, Ultima_Acao_Em, Resolvido_Por, Data_Resolucao. (linha 874, arquivo "Code")
```

Impacto: o Handover fica indisponivel para usuario final se o deployment permanecer em `@20`.

Causa provavel: o commit adiciona colunas `Titulo` e `Urgencia` na aba `Geral`, mas a migracao defensiva atual nao consegue inserir essas colunas no meio do cabecalho existente sem considerar a estrutura atual compativel. O validador de cabecalho bloqueia antes do app abrir.

## Smoke desktop

- Abertura: FALHA em `@20`.
- Dashboard: NAO VALIDADO por falha na abertura.
- Modal: NAO VALIDADO por falha na abertura.
- Geral: NAO VALIDADO por falha na abertura.
- Medicamento Falta: NAO VALIDADO por falha na abertura.
- Medicamento Encomenda: NAO VALIDADO por falha na abertura.
- Comprado otimista: NAO VALIDADO por falha na abertura.
- WhatsApp: NAO VALIDADO por falha na abertura.
- Checklist rascunho observacao: NAO VALIDADO por falha na abertura.
- Historico: NAO VALIDADO por falha na abertura.

## Registros criados

Nenhum.

## Estado final

O deployment oficial foi revertido para a versao 19 para preservar o uso operacional.

## Veredito

Publicacao bloqueada. Motivo: falha critica de schema/cabecalho na aba `Geral` ao abrir o Web App na versao 20.
