# Web App Google Sheets Drogaria

Este projeto contem dois arquivos para colar no Editor de Apps Script:

- `Code.gs`: backend, integracao com Google Sheets, arquivamento e email.
- `Index.html`: formulario, dashboard e interacoes sem recarregar a pagina.

## Como Instalar

1. Crie ou abra a planilha no Google Sheets.
2. Acesse `Extensoes > Apps Script`.
3. No arquivo `Code.gs`, cole todo o conteudo de `Code.gs` deste projeto.
4. Crie um arquivo HTML chamado `Index`.
5. Cole todo o conteudo de `Index.html` neste arquivo HTML.
6. Salve o projeto.

## Preparar A Planilha

1. No seletor de funcoes do Apps Script, escolha `setupSpreadsheet`.
2. Clique em `Executar`.
3. Autorize o script quando solicitado.

O script cria/valida estas abas:

- `Geral`: `ID, Timestamp, Autor, Descricao, Resolvido`
- `Medicamentos`: `ID, Timestamp, Tipo, Medicamento, Pre_Pago, Cliente, Atendente, Previsao_Entrega, Comprado, Entregue`
- `Arquivo_Resolvidos`: historico unificado com a coluna `Origem`.

## Dados De Teste

1. No seletor de funcoes, escolha `populateTestData`.
2. Clique em `Executar`.
3. A funcao cria 3 registros:
   - 1 solicitacao geral.
   - 1 medicamento do tipo `Encomenda`.
   - 1 medicamento do tipo `Falta`.

Ao criar o medicamento do tipo `Encomenda`, o script envia email para `drogariasconceitocm@gmail.com`. O tipo `Falta` nao dispara email.

## Publicar Como Web App

1. No Apps Script, clique em `Implantar > Nova implantacao`.
2. Em `Selecionar tipo`, escolha `App da Web`.
3. Configure:
   - `Executar como`: `Eu`
   - `Quem pode acessar`: `Qualquer pessoa`
4. Clique em `Implantar`.
5. Autorize as permissoes solicitadas.
6. Copie a URL do Web App e abra no navegador.

## Uso

- Use o formulario para cadastrar `Geral` ou `Medicamentos`.
- Em `Medicamentos`, selecione:
  - `Encomenda` para pedido de cliente que deve disparar email.
  - `Falta` para compra/reposicao de medicamento em falta, sem email.
- O dashboard mostra itens abertos.
- Medicamentos com `Previsao_Entrega` vencida ou no dia atual ficam em vermelho enquanto nao estiverem entregues.
- Os botoes `Marcar como Comprado`, `Marcar como Entregue` e `Marcar como Resolvido` atualizam a planilha sem recarregar a pagina.
- Ao marcar `Entregue` ou `Resolvido`, a linha e movida para `Arquivo_Resolvidos`.

## Observacoes

- O envio de email usa `MailApp.sendEmail`, entao a conta que publicar o Web App precisa autorizar essa permissao.
- Se alguem marcar manualmente `Resolvido` ou `Entregue` na planilha, o `onEdit(e)` tambem arquiva a linha.
- Para uso publico, mantenha a URL do Web App apenas com pessoas autorizadas a registrar solicitacoes.
