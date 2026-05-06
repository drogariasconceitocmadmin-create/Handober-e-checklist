# Validacao Handover - commit a9524a0

Projeto: Handover - Drogarias Conceito

Pasta: `C:\Users\Marco\Desktop\Sis Drogaria\Handover`

Branch: `master`

Commit validado: `a9524a0 - Handover: formata Hora_Vencimento no card Geral como HH:mm`

ScriptId: `1U-1UOlud99m4NHPdaSUoL9yz4GNV193NW9mhw2t8aB-ypx9AcvfsbNSd`

Deployment oficial: `AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw`

URL oficial: `https://script.google.com/macros/s/AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw/exec`

## Resultado

Status geral: OK

Versao publicada: 25.

Rollback feito: NAO.

POP tocado: NAO.

## Pre-deploy

- Pasta Handover confirmada.
- Branch `master` confirmada.
- `.clasp.json` confirmado com scriptId do Handover.
- Commit `a9524a0` presente no HEAD.
- Commit alterou somente `Index.html`.
- `Code.gs` nao foi alterado.
- Schema nao foi alterado.
- Payloads nao foram alterados.
- Vencidos/Hoje nao foi alterado.
- Nao ha referencia ao scriptId/deploymentId do POP no diff.
- Patch adiciona apenas formatacao de `Hora_Vencimento` para exibicao no card Geral.

## Publicacao

- `clasp status`: OK.
- `clasp push`: OK, 3 arquivos enviados.
- `clasp version`: criada versao 25.
- `clasp deploy`: deployment oficial atualizado para versao 25.

## Smoke minimo real

- Abertura: OK. Web App abriu e dashboard carregou.
- Hora vencimento: OK. Registro `CODEX_V24 Geral vencimento foco` mostra `Vence: 05/05/2026 22:34`.
- Valor antigo: OK. `1899-12-30T22:34:00` nao aparece no card.
- Vencidos/Hoje: OK. Filtro mostra o registro com vencimento e continua exibindo `22:34`.
- Console: OK. Sem erro critico observado.

## Falhas

### Criticas

- Nenhuma.

### Medias

- Nenhuma.

### Leves

- Nenhuma.

## Veredito

Publicado e aprovado. Hora_Vencimento exibida como HH:mm.
