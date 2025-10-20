import express from 'express';
import { 
  getServices,
  getServiceById,
  getServicesByCategory,
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController.js';

const router = express.Router();

// ========== ROUTES PUBLIQUES (lecture seule) ==========

/**
 * @route   GET /api/services/:pressingId
 * @desc    Récupérer tous les services d'un pressing
 * @access  Public
 */
router.get('/detail/:id', getServiceById); 

/**
 * @route   GET /api/services/detail/:id
 * @desc    Récupérer un service par son ID
 * @access  Public
 */
router.get('/:pressingId/category/:category', getServicesByCategory);

/**
 * @route   GET /api/services/:pressingId/category/:category
 * @desc    Récupérer les services d'un pressing par catégorie
 * @access  Public
 */
router.get('/:pressingId', getServices);

// ========== ROUTES PROTÉGÉES (nécessitent authentification) ==========
// Décommenter quand le middleware d'authentification sera prêt

/**
 * @route   POST /api/services
 * @desc    Créer un nouveau service
 * @access  Private (Pressing only)
 */
router.post('/', 
  // authenticateToken, 
  // checkRole(['pressing', 'admin']),
  createService
);

/**
 * @route   PUT /api/services/:id
 * @desc    Modifier un service existant
 * @access  Private (Pressing only)
 */
router.put('/:id', 
  // authenticateToken, 
  // checkRole(['pressing', 'admin']),
  updateService
);

/**
 * @route   DELETE /api/services/:id
 * @desc    Supprimer un service
 * @access  Private (Pressing only)
 */
router.delete('/:id', 
  // authenticateToken, 
  // checkRole(['pressing', 'admin']),
  deleteService
);

export default router;