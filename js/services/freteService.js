// js/services/freteService.js
import { obterProdutosDoCarrinho } from './carrinhoService.js';

async function calcularFrete(cep, botao) {
    botao.disabled = true;
    const textoOriginalBotao = botao.textContent;
    botao.textContent = 'Calculando frete...';

    const produtos = obterProdutosDoCarrinho();
    const pacotes = await obterPacotes();
    const products = produtos.map(produto => {
        const pacote = pacotes.find(pacote => pacote.id === (produto.id === "camiseta-roxa" ? 'camiseta-roxa' : 'caneca-branca'));
        return pacote ? { quantity: produto.quantidade, height: pacote.height, length: pacote.length, width: pacote.width, weight: pacote.weight } : null;
    }).filter(item => item !== null);

    try {
        const response = await fetch('https://n8n.srv830193.hstgr.cloud/webhook/19b686ff-18a0-49ae-adc1-d0373fb89e28', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cep: cep, products: products })
        });

        const data = await response.json();
        const valorFrete = data[0].price;
        const valorFormatado = valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.querySelector('#valor-frete .valor').textContent = valorFormatado;
        document.querySelector('#valor-frete').style.display = 'flex';

        const totalCarrinhoElement = document.querySelector("#total-carrinho");
        const valorTotalCarrinho = parseFloat(document.querySelector("#total-carrinho").textContent.replace("Total: R$ ", "").replace('.', ','));

        if (totalCarrinhoElement) {
            totalCarrinhoElement.textContent = `Total: R$ ${(valorTotalCarrinho + valorFrete).toFixed(2).replace('.', ',')}`;
        }
    } catch (error) {
        console.error('Erro ao enviar o CEP para o n8n:', error);
    } finally {
        botao.disabled = false;
        botao.textContent = textoOriginalBotao;
    }
}

async function obterPacotes() {
    try {
        const response = await fetch('./assets/json/pacotes.json');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Erro ao carregar pacotes.json:', error);
        return [];
    }
}

export { calcularFrete };