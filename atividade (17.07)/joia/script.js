// // selecione o botão usando o método getElementById
// var botao = document.getElementById("botao");

// //adicione um evento de clique ao botão
// botao.addEventListener("click", function(){
//     //selecione o paragrafo usando o metodo getElementById
//     var paragrafo = document.getElementById("paragrafo");

//     //altere o texto do paragrafo
//     paragrafo.textContent = "O texto desse parágrafo foi alterado!";
// });

document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('botao').addEventListener('click',alteraTexto)
    document.getElementById('btn_limpar').addEventListener('click',limpaParagrafo)

});

function alteraTexto(){
    var paragrafo = document.getElementById("paragrafo");

    paragrafo.textContent = "O texto desse parágrafo foi alterado!"
}

function limpaParagrafo(){
    var paragrafo = document.getElementById("paragrafo");

    paragrafo.textContent = ""
}

