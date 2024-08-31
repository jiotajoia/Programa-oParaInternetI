document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('botao1').addEventListener('click',copiarokay)
    document.getElementById('botao2').addEventListener('click',pbokay)
    document.getElementById('botao3').addEventListener('click',pokay)
    document.getElementById('somar').addEventListener('click',somarokay)

    document.getElementById('botao4').addEventListener('click',listarokay)

    document.getElementById('botao5').addEventListener('click', aumentarok)
    document.getElementById('botao6').addEventListener('click', diminuirok)

    document.getElementById('calcular').addEventListener('click', calculadora)

    document.getElementById('botao7').addEventListener('click', selectok)
});

function selectok(){
    let item = document.createElement('option')
    item.innerHTML= document.getElementById('caixa4').value
    document.getElementById('select1').appendChild(item)
}

function calculadora(){
    var operacoes = document.getElementsByName('operacao');

    var operacaoR;

    for(let operacao of operacoes){
        if(operacao.checked){
            operacaoR = operacao;
            break;
        }
    }

    if (operacaoR){

        let resultado;

        let numero1 = Number(document.getElementById('numero4').value)
        let numero2 = Number(document.getElementById('numero5').value)

        switch(operacaoR.id){
            case "adicao":
                resultado = numero1 + numero2;
                break;
            case "subtracao":
                resultado = numero1 - numero2;
                break;
            case "multiplicacao":
                resultado = numero1 * numero2;
                break;
            case "divisao":
                resultado = numero1 / numero2;
                break;
        }

        document.getElementById("resultado").innerHTML = resultado;
    }
}

function aumentarok(){
    var style = window.getComputedStyle(document.querySelector('body'));
    
    var tamanhoAtual = style.fontSize.replace('px','').trim();
    
    var tamanho = Number(tamanhoAtual) + 1;

    document.body.style.fontSize = `${tamanho}px`

    document.getElementById('teste').innerHTML = `${tamanho}`;
}

function diminuirok(){    
    var style = window.getComputedStyle(document.querySelector('body'));
    
    var tamanhoAtual = style.fontSize.replace('px','').trim();
    
    var tamanho = Number(tamanhoAtual) - 1;

    document.body.style.fontSize = `${tamanho}px`

    document.getElementById('teste').innerHTML = `${tamanhoAtual}`;
}

function copiarokay(){
    let texto = document.getElementById('caixa1').value;

    document.getElementById('caixa2').value = texto.toUpperCase();
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