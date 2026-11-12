// Contantes de elementos que vamos interagir
const selectedUf = document.getElementById('uf');
const inputCidade = document.getElementById('cidade');
const inputRua = document.getElementById('rua');
const btnBuscar = document.getElementById('btnBuscar');
const divMensagem = document.getElementById('mensagem');
const divResultado = document.getElementById('resultado');

const containerLista = document.getElementById('listaResultados');

//adicionando os eventos nos componentes

btnBuscar.addEventListener('click', buscarEndereco);

[selectedUf, inputCidade, inputRua].forEach(campo => {
    campo.addEventListener('keypress', (tecla) => {
        if (tecla.key === 'Enter'){
            buscarEndereco();
            } 
        }
    );
});

async function buscarEndereco() {
    const valorUf = selectedUf.value.trim();
    const valorCidade = inputCidade.value.trim();
    const valorRua = inputRua.value.trim();

    esconderElementos(divMensagem);
    divResultado.classList.remove('oculto');
    containerLista.innerHTML = '';

    //validações do cep
    if(!valorUf){
        mostrarMensagem('Por favor, selecione o estado (UF)','erro');
        selectedUf.focus();
        return;
    }

    if(valorCidade.lenght < 3){
        mostrarMensagem('por favor, informe a cidade com no mínimo 3 caracteres', 'erro');
        inputCidade.focus();
        return;
    }

    if (valorRua.lenght < 3){
        mostrarMensagem('por favor, informe rua/logradouro com no mínimo 3 caracteres', 'erro');
        inputRua.focus();
        return;
    }

    

    mostrarMensagem('buscando endereço...', 'info');


    try{

        const cidadeFormatada = encodeURIComponent(valorCidade);
        const ruaFormatada =  encodeURIComponent(valorRua);


        // montando a url para requisição 
        const url = `https://viacep.com.br/ws/${valorUf}/${cidadeFormatada}/${ruaFormatada}/json/`;
        const resposta = await fetch(url);
        

        if(!resposta.ok){
            throw new Error('Falha na requisição. Código de status: ${resposta.status}');
        }

        const enderecos = await resposta.json();

        if(!Array.isArray(enderecos) || enderecos.length === 0){
            mostrarMensagem('nenhum cep/endereço encontrado para os dados informados.','erro');
            return; 
        }

        enderecos.forEach((itemEndereco) => {
            const card = document.createElement('div');
            card.className = 'item-endereco';

            card.innerHTML = `
                <p class="destaque"> 🤘CEP: ${itemEndereco.cep} </p>
                <p><b>Logradouro:</b> ${itemEndereco.Logradouro || 'não informado'}</p>
                <p><strong>Bairro:</strong>${itemEndereco.Bairro || 'não informado'}</p> 
                <p><strong>Cidade/UF:</strong>${itemEndereco.localidade || 'não informado'} - $ {itemEndereco.UF}</p> 
                <p><strong>Complemento:</strong>${itemEndereco.complemento ? itemEndereco.complemento : 'nenhum'}</p>
            `;

            containerLista.appendChild(card);
        });

        esconderElementos(divMensagem);
        divResultado.classList.remove('oculto');


    } catch(erro){
        console.error('Erro na requisição:', erro);
        mostrarMensagem('Erro de conexão ao buscar CEP. Tente novamente mais tarde.', 'erro');
    }
}


//funções auxiliares 

function mostrarMensagem(texto, tipo){
    divMensagem.textContent = texto;
    divMensagem.className = `mensagem ${tipo}`;
}

function esconderElementos(elemento){
    elemento.classList.add('oculto');
}