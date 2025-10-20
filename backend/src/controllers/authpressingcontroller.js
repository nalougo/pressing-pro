import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/pressing.json");

// Fonctions de validation
const validatePhone = (phone) => {
  const phoneRegex = /^(\+225|225)?[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateName = (name) => {
  return name && name.trim().length >= 3;
};

// Lecture du fichier JSON
const readPressingsFromFile = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lecture fichier:", error);
    return [];
  }
};

// Écriture dans le fichier JSON
const writePressingsToFile = (pressings) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(pressings, null, 2));
    return true;
  } catch (error) {
    console.error("Erreur écriture fichier:", error);
    return false;
  }
};

const generateToken = (pressing) => {
  return jwt.sign(
    { id: pressing.id, phone: pressing.phone, role: "pressing" },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
    try {
      const { pressingName, phone, password } = req.body; // ✅ Pas d'email
  
      console.log("📝 Inscription - Données reçues:", { pressingName, phone });
  
      // Validation du nom
      if (!validateName(pressingName)) {
        return res.status(400).json({
          success: false,
          message: "Le nom du pressing doit avoir au moins 3 caractères",
        });
      }
  
      // Validation du téléphone
      if (!validatePhone(phone)) {
        return res.status(400).json({
          success: false,
          message: "Format de téléphone invalide (ex: +225 0123456789)",
        });
      }
  
      // Validation du mot de passe
      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message: "Le mot de passe doit avoir au moins 8 caractères",
        });
      }
  
      const pressings = readPressingsFromFile();
  
      // Vérification téléphone
      const normalizedPhone = phone.replace(/\s/g, "");
      const existingPressing = pressings.find(
        (p) => p.phone.replace(/\s/g, "") === normalizedPhone
      );
  
      if (existingPressing) {
        return res.status(400).json({
          success: false,
          message: "Ce numéro de téléphone est déjà utilisé",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newPressing = {
        id: Math.random().toString(36).substr(2, 19),
        name: pressingName,
        phone,
        email: null, // ✅ Email mis à null
        password: hashedPassword,
        address: null,
        city: null,
        rating: 0,
        isActive: true,
        role: "pressing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
  
      pressings.push(newPressing);
      writePressingsToFile(pressings);
  
      const token = generateToken(newPressing);
  
      console.log("✅ Inscription réussie:", newPressing.name);
  
      res.status(201).json({
        success: true,
        message: "Inscription réussie",
        pressing: {
          id: newPressing.id,
          name: newPressing.name,
          phone: newPressing.phone,
          email: newPressing.email, // Sera null
          role: "pressing",
        },
        token,
      });
    } catch (error) {
      console.error("❌ Erreur d'enregistrement:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

export const login = async (req, res) => {
    try {
      const { phone, password } = req.body;
  
      // Vérification des champs requis
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Le numéro de téléphone est requis",
        });
      }
  
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Le mot de passe est requis",
        });
      }
  
      // Validation du format du téléphone
      if (!validatePhone(phone)) {
        return res.status(400).json({
          success: false,
          message: "Format de téléphone invalide",
        });
      }
  
      // Lecture des pressings
      const pressings = readPressingsFromFile();
  
      // Normalisation et recherche du pressing
      const normalizedPhone = phone.replace(/[\s+]/g, "");
      const pressing = pressings.find(
        (p) => p.phone.replace(/[\s+]/g, "") === normalizedPhone
      );
  
      if (!pressing) {
        return res.status(401).json({
          success: false,
          message: "Numéro de téléphone non trouvé",
        });
      }
  
      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(password, pressing.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Mot de passe incorrect",
        });
      }
  
      // Génération du token
      const token = generateToken(pressing);
  
      // Réponse de succès
      res.json({
        success: true,
        message: "Connexion réussie",
        pressing: {
          id: pressing.id,
          name: pressing.name,
          phone: pressing.phone,
          email: pressing.email,
          role: "pressing",
        },
        token,
      });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };
export const getPressing = async (req, res) => {
  try {
    const { id } = req.params;

    const pressings = readPressingsFromFile();
    const pressing = pressings.find((p) => p.id === id);

    if (!pressing) {
      return res.status(404).json({
        success: false,
        message: "Pressing non trouvé",
      });
    }

    res.json({
      success: true,
      pressing: {
        id: pressing.id,
        name: pressing.name,
        phone: pressing.phone,
        email: pressing.email,
        role: "pressing",
        createdAt: pressing.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};