document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('botao1').addEventListener('click',copiarokay)
    document.getElementById('botao2').addEventListener('click',pbokay)
    document.getElementById('botao3').addEventListener('click',pokay)
    document.getElementById('somar').addEventListener('click',somarokay)

    document.getElementById('botao4').addEventListener('click',listarokay)

});

function copiarokay(){
    let texto = document.getElementById('caixa1').value;
    document.getElementById('caixa2').value = texto;
}

function pbokay(){
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
}

function pokay(){
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
}

function somarokay(){
    let numero1 = Number(document.getElementById('numero1').value)
    let numero2 = Number(document.getElementById('numero2').value)
    let numero3 = numero1 + numero2

    document.getElementById('numero3').value = numero3
}

function listarokay(){
    let item = document.createElement('li')
    item.innerHTML= document.getElementById('caixa3').value
    document.body.appendChild(item)
}
