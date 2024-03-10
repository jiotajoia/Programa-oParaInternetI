import axios from 'axios'
import Cheerio from 'cheerio'

async function MostraOcorrencias(url, word) {
    try {
        const response = await axios.get(url);

        const html = Cheerio.load(response.data);

        const pageText = html('body').text();

        // expressão regular para encontrar todas as ocorrências da palavra
        const regex = new RegExp(`(?:\\W|^)(${word})(?:\\W|$)`, 'gi');
        let match;
        let occurrences = [];

        while ((match = regex.exec(pageText)) !== null) {
            const startIndex = Math.max(0, match.index - 20); //conta os caracteres antes
            const endIndex = Math.min(pageText.length, match.index + match[0].length + 20); //aqui os depois

            occurrences.push(pageText.substring(startIndex, endIndex));
        }

        return occurrences;
    } catch (error) {
        console.error('Erro ao obter a página:', error);
        return null;
    }
}

const url = 'https://pt.wikipedia.org/wiki/Twice';
const word = 'Momo';

MostraOcorrencias(url, word)
    .then(occurrences => {
        console.log(`ocorrências para '${word}'`);
        occurrences.forEach((c, index) => {
            console.log(`Ocorrência ${index + 1}: `)
            console.log(c);
        });
    })
    .catch(error => console.error('Erro ao realizar o parse da página:', error));
