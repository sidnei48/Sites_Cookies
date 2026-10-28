# B&S Cookies — código-fonte

Cópia da versão do site atualizada em 22/09/2026, com logo original e fotos dos cookies.

## Abrir no VS Code

1. Extraia este ZIP.
2. No VS Code, use **Arquivo > Abrir Pasta** e selecione a pasta **BS_Cookies**.
3. Para ver a página, abra o arquivo **index.html** no navegador.
4. Edite os arquivos, salve e atualize a página no navegador.

O projeto usa HTML, CSS e JavaScript puro. Não precisa instalar pacotes nem executar npm install.

Se preferir visualizar por um servidor local e tiver Python instalado, abra o terminal na pasta do projeto e execute `python -m http.server 8000` (no Windows, também pode usar `py -m http.server 8000`). Depois abra http://localhost:8000 no navegador. Encerre com Ctrl+C.

## Onde editar

| Arquivo | Conteúdo |
| --- | --- |
| index.html | Textos da página, navegação, seções e campos do pedido. |
| styles.css | Cores, fontes, tamanhos, espaçamento e layout no celular. |
| script.js | Sabores, preços, fotos do cardápio, filtros e carrinho. |
| assets/ | Logo, fotos e fundo com migalhas. |
| build.mjs | Comando opcional para copiar os arquivos de publicação para dist/. |

### Sabores e preços

No começo de **script.js**, cada objeto da lista `products` representa um sabor. Edite `name`, `description` e `price` para mudar nome, descrição e preço. Mantenha os identificadores `id` ao alterar os produtos existentes.

### Fotos

A lista `productPhotos`, em **script.js**, relaciona cada sabor ao arquivo de imagem. Para acrescentar Kinder Bueno e Pistache, coloque as respectivas fotos em **assets/** e adicione as entradas `kinder` e `pistache` à lista. Exemplo: `kinder: "assets/kinder.jpg"`. Preserve as vírgulas entre as entradas.

Para substituir uma imagem já usada, você também pode manter o mesmo nome e extensão do arquivo existente. As imagens do destaque inicial estão no **index.html**.

### Cores e layout

A paleta usa azul **#282E67** e creme. No fim de **styles.css**, há um bloco iniciado por `/* B&S: identidade original... */` com os ajustes mais recentes. Algumas regras desse bloco substituem regras anteriores; procure nele primeiro ao ajustar a aparência.

### WhatsApp

O contato da seção “Onde estamos” está em **index.html**. O número que recebe o resumo do pedido está na função `prepareReview`, em **script.js**. Procure por `wa.me` nos dois arquivos para atualizar ambos. O número usa código do país e DDD, sem espaços.

## Funcionamento desta versão

O cliente escolhe os cookies, informa seus dados e revisa o resumo. O botão final abre o WhatsApp com o texto preparado, para o próprio cliente enviar. Esta versão ainda não grava pedidos em banco de dados nem processa pagamentos. O carrinho é guardado no navegador usando localStorage.

As alterações feitas nesta cópia não atualizam automaticamente o site hospedado.

## Publicação em outro serviço (opcional)

O site pode ser servido diretamente com index.html, styles.css, script.js e a pasta assets. Se tiver Node.js, o comando `node build.mjs` reúne esses arquivos em **dist/**. As fontes usam Google Fonts; sem conexão, o navegador usa as fontes alternativas definidas no CSS.
