const form = document.getElementById('meuForm');
const inputNome = document.getElementById('nome');
const resultado = document.getElementById('resultado');
const botao = document.getElementById('botao');


inputNome.addEventListener('keyup', validarCampo)

function validarCampo() {
    // tira os espaços do início e do fim do texto
    const nome = inputNome.value.trim();

    resultado.classList.remove('erro');
    inputNome.classList.remove('input-erro');

    if (nome === '') {
        botao.disabled = true;
        return;
    }
    // regex q verifica se o nome só tem letras, 
    if (!/^[A-Za-zÀ-ÿ]+$/.test(nome)) {
         resultado.innerText = 'Digite apenas letras.';
         resultado.classList.add('erro');
         inputNome.classList.add('input-erro');
         botao.disabled = true;
         return;
    }
    resultado.innerText = '';

    botao.disabled = false;
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    // remove novamente os espaços antes de enviar para a API,
    // pois o trim da função validarCampo() não altera o valor original do input
    const nome = inputNome.value.trim();

    buscarNome(nome);
});
 


async function buscarNome(nome) {
    const resultado = document.getElementById('resultado');
    const url = `https://api.nationalize.io/?name=${nome}`;

    try {
        // buscar os dados
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.country.length === 0) {

            resultado.innerText = "Nenhum resultado encontrado.";
            return;

        }
        resultado.innerText = '';
        // busca o primeiro índice da lista do json, que é o país com maior probabilidade
        const siglaPais = dados.country[0].country_id;
        // formata a probabilidade, com duas casas decimais e vezes 100 para porcentagem
        const probabilidade = (dados.country[0].probability * 100).toFixed(2);

        // forma do javascript
        const pais = new Intl.DisplayNames(
            ['pt-BR'],
            { type: 'region' }
        ).of(siglaPais);
        

        //outra api,para transformar em nome normal
        // const respostaPais = await fetch(`https://restcountries.com/v3.1/alpha/${siglaPais}`);

        // const dadosPais = await respostaPais.json();
        // const pais = dadosPais[0].name.common;


        resultado.innerText =
            `País mais provável: ${pais} (${probabilidade}%)`;

    } catch (erro) {
        resultado.innerText = "Erro ao buscar dados.";
        console.error(erro);
    }

}