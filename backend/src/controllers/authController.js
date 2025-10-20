import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/client.json");

// Fonctions de validation
const validatePhone = (phone) => {
  const phoneRegex = /^(\+225|225)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateName = (name) => {
  return name && name.trim().length >= 3;
};

// Lecture du fichier JSON
const readUsersFromFile = () => {
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
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error("Erreur écriture fichier:", error);
    return false;
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, phone: user.phone },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Validation du nom
    if (!validateName(name)) {
      return res.status(400).json({
        success: false,
        message: "Le nom doit avoir au moins 3 caractères",
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

    // Lire les utilisateurs existants
    const users = readUsersFromFile();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find((u) => u.phone === phone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Ce numéro de téléphone est déjà utilisé",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Ajouter à la liste et sauvegarder
    users.push(newUser);
    writeUsersToFile(users);

    // Générer le token
    const userModel = new User(newUser);
    const token = generateToken(userModel);

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      user: userModel.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Erreur d'enregistrement:", error);
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

    // Validation du téléphone
    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Format de téléphone invalide",
      });
    }

    // Validation du mot de passe
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe est requis",
      });
    }

    // Lire les utilisateurs
    const users = readUsersFromFile();

    // Chercher l'utilisateur par téléphone
    const user = users.find((u) => u.phone === phone);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe incorrect",
      });
    }

    // Générer le token
    const userModel = new User(user);
    const token = generateToken(userModel);

    res.json({
      success: true,
      message: "Connexion réussie",
      user: userModel.toJSON(),
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