document.addEventListener('DOMContentLoaded', function(){

    var p1 = document.getElementById('texto');
    p1.innerHTML = 'Hello world';

    document.getElementById('btnHello').addEventListener('click', helloworld);
    document.getElementById('btnCopiar').addEventListener('click', copiar);
    document.getElementById('btnMudarCor').addEventListener('click', mudarCor);
});

function helloworld(){
    alert('Joiar')
}

function copiar(){
    let texto = document.getElementById('caixaTexto').value;
    document.getElementById('resultado2').innerHTML += texto + '<br>';
}

function mudarCor(){
    let cor = document.getElementById('inputCor').value;
    document.body.style.backgroundColor = cor;
}