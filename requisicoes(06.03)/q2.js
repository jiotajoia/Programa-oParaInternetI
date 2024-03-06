import axios from 'axios'

async function getUrl(URL){
    try{
        const response = await axios.get(URL);
        console.log(response.config);
    } catch(error){
        console.log("Deu errado: ", error);
    }
}

getUrl('https://www.adorocinema.com/');