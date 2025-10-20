# Application de Pressing

Cette application est organisée en deux parties distinctes : un backend API et un frontend React.

## Structure du projet

```
pressing/
├── backend/                 # API Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── data/           # Données JSON
│   │   ├── controllers/    # Contrôleurs
│   │   ├── routes/         # Routes API
│   │   └── models/         # Modèles de données
│   ├── server.js           # Serveur principal
│   ├── package.json        # Dépendances backend
│   ├── .env               # Variables d'environnement backend
│   └── .gitignore         # Fichiers à ignorer backend
│
├── frontend/               # Interface utilisateur (React/Vite)
│   ├── src/
│   │   ├── pages/          # Pages de l'application
│   │   ├── components/     # Composants réutilisables
│   │   ├── services/       # Services API
│   │   ├── assets/         # Images et ressources
│   │   ├── App.jsx         # Composant principal
│   │   └── main.jsx        # Point d'entrée
│   ├── index.html          # Page HTML principale
│   ├── vite.config.js      # Configuration Vite
│   ├── tailwind.config.js  # Configuration Tailwind CSS
│   ├── package.json        # Dépendances frontend
│   └── .env               # Variables d'environnement frontend
│
└── .gitignore             # Fichiers à ignorer globalement
```

## Installation et démarrage

### Backend

1. Naviguer vers le dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` avec vos variables d'environnement :
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=27017
DB_NAME=pressing_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

4. Démarrer le serveur :
```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:5000`

### Frontend

1. Naviguer vers le dossier frontend :
```bash
cd frontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` avec vos variables d'environnement :
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Pressing App
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

4. Démarrer l'application :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Technologies utilisées

### Backend
- Node.js
- Express.js
- MongoDB (avec Mongoose)
- JWT pour l'authentification
- CORS pour les requêtes cross-origin

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios pour les requêtes API
- Lucide React pour les icônes

## Scripts disponibles

### Backend
- `npm start` : Démarre le serveur en production
- `npm run dev` : Démarre le serveur en mode développement avec nodemon

### Frontend
- `npm run dev` : Démarre l'application en mode développement
- `npm run build` : Construit l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint