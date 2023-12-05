//importações necessárias para o projeto 
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

//configuração de json e cors
app.use(bodyParser.json());
app.use(cors());

// Rota que lista todos os usuários cadastrados
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Rota que cadastra um usuário
app.post("/user", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        age,
      },
    });
    res.json(newUser);
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// Rota que apaga um usuário, passando o id
app.delete("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    res.json(deletedUser);
  } catch (error) {
    console.error("Erro ao apagar usuário:", error);
    res.status(500).json({ error: "Erro ao apagar usuário" });
  }
});

// Rota que atualiza um usuário, pelo id
app.put("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { name, email, age } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        age,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Rota que lista usuários que contenham o nome específico
app.get("/users/:name", async (req, res) => {
  const userName = req.params.name;
  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: userName,
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários por nome:", error);
    res.status(500).json({ error: "Erro ao buscar usuários por nome" });
  }
});

// Rota que lista um usuário pelo id
app.get("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por id:", error);
    res.status(500).json({ error: "Erro ao buscar usuário por id" });
  }
});
// Inicie o servidor na porta especificada
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = { app, server };
