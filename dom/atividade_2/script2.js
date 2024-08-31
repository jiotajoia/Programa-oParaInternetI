document.addEventListener("DOMContentLoaded", function(){
    
})

function exibirErro(id, mensagem) {
    let elemento = document.getElementById(id)
    elemento.innerHTML = mensagem

    elemento.classList.remove("oculto")

    setTimeout(function () {
        elemento.classList.add('oculto');
    }, 3000)

}