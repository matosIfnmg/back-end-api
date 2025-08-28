// 1. Importa o pacote express
import express from "express";

// 2. Inicia o express e define a porta
const app = express();
const port = 3000;

// 3. Cria nosso primeiro endpoint na rota raiz "/"
app.get("/", (req, res) => {
  console.log("Recebi uma requisição na rota '/'!");

  res.json({
    descricao: "API de exemplo para atividade #13", // Sua descrição
    autor: "Seu Nome Completo",                  // Seu nome
  });
});

// 4. "Liga" o servidor para ele começar a ouvir requisições
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}. Acesse http://localhost:${port}`);
});