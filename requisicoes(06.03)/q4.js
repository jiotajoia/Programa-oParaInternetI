import axios from 'axios'
import Cheerio from 'cheerio'

async function getLinks(url) {
    try {
        const response = await axios.get(url);

        // Carrega o conteúdo HTML da página usando cheerio
        const html = Cheerio.load(response.data);

        // Encontra todos os elementos <a> na página
        const links = html('a');

        // Array para armazenar os valores dos links
        const linkValues = [];

        // Itera sobre os elementos <a> e adiciona os valores à lista
        links.each((element) => {
            linkValues.push(html(element).attr('href'));
        });

        return linkValues;
    } catch (error) {
        console.error('Erro ao obter a página:', error);
        return null;
    }
}

// Exemplo de uso
const url = 'https://www.adorocinema.com'; // Insira a URL desejada aqui
getLinks(url)
    .then(links => {
        if (links) {
            console.log('Links encontrados na página:');
            links.forEach(link => console.log(link));
        }
    })
    .catch(error => console.error('Erro ao realizar o parse da página:', error));
