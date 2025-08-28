// ######
// 1. Importação de Pacotes
// ######
import express from "express"; // Importa o framework Express

// ######
// 2. Configurações do Servidor
// ######
const app = express();         // Cria uma instância do Express para gerenciar o servidor
const port = 3000;             // Define a porta que o servidor vai "escutar"

// ######
// 3. Definição de Rotas (Endpoints)
// ######

// Rota GET para o caminho raiz ("/")
app.get("/", (req, res) => {
  // req (request): Contém os dados da requisição que chegou.
  // res (response): É o objeto que usamos para enviar uma resposta de volta.

  console.log("Rota GET / foi solicitada com sucesso!"); // Mensagem no terminal do servidor

  // Envia uma resposta em formato JSON com seus dados
  res.json({
    descricao: "API de exemplo para atividade #13",
    autor: "Vinicius araujo matos",
  });
});

// ######
// 4. Inicialização do Servidor
// ######
app.listen(port, () => {
  // Inicia o servidor e o faz "escutar" por requisições na porta definida
  console.log(`Serviço rodando na porta: ${port}`);
});