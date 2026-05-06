# Validacao Handover - commit e7c7f84

Projeto: Handover - Drogarias Conceito

Pasta: `C:\Users\Marco\Desktop\Sis Drogaria\Handover`

Branch: `master`

Commit validado: `e7c7f84 - fix(handover): Novo registro Medicamentos abre modal na categoria correta`

ScriptId: `1U-1UOlud99m4NHPdaSUoL9yz4GNV193NW9mhw2t8aB-ypx9AcvfsbNSd`

Deployment oficial: `AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw`

URL oficial: `https://script.google.com/macros/s/AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw/exec`

## Resultado

Status geral: OK

Versao publicada: 27.

Rollback feito: NAO.

POP tocado: NAO.

## Pre-deploy

- Pasta Handover confirmada.
- Branch `master` confirmada.
- `.clasp.json` confirmado com scriptId do Handover.
- Commit `e7c7f84` presente no HEAD.
- Commit alterou somente `Index.html`.
- `Code.gs` nao foi alterado.
- Schema nao foi alterado.
- Payloads nao foram alterados.
- Nao ha referencia ao scriptId/deploymentId do POP no diff.
- Patch limita-se a passar categoria inicial para `openFormModal_`.

## Publicacao

- `clasp status`: OK.
- `clasp push`: OK, 3 arquivos enviados.
- `clasp version`: criada versao 27.
- `clasp deploy`: deployment oficial atualizado para versao 27.
- URL oficial mantida.

## Smoke minimo real

- Abertura: OK. Web App abriu sem erro critico e layout v26 carregou.
- Novo registro Geral: OK. `Novo registro > Pendencia da loja` abriu modal em categoria `Geral`; campos de Geral visiveis e campos de Medicamentos ocultos.
- Novo registro Medicamentos: OK. `Novo registro > Medicamento solicitado` abriu modal em categoria `Medicamentos`; campos de Medicamentos visiveis e campos de Geral ocultos.
- Falta: OK. Ao selecionar `Falta`, cliente, telefone, pre-pago e preco ficaram ocultos.
- Encomenda: OK. Ao selecionar `Encomenda`, cliente, telefone, preco e pre-pago ficaram visiveis.
- Console: OK. Sem erro critico observado.
- Registros criados: nenhum.

## Falhas

### Criticas

- Nenhuma.

### Medias

- Nenhuma.

### Leves

- Nenhuma.

## Veredito

Publicado e aprovado. Dropdown `Novo registro > Medicamento solicitado` abre o modal diretamente em `Medicamentos`.
