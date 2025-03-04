import readline from 'readline';
import fs from 'fs';


// Função para carregar o modelo a partir do arquivo JSON
function carregarModelo() {
    const data = fs.readFileSync('modelo.json', 'utf8');
    return JSON.parse(data).perguntas;
}

// Função para fazer perguntas ao modelo
function fazerPergunta(pergunta, modelo) {
    const interacao = modelo.find(item => item.pergunta.toLowerCase() === pergunta.toLowerCase());
    return interacao ? interacao.resposta : "Desculpe, não sei a resposta para isso.";
}

// Função para salvar interações em um arquivo JSON
function salvarInteracao(pergunta, resposta) {
    const interacao = { pergunta, resposta };
    fs.appendFileSync('interacoes.json', JSON.stringify(interacao) + '\n', 'utf8');
}

// Função para ler interações anteriores do arquivo JSON
function lerInteracoes() {
    if (fs.existsSync('interacoes.json')) {
        const data = fs.readFileSync('interacoes.json', 'utf8');
        const interacoes = data.trim().split('\n').map(line => JSON.parse(line));
        return interacoes;
    }
    return [];
}

// Configuração da interface de leitura
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função principal para interação com o usuário
function iniciar() {
    // Carregar o modelo
    const modelo = carregarModelo();

    // Ler interações anteriores
    const interacoes = lerInteracoes();
    if (interacoes.length > 0) {
        console.log("Interações anteriores:");
        interacoes.forEach(interacao => {
            console.log(`Pergunta: ${interacao.pergunta}`);
            console.log(`Resposta: ${interacao.resposta}`);
        });
    }

    rl.question('Faça sua pergunta: ', (pergunta) => {
        const resposta = fazerPergunta(pergunta, modelo);
        console.log(`Resposta: ${resposta}`);
        
        // Salvar a interação
        salvarInteracao(pergunta, resposta);
        
        // Perguntar se o usuário deseja continuar
        rl.question('Deseja fazer outra pergunta? (s/n): ', (continuar) => {
            if (continuar.toLowerCase() === 's') {
                iniciar(); // Reinicia a interação
            } else {
                console.log('Obrigado por usar o sistema!');
                rl.close(); // Fecha a interface
            }
        });
    });
}

// Iniciar a aplicação
iniciar();