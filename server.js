// ######
// 1. Importação de Pacotes
// ######
import express from "express"; // Importa o framework Express
import { Pool } from 'pg'; // Importa a Classe Pool do Postgres
import dotenv from "dotenv"; // Importa o pacote dotenv

// ######
// 2. Configurações do Servidor
// ######
dotenv.config();         // Carrega e processa o arquivo .env

const app = express();
const port = 3000;

// Variáveis e Funções para Conexão Única com o BD (Refatoração para evitar repetição)
let pool = null; // Variável para armazenar o pool de conexões

// Função para obter uma conexão com o banco de dados
function conectarBD() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.URL_BD,
    });
  }
  return pool;
}

// ######
// 3. Definição de Rotas (Endpoints)
// ######

// Rota GET para o caminho raiz ("/")
app.get("/", async (req, res) => {
  console.log("Rota GET / solicitada"); 
  
  const db = conectarBD(); // Obtém a conexão com o banco de dados
  
  let dbStatus = "ok";
  // Tenta executar uma consulta simples para verificar a conexão com o banco de dados
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }

  // Responde com um JSON contendo seus dados e o status do BD
  res.json({
    descricao: "API para a atividade #17: Leitura de Dados",
    autor: "Vinicius Araujo Matos", 
    statusBD: dbStatus,
  });
});

// Rota GET para retornar todas as questões cadastradas
app.get("/questoes", async (req, res) => {
	console.log("Rota GET /questoes solicitada"); // Log no terminal
	
    const db = conectarBD(); // Obtém a conexão com o banco de dados

	try {
        const resultado = await db.query("SELECT * FROM questoes"); // Executa a consulta
        const dados = resultado.rows; // Obtém as linhas (questões)
        res.json(dados); // Retorna o resultado da consulta como JSON
    } catch (e) {
        console.error("Erro ao buscar questões:", e); // Log do erro
        res.status(500).json({
            erro: "Erro interno do servidor",
            mensagem: "Não foi possível buscar as questões",
        });
    }
});

// ######
// 4. Inicialização do Servidor
// ######
app.listen(port, () => {
  console.log(`Serviço rodando na porta: ${port}`);
});