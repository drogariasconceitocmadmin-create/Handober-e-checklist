# Validacao Handover - commit fee9b80

Projeto: Handover - Drogarias Conceito

Pasta: `C:\Users\Marco\Desktop\Sis Drogaria\Handover`

Branch: `master`

Commit validado: `fee9b80 - fix(handover): tolerate legacy Geral/Arquivo headers without blocking Web App`

ScriptId: `1U-1UOlud99m4NHPdaSUoL9yz4GNV193NW9mhw2t8aB-ypx9AcvfsbNSd`

SpreadsheetId informado: `1tHDX3I5yVx2UioNki695UIoNxHjXxpxCuKZwv2l7Dv8`

Deployment oficial: `AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw`

URL oficial: `https://script.google.com/macros/s/AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw/exec`

## Resultado

Status geral: PARCIAL

Versao publicada: 21.

Rollback feito: NAO.

POP tocado: NAO.

## Pre-deploy

- Pasta Handover confirmada.
- Branch `master` confirmada.
- `.clasp.json` confirmado com scriptId do Handover.
- Commit `fee9b80` presente no HEAD.
- Diff do commit alterou `Code.gs` e `Index.html`.
- Nao ha `sheet.clear()`.
- `ensureHeadersLegacyAdditive_` nao reordena colunas existentes.
- `ensureHeadersLegacyAdditive_` nao sobrescreve cabecalhos existentes.
- Cabecalhos faltantes sao adicionados no final.
- Aliases com/sem acento sao tratados por chave canonica.
- Geral/Arquivo usam leitura/escrita por mapa de cabecalho real.
- Fallbacks de Geral confirmados no codigo: `Titulo || Assunto || Descricao resumida || Solicitação geral`; urgencia vazia vira `Normal`.
- Mantidos: modal, Geral com titulo/urgencia, operador atual, atalhos de data, rascunho checklist, comprado otimista, Falta sem preco, Encomenda com preco e `doGet` com viewport.

## Publicacao

- `clasp status`: OK.
- `clasp push`: OK, 3 arquivos enviados.
- `clasp version`: criada versao 21.
- `clasp deploy`: deployment oficial atualizado para versao 21.

## Smoke desktop real

- Abertura: OK. Web App abriu sem erro de cabecalho.
- Dashboard: OK. Cards carregaram.
- Checklist inicial: OK. Iniciou recolhido.
- Console: OK. Sem erro critico observado.
- Schema Geral: OK. Aba Geral nao bloqueou abertura; registros antigos continuaram visiveis; novo Geral salvou com titulo/urgencia.
- Geral: OK. Criado `CODEX_V21 Geral - schema`; card apareceu rapido e exibiu operador/urgencia.
- Medicamento Falta: OK parcial visual. Campo Preco de venda ficou oculto; nao foi salvo novo registro de Falta nesta rodada.
- Medicamento Encomenda: OK parcial visual. Campo Preco apareceu e atalhos de data preencheram o campo; nao foi salvo novo registro de Encomenda nesta rodada.
- Checklist observacao: FALHA. Texto digitado em observacao do item A sumiu ao marcar item B como Feito.
- Historico/Resolvidos: OK. Carregou sob demanda sem erro de cabecalho.

## Registros criados

- `CODEX_V21 Geral - schema`

## Falhas

### Criticas

- Nenhuma.

### Medias

- Checklist observacao: rascunho digitado em um item nao foi preservado apos atualizar outro item do checklist.

### Leves

- Medicamento Falta e Encomenda foram validados visualmente, mas nao foram salvos nesta rodada para evitar registros extras apos identificar a falha media do checklist.

## Veredito

Publicado com ressalvas. Proxima correcao: preservar rascunho de observacao do checklist durante re-render/atualizacao otimista de outro item.
