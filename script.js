const form = document.querySelector('#formCadastro');
const buscarCep = document.querySelector('#buscarCep');
const cep = document.querySelector('#cep');

// ouvir evento de click do buscarCep
buscarCep.addEventListener("click", async function(){
    // expressão regex: aceita apenas numeros, e o replace substitui o que não for numero por espaço vazio
    const valor = cep.value.replace(/\D/g, "");
    if(valor.length !== 8) {
        alert("Digite um CEP valido");
        return
    } try{
        const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
        const dados = await resposta.json();
        console.log(dados);
        if(!resposta.ok || dados.erro) throw new Error("CEP não encontrado");
        document.querySelector('#logradouro').value = dados.logradouro;
        document.querySelector('#bairro').value = dados.bairro;
        document.querySelector('#estado').value = dados.estado;
        document.querySelector('#cidade').value = dados.localidade;
        alert("endereço encontrado!");
    
    } catch(erro) {
        alert(erro, "erro");
    }

});

//ouvir eventos
form.addEventListener("submit", function(event){
    event.preventDefault();
    console.log(Object.fromEntries([...form.elements].filter(Element => Element.id).map( Element => [Element.id, Element.value])));

    form.reset();
});

