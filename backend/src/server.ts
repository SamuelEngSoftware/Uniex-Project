import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import routes from "./routes/index";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco de Dados conectado com sucesso!");
    app.listen(3000, () => {
      console.log("🚀 Servidor rodando em http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar no banco:", error);
  });

app.get("/", (req, res) => {
  return res.json({ message: "API UniEx está online!" });
});