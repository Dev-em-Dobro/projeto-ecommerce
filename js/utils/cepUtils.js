// js/utils/cepUtils.js
function validarCep(cep) {
    const cepNumeros = cep.replace(/\D/g, '');

    if (!cepNumeros) {
        return 'Por favor, informe um CEP válido.';
    }
    if (cepNumeros.length !== 8) {
        return 'O CEP deve conter exatamente 8 números.';
    }
    return '';
}

export { validarCep };