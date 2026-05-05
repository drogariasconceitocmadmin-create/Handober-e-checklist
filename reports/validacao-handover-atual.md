# Validacao Handover - commit 880029c

Projeto: Handover - Drogarias Conceito

Pasta: `C:\Users\Marco\Desktop\Sis Drogaria\Handover`

Branch: `master`

Commit validado: `880029c - fix(checklist): preserve observation drafts across status updates and re-render`

ScriptId: `1U-1UOlud99m4NHPdaSUoL9yz4GNV193NW9mhw2t8aB-ypx9AcvfsbNSd`

SpreadsheetId informado: `1tHDX3I5yVx2UioNki695UIoNxHjXxpxCuKZwv2l7Dv8`

Deployment oficial: `AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw`

URL oficial: `https://script.google.com/macros/s/AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw/exec`

## Resultado

Status geral: OK

Versao publicada: 22.

Rollback feito: NAO.

POP tocado: NAO.

## Pre-deploy

- Pasta Handover confirmada.
- Branch `master` confirmada.
- `.clasp.json` confirmado com scriptId do Handover.
- Commit `880029c` presente no HEAD.
- Commit alterou somente `Index.html`.
- `Code.gs` nao foi alterado no commit.
- Nao houve mudanca de schema.
- Nao ha `sheet.clear()`.
- Patch preserva checklist, filtros, observacao, estados Feito/N/A/Pendente e operador/responsavel.
- v21 de schema legado permanece preservada, sem alteracao no backend.
- POP nao apareceu em busca por scriptId/deploymentId proibido.

## Publicacao

- `clasp status`: OK.
- `clasp push`: OK, 3 arquivos enviados.
- `clasp version`: criada versao 22.
- `clasp deploy`: deployment oficial atualizado para versao 22.

## Smoke desktop real

- Abertura: OK. Web App abriu sem Access Denied.
- Dashboard: OK. Carregou com cards e checklist recolhido.
- Console: OK. Sem erro critico observado.
- Checklist rascunho: OK. Texto `CODEX_V22 RASCUNHO NAO PODE SUMIR` permaneceu apos marcar outro item como Feito, marcar outro como N/A, voltar um item para Pendente e trocar filtros.
- Persistencia da observacao: OK. Observacao salva permaneceu apos recarregar a pagina.
- Filtros checklist: OK. Todos, Pendentes, Feitos e Feitos hoje trocaram sem erro e com contagens coerentes.
- Regressao minima: OK. Modal de novo registro abriu; Falta manteve Preco de venda oculto; Encomenda manteve Preco de venda visivel; Historico/Resolvidos carregou sob demanda.

## Dados de teste

- Registros novos criados: nenhum.
- Alteracoes operacionais feitas no checklist: observacao salva no item de checklist `cdc719f4-51ef-4dd1-a15d-08e796b527d7`; item `0fc4e01a-9022-497c-b276-21eba9665842` marcado como Feito e depois voltou para Pendente; item `06cbb6d3-422d-4368-a2cd-7ec2ddeecc00` marcado como N/A.

## Falhas

### Criticas

- Nenhuma.

### Medias

- Nenhuma.

### Leves

- Nenhuma.

## Veredito

Handover v22 publicado e aprovado. Bug do rascunho de observacao do checklist corrigido. POP nao foi tocado.
