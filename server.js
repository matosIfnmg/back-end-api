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

// Middleware para interpretar requisições com corpo em JSON
app.use(express.json()); 

// Variáveis e Funções para Conexão Única com o BD
let pool = null; 

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

// Rota GET / - Status do Banco de Dados
app.get("/", async (req, res) => {
  console.log("Rota GET / solicitada"); 
  
  const db = conectarBD(); 
  let dbStatus = "ok";
  
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = e.message;
  }

  res.json({
    descricao: "API para Questões de Prova",
    autor: "Vinicius Araujo Matos", // Substituído pelo seu nome
    statusBD: dbStatus,
  });
});

// Rota GET /questoes - Retorna todas as questões
app.get("/questoes", async (req, res) => {
	console.log("Rota GET /questoes solicitada");
	
    const db = conectarBD();

	try {
        const resultado = await db.query("SELECT * FROM questoes"); 
        const dados = resultado.rows; 
        res.json(dados);
    } catch (e) {
        console.error("Erro ao buscar questões:", e); 
        res.status(500).json({
            erro: "Erro interno do servidor",
            mensagem: "Não foi possível buscar as questões",
        });
    }
});


// Rota GET /questoes/:id - Retorna uma única questão por ID
app.get("/questoes/:id", async (req, res) => {
  console.log("Rota GET /questoes/:id solicitada");

  try {
    const id = req.params.id;
    const db = conectarBD();
    const consulta = "SELECT * FROM questoes WHERE id = $1"; 
    const resultado = await db.query(consulta, [id]);
    const dados = resultado.rows;

    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Questão não encontrada" });
    }

    res.json(dados[0]); // Retorna a primeira (e única) questão encontrada
  } catch (e) {
    console.error("Erro ao buscar questão:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});


// Rota POST /questoes - Insere uma nova questão
app.post("/questoes", async (req, res) => {
  console.log("Rota POST /questoes solicitada"); 

  try {
    const data = req.body;
    // Validação dos dados recebidos
    if (!data.enunciado || !data.disciplina || !data.tema || !data.nivel) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem: "Todos os campos (enunciado, disciplina, tema, nivel) são obrigatórios.",
      });
    }

    const db = conectarBD(); 
    const consulta = "INSERT INTO questoes (enunciado,disciplina,tema,nivel) VALUES ($1,$2,$3,$4) RETURNING *"; // Adicionado RETURNING * para retornar a questão inserida
    const questao = [data.enunciado, data.disciplina, data.tema, data.nivel]; 
    const resultado = await db.query(consulta, questao);
    
    res.status(201).json({ 
        mensagem: "Questão criada com sucesso!", 
        questao: resultado.rows[0] 
    });
  } catch (e) {
    console.error("Erro ao inserir questão:", e);
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});


// Rota PUT /questoes/:id - Atualiza uma questão
app.put("/questoes/:id", async (req, res) => {
  console.log("Rota PUT /questoes/:id solicitada"); 

  try {
    const id = req.params.id; 
    const db = conectarBD(); 
    
    // 1. Busca a questão existente para preencher campos faltantes
    let consulta = "SELECT * FROM questoes WHERE id = $1"; 
    let resultado = await db.query(consulta, [id]);
    let questaoExistente = resultado.rows; 

    if (questaoExistente.length === 0) {
      return res.status(404).json({ mensagem: "Questão não encontrada" }); 
    }

    const data = req.body; 
    const q = questaoExistente[0]; // Dados atuais

    // Usa o valor enviado ou mantém o valor atual
    const enunciado = data.enunciado || q.enunciado;
    const disciplina = data.disciplina || q.disciplina;
    const tema = data.tema || q.tema;
    const nivel = data.nivel || q.nivel;

    // 2. Atualiza a questão
    consulta ="UPDATE questoes SET enunciado = $1, disciplina = $2, tema = $3, nivel = $4 WHERE id = $5 RETURNING *";
    resultado = await db.query(consulta, [
      enunciado,
      disciplina,
      tema,
      nivel,
      id,
    ]);

    res.status(200).json({ 
        mensagem: "Questão atualizada com sucesso!",
        questao: resultado.rows[0]
    }); 
  } catch (e) {
    console.error("Erro ao atualizar questão:", e); 
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
});


// Rota DELETE /questoes/:id - Exclui uma questão
app.delete("/questoes/:id", async (req, res) => {
  console.log("Rota DELETE /questoes/:id solicitada"); 

  try {
    const id = req.params.id;
    const db = conectarBD();

    // Busca a questão antes de deletar (opcional, mas bom para dar feedback)
    const consultaBusca = "SELECT * FROM questoes WHERE id = $1";
    const resultadoBusca = await db.query(consultaBusca, [id]);
    const questaoDeletada = resultadoBusca.rows[0];

    if (!questaoDeletada) {
      return res.status(404).json({ mensagem: "Questão não encontrada" });
    }

    const consultaDelete = "DELETE FROM questoes WHERE id = $1"; 
    await db.query(consultaDelete, [id]);

    res.status(200).json({ 
        mensagem: "Questão excluída com sucesso!!",
        questao_excluida: questaoDeletada
    });
  } catch (e) {
    console.error("Erro ao excluir questão:", e); 
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});


// ######
// 4. Inicialização do Servidor
// ######
app.listen(port, () => {
  console.log(`Serviço rodando na porta: ${port}`);
});