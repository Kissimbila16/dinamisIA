import { LlamaModel, LlamaContext }  from "node-llama-cpp";
import path  from 'path';
import fs  from 'fs';

const modelPath = path.join(__dirname, "./models/seu_modelo_llama.gguf"); // Substitua pelo caminho correto
const model = new LlamaModel({ modelPath: modelPath });
const context = new LlamaContext({ model });

async function gerarTexto(prompt) {
  try {
    const resposta = await context.evaluate({ prompt: prompt, maxTokens: 150 });
    return resposta.choices[0].text;
  } catch (error) {
    console.error("Erro ao gerar texto:", error);
    return "Erro ao gerar texto.";
  }
}

// Exemplo de uso
gerarTexto("Qual a capital da França?").then(texto => {
  console.log(texto);
});

// Dados de entrada em JSON
const dadosEntrada = {
  perguntas: [
    { pergunta: "Qual a capital do Brasil?" },
    { pergunta: "Quem escreveu Dom Quixote?" },
  ],
};

// Carrega o modelo (assumindo que o código de carregamento do modelo esteja acima)

async function processarPerguntas() {
  const respostas = [];

  for (const perguntaObj of dadosEntrada.perguntas) {
    const pergunta = perguntaObj.pergunta;
    const resposta = await gerarTexto(pergunta);
    respostas.push({ pergunta: pergunta, resposta: resposta });
  }

  // Salva as respostas em um arquivo JSON
  fs.writeFileSync("respostas.json", JSON.stringify(respostas, null, 2), "utf8");
  console.log("Respostas salvas em respostas.json");
}

processarPerguntas();