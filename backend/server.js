import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// Import des routes
import authRoutes from "./src/routes/authRoutes.js";
import pressingRoutes from "./src/routes/authpressingRoute.js";
import serviceRoutes from './src/routes/serviceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ========== CORS CORRIGÉ ==========
app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'https://pressing-pro.vercel.app',
      'https://pressing-pro-git-main.vercel.app',
      /\.vercel\.app$/  // Autorise tous les sous-domaines Vercel
    ];
    
    // Vérifier si l'origin est autorisée
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 heures
}));

// ========== MIDDLEWARE OPTIONS (IMPORTANT pour CORS) ==========
app.options('*', cors()); // Répondre à toutes les requêtes preflight

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