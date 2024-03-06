import axios from 'axios'
import fs from 'fs'

axios({
    method: "get",
    url: 'https://br.web.img3.acsta.net/c_150_200/pictures/23/12/12/15/59/2772653.jpg',
    responseType: "stream"
})
.then(function (response){
    response.data.pipe(fs.createWriteStream('imagem1.jpg'));
});