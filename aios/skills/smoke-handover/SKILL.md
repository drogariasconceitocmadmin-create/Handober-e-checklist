# Skill: Smoke test — Handover (desktop)

**Escopo:** validação no **computador da loja** (desktop). Mobile pode existir, mas **não** é foco deste checklist agora.

Pré-requisitos: Web App Handover aberto; **Operador atual** preenchido quando o fluxo exigir; rede estável.

## 1. Geral

- Abrir **Novo registro** → categoria **Geral**.
- Criar solicitação simples (autor + descrição).
- Confirmar: cartão aparece rápido (UI otimista / “Sincronizando…” → confirmado); aparece na fila sem precisar forçar filtro incorreto.
- **Marcar como resolvido** e confirmar sumiço da pendência e presença coerente no **histórico** (quando filtro/carregar histórico).

## 2. Medicamentos — Falta

- Tipo **Falta**: campo **Preço de venda** não deve aparecer ou não deve ser enviado.
- Salvar; cartão sem linha de preço (R$).
- Confirmar fluxo de status (pendente → comprado / entregue conforme uso).

## 3. Medicamentos — Encomenda

- Tipo **Encomenda**: **Preço de venda** visível; opcional; valor negativo bloqueado.
- Salvar e verificar cartão e comportamento de e-mail se aplicável ao ambiente.

## 4. WhatsApp

- Item elegível (ex.: comprado / entregue / resolvido parcialmente conforme regra atual).
- Telefone válido.
- Clicar **Avisar no WhatsApp**: **abrir `wa.me` imediatamente**; registro de tentativa em background e atualização do card (status/data aviso).

## 5. Checklist

- Abrir checklist; filtros **Todos / Pendentes / Feitos / Não aplicáveis / Feitos hoje** comportam-se de forma previsível (item não “some” no **Todos** após Feito).
- Marcar **Feito** / **N/A** / **Pendente**: feedback rápido; botão **Feito ✓** quando aplicável; **Responsável** e horário coerentes com **Operador atual**.
- Possível marcar outro item sem bloqueio global da tela inteira.

## 6. Operador atual

- Preencher nome; executar ação crítica (checklist ou fila).
- Recarregar página: nome permanece (**localStorage**).

## 7. Histórico / Resolvidos

- Filtro **Histórico / Resolvidos**: carrega lista do arquivo; cards legíveis (origem, auditoria quando houver).
- **Resolvidos parcialmente** na fila ativa continua fazendo sentido com medicamentos.

## 8. Arquivamento

- Fluxo de resolução geral → linha vai para **Arquivo_Resolvidos** sem corrupção aparente de colunas.

## Saída

Registrar falhas com: passo, horário, navegador, mensagem de tela e (se possível) trecho do console.
