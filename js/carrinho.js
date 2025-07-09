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
    passo 5 - atualizar o valor

Objetivo 3 - Atualizar os valores do carrinho
    passo 1 - pegar o input de quantidade do carrinho
    passo 2 - adicionar evento de escuta no input  
    passo 3 - atualizar o valor total do produto
    passo 4 - atualizar o valor total do carrinho
*/

/* parte 1 - vamos adicionar +1 no icone do carrinho
    passo 1 - pegar os botões de adicionar ao carrinho do html
*/
const botoesAdicionarAoCarrinho = document.querySelectorAll(".adicionar-ao-carrinho");

//passo 2 - adicionar uma evento de escuta nesses botões pra quando clicar disparar uma ação!
botoesAdicionarAoCarrinho.forEach(btn => {
	btn.addEventListener("click", function (event) {
		// passo 3 - pega as informações do produto clicado e adicionar no localStorage
		// Encontra o elemento do produto mais próximo
		const produtoElemento = btn.closest(".produto");

		// Pega as informações do produto
		const id = produtoElemento.getAttribute("data-id");
		const nome = produtoElemento.querySelector(".nome").textContent;
		const preco = parseFloat(produtoElemento.querySelector(".preco").textContent.replace("R$ ", "").replace(",", "."));
		const imagem = produtoElemento.querySelector("img").getAttribute("src");

		const carrinho = obterProdutosDoCarrinho();
		const existente = carrinho.find(produto => produto.id === id);

		if (existente) {
			existente.quantidade += 1;
		} else {
			carrinho.push({
				id: id,
				nome: nome,
				preco: preco,
				imagem: imagem,
				quantidade: 1,
			});
		}

		localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarContadorDoCarrinho();
	});
});

// passo 4 - atualizar o contador do carrinho de compras
function atualizarContadorDoCarrinho() {
    const carrinho = obterProdutosDoCarrinho();
    let total = 0;

    for (const produto of carrinho) {
        total += produto.quantidade;
    }

    document.getElementById("contador-carrinho").textContent = total;
}


atualizarContadorDoCarrinho();

function obterProdutosDoCarrinho() {
	const produtos = localStorage.getItem("carrinho");

	return produtos ? JSON.parse(produtos) : [];
}
