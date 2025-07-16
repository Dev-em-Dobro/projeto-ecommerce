import { obterProdutosDoCarrinho } from './carrinhoService.js';

export async function calcularFrete(cep, btnCalcularFrete) {
	btnCalcularFrete.disabled = true;
	const textoOriginalDoBotaoDeFrete = btnCalcularFrete.textContent;
	btnCalcularFrete.textContent = "Calculando frete...";

	const url = "https://robertodias.app.n8n.cloud/webhook/f5282aac-8835-41e2-aefc-06545890bcf2";
	try {
		const medidasResponse = await fetch("./js/medidas-produtos.json");
		const medidas = await medidasResponse.json();

		const produtos = obterProdutosDoCarrinho();
		const products = produtos.map(produto => {
			const medida = medidas.find(m => m.id === produto.id);
			return {
				quantity: produto.quantidade,
				height: medida ? medida.height : 4,
				length: medida ? medida.length : 30,
				width: medida ? medida.width : 25,
				weight: medida ? medida.weight : 0.25,
			};
		});

		const resposta = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ cep, products }),
		});
		if (!resposta.ok) throw new Error("Erro ao calcular frete");
		const resultado = await resposta.json();
		return resultado.price;
	} catch (erro) {
		console.error("Erro ao calcular frete:", erro);
		return null;
	} finally {
		btnCalcularFrete.disabled = false;
		btnCalcularFrete.textContent = textoOriginalDoBotaoDeFrete;
	}
}