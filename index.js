import express from 'express';
import fs from 'fs';
import readline from 'readline';
import { getLlama, LlamaChatSession } from 'node-llama-cpp';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Caminho para o seu modelo .gguf
const modelPath = 'Llama-3.2-3B-Instruct-IQ3_M.gguf'; // Altere para o caminho correto do seu modelo

async function setModel() {
    const llama = await getLlama();
    const model = await llama.loadModel({
        modelPath: path.join(__dirname, "./", modelPath),
    });

    const context = await model.createContext();
    const session = new LlamaChatSession({
        contextSequence: context.getSequence(),
    });
    console.log(session)
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Função para fazer perguntas ao modelo
async function fazerPergunta(pergunta) {
    const resposta = await session.prompt(pergunta); // Método para gerar resposta
    return resposta;
}

// Função para salvar interações em um arquivo JSON
function salvarInteracao(pergunta, resposta) {
    let interacoes = [];
    // Tentar ler o arquivo JSON existente
    try {
        const data = fs.readFileSync('interacoes.json', 'utf8');
        interacoes = data.split('\n').filter(line => line).map(line => JSON.parse(line));
    } catch (error) {
        console.error('Erro ao ler o arquivo JSON:', error);
    }
    // Verificar se a pergunta já existe
    const perguntaExistente = interacoes.find(interacao => interacao.pergunta === pergunta);
    if (!perguntaExistente) {
        // Se não existir, salvar a nova pergunta
    const novaInteracao = { pergunta, resposta };
        interacoes.push(novaInteracao);
        fs.writeFileSync('interacoes.json', interacoes.map(interacao => JSON.stringify(interacao)).join('\n'), 'utf8');
        console.log('Pergunta guardada no arquivo JSON.');
    } else {
        console.log('A pergunta já existe no arquivo JSON.');
    }
}

function listarInformacoesDoArquivo(arquivo) {
    fs.readFile(arquivo, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            console.log('Conteúdo do arquivo JSON:');
            console.log(JSON.stringify(jsonData, null, 2)); // Formata a saída
        } catch (parseError) {
            console.error('Erro ao analisar o JSON:', parseError);
        }
    });
}

function solicitarNomeDoArquivo() {
    rl.question('Digite o caminho do arquivo JSON que deseja ler: ', (caminho) => {
        const arquivo = path.resolve(caminho); // Resolve o caminho absoluto
        listarInformacoesDoArquivo(arquivo);
        rl.close(); // Fecha a interface após a leitura
    });
}

// Função principal para interação com o usuário
async function iniciar() {
    setModel();

    rl.question('Faça sua pergunta: ', async (pergunta) => {
        if(pergunta.includes('Mostrar segredos')){

        }
        const resposta = await fazerPergunta(pergunta);
        console.log(`Resposta: ${resposta}`);
        // Salvar a interação
        salvarInteracao(pergunta, resposta);

        // Perguntar se o usuário deseja continuar
        // rl.question('Deseja fazer outra pergunta? (s/n): ', (continuar) => {
        //     if (continuar.toLowerCase() === 's') {
        //         iniciar(); // Reinicia a interação
        //     } else {
        //         console.log('Obrigado por usar o sistema!');
        //         rl.close(); // Fecha a interface
        //     }
        // });
    });
}

// Iniciar a aplicação
iniciar();

// Se você quiser usar o Express para uma API, descomente as linhas abaixo
// const port = parseInt(process.env.PORT) || 3000;
// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });