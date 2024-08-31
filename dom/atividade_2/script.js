document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('botaoErro').addEventListener('click', function () {

        exibirErro("mensagemErro", "erro ok")
        exibirErro("mensagemErro2", "erro fofo")
    })

    var botaoExibir = document.getElementById('botaoExibir')
    botaoExibir.addEventListener('click', exibirConteudo)

    document.getElementById("calcularEng").addEventListener("click", calcularEng)

    document.getElementById("botaoImg").addEventListener("click", mostrarImg)

    document.getElementById("fotos").addEventListener("change", mudarFoto)

    document.getElementById("enviarBtn").addEventListener("click", mostraRedes)

    document.getElementById("btnCriaSelect").addEventListener("click", criaSelect)

    document.getElementById("btnRemoveOption").addEventListener("click", removeOption)
})

function removeOption() {
    let hashtags = document.getElementById("hashtags");

    if (hashtags) {
        let selecionados = hashtags.selectedOptions;

        if (selecionados) {
            for (let selecionado of selecionados) {
                hashtags.removeChild(selecionado);
            }
        } else {
            exibirErro("erro", "Nenhuma hashtag selecionada!")
        }
    }
}

function criaSelect() {
    let hashtags = document.getElementById('hashtags').childNodes;

    let item = document.createElement('option')
    item.innerHTML = document.getElementById('hashtag').value.trim()

    if (hashtags.length == 5) {
        exibirErro("erro", "Número máximo de hashtags atingido!")
    } else if (hashtags.length == 0) {
        if (item.value.length == 0) {
            exibirErro("erro", "Hashtag vazia!")
        } else if (1 == item.value.length) {
            exibirErro("erro", "Hashtag com comprimento menor que 2 caracteres")
        } else {
            document.getElementById('hashtags').appendChild(item)
        }
    } else {
        for (let hashtag of hashtags) {
            if (item.value == hashtag.innerHTML) {
                exibirErro("erro", "Hashtag repetida!")
                break;
            } else if (item.value.length == 0) {
                exibirErro("erro", "Hashtag vazia!")
                break;
            } else if (1 == item.value.length) {
                exibirErro("erro", "Hashtag com comprimento menor que 2 caracteres")
                break;
            } else {
                document.getElementById('hashtags').appendChild(item)
                break;
            }
        }
    }

}

function mostraRedes() {
    var redes = document.getElementsByName('redesSociais');

    //var redesS = [];

    var redesS = "";

    for (let rede of redes) {
        if (rede.checked) {
            //redesS.push(rede);
            redesS += `${rede.defaultValue}<br/>`
        }
    }

    if (redesS.length > 0) {
        document.getElementById('redesSelecionadas').innerHTML = redesS;
    } else {
        exibirErro('redesSelecionadas', "Escolha pelo menos uma rede social!")
    }
}

function exibirErro(id, mensagem) {
    let elemento = document.getElementById(id)
    elemento.innerHTML = mensagem

    elemento.classList.remove("oculto")

    setTimeout(function () {
        elemento.classList.add('oculto');
    }, 3000)

}

function exibirConteudo() {
    let conteudo = document.getElementById('caixaDeTexto').value;

    conteudo.trim()
    if (!conteudo) {
        exibirErro("mensagemErro2", "campo vazio :c")
    }

    document.getElementById('conteudo').innerHTML = conteudo;
}

function calcularEng() {
    let qtdInteracoes = Number(document.getElementById("interacoes").value)
    let qtdVisualizacoes = Number(document.getElementById("visualizacoes").value)

    if (isNaN(qtdInteracoes) || isNaN(qtdVisualizacoes)) {
        exibirErro("erroSocial", "NAN valores invalidos :c")
        document.getElementById("resultadoEng").innerHTML = ""
        return
    }

    let resultado = qtdInteracoes / qtdVisualizacoes * 100

    document.getElementById("resultadoEng").innerHTML = resultado

}

function mostrarImg() {
    let imgEscolhida = document.getElementById("imagem")
    let imagemOK = imgEscolhida.files[0]

    let imagem = document.createElement("img")

    imagem.src = URL.createObjectURL(imagemOK)

    let resultado = document.getElementById("resultadoImg")

    resultado.appendChild(imagem)

}

function mudarFoto() {
    let div_imagem = document.getElementById('imgTop')

    let imagem_atual = document.createElement('img')

    div_imagem.innerHTML = ''
    imagem_atual.src = event.target.value
    div_imagem.appendChild(imagem_atual)
}