import express from 'express';
import chatbot from './models/chatbot';
import ia from './models/llama';

const app = express();

// Iniciar a aplicação
app.get('/api/dunamis', (req, res) => {
  console.log('running')
});

app.get('/api/chat/dunamis', (req, res) => {
  console.log('running')
});

app.get('/', (req, res) => {
  res.json('running dunamis IA')
});

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});