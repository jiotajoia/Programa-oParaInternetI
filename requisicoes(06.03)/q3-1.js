import axios from 'axios'
import fs from 'fs'

async function getImage(URL){
    try{
        const response = await axios.get(URL, {responseType: 'stream'});
        response.data.pipe(fs.createWriteStream('imagem2.jpg'))
    } catch(error){
        console.log("Deu errado: ", error);
    }
}

getImage('https://br.web.img3.acsta.net/c_150_200/pictures/24/02/15/22/36/1349695.jpg');