
document.addEventListener('DOMContentLoaded', function() {
    // API de Conselhos
    document.getElementById('obter-conselho').addEventListener('click', function() {
        fetch('https://api.adviceslip.com/advice')
            .then(response => response.json())
            .then(data => {
                document.getElementById('conselho-saida').textContent = data.slip.advice;
            })
            .catch(error => console.error('Erro:', error));
    });

    // API de Imagem de Cachorro
    document.getElementById('obter-imagem-cachorro').addEventListener('click', function() {
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById('imagem-cachorro');
                img.src = data.message;
                img.style.display = 'block';
            })
            .catch(error => console.error('Erro:', error));
    });

    // API de Imagem da NASA
    document.getElementById('obter-imagem-nasa').addEventListener('click', function() {
        fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById('imagem-nasa');
                img.src = data.url;
                img.style.display = 'block';
                document.getElementById('descricao-nasa').textContent = data.explanation;
            })
            .catch(error => console.error('Erro:', error));
    });

    // API de Bandeira do País
    document.getElementById('obter-bandeira').addEventListener('click', function() {
        const nomePais = document.getElementById('nome-pais').value.trim();
        fetch(`https://restcountries.com/v3.1/name/${nomePais}`)
            .then(response => {
                if (!response.ok) throw new Error('País não encontrado');
                return response.json();
            })
            .then(data => {
                const img = document.getElementById('imagem-bandeira');
                let nomeNativo = document.getElementById('nome-nativo');
                img.src = data[0].flags.svg;
                img.style.display = 'block';
                nomeNativo.textContent = data[0].name.nativeName.por.official;
                document.getElementById('erro-bandeira').textContent = '';
            })
            .catch(error => {
                document.getElementById('erro-bandeira').textContent = 'País não encontrado. Por favor, tente novamente.';
                document.getElementById('imagem-bandeira').style.display = 'none';
                console.error('Erro:', error);
            });
    });
});
