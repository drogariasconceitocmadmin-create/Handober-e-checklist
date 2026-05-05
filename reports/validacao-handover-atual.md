# Validação e publicação — Handover (versão 19)

**Projeto:** Handover — Drogarias Conceito  
**Pasta:** `C:\Users\Marco\Desktop\Sis Drogaria\Handover`  
**Registro de governança:** este arquivo faz parte do fluxo `aios/` + `tasks/` + `reports/`.

---

## Sumário executivo

| Campo | Valor |
|--------|--------|
| **Versão publicada** | 19 |
| **Resultado global** | **PARCIAL** apenas por ressalva administrativa (HEAD / `clasp push`); **testes funcionais OK** |
| **Falhas críticas** | Nenhuma |
| **POP tocado** | **Não** |

A ressalva administrativa fica **encerrada para fins de rastreabilidade** com este registro em `reports/` e atualização em `tasks/current.md`.

---

## Referências de código e deploy

| Campo | Valor |
|--------|--------|
| **Commit funcional validado (P0 UX)** | `e9e78d8` |
| **Commit de governança no repo (HEAD na época do push)** | `f4a36e3` |
| **DeploymentId (v19)** | `AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw` |
| **URL oficial (Web App)** | https://script.google.com/macros/s/AKfycbzJ5fxFTSfkDsU5l0s79MNrklpkwI1xVMgG_DIvXnJWlRFLRCGMZYtKZSymyc6fmXuw/exec |

**scriptId Handover** (inalterado neste ciclo): `1U-1UOlud99m4NHPdaSUoL9yz4GNV193NW9mhw2t8aB-ypx9AcvfsbNSd`

---

## Contexto da validação

- Publicação e smoke realizados pelo **Codex** antes da criação das skills em `aios/skills/`.
- Skills lidas para alinhamento documental: `aios/skills/handover/SKILL.md`, `aios/skills/gas-safety/SKILL.md`.

---

## Resultados funcionais (desktop)

| Área | Resultado |
|------|-----------|
| Abertura desktop | OK |
| Performance percebida | OK |
| Geral | OK |
| Medicamento Falta | OK |
| Medicamento Encomenda | OK |
| WhatsApp | OK |
| Checklist | OK |
| Operador / responsabilidade | OK |
| Histórico / Resolvidos | OK |

---

## Incidentes e limitações (não bloqueantes)

### Médio — administrativo / fluxo Git–clasp

- `clasp push` exigiu **`--force`**.
- **HEAD local** estava em **`f4a36e3`** (commit de governança, sem alteração funcional em relação ao código publicado referenciado por **`e9e78d8`** para o P0).

**Tratamento:** registrado aqui e na task atual como ressalva administrativa; não indica regressão funcional nos testes executados.

### Leve — automação

- Limitação do **Playwright** com `select` / `date` dentro do **iframe** do Web App (impacto em automação, não necessariamente em uso humano no desktop).

---

## Registros de teste criados (planilha / sessão Codex)

Identificadores informados para rastreio:

- `CODEX_SMOKE_HANDOVER 1778019281748 Geral`
- `CODEX_SMOKE_HANDOVER FALTA 1778019489260`
- `CODEX_SMOKE_HANDOVER ENCOMENDA 1778019540225`

---

## Próximos passos sugeridos (fora do escopo deste commit)

1. Alinhar documentação canônica de **deploymentId** / URL em `aios/skills/handover/SKILL.md` e `AGENTS.md` quando política do time autorizar (não feito nesta rodada).
2. Manter smoke desktop humano periódico conforme `aios/skills/smoke-handover/SKILL.md`.

---

## Metadados do relatório

| Campo | Valor |
|--------|--------|
| **Formato complementar** | `reports/validacao-handover-atual.json` |
| **Arquivos explicitamente não alterados nesta rodada** | `Code.gs`, `Index.html`, `appsscript.json`, `.clasp.json` |
