const form = document.querySelector('#formCadastro');
const buscarCep = document.querySelector('#buscarCep');
const cep = document.querySelector('#cep');
const estado = document.querySelector('#estado');

function mensagem(texto, tipo = "sucesso") {
    Toastify({
        text: texto,
        duration: 3000,
        gravity: "top",
        position: "rigth",
        style: {
            background: tipo === "sucesso"
            ? " #198756"
            : " #dc3545"
        }
    }).showToast();
}


// criar opções de seleção dinamicamnete
function adicionarOpcao(select, texto, valor){
    select.add(new Option(texto, valor));
}
// carregar os estados

async function carregarEstados() {
    try {
        const resposta = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        if (!resposta.ok) {
            throw new Error("Não foi possivel carregar os Estados.");
        }
        const estados = await resposta.json();
        estados.forEach(item => adicionarOpcao(estado, item.nome, item.sigla));
    } catch (erro) {}
}

carregarEstados();

// ouvir evento de click do buscarCep
buscarCep.addEventListener("click", async function () {
    // expressão regex: aceita apenas numeros, e o replace substitui o que não for numero por espaço vazio
    const valor = cep.value.replace(/\D/g, "");
    if (valor.length !== 8) {
        mensagem("Por favor, digite um CEP válido com 8 dígitos.", "erro");
        return;
    } try {
        const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
        const dados = await resposta.json();
        console.log(dados);
        if (!resposta.ok || dados.erro) throw new Error("CEP não encontrado");
        document.querySelector('#logradouro').value = dados.logradouro;
        document.querySelector('#bairro').value = dados.bairro;
        document.querySelector('#estado').value = dados.estado;
        document.querySelector('#cidade').value = dados.localidade;
        mensagem("endereço encontrado!");

    } catch (erro) {
        mensagem(erro.mensagem, "erro");
    }
    
});

//ouvir eventos
form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(Object.fromEntries([...form.elements].filter(Element => Element.id).map(Element => [Element.id, Element.value])));
    
    form.reset();
});


