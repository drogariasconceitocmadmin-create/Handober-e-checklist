# Task atual — Handover

## Título

**Handover v23 — validação desktop/backoffice e skills de domínio**

---

## Status da task

| Campo | Valor |
|--------|--------|
| **Estado** | **Concluído / publicado** |
| **Versão** | **23** |
| **Deployment oficial** | Mantido (mesmo Web App Handover; ver `AGENTS.md` do projeto e skill `aios/skills/handover/SKILL.md`). |
| **Relatórios (canônicos)** | `reports/validacao-handover-atual.md`, `reports/validacao-handover-atual.json` |
| **Commit de relatórios** | `62d8e32` |

### Confirmações de isolamento

- **POP:** não tocado neste ciclo de skills/tasks.
- **Código Apps Script / Web App:** não alterado nesta entrega (somente documentação em `aios/skills/` e `tasks/current.md`).

---

## Escopo validado na v23 (referência para skills)

| Área | Conteúdo |
|------|-----------|
| **Checklist** | Observação em leitura/edição, rascunho preservado, filtros de visualização, seletor de turno (Manhã/Tarde/Noite), `generateChecklistForTurno` no fluxo de refresh. |
| **Histórico / Resolvidos** | Carga sob demanda, filtros (datas, categoria, estado, operador), reabrir/reverter com modal e trilha (`Estado_Arquivo`, reabertura, vínculos). |
| **Sincronização** | “Atualizar agora”, carimbo de última atualização, auto-refresh leve com guardas (modais / edição de observação), merge sem descartar rascunhos ou placeholders críticos. |
| **UX desktop** | Modal de operador (sem `window.prompt`), novo registro otimista com modal fechando cedo, resolver Geral com **Resolvendo…** e rollback visível no card. |

---

## Skills específicas (v23)

| Skill | Pasta |
|-------|--------|
| Checklist | `aios/skills/checklist-handover/SKILL.md` |
| Histórico | `aios/skills/historico-resolvidos/SKILL.md` |
| Sync / auditoria na UI | `aios/skills/handover-sync-audit/SKILL.md` |
| UX desktop | `aios/skills/handover-desktop-ux/SKILL.md` |

Skills gerais existentes continuam válidas: `handover`, `gas-safety`, `sheets-schema`, `smoke-handover`, `codex-handover-deploy` (deploy apenas com autorização).

---

## Próximos passos sugeridos (opcional)

- Rodar smoke conforme `smoke-handover` após qualquer mudança futura em `Code.gs` / `Index.html`.
- Atualizar relatórios em `reports/` quando houver nova versão publicada e registrar novo commit de relatório neste arquivo.
