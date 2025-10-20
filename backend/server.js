import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./src/routes/authRoutes.js";
import pressingRoutes from "./src/routes/authpressingRoute.js";
import serviceRoutes from './src/routes/serviceRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://votre-app.vercel.app',
      'https://votre-app-git-main.vercel.app'
    ]
  : [
      'http://localhost:5173',
      'http://localhost:5176',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5176'
    ];

// ✅ Configure CORS une seule fois
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Pressing Pro",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      pressing: "/api/pressing",
      services: "/api/services"
    },
  });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/pressing", pressingRoutes);
app.use('/api/services', serviceRoutes);

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || "development"}`);
});