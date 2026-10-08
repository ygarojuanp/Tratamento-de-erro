const form = document.querySelector('#formCadastro');

//ouvir eventos
form.addEventListener("submit", function(event){
    event.preventDefault();
    console.log(Object.fromEntries([...form.elements].filter(Element => Element.id).map( Element => [Element.id, Element.value])));
});
