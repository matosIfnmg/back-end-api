// ######
// 1. Importação de Pacotes
// ######
import express from "express"; // Importa o framework Express
import pkg from "pg";
import dotenv from "dotenv";

// ######
// 2. Configurações do Servidor
// ######
dotenv.config();         // Carrega e processa o arquivo .env
const { Pool } = pkg;    // Utiliza a Classe Pool do Postgres

const app = express();
const port = 3000;

const db = new Pool({  
  connectionString: process.env.URL_BD,
});

// ######
// 3. Definição de Rotas (Endpoints)
// ######

// Rota GET para o caminho raiz ("/")
app.get("/", async (req, res) => {
  // req (request): Contém os dados da requisição que chegou.
  // res (response): É o objeto que usamos para enviar uma resposta de volta.

  let dbStatus = "ok";
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }
  
  console.log("Rota GET / foi solicitada com sucesso!");

  // Envia uma resposta em formato JSON com seus dados
  res.json({
    descricao: "API de exemplo para a atividade #16",
    autor: "Vinicius Araujo Matos",
    statusBD: dbStatus,
  });
});

// ######
// 4. Inicialização do Servidor
// ######
app.listen(port, () => {
  // Inicia o servidor e o faz "escutar" por requisições na porta definida
  console.log(`Serviço rodando na porta: ${port}`);
});