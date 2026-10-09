const form = document.querySelector('#formCadastro');
const buscarCep = document.querySelector('#buscarCep');
const cep = document.querySelector('#cep');
const estado = document.querySelector('#estado');
const cidade = document.querySelector('#cidade');

function mensagem(texto, tipo = "sucesso") {
    Toastify({
        text: texto,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: tipo === "sucesso"
                ? " #198756"
                : " #dc3545"
        }
    }).showToast();
}

function adicionarOpcao(select, texto, valor) {
    if (!select) return;
    select.add(new Option(texto, valor));
}

async function carregarEstados() {
    try {
        cidade.disabled = true;
        const resposta = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');

        if (!resposta.ok) {
            throw new Error("Não foi possivel carregar os Estados.");
        }

        const estados = await resposta.json();
        estados.forEach(item => adicionarOpcao(estado, item.nome, item.sigla));
    } catch (erro) {
        mensagem(erro.message || 'Erro ao carregar os estados.', 'erro');
    }
}

//ouvir mudanças do estado para carregar as cidades
estado.addEventListener("change", async function () {
    cidade.replaceChildren(new Option("Carregando cidades...", ""));
    cidade.disabled = true;
    if(!estado.value){
        cidade.replaceChildren(new Option("Selecione o estado primeiro", ""));
        return;
    }
    try {
        const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.value}/municipios`);
        if (!resposta.ok){
            throw new Error("Não foi possivel carregar as cidades.");
            
        }
        const cidades = await resposta.json();
        cidade.replaceChildren(new Option("Selecione a Cidade."));
        cidades.forEach(item => adicionarOpcao(cidade, item.nome, item.nome));
        if(cidade.dataset.localidade) {
            cidade.value = cidade.dataset.localidade;
            delete cidade.dataset.localidade;                        
        }
        cidade.disabled = false;        
        
    } catch (error) {}
    
})

carregarEstados();

buscarCep.addEventListener('click', async function (event) {
    event.preventDefault();

    const valor = cep.value.replace(/\D/g, '');

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


