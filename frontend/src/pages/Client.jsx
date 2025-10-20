import { useState, useEffect } from "react";
import {
  Bell,
  User,
  LogOut,
  Plus,
  MapPin,
  Menu,
  X,
  Package,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../assets/image/logopro.png";

export default function Client() {
  const [activeTab, setActiveTab] = useState("mes-commandes");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Récupérer les données utilisateur du localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }
  }, []);

  // New order form state
  const [adresseCollecte, setAdresseCollecte] = useState("");
  const [dateCollecte, setDateCollecte] = useState("");
  const [heureCollecte, setHeureCollecte] = useState("");
  const [telephone, setTelephone] = useState("");
  const [pressingSelectionne, setPressingSelectionne] = useState("");
  const [instructions, setInstructions] = useState("");
  const [articles, setArticles] = useState({
    chemise: 0,
    pantalon: 0,
    robe: 0,
    costume: 0,
    veste: 0,
    short: 0,
    tshirt: 0,
    pull: 0,
    debardeur: 0,
    jupe: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const commandes = [
    {
      id: "CMD001",
      date: "15/01/2024",
      pressing: "Clarté Nettoyage",
      articles: [
        { nom: "Chemise", quantite: 2 },
        { nom: "Pantalon", quantite: 1 },
        { nom: "Robe", quantite: 1 },
      ],
      total: "8500 FCFA",
      livraisonPrevue: "15/10/2025",
      livreur: "Kouame A.",
      statut: "en-collecte",
    },
    {
      id: "CMD002",
      date: "10/01/2024",
      pressing: "Naya pressing",
      articles: [
        { nom: "Costume", quantite: 1 },
        { nom: "Chemise", quantite: 3 },
      ],
      total: "12000 FCFA",
      livraisonPrevue: "12/10/2025",
      livreur: "Adjoua M.",
      statut: "pret",
    },
    {
      id: "CMD003",
      date: "05/01/2024",
      pressing: "Express Clean",
      articles: [
        { nom: "Robe de soirée", quantite: 1 },
        { nom: "Veste", quantite: 1 },
      ],
      total: "15000 FCFA",
      livraisonPrevue: "08/10/2025",
      livreur: "Koffi B.",
      statut: "en-cours",
    },
  ];

  const articlesData = [
    { id: "chemise", nom: "Chemise", prix: 1500 },
    { id: "pantalon", nom: "Pantalon", prix: 2000 },
    { id: "robe", nom: "Robe", prix: 3500 },
    { id: "costume", nom: "Costume", prix: 4000 },
    { id: "veste", nom: "Veste", prix: 5000 },
    { id: "short", nom: "Short", prix: 1000 },
    { id: "tshirt", nom: "T-shirt", prix: 1000 },
    { id: "pull", nom: "Pull", prix: 2000 },
    { id: "debardeur", nom: "Débardeur", prix: 700 },
    { id: "jupe", nom: "jupe", prix: 1000 },
  ];

  const pressings = [
    { id: "1", nom: "Clarté Nettoyage" },
    { id: "2", nom: "Naya pressing" },
    { id: "3", nom: "Express Clean" },
    { id: "4", nom: "Pressing pro" },
  ];

  const updateArticleQuantity = (articleId, delta) => {
    setArticles((prev) => ({
      ...prev,
      [articleId]: Math.max(0, prev[articleId] + delta),
    }));
  };

  const calculateTotal = () => {
    return articlesData.reduce((total, article) => {
      return total + article.prix * articles[article.id];
    }, 0);
  };

  const handleConfirmerCommande = () => {
    const total = calculateTotal();
    if (total === 0) {
      alert("Veuillez sélectionner au moins un article");
      return;
    }
    if (
      !adresseCollecte ||
      !dateCollecte ||
      !heureCollecte ||
      !telephone ||
      !pressingSelectionne
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Here you would normally send the order to your backend
    alert(`Commande confirmée!\nTotal: ${total} FCFA`);

    // Reset form
    setAdresseCollecte("");
    setDateCollecte("");
    setHeureCollecte("");
    setTelephone("");
    setPressingSelectionne("");
    setInstructions("");
    setArticles({
      chemise: 0,
      pantalon: 0,
      robe: 0,
      costume: 0,
      veste: 0,
      short: 0,
      tshirt: 0,
      pull: 0,
      debardeur: 0,
      jupe: 0,
    });
  };

  const getStatutBadge = (statut) => {
    const styles = {
      "en-collecte": "bg-gray-200 text-gray-800",
      pret: "bg-blue-500 text-white",
      "en-cours": "bg-yellow-400 text-black",
      livre: "bg-green-500 text-white",
    };

    const labels = {
      "en-collecte": "En collecte",
      pret: "Prêt",
      "en-cours": "En cours",
      livre: "Livré",
    };

    return (
      <span
        className={`px-4 py-1.5 rounded-full text-sm font-medium ${styles[statut]}`}
      >
        {labels[statut]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20"
            : "bg-white shadow-sm border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 font-bold text-lg md:text-xl">
                <div className="flex items-center space-x-2 font-bold text-lg md:text-xl">
                  <img
                    src={logo}
                    alt="Logo Pressing"
                    className="h-9 md:h-11 w-auto"
                  />
                </div>
              </div>
            </div>

            {/* Client Badge - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Client</span>
              </span>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  1
                </span>
              </button>

              {/* Desktop User Profile */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">{userName}</span>
                </div>
              </div>

              {/* Desktop Logout */}
              <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
                <LogOut className="w-6 h-6 text-gray-700" />
              </button>

              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-3 space-y-3">
                <div className="flex items-center space-x-3 py-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">{userName}</span>
                </div>
                <button className="flex items-center space-x-3 py-2 w-full text-left hover:bg-gray-50 rounded-lg px-2 transition-colors">
                  <LogOut className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 mb-24 md:mb-8">
        {/* Title Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord client
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez vos commandes de pressing ici
            </p>
          </div>

          <Button
            onClick={() => setActiveTab("nouvelle-commande")}
            className="bg-black hover:bg-gray-800 text-white font-semibold px-4 md:px-8 py-2.5 rounded-full shadow-md flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nouvelle commande</span>
            <span className="sm:hidden">Nouvelle</span>
          </Button>
        </div>

        {/* Tabs - Desktop only */}
        <div className="hidden md:block bg-white shadow-sm mb-6 overflow-hidden rounded-full">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab("mes-commandes")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "mes-commandes"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Mes commandes
            </button>
            <button
              onClick={() => setActiveTab("nouvelle-commande")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "nouvelle-commande"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Nouvelle commande
            </button>
            <button
              onClick={() => setActiveTab("pressing")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "pressing"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Pressing
            </button>
            <button
              onClick={() => setActiveTab("profil")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "profil"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Profil
            </button>
          </div>
        </div>

        {/* Orders List */}
        {activeTab === "mes-commandes" && (
          <div className="space-y-3">
            {commandes.map((commande) => (
              <div
                key={commande.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all hover:border-gray-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {commande.id}
                      </h3>
                      {getStatutBadge(commande.statut)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {commande.date} • {commande.pressing}
                    </p>
                  </div>
                </div>

                {/* Compact Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-t border-gray-100">
                  {/* Articles */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Articles
                    </p>
                    <div className="text-sm text-gray-900">
                      {commande.articles.map((article, index) => (
                        <span key={index} className="block text-xs">
                          {article.nom} ×{article.quantite}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Total
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {commande.total}
                    </p>
                  </div>

                  {/* Livraison */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Livraison
                    </p>
                    <p className="text-xs text-gray-700">
                      {commande.livraisonPrevue}
                    </p>
                  </div>

                  {/* Livreur */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Livreur
                    </p>
                    <p className="text-xs text-gray-700">{commande.livreur}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Button className="bg-black hover:bg-gray-800 text-white text-xs font-medium px-3 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Suivre</span>
                  </Button>
                  <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Order Form */}
        {activeTab === "nouvelle-commande" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Nouvelle commande
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Collection Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-4">
                    Informations de collecte
                  </h4>

                  {/* Address */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse de collecte
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={adresseCollecte}
                        onChange={(e) => setAdresseCollecte(e.target.value)}
                        placeholder="Votre Adresse complète..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <MapPin className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de collecte
                      </label>
                      <input
                        type="date"
                        value={dateCollecte}
                        onChange={(e) => setDateCollecte(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heure souhaitée
                      </label>
                      <input
                        type="time"
                        value={heureCollecte}
                        onChange={(e) => setHeureCollecte(e.target.value)}
                        placeholder="Heure..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+225 XX XX XX XX XX"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  {/* Pressing Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionner un pressing*
                    </label>
                    <div className="relative">
                      <select
                        value={pressingSelectionne}
                        onChange={(e) => setPressingSelectionne(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="">Pressing pro</option>
                        {pressings.map((pressing) => (
                          <option key={pressing.id} value={pressing.id}>
                            {pressing.nom}
                          </option>
                        ))}
                      </select>
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <MapPin className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Articles */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  Articles à Nettoyer
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {articlesData.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {article.nom}
                        </p>
                        <p className="text-sm text-gray-600">
                          {article.prix} fcfa
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateArticleQuantity(article.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900">
                          {articles[article.id]}
                        </span>
                        <button
                          onClick={() => updateArticleQuantity(article.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions particulières
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Tâches particulières et instructions de lavage...."
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-center items-center mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  Total: {calculateTotal()} FCFA
                </span>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleConfirmerCommande}
                  className="bg-black hover:bg-gray-800 text-white font-bold text-lg px-16 py-4 rounded-xl transition-colors w-full md:w-auto"
                >
                  Confirmer la commande
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pressing Tab */}
        {activeTab === "pressing" && (
          <div className="space-y-6">
            {/* Header with Location Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Pressings à proximité
              </h3>
              <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Localisation</span>
              </Button>
            </div>

            {/* Map Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="w-full h-80 bg-gray-100 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200"></div>
                <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    Carte des pressings
                  </p>
                  <p className="text-sm text-gray-500">
                    Intégration Google Maps
                  </p>
                </div>
              </div>
            </div>

            {/* Pressing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pressing Pro */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Pressing pro
                  </h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Boulevard Latrille, Cocody</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-semibold text-gray-700">
                    Tarifs:
                  </h5>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Chemise</span>
                      <span className="font-medium text-gray-900">
                        1500 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pantalon</span>
                      <span className="font-medium text-gray-900">
                        2000 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Robe</span>
                      <span className="font-medium text-gray-900">
                        3500 FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2 rounded-lg transition-colors">
                    Détails
                  </Button>
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Choisir
                  </Button>
                </div>
              </div>

              {/* Sdk */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Sdk</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Boulevard Latrille, plateau</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-semibold text-gray-700">
                    Tarifs:
                  </h5>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Chemise</span>
                      <span className="font-medium text-gray-900">
                        1200 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pantalon</span>
                      <span className="font-medium text-gray-900">
                        2500 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Robe</span>
                      <span className="font-medium text-gray-900">
                        3100 FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2 rounded-lg transition-colors">
                    Détails
                  </Button>
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Choisir
                  </Button>
                </div>
              </div>

              {/* Naya pressing */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Naya pressing
                  </h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Boulevard Latrille, yopougon</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-semibold text-gray-700">
                    Tarifs:
                  </h5>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Chemise</span>
                      <span className="font-medium text-gray-900">
                        3500 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pantalon</span>
                      <span className="font-medium text-gray-900">
                        5000 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Robe</span>
                      <span className="font-medium text-gray-900">
                        4000 FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2 rounded-lg transition-colors">
                    Détails
                  </Button>
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Choisir
                  </Button>
                </div>
              </div>

              {/* abidal pressing */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    abidal pressing
                  </h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Boulevard Latrille, angré</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-semibold text-gray-700">
                    Tarifs:
                  </h5>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Chemise</span>
                      <span className="font-medium text-gray-900">
                        1800 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pantalon</span>
                      <span className="font-medium text-gray-900">
                        2600 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Robe</span>
                      <span className="font-medium text-gray-900">
                        3000 FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2 rounded-lg transition-colors">
                    Détails
                  </Button>
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Choisir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Informations personnelles
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value="Adjoua Marie"
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value="adjoua.marie@gmail.com"
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value="+225 0506458217"
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-2.5 rounded-lg transition-colors">
                  Mettre à jour
                </Button>
              </div>
            </div>

            {/* Adresses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Adresses
              </h3>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Domicile
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Cocody Angré, Rue des Jardins
                    <br />
                    Villa n°47, Abidjan
                  </p>
                </div>

                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors border border-gray-300">
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une adresse</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-xl border-t border-white/10 shadow-2xl z-50">
        <div className="flex justify-around items-center pt-3 pb-0">
          <button
            onClick={() => setActiveTab("mes-commandes")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "mes-commandes"
                ? "text-black bg-white/30"
                : "text-gray-700"
            }`}
          >
            <Package
              className={`w-6 h-6 mb-1 ${
                activeTab === "mes-commandes" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Commandes</span>
          </button>

          <button
            onClick={() => setActiveTab("nouvelle-commande")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "nouvelle-commande"
                ? "text-black bg-white/30"
                : "text-gray-700"
            }`}
          >
            <Plus
              className={`w-6 h-6 mb-1 ${
                activeTab === "nouvelle-commande" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Nouvelle</span>
          </button>

          <button
            onClick={() => setActiveTab("pressing")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "pressing"
                ? "text-black bg-white/30"
                : "text-gray-700"
            }`}
          >
            <Store
              className={`w-6 h-6 mb-1 ${
                activeTab === "pressing" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Pressing</span>
          </button>

          <button
            onClick={() => setActiveTab("profil")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "profil"
                ? "text-black bg-white/30"
                : "text-gray-700"
            }`}
          >
            <User
              className={`w-6 h-6 mb-1 ${
                activeTab === "profil" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
