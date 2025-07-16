import { obterProdutosDoCarrinho, salvarProdutosNoCarrinho, atualizarCarrinhoETabela, removerProdutoDoCarrinho } from "./services/carrinhoService.js";
import { calcularFrete } from "./services/freteService.js";
import { validarCep } from "./utils/utils.js";

atualizarCarrinhoETabela();

const botoesAdicionarAoCarrinho = document.querySelectorAll(".adicionar-ao-carrinho");
botoesAdicionarAoCarrinho.forEach(botao => {
	botao.addEventListener("click", evento => {
		const elementoProduto = evento.target.closest(".produto");
		const id = elementoProduto.dataset.id;
		const nome = elementoProduto.querySelector(".nome").textContent;
		const imagem = elementoProduto.querySelector("img").getAttribute("src");
		const preco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

		const carrinho = obterProdutosDoCarrinho();
		const produtoNoCarrinho = carrinho.find(item => item.id === id);

		if (produtoNoCarrinho) {
			produtoNoCarrinho.quantidade += 1;
		} else {
			carrinho.push({ id, nome, imagem, preco, quantidade: 1 });
		}

		salvarProdutosNoCarrinho(carrinho);
		atualizarCarrinhoETabela();
	});
});

const corpoTabela = document.querySelector("#modal-1-content table tbody");

corpoTabela.addEventListener("click", evento => {
	if (evento.target.classList.contains("btn-remover")) {
		const id = evento.target.dataset.id;
		removerProdutoDoCarrinho(id);
		atualizarCarrinhoETabela();
	}
});

corpoTabela.addEventListener("input", evento => {
	if (evento.target.classList.contains("input-quantidade")) {
		const id = evento.target.dataset.id;
		let novaQuantidade = parseInt(evento.target.value);
		if (isNaN(novaQuantidade) || novaQuantidade < 1) {
			novaQuantidade = 1;
			evento.target.value = 1;
		}
		const carrinho = obterProdutosDoCarrinho();
		const produto = carrinho.find(item => item.id === id);
		if (produto && produto.quantidade !== novaQuantidade) {
			produto.quantidade = novaQuantidade;
			salvarProdutosNoCarrinho(carrinho);
			atualizarCarrinhoETabela();
		}
	}
});

const btnCalcularFrete = document.getElementById("btn-calcular-frete");
const inputCep = document.getElementById("input-cep");

inputCep.addEventListener("keydown", evento => {
	if (evento.key === "Enter") {
		btnCalcularFrete.click();
	}
});

btnCalcularFrete.addEventListener("click", async () => {
	const cep = inputCep.value.trim();
	const erroCep = document.querySelector(".erro");
	if (!validarCep(cep)) {
		erroCep.textContent = "CEP inválido.";
		erroCep.style.display = "block";
		return;
	} else {
		erroCep.style.display = "none";
	}

	const valorFrete = await calcularFrete(cep, btnCalcularFrete);
	const freteFormatado = valorFrete.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
	document.querySelector("#valor-frete .valor").textContent = freteFormatado;
	document.querySelector("#valor-frete").style.display = "flex";

	const elementoTotalCarrinho = document.querySelector("#total-carrinho");
	const valorTotalCarrinho = parseFloat(elementoTotalCarrinho.textContent.replace("Total: R$ ", "").replace(".", ",").replace(",", "."));

	const totalComFrete = valorTotalCarrinho + valorFrete;
	const totalComFreteFormatado = totalComFrete.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
	elementoTotalCarrinho.textContent = `Total: R$ ${totalComFreteFormatado}`;
});
