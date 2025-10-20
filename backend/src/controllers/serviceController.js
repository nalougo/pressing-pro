import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ServiceModel } from "../models/service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/services.json");

// Lecture des services
const readServicesFromFile = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      // Créer le dossier data s'il n'existe pas
      const dataDir = path.dirname(dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lecture fichier:", error);
    return [];
  }
};

// Écriture des services
const writeServicesToFile = (services) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(services, null, 2));
    return true;
  } catch (error) {
    console.error("Erreur écriture fichier:", error);
    return false;
  }
};

// GET - Récupérer tous les services d'un pressing
export const getServices = async (req, res) => {
  try {
    const { pressingId } = req.params;
    
    if (!pressingId) {
      return res.status(400).json({
        success: false,
        message: "L'ID du pressing est requis"
      });
    }

    const services = readServicesFromFile();
    
    // Filtrer par pressingId et convertir en modèles
    const pressingServices = services
      .filter(s => s.pressingId === pressingId)
      .map(s => ServiceModel.fromJSON(s).toJSON());
    
    res.json({
      success: true,
      count: pressingServices.length,
      services: pressingServices
    });
  } catch (error) {
    console.error("Erreur getServices:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des services",
      error: error.message
    });
  }
};

// POST - Créer un nouveau service
export const createService = async (req, res) => {
  try {
    const { pressingId, name, category, price, description, estimatedTime } = req.body;
    
    // Créer une instance du modèle
    const service = new ServiceModel({
      pressingId,
      name,
      category,
      price,
      description,
      estimatedTime
    });
    
    // Valider le service
    const validation = service.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: validation.errors
      });
    }
    
    const services = readServicesFromFile();
    
    // Vérifier si un service identique existe déjà
    const existingService = services.find(
      s => s.pressingId === pressingId && 
           s.name.toLowerCase() === name.toLowerCase() &&
           s.category === category
    );
    
    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Un service avec ce nom existe déjà dans cette catégorie"
      });
    }
    
    // Générer un ID unique
    service.id = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Ajouter le service
    services.push(service.toJSON());
    const writeSuccess = writeServicesToFile(services);
    
    if (!writeSuccess) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'enregistrement du service"
      });
    }
    
    res.status(201).json({
      success: true,
      message: "Service créé avec succès",
      service: service.toJSON()
    });
  } catch (error) {
    console.error("Erreur createService:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création du service",
      error: error.message
    });
  }
};

// PUT - Modifier un service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, estimatedTime, isActive } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'ID du service est requis"
      });
    }
    
    const services = readServicesFromFile();
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Service non trouvé"
      });
    }
    
    // Créer un service mis à jour
    const updatedServiceData = {
      ...services[serviceIndex],
      name: name || services[serviceIndex].name,
      category: category || services[serviceIndex].category,
      price: price !== undefined ? price : services[serviceIndex].price,
      description: description !== undefined ? description : services[serviceIndex].description,
      estimatedTime: estimatedTime !== undefined ? estimatedTime : services[serviceIndex].estimatedTime,
      isActive: isActive !== undefined ? isActive : services[serviceIndex].isActive,
      updatedAt: new Date().toISOString()
    };
    
    const updatedService = new ServiceModel(updatedServiceData);
    
    // Valider le service mis à jour
    const validation = updatedService.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: validation.errors
      });
    }
    
    // Vérifier les doublons (sauf le service actuel)
    const duplicateService = services.find(
      s => s.id !== id &&
           s.pressingId === updatedService.pressingId && 
           s.name.toLowerCase() === updatedService.name.toLowerCase() &&
           s.category === updatedService.category
    );
    
    if (duplicateService) {
      return res.status(409).json({
        success: false,
        message: "Un service avec ce nom existe déjà dans cette catégorie"
      });
    }
    
    services[serviceIndex] = updatedService.toJSON();
    const writeSuccess = writeServicesToFile(services);
    
    if (!writeSuccess) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du service"
      });
    }
    
    res.json({
      success: true,
      message: "Service modifié avec succès",
      service: updatedService.toJSON()
    });
  } catch (error) {
    console.error("Erreur updateService:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la modification du service",
      error: error.message
    });
  }
};

// DELETE - Supprimer un service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'ID du service est requis"
      });
    }
    
    const services = readServicesFromFile();
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Service non trouvé"
      });
    }
    
    const deletedService = services.splice(serviceIndex, 1)[0];
    const writeSuccess = writeServicesToFile(services);
    
    if (!writeSuccess) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du service"
      });
    }
    
    res.json({
      success: true,
      message: "Service supprimé avec succès",
      service: deletedService
    });
  } catch (error) {
    console.error("Erreur deleteService:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression du service",
      error: error.message
    });
  }
};

// GET - Récupérer un service par ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "L'ID du service est requis"
      });
    }
    
    const services = readServicesFromFile();
    const service = services.find(s => s.id === id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service non trouvé"
      });
    }
    
    res.json({
      success: true,
      service: ServiceModel.fromJSON(service).toJSON()
    });
  } catch (error) {
    console.error("Erreur getServiceById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération du service",
      error: error.message
    });
  }
};

// GET - Récupérer les services par catégorie
export const getServicesByCategory = async (req, res) => {
  try {
    const { pressingId, category } = req.params;
    
    if (!pressingId || !category) {
      return res.status(400).json({
        success: false,
        message: "L'ID du pressing et la catégorie sont requis"
      });
    }
    
    const services = readServicesFromFile();
    const categoryServices = services
      .filter(s => s.pressingId === pressingId && s.category === category)
      .map(s => ServiceModel.fromJSON(s).toJSON());
    
    res.json({
      success: true,
      count: categoryServices.length,
      category,
      services: categoryServices
    });
  } catch (error) {
    console.error("Erreur getServicesByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des services",
      error: error.message
    });
  }
};