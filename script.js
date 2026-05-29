const form = document.getElementById('meuForm');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    buscarNome(nome);
});

async function buscarNome(nome) {
    const resultado = document.getElementById('resultado');
    const url = `https://api.nationalize.io/?name=${nome}`;

    try {

        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.country.length === 0) {

            resultado.innerText = "Nenhum resultado encontrado.";
            return;

        }

        const siglaPais = dados.country[0].country_id;
        const probabilidade = (dados.country[0].probability * 100).toFixed(2);

        //outra api,para transformar em nome normal
        const respostaPais = await fetch(`https://restcountries.com/v3.1/alpha/${siglaPais}`);

        const dadosPais = await respostaPais.json();
        const pais = dadosPais[0].name.common;


        resultado.innerText =
            `País mais provável: ${pais} (${probabilidade}%)`;

    } catch (erro) {
        resultado.innerText = "Erro ao buscar dados.";
        console.error(erro);
    }
}