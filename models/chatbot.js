const fs = require('fs');
const readline = require('readline');

// Função para ler o arquivo JSON
function lerDados() {
    const dados = fs.readFileSync('data.json');
    return JSON.parse(dados);
}

// Função para escrever no arquivo JSON
function escreverDados(dados) {
    fs.writeFileSync('data.json', JSON.stringify(dados, null, 2));
}

// Função para gerar resposta do chatbot
function gerarResposta(input) {
    const respostas = {
        "olá": "Olá! Como posso ajudar você hoje?",
        "tudo bem": "Estou bem, obrigado! E você?",
        "adeus": "Até logo! Tenha um ótimo dia!"
    };

    const resposta = respostas[input.toLowerCase()] || "Desculpe, não entendi. Pode reformular?";
    return resposta;
}

// Função principal
function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt('Você: ');
    rl.prompt();

    rl.on('line', (input) => {
        const resposta = gerarResposta(input);
        console.log(`Chatbot: ${resposta}`);

        // Ler dados existentes
        const dados = lerDados();

        // Adicionar nova conversa
        dados.conversas.push({ usuario: input, chatbot: resposta });

        // Escrever dados atualizados
        escreverDados(dados);

        rl.prompt();
    }).on('close', () => {
        console.log('Chat encerrado.');
        process.exit(0);
    });
}

// Executar a função principal
main();