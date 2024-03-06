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
            const startIndex = Math.max(0, match.index - 10);
            const endIndex = Math.min(pageText.length, match.index + match[0].length + 10);

            occurrences.push(pageText.substring(startIndex, endIndex));
        }

        return occurrences;
    } catch (error) {
        console.error('Erro ao obter a página:', error);
        return null;
    }
}

const url = 'https://www.adorocinema.com/'; 
const word = 'filme';

MostraOcorrencias(url, word)
    .then(occurrences => {
        if (occurrences) {
            console.log(`Ocorrências da palavra "${word}" na página: `);
            occurrences.forEach((occurrence, index) => {
                console.log(`Ocorrência ${index + 1} :`);
                console.log(occurrence);
            });
        }
    })
    .catch(error => console.error('Erro ao realizar o parse da página:', error));
