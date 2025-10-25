import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
// loading environment variables
dotenv.config();

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route
app.use("/api", router);

// health check route
app.get("/health", (req, res) => {
  res.send("Server running fine");
});

export default app;
