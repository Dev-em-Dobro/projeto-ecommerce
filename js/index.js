/*
Objetivo 1 - quando clicar no botao de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar o html do carrinho
    parte 1 - vamos adicionar +1 no icone do carrinho
        passo 1 - pegar os botões de adicionar ao carrinho do html
        passo 2 - adicionar uma evento de escuta nesses botões pra quando clicar disparar uma ação
        passo 3 - pega as informações do produto clicado e adicionar no localStorage
        passo 4 - atualizar o contador do carrinho de compras
        passo 5 - renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho
    passo 1  - pegar o botão de deletar do html
    passo 2 - adicionar evento de escuta no botão
    passo 3 - remover o produto do localStorage
    passo 4 - atualizar o html do carrinho retirando o produto

Objetivo 3 - Atualizar os valores do carrinho
    passo 1 - pegar o input de quantidade do carrinho
    passo 2 - adicionar evento de escuta no input   
    passo 3 - atualizar o valor total do produto
    passo 4 - atualizar o valor total do carrinho

*/


document.querySelectorAll('.adicionar-ao-carrinho').forEach(btn => {
  btn.addEventListener('click', handleAdicionarAoCarrinho);
});

function handleAdicionarAoCarrinho(event) {
  const elementoProduto = event.target.closest('.produto');
  if (!elementoProduto) return;
  const produto = obterDadosProduto(elementoProduto);
  adicionarProdutoAoCarrinho(produto);
  atualizarCarrinhoETabela();
}

function obterDadosProduto(elementoProduto) {
  return {
    id: elementoProduto.dataset.id,
    nome: elementoProduto.querySelector('.nome').textContent,
    preco: parseFloat(
      elementoProduto.querySelector('.preco').textContent
        .replace('R$', '')
        .replace('.', '')
        .replace(',', '.')
    ),
    imagem: elementoProduto.querySelector('img').getAttribute('src'),
    quantidade: 1
  };
}

function adicionarProdutoAoCarrinho(produto) {
  const carrinho = obterProdutosDoCarrinho();
  const existente = carrinho.find(item => item.id === produto.id);
  if (existente) {
    existente.quantidade = (existente.quantidade || 1) + 1;
  } else {
    carrinho.push(produto);
  }
  salvarCarrinho(carrinho);
}


function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
  const produtos = localStorage.getItem('carrinho');
  return produtos ? JSON.parse(produtos) : [];
}

function atualizarContadorCarrinho() {
  const carrinho = obterProdutosDoCarrinho();
  const total = carrinho.reduce((soma, item) => soma + (item.quantidade || 1), 0);
  const contador = document.getElementById('contador-carrinho');
  if (contador) contador.textContent = total;
}

function removerDoCarrinho(produtoId) {
  const carrinho = obterProdutosDoCarrinho();
  const carrinhoAtualizado = carrinho.filter(item => item.id !== produtoId);
  salvarCarrinho(carrinhoAtualizado);
}

function renderizarTabelaCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const corpoTabela = document.querySelector('#modal-1-content table tbody');
  if (!corpoTabela) return;
  corpoTabela.innerHTML = '';
  produtos.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.imagem || './assets/images/camiseta_roxa.jpg'}" alt="${item.nome}" /></td>
      <td>${item.nome}</td>
      <td>R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
      <td><input type="number" value="${item.quantidade}" min="1" data-id="${item.id}" class="input-quantidade" /></td>
      <td><strong>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</strong></td>
      <td><button class="btn-deletar" data-id="${item.id}">Deletar</button></td>
    `;
    corpoTabela.appendChild(tr);
  });
}


function inicializarEventosTabelaCarrinho() {
  const corpoTabela = document.querySelector('#modal-1-content table tbody');
  if (!corpoTabela) return;

  corpoTabela.addEventListener('click', evento => {
    if (evento.target.classList.contains('btn-deletar')) {
      const id = evento.target.getAttribute('data-id');
      removerDoCarrinho(id);
      atualizarCarrinhoETabela();
    }
  });

  corpoTabela.addEventListener('input', evento => {
    if (evento.target.classList.contains('input-quantidade')) {
      const id = evento.target.getAttribute('data-id');
      let novaQuantidade = parseInt(evento.target.value, 10);
      if (isNaN(novaQuantidade) || novaQuantidade < 1) novaQuantidade = 1;
      atualizarQuantidadeProduto(id, novaQuantidade);
      atualizarCarrinhoETabela();
    }
  });
}

function atualizarQuantidadeProduto(produtoId, novaQuantidade) {
  const carrinho = obterProdutosDoCarrinho();
  const item = carrinho.find(item => item.id === produtoId);
  if (item) {
    item.quantidade = novaQuantidade;
    salvarCarrinho(carrinho);
  }
}


function atualizarTotalCarrinho() {
  const carrinho = obterProdutosDoCarrinho();
  const total = carrinho.reduce((soma, item) => soma + (item.preco * (item.quantidade || 1)), 0);
  const totalSpan = document.getElementById('total-carrinho');
  if (totalSpan) {
    totalSpan.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

function atualizarCarrinhoETabela() {
  atualizarContadorCarrinho();
  renderizarTabelaCarrinho();
  atualizarTotalCarrinho();
  inicializarEventosTabelaCarrinho();
}

// Inicialização
atualizarCarrinhoETabela();