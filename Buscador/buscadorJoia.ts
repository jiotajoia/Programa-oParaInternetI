import cheerio from 'cheerio';
import axios, {AxiosResponse} from 'axios';
import { question } from 'readline-sync';
import * as diacritics from 'diacritics';

let sites: Site[] = [];

//controle de pontos
let pntsPorLinksRecebidos: number = 20;
let pntsPorTermosBuscados: number = 5;
let pntsPorTagsH1: number = 15;
let pntsPorTagsH2: number = 10;
let pntsPorTagsP: number = 5;
let pntsPorTagsA: number = 2;
let pntsPorTagsMeta: number = 20;
let pntsPorTagTitle: number = 20;
let penalidadeAutoRef: number = -20;
let pntsPorDataAtual: number = 30;
let penalidadeFrescor: number = -5;

//pontos por paginas
class Site{
    nome: string= "";
    pntsLinksRecebidos: number = 0;
    pntsTermosBuscados: number = 0;
    pntsTags: number = 0;
    pntsAutoRef: number = 0;
    pntsFrescor: number = 0;
    pontuacaoFinal: number = 0;
    exibivel: boolean = false;
};

async function main(){
    let funcionalidade: number = -1;

    while(funcionalidade != 0){
        console.log(`\n>>>>>BUSCADOR JOIA<<<<<\n
Funcionalidades:
1- Realizar Busca
2- Alterar Pontuações
0- Sair\n`);
        
        funcionalidade = Number(question("Digite a funcionalidade de interesse: "));

        if(funcionalidade == 1){
            await buscador();
        }else if(funcionalidade == 2){
            painelDeControle();
        }
    }

    console.log("Fechando Buscador Joia...");
}

async function buscador(){
    sites = [];
    let linksProcurados: string[] = [];
    let profundidade: number = 0;
    let linkInicial = question('Digite o link inicial: ');
    let profundidadeMaxima = Number(question('Digite a profundidade máxima desejada: '));
    
    while (isNaN(profundidadeMaxima)){
        console.log("Valor invalido, digite novamente.");
        profundidadeMaxima = Number(question('Digite a profundidade máxima desejada: '));
    }

    let termoBuscado = question('Digite o termo que deseja buscar: ')

    await indexador(linkInicial, linksProcurados, profundidade, profundidadeMaxima ).then(linksProcurados => {})
    .catch(error => console.error('Erro: ', error));

    for (let link of linksProcurados){
        await minerarLink(link, termoBuscado,linksProcurados);
    }

    ranquearSites(sites);
}

function painelDeControle(){
    console.clear();
    let opcao: number;
    let valor: number;
    let menu = `Pontuação atual: 
    1- Pontos Por Links Recebido = ${pntsPorLinksRecebidos}
    2 - Pontos Por Termos Buscados = ${pntsPorTermosBuscados}
    3 - Pontos por tag <h1> = ${pntsPorTagsH1}
    4 - Pontos por tag <h2> = ${pntsPorTagsH2}
    5 - Pontos por tag <a> = ${pntsPorTagsA}
    6 - Pontos por tag <p> = ${pntsPorTagsP}
    7 - Pontos por tag <meta> = ${pntsPorTagsMeta}
    8 - Pontos por tag <title> = ${pntsPorTagTitle}
    9 - Pontos por data atual = ${pntsPorDataAtual}
    10 - Penalidade por autoreferência = ${penalidadeAutoRef}
    11 - Penalidade por frescor da página = ${penalidadeFrescor}
    12 - Restaurar valores padrões
    0 - Sair do Painel`;

    console.log(menu);
    opcao = Number(question("\nDigite a opção desejada: "));
    valor = Number(question("digite o novo valor de pontuação: "));

    while (opcao != 0){

        switch (opcao) {
            case 1:
                pntsPorLinksRecebidos = valor;
                break;
            case 2:
                pntsPorTermosBuscados = valor;
                break;
            case 3:
                pntsPorTagsH1 = valor;
                break;
            case 4:
                pntsPorTagsH2 = valor;
                break;
            case 5:
                pntsPorTagsA = valor;
                break;
            case 6:
                pntsPorTagsP = valor;
                break;
            case 7:
                pntsPorTagsMeta = valor;
                break;
            case 8:
                pntsPorTagTitle = valor;
                break;
            case 9:
                pntsPorDataAtual = valor;
                break;
            case 10:
                penalidadeAutoRef = valor;
                break;
            case 11:
                penalidadeFrescor = valor;
                break;
            case 12:
                pntsPorLinksRecebidos = 20;
                pntsPorTermosBuscados = 5;
                pntsPorTagsH1 = 15;
                pntsPorTagsH2 = 10;
                pntsPorTagsP = 5;
                pntsPorTagsA = 2;
                pntsPorTagsMeta = 20;
                pntsPorTagTitle = 20;
                penalidadeAutoRef = -20;
                pntsPorDataAtual = 30;
                penalidadeFrescor = -5;
                break
            default:
                break;
        }

        menu = `Pontuação atual: 
    1- Pontos Por Links Recebido = ${pntsPorLinksRecebidos}
    2 - Pontos Por Termos Buscados = ${pntsPorTermosBuscados}
    3 - Pontos por tag <h1> = ${pntsPorTagsH1}
    4 - Pontos por tag <h2> = ${pntsPorTagsH2}
    5 - Pontos por tag <a> = ${pntsPorTagsA}
    6 - Pontos por tag <p> = ${pntsPorTagsP}
    7 - Pontos por tag <meta> = ${pntsPorTagsMeta}
    8 - Pontos por tag <title> = ${pntsPorTagTitle}
    9 - Pontos por data atual = ${pntsPorDataAtual}
    10 - Penalidade por autoreferência = ${penalidadeAutoRef}
    11 - Penalidade por frescor da página = ${penalidadeFrescor}
    12 - Restaurar valores padrões
    0 - Sair do Painel`;
        console.clear();
        console.log(menu);
        opcao = Number(question("Digite a opção desejada: "));

        if(opcao == 0){
            console.clear();
            console.log('Saindo do Painel de controle...');
            let enter = question('')
            console.clear();
            break;
        }

        valor = Number(question("digite o novo valor de pontuação: "));
        console.clear();
    }    
}

function ranquearSites(sites: Site[]): void{
    let sitesExibiveis: Site[] = [];
    for(let site of sites){
        if(site.exibivel == true){
            sitesExibiveis.push(site);
        }
    }

    let sitesExibiveis1: Site[] =  sitesExibiveis;

    let sitesOrdenados: Site[] =  sitesExibiveis.sort((a, b) => {
        if(b.pontuacaoFinal == a.pontuacaoFinal){  //desempate
            if(b.pntsTermosBuscados == a.pntsTermosBuscados){
                if(b.pntsFrescor == a.pntsFrescor){
                    if(b.pntsLinksRecebidos == a.pntsLinksRecebidos){
                        return b.pntsLinksRecebidos - a.pntsLinksRecebidos;
                    }
                }else{
                    return b.pntsFrescor - a.pntsFrescor;
                }
            }else{
                return (b.pntsTermosBuscados) - (a.pntsTermosBuscados);
            }
        }
        return b.pontuacaoFinal - a.pontuacaoFinal;
    });
    
    mostraRank(sitesOrdenados);
}

function mostraRank(sitesRankeados: Site[]){
    let contador: number = 1;

    if(sitesRankeados[0] == null){
        console.log("\nNão foi encontrado nenhum resultado relacionado a sua busca.");
        return;
    }

    console.log("\n\n>>>>>>>> RANKING DOS SITES <<<<<<<<\n\n");

    console.log(`Você deseja mostrar o ranking detalhado ou simplificado?
    1 - RANKING SIMPLIFICADO
    2 - RANKING DETALHADO`);

    let opcao: number = Number(question('Digite a opção desejada: '));
    while (opcao > 2 || opcao < 1){
        console.log("digite uma opção válida");
        opcao = Number(question('Digite a opção desejada: '));
    }
    if(opcao == 1){
        for(let site of sitesRankeados){
            console.log(`\n${contador} lugar - ${site.nome}, ${site.pontuacaoFinal} pontos totais!!\n`);
            contador++;
        }
    }else if(opcao == 2){
        for(let site of sitesRankeados){
        console.log(`${contador} lugar -----`);
        console.log(`>>> Nome: ${site.nome} <<<\nPontos por Links Recebidos: ${site.pntsLinksRecebidos}\nPontos por Termos Buscados: ${site.pntsTermosBuscados}\nPontos por Tags: ${site.pntsTags}\nPontos por Autoreferência: ${site.pntsAutoRef}\nPontos por Frescor: ${site.pntsFrescor}\nPontuação Final: ${site.pontuacaoFinal}\n`);
        contador++;
        }
    }
    let enter: string = question("press <enter>");
}

async function minerarLink(Url:string, termoBuscado: string, links: string[]){//função para pegar um link e instanciar uma classe link  
    let siteAtual: Site = new Site();

    try{        
        //atribui pontuações para cada critério
        let response: AxiosResponse = await axios.get(Url);
        let data = cheerio.load(response.data);
        
        let contadorTermos: number|any = await obterQuantidades(Url,'body', termoBuscado);

        let contadorTermosH1: number|any = await obterQuantidades(Url,'h1',termoBuscado);
        let contadorTermosH2: number | any= await obterQuantidades(Url,'h2',termoBuscado);
        let contadorTermosP: number | any = await obterQuantidades(Url,'p', termoBuscado);
        let contadorTermosA: number | any = await obterQuantidades(Url,'a',termoBuscado);
        let contadorTermosMeta: number | any = await obterQuantidades(Url,'meta',termoBuscado);
        let contadorTermosTitle: number | any = await obterQuantidades(Url,'title', termoBuscado);

        let diferençaDeAnos: number | any = await obterDiferençaDeAnos(Url, 2024);

        let contadorLinksRecebidos: number | any = await obterQtdLinksRecebidos(Url, links);
        
        let contadorAutoref: number | any = await obterQtdAutoref(Url);
        //atualiza pontos para o site
        
        let nome = data('title').eq(0).text();
        siteAtual.nome = nome;

        siteAtual.pntsLinksRecebidos = contadorLinksRecebidos * pntsPorLinksRecebidos;
        
        siteAtual.pntsTermosBuscados = (pntsPorTermosBuscados * contadorTermos);

        siteAtual.pntsTags = (contadorTermosH1 * pntsPorTagsH1) +
        (contadorTermosH2 * pntsPorTagsH2) + (contadorTermosP * pntsPorTagsP) + (contadorTermosA * pntsPorTagsA) +
        (contadorTermosMeta * pntsPorTagsMeta) + (contadorTermosTitle * pntsPorTagTitle);
        
        if(contadorAutoref > 0){
            siteAtual.pntsAutoRef = (contadorAutoref * penalidadeAutoRef);
        }

        if(diferençaDeAnos == 0){
            siteAtual.pntsFrescor = 30;
        }else if(diferençaDeAnos > 0){
            siteAtual.pntsFrescor = diferençaDeAnos * penalidadeFrescor;
        }

        if(contadorTermos > 0 || contadorTermosMeta > 0 || contadorTermosTitle > 0){
            siteAtual.exibivel = true;
        }
       
        siteAtual.pontuacaoFinal = siteAtual.pntsLinksRecebidos + siteAtual.pntsFrescor + siteAtual.pntsAutoRef +
        siteAtual.pntsTags + siteAtual.pntsTermosBuscados;

        sites.push(siteAtual);
    }catch(error){
        console.error("Erro: ", error);
    }
}

async function obterQtdLinksRecebidos(url: string, links: string[]): Promise<any> {
    try{
        let contadorLinksRecebidos: number = 0;

        for(let link of links){
            if(link != url){
                let linksEncontrados: string[] | any =  await obterLinks(link);
                
                for(let link2 of linksEncontrados){
                    if(link2 == url){
                        contadorLinksRecebidos++;
                    }
                }
            }
        }

        return contadorLinksRecebidos;
    }catch(error){
        console.error(`Erro ao obter quantidade de apontamentos para a url ${url}: `, error);
    }
}

async function obterDiferençaDeAnos(url: string, anoAtual: number): Promise<any>{
    try{
        const response: AxiosResponse = await axios.get(url);
        const anchors = cheerio.load(response.data);

        const paragrafosData = anchors('p').eq(0).text();
        const anoPublicacao = Number(paragrafosData.split('/')[2]);
        const diferençaDeAnos = anoAtual - anoPublicacao;

        return diferençaDeAnos;
    } catch(error){
        console.error("Erro ao obter frescor da página: ", error);
    }
}

async function obterQtdAutoref(url: string): Promise<any>{
    try{
        let autorefEncontrados: string[] | any = await obterLinks(url);
        
        let contadorAutoref: number = 0;
        for(let autoref of autorefEncontrados){
            if(autoref == url){
                contadorAutoref++;
            }
        }
            
        return contadorAutoref;   
    }catch(error){
        console.error(`Ocorreu um erro ao obter quantidade de autoreferências para a url ${url}:, error`);
    }
}

async function obterQuantidades(url: string, tagDesejada: string, termoBuscado: string): Promise<any>{ 
    try{
        const response: AxiosResponse = await axios.get(url);
        const data = cheerio.load(response.data);        
        let contador: number = 0;
        const termoNormalizado = normalizeTermo(termoBuscado);

        if(tagDesejada == 'meta'){
            data(tagDesejada).each((index, element) => {
                // Extrai o conteúdo do atributo 'content'
                let content = data(element).attr('content');

                if(content){
                    let contentNormalizado: string[] = normalizeTermo(content).split(/\s+/);

                    for (let i = 0; i < contentNormalizado.length; i++) {

                        let palavraAtual: string = contentNormalizado[i];

                        if (palavraAtual[palavraAtual.length -1] == ',' || palavraAtual[palavraAtual.length -1] ==  '!' ||
                         palavraAtual[palavraAtual.length -1] == '.' || palavraAtual[palavraAtual.length -1] == ';' || palavraAtual[palavraAtual.length -1] == ':' || palavraAtual[palavraAtual.length -1] == '?'){
                            let palavraArray: string[] = palavraAtual.split("");
                            palavraArray.pop();
                            palavraAtual = palavraArray.join("");
                        }

                        if (palavraAtual == termoNormalizado) {
                            contador++;
                        }
                    }
                }
            });
        }

        data(tagDesejada).each((index, element) => {
            let texto = data(element).text();
            let palavrasTexto: string[] = texto.split(/\s+/);

            for (let i = 0; i < palavrasTexto.length; i++){
                let palavraNormalizada = normalizeTermo(palavrasTexto[i]);

                if (palavraNormalizada[palavraNormalizada.length -1] == ',' || palavraNormalizada[palavraNormalizada.length -1] ==  '!' ||
                    palavraNormalizada[palavraNormalizada.length -1] == '.' || palavraNormalizada[palavraNormalizada.length -1] == ';' ||
                    palavraNormalizada[palavraNormalizada.length -1] == ':' || palavraNormalizada[palavraNormalizada.length -1] == '?'){
                            let palavraArray: string[] = palavraNormalizada.split("");
                            palavraArray.pop();
                            palavraNormalizada = palavraArray.join("");
                        }
                if (palavraNormalizada == termoNormalizado){
                    contador++;
                }
            }
        })
        
        return contador;
    }catch(error){
        console.error(`Erro ao obter valores em tag na url ${url}: `, error);
    }
}

async function obterLinks(url: string): Promise<any>{
    try{
        const response: AxiosResponse = await axios.get(url);
        const anchors = cheerio.load(response.data);
        
        let linksEncontrados: string[] = [];

        anchors('a').each((index, element) => {
            let href: string | undefined = anchors(element).attr('href');
        
            if(href){
                const urlCompleta = new URL(href, url).href;
                linksEncontrados.push(urlCompleta);
            }
        })

        return linksEncontrados;
    } catch(error){
        console.error(`Erro ao obter links da url: ${url}, error`);
    }
}

function normalizeTermo(termo: string) {
    return diacritics.remove(termo).toLowerCase();
}

async function indexador(url: string, visitado: string[], profundidade: number, profundidadeMaxima: number): Promise<any> {
    if (profundidade > profundidadeMaxima || visitado.includes(url)){
        return; // Se atingir a profundidade máxima, retorna
    }

    console.log(`Indexando: ${url}`);

    try {
        const resposta: AxiosResponse = await axios.get(url);
        const anchors = cheerio.load(resposta.data);

        const links: string[] = [];
        
        anchors('a').each((_, element) => {
            const href = anchors(element).attr('href');
            if (href && !href.startsWith('#')) {
                links.push(href);
            }
        });

        visitado.push(url);

        for (const link of links) {
            const absoluteURL = new URL(link, url).href;
            await indexador(absoluteURL, visitado, profundidade + 1, profundidadeMaxima);
        }

        return visitado;
    }catch(error){
        console.error(`Erro ao indexar ${url}: ${error}`);
    }
}

main()
//necessário para resolução da segunda questão - linha do tempo  100% V

//informar o termo  V
//informar o site inicial  V
//armazenar o site inicial   V
//ler o site inicial e extrair suas pontuaçoes   V
//verificar os links dentro do site e os adicionar no array, caso eles ja nao estejam adicionados   V
//para cada um, realizar toda a pontuação   V
//a partir das pontuações totais, realizar um ranking mostrando os sites   V
//perguntar se quer ranking detalhado    V
//caso sim, mostrar as pontuaçoes detalhadas dos sites   V
//necessário para resolução da segunda questão - linha do tempo    V
//não esquecer de mudar os nomes das variaveis do objeto e de impedir de mostrar caso exibivel falso   V