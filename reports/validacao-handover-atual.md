# Validacao Handover - commit 92a7066

Projeto: Handover - Drogarias Conceito

Pasta: `C:\Users\Marco\Desktop\Sis Drogaria\Handover`

Branch: `master`

Commit validado: `92a7066 - Handover v23: vencimento Geral, Falta/Encomenda campos, revert medicamento, Enter checklist/modal`

ScriptId: `1U-1UOlud99m4NHPdaSUoL9yz4GNV193NW9mhw2t8aB-ypx9AcvfsbNSd`

SpreadsheetId informado: `1tHDX3I5yVx2UioNki695UIoNxHjXxpxCuKZwv2l7Dv8`

Deployment oficial: `AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw`

URL oficial: `https://script.google.com/macros/s/AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw/exec`

## Resultado

Status geral: PARCIAL

Versao publicada: 24.

Rollback feito: NAO.

POP tocado: NAO.

## Pre-deploy

- Pasta Handover confirmada.
- Branch `master` confirmada.
- `.clasp.json` confirmado com scriptId do Handover.
- Commit `92a7066` presente no HEAD.
- Commit alterou somente `Code.gs` e `Index.html`.
- Nao ha referencia ao scriptId/deploymentId do POP no diff.
- Nao ha `sheet.clear()`.
- `doGet` preserva `.addMetaTag('viewport', 'width=device-width, initial-scale=1')`.
- Schema legado tolerante preservado.
- Novas colunas sao aditivas e entram no final sem reordenar dados.
- Falta limpa cliente, telefone, pre-pago, previsao e preco no fluxo simples.
- Encomenda preserva cliente, telefone, preco, pre-pago e atendente editavel.
- Atendente e autor sao sincronizados a partir do Operador atual.
- Geral tem checkbox `Tem vencimento / prazo`.
- Geral so entra em Vencidos/Hoje quando `Tem_Vencimento` esta ativo e `Data_Vencimento` e aplicavel.
- Encomenda usa `Previsao_Entrega` para Vencidos/Hoje; Falta nova nao entra indevidamente.
- `revertMedicationToPending` existe e registra auditoria de reversao.
- Enter salva observacao de checklist; Shift+Enter quebra linha.
- Enter salva novo registro; Shift+Enter quebra linha na descricao.
- Botao do checklist esta como `Atualizar checklist`.
- v23 preservada: operador modal, save otimista, resolver com rollback, historico filtros, reabrir historico, checklist obs, rascunho, turno, atualizar agora e WhatsApp imediato.

## Publicacao

- `clasp status`: OK.
- `clasp push`: OK, 3 arquivos enviados.
- `clasp version`: criada versao 24.
- `clasp deploy`: deployment oficial atualizado para versao 24.

## Smoke desktop real

- Abertura: OK. Web App abriu, dashboard carregou, checklist iniciou recolhido e console nao teve erro critico.
- Geral sem vencimento: OK. `CODEX_V24 Geral sem vencimento` salvou com card otimista e nao apareceu no filtro Vencidos/Hoje.
- Geral com vencimento: OK funcional. `CODEX_V24 Geral vencimento foco` salvou, persistiu apos reload e apareceu em Vencidos/Hoje.
- Vencidos/Hoje: OK funcional. Geral com vencimento hoje apareceu; Geral sem vencimento nao apareceu; Falta e Encomenda com previsao amanha nao apareceram.
- Falta: OK. Cliente, telefone, pre-pago e preco ficaram ocultos; registro `CODEX_V24 Falta` salvou sem esses dados no card.
- Encomenda: OK. Cliente, telefone, pre-pago e preco visiveis; atendente veio preenchido e aceitou edicao; preco apareceu no card.
- Reversao: OK. Encomenda marcada como Comprado e revertida para Pendente; card exibiu auditoria `Revertido por CODEX_V24`.
- Enter checklist: OK. Shift+Enter quebrou linha; Enter salvou; texto salvo apareceu como bloco fixo.
- Enter novo registro: OK. Shift+Enter quebrou linha na descricao; Enter salvou o registro.
- Historico/WhatsApp/Atualizar: OK. Historico carregou, WhatsApp abriu URL sem envio real e Atualizar agora funcionou.

## Registros criados

- `CODEX_V24 Geral sem vencimento`
- `CODEX_V24 Geral Enter`
- `CODEX_V24 Falta`
- `CODEX_V24 Encomenda`
- `CODEX_V24 Geral vencimento foco`

## Observacoes

- A tentativa inicial `CODEX_V24 Geral vencimento hoje` nao persistiu apos reload porque o preenchimento automatizado do input date falhou; o reteste focado com preenchimento direto validou o fluxo funcional.
- Uma observacao de checklist com texto `CODEX_V24 checklist linha 1` / `linha 2` foi salva durante o smoke.

## Falhas

### Criticas

- Nenhuma.

### Medias

- Nenhuma.

### Leves

- Hora limite de Geral com vencimento foi exibida como `1899-12-30T22:34:00` no card, em vez de formato curto `22:34`. Impacto visual/legibilidade; nao bloqueia salvamento nem filtro Vencidos/Hoje.

## Veredito

Publicado com ressalvas. Proxima correcao: formatar `Hora_Vencimento` como hora curta no card.
