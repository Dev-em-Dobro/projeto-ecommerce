
export function salvarProdutosNoCarrinho(carrinho) {
	localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

export function obterProdutosDoCarrinho() {
	const produtos = localStorage.getItem("carrinho");
	return produtos ? JSON.parse(produtos) : [];
}

function atualizarContadorCarrinho() {
	const produtos = obterProdutosDoCarrinho();
	let total = 0;

	produtos.forEach(produto => {
		total += produto.quantidade;
	});

	document.getElementById("contador-carrinho").textContent = total;
}

function renderizarTabelaDoCarrinho() {
	const produtos = obterProdutosDoCarrinho();
	const corpoTabela = document.querySelector("#modal-1-content table tbody");

	corpoTabela.innerHTML = produtos
		.map(
			produto => `
		<tr>
			<td class="td-produto">
				<img src="${produto.imagem}" alt="${produto.nome}" />
			</td>
			<td>${produto.nome}</td>
			<td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
			<td class="td-quantidade">
				<input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1" />
			</td>
			<td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
			<td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td>
		</tr>
	`
		)
		.join("");
}


export function removerProdutoDoCarrinho(id) {
	const carrinhoAtualizado = obterProdutosDoCarrinho().filter(produto => produto.id !== id);
	salvarProdutosNoCarrinho(carrinhoAtualizado);
	atualizarCarrinhoETabela();
}

function atualizarValorTotalCarrinho() {
	const produtos = obterProdutosDoCarrinho();
	const total = produtos.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);
	document.querySelector("#total-carrinho").textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
	document.querySelector("#subtotal-pedidos .valor").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

export function atualizarCarrinhoETabela() {
	atualizarContadorCarrinho();
	renderizarTabelaDoCarrinho();
	atualizarValorTotalCarrinho();
}