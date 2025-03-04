import express from 'express';


const app = express();

// Iniciar a aplicação
 app.get('/api/data/dunamis', (req, res) => {
   console.log('running')
     })

     app.get('/', (req, res) => {
      res.json('running dunamis IA')
      
        })
    
const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});