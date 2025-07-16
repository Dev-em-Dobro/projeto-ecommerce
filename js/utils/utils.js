export function validarCep(cep) {
	const regexCep = /^[0-9]{5}-?[0-9]{3}$/;
	return regexCep.test(cep);
}