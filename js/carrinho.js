// js/carrinho.js
import { adicionarProdutoAoCarrinho, removerProdutoDoCarrinho, obterProdutosDoCarrinho, salvarProdutosNoCarrinho, atualizarCarrinhoETabela } from './services/carrinhoService.js';
import { calcularFrete } from './services/freteService.js';
import { validarCep } from './utils/cepUtils.js';

const botoesAdicionarAoCarrinho = document.querySelectorAll(".adicionar-ao-carrinho");
const corpoTabela = document.querySelector("#modal-1-content table tbody");
const botaoCalcularFrete = document.getElementById('btn-calcular-frete');
const inputCep = document.getElementById('input-cep');

// Event listeners e lógica do carrinho
botoesAdicionarAoCarrinho.forEach(botao => {
	botao.addEventListener("click", evento => {
		const { produtoId, produtoNome, produtoImagem, produtoPreco } = obterDadosDoProduto(evento);

		adicionarProdutoAoCarrinho(produtoId, produtoNome, produtoImagem, produtoPreco);
		atualizarCarrinhoETabela();
	});
});

corpoTabela.addEventListener("click", evento => {
	if (evento.target.classList.contains("btn-remover")) {
		const id = evento.target.dataset.id;
		removerProdutoDoCarrinho(id);
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
		const produtos = obterProdutosDoCarrinho();
		const produto = produtos.find(produto => produto.id === id);
		if (produto && produto.quantidade !== novaQuantidade) {
			produto.quantidade = novaQuantidade;
			salvarProdutosNoCarrinho(produtos);
			atualizarCarrinhoETabela();
		}
	}
});

// Lógica de cálculo de frete
botaoCalcularFrete.addEventListener('click', async () => {
	const cep = inputCep.value;
	const erroSpan = document.getElementById('cep-erro');
	const mensagemErro = validarCep(cep);

	if (mensagemErro) {
		erroSpan.textContent = mensagemErro;
		erroSpan.style.display = 'block';
		return;
	}
	erroSpan.textContent = '';
	erroSpan.style.display = 'none';

	await calcularFrete(cep, botaoCalcularFrete);
});

inputCep.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		botaoCalcularFrete.click();
	}
});

atualizarCarrinhoETabela();

function obterDadosDoProduto(evento) {
	const produtoId = evento.target.closest(".produto").dataset.id;
	const produtoNome = evento.target.closest(".produto").querySelector(".nome").textContent;
	const produtoImagem = evento.target.closest(".produto").querySelector("img").getAttribute("src");
	const produtoPreco = parseFloat(evento.target.closest(".produto").querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));
	return { produtoId, produtoNome, produtoImagem, produtoPreco };
}
