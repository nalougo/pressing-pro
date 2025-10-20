// src/services/serviceAPI.js (Frontend)

const API_URL = "http://localhost:3001/api";

export const serviceAPI = {
  /**
   * Récupérer tous les services d'un pressing
   * @param {string} pressingId - ID du pressing
   * @returns {Promise<Object>} - Liste des services
   */
  getAll: async (pressingId) => {
    try {
      const response = await fetch(`${API_URL}/services/${pressingId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur getAll:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur",
        services: []
      };
    }
  },
  
  /**
   * Récupérer un service par son ID
   * @param {string} serviceId - ID du service
   * @returns {Promise<Object>} - Détails du service
   */
  getById: async (serviceId) => {
    try {
      const response = await fetch(`${API_URL}/services/detail/${serviceId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur getById:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur"
      };
    }
  },

  /**
   * Récupérer les services par catégorie
   * @param {string} pressingId - ID du pressing
   * @param {string} category - Catégorie de service
   * @returns {Promise<Object>} - Liste des services filtrés
   */
  getByCategory: async (pressingId, category) => {
    try {
      const response = await fetch(
        `${API_URL}/services/${pressingId}/category/${encodeURIComponent(category)}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur getByCategory:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur",
        services: []
      };
    }
  },
  
  /**
   * Créer un nouveau service
   * @param {string} pressingId - ID du pressing
   * @param {Object} serviceData - Données du service
   * @returns {Promise<Object>} - Service créé
   */
  create: async (pressingId, serviceData) => {
    try {
      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          pressingId, 
          ...serviceData 
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur create:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur"
      };
    }
  },
  
  /**
   * Modifier un service existant
   * @param {string} serviceId - ID du service
   * @param {Object} serviceData - Nouvelles données du service
   * @returns {Promise<Object>} - Service modifié
   */
  update: async (serviceId, serviceData) => {
    try {
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(serviceData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur update:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur"
      };
    }
  },
  
  /**
   * Supprimer un service
   * @param {string} serviceId - ID du service
   * @returns {Promise<Object>} - Confirmation de suppression
   */
  delete: async (serviceId) => {
    try {
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur delete:", error);
      return {
        success: false,
        message: "Erreur de connexion au serveur"
      };
    }
  }
};