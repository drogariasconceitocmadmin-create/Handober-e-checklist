---
name: handover-desktop-ux
description: >-
  Padrões de UX desktop Handover v23: modal de operador (sem window.prompt),
  novo registro otimista com modal fechando cedo, resolver Geral com estado
  Resolvendo e rollback visível. Use para backlog UX Handover, acessibilidade de
  fluxos na loja ou revisão anti-regressão de UI.
disable-model-invocation: true
---

# Skill: UX desktop / backoffice (Handover v23)

## Princípio

Priorizar **clareza na loja** e **feedback imediato** sem travar o navegador em chamadas ao Apps Script.

## Operador atual

- **Não usar** `window.prompt` para operador.
- Fluxo: **`runWithOperador_(callback)`** — se não houver nome na barra superior, abrir **modal próprio** (título no tom de “Informe o operador atual”, campo nome, **Confirmar** / **Cancelar**).
- **Confirmar:** grava em `localStorage`, preenche o campo do topo, executa o callback pendente.
- **Cancelar:** não executar ação crítica; toast discreto: **Operador obrigatório para esta ação**.

## Novo registro (modal)

1. Validar campos no cliente.
2. Inserir **card otimista** (ex.: sincronizando).
3. **Fechar o modal imediatamente** após validação (usuário não fica preso em “Salvando…”).
4. Backend em segundo plano:
   - **Sucesso:** substituir o placeholder pelo registro real; toast **Salvo**.
   - **Falha:** manter card com erro; oferecer **Tentar novamente** e **Editar** (reenvio com payload guardado).

## Resolver solicitação Geral

1. Não remover o card da fila antes da **confirmação** do servidor.
2. Ao clicar resolver: estado visual **Resolvendo…**, botões daquele card desabilitados/ausentes.
3. **Sucesso:** remover da fila principal (foi arquivado); toast **Resolvido**; opcionalmente aparecer no histórico após recarga do arquivo.
4. **Falha:** reverter para o estado anterior **no próprio card**, mensagem de erro **no card** com contexto (ID, aba, ação); mensagens do backend devem preferir resolução por **ID** confiável, não índice de linha “visual”.

## Histórico / reabrir

- Confirmação em **modal próprio**; operador obrigatório; auditoria no arquivo (ver `historico-resolvidos`).

## Anti-regressão rápida

- Sem prompt nativo de operador.
- Cards Geral não “somem” em erro de rede após clique em resolver.
- Modal de novo registro não bloqueia a tela inteira até o `google.script.run` terminar.
