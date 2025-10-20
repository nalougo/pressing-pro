// src/models/Service.js

/**
 * Modèle de validation pour les services de pressing
 */

export class ServiceModel {
    constructor(data) {
      this.id = data.id || null;
      this.pressingId = data.pressingId;
      this.name = data.name;
      this.category = data.category;
      this.price = data.price;
      this.description = data.description || '';
      this.estimatedTime = data.estimatedTime || null; // en heures
      this.isActive = data.isActive !== undefined ? data.isActive : true;
      this.createdAt = data.createdAt || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
    }
  
    // Validation du service
    validate() {
      const errors = [];
  
      // Validation du nom
      if (!this.name || this.name.trim().length < 3) {
        errors.push({
          field: 'name',
          message: 'Le nom du service doit contenir au moins 3 caractères'
        });
      }
  
      if (this.name && this.name.length > 100) {
        errors.push({
          field: 'name',
          message: 'Le nom du service ne peut pas dépasser 100 caractères'
        });
      }
  
      // Validation de la catégorie
      const validCategories = [
        'Lavage Standard',
        'Nettoyage à sec',
        'Repassage',
        'Détachage',
        'Express'
      ];
  
      if (!this.category || !validCategories.includes(this.category)) {
        errors.push({
          field: 'category',
          message: `La catégorie doit être l'une des suivantes: ${validCategories.join(', ')}`
        });
      }
  
      // Validation du prix
      if (!this.price || isNaN(this.price) || parseFloat(this.price) < 0) {
        errors.push({
          field: 'price',
          message: 'Le prix doit être un nombre positif'
        });
      }
  
      if (parseFloat(this.price) > 1000000) {
        errors.push({
          field: 'price',
          message: 'Le prix ne peut pas dépasser 1 000 000 FCFA'
        });
      }
  
      // Validation du pressingId
      if (!this.pressingId) {
        errors.push({
          field: 'pressingId',
          message: 'L\'ID du pressing est requis'
        });
      }
  
      // Validation du temps estimé (optionnel)
      if (this.estimatedTime !== null && (isNaN(this.estimatedTime) || this.estimatedTime < 0)) {
        errors.push({
          field: 'estimatedTime',
          message: 'Le temps estimé doit être un nombre positif'
        });
      }
  
      // Validation de la description (optionnel)
      if (this.description && this.description.length > 500) {
        errors.push({
          field: 'description',
          message: 'La description ne peut pas dépasser 500 caractères'
        });
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    // Méthode pour obtenir un objet simple
    toJSON() {
      return {
        id: this.id,
        pressingId: this.pressingId,
        name: this.name,
        category: this.category,
        price: parseFloat(this.price),
        description: this.description,
        estimatedTime: this.estimatedTime,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  
    // Méthode statique pour créer depuis les données brutes
    static fromJSON(data) {
      return new ServiceModel(data);
    }
  
    // Méthode pour formater le prix
    getFormattedPrice() {
      return new Intl.NumberFormat('fr-CI', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
      }).format(this.price);
    }
  
    // Méthode pour obtenir le temps estimé formaté
    getFormattedEstimatedTime() {
      if (!this.estimatedTime) return 'Non spécifié';
      
      if (this.estimatedTime < 1) {
        return `${Math.round(this.estimatedTime * 60)} min`;
      } else if (this.estimatedTime === 1) {
        return '1 heure';
      } else if (this.estimatedTime < 24) {
        return `${this.estimatedTime} heures`;
      } else {
        const days = Math.floor(this.estimatedTime / 24);
        return `${days} jour${days > 1 ? 's' : ''}`;
      }
    }
  }
  
  // Constantes pour les catégories
  export const SERVICE_CATEGORIES = {
    LAVAGE_STANDARD: 'Lavage Standard',
    NETTOYAGE_SEC: 'Nettoyage à sec',
    REPASSAGE: 'Repassage',
    DETACHAGE: 'Détachage',
    EXPRESS: 'Express'
  };
  
  // Constantes pour les articles types par catégorie
  export const COMMON_SERVICES = {
    'Lavage Standard': [
      { name: 'Chemise', defaultPrice: 500 },
      { name: 'Pantalon', defaultPrice: 750 },
      { name: 'Robe', defaultPrice: 1000 },
      { name: 'T-shirt', defaultPrice: 400 },
      { name: 'Jean', defaultPrice: 800 }
    ],
    'Nettoyage à sec': [
      { name: 'Costume', defaultPrice: 3000 },
      { name: 'Veste', defaultPrice: 2000 },
      { name: 'Manteau', defaultPrice: 3500 },
      { name: 'Robe de soirée', defaultPrice: 2500 }
    ],
    'Repassage': [
      { name: 'Chemise (repassage seul)', defaultPrice: 300 },
      { name: 'Pantalon (repassage seul)', defaultPrice: 400 },
      { name: 'Robe (repassage seul)', defaultPrice: 500 }
    ],
    'Détachage': [
      { name: 'Détachage simple', defaultPrice: 500 },
      { name: 'Détachage complexe', defaultPrice: 1500 }
    ],
    'Express': [
      { name: 'Service express (moins de 24h)', defaultPrice: 5000 }
    ]
  };
  
  export default ServiceModel;