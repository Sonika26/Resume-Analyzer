import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authroutes";



dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Route
app.get("/api/message", (req: Request, res: Response) => {
  res.json({ reply: "Hello from the backend!" });
});

// Example: POST route if you want to send data
app.post("/api/message", (req: Request, res: Response) => {
  const { msg } = req.body;
  console.log("Received from frontend:", msg);
  res.json({ reply: `Backend got your message: ${msg}` });
});

export default app;
