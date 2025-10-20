import { useState, useEffect } from "react";
import {
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Package,
  Phone,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  DollarSign,
  Plus,
  Search,
  Eye,
  Edit,
  MapPin,
  Download,
  Mail,
  Trash2,
  Loader2,
} from "lucide-react";
import { serviceAPI } from "../services/serviceAPI";
import logo from "../assets/image/logopro.png";

export default function PressingDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ========== ÉTATS POUR LA GESTION DES SERVICES ==========
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    estimatedTime: "",
  });
  const [serviceErrors, setServiceErrors] = useState({});

  
  const pressingId = "pressing_123"; // À récupérer depuis localStorage ou context

  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Récupérer les données du pressing depuis localStorage
    const pressingData = JSON.parse(localStorage.getItem("pressing") || "{}");
    setUserName(pressingData.name || "Pressing Pro");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ========== CHARGER LES SERVICES ==========
  useEffect(() => {
    if (activeTab === "pricing") {
      loadServices();
    }
  }, [activeTab]);

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      // Récupérer l'ID du pressing depuis localStorage
      const pressingData = JSON.parse(localStorage.getItem("pressing") || "{}");
      const id = pressingData.id || pressingId;

      const result = await serviceAPI.getAll(id);

      if (result.success) {
        setServices(result.services);
      } else {
        console.error("Erreur:", result.message);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      alert("Impossible de charger les services. Vérifiez votre connexion.");
    } finally {
      setLoadingServices(false);
    }
  };

  // ========== VALIDATION DU FORMULAIRE ==========
  const validateServiceForm = () => {
    const errors = {};

    if (!serviceForm.name || serviceForm.name.trim().length < 3) {
      errors.name = "Le nom doit contenir au moins 3 caractères";
    }

    if (!serviceForm.category) {
      errors.category = "Veuillez sélectionner une catégorie";
    }

    if (!serviceForm.price || parseFloat(serviceForm.price) <= 0) {
      errors.price = "Le prix doit être supérieur à 0";
    }

    if (
      serviceForm.estimatedTime &&
      parseFloat(serviceForm.estimatedTime) < 0
    ) {
      errors.estimatedTime = "Le temps doit être positif";
    }

    setServiceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ========== AJOUTER UN SERVICE ==========
  const handleAddService = async () => {
    if (!validateServiceForm()) return;

    setLoadingServices(true);
    try {
      const pressingData = JSON.parse(localStorage.getItem("pressing") || "{}");
      const id = pressingData.id || pressingId;

      const result = await serviceAPI.create(id, {
        name: serviceForm.name.trim(),
        category: serviceForm.category,
        price: parseFloat(serviceForm.price),
        description: serviceForm.description?.trim() || "",
        estimatedTime: serviceForm.estimatedTime
          ? parseFloat(serviceForm.estimatedTime)
          : null,
      });

      if (result.success) {
        setServices([...services, result.service]);
        setShowServiceModal(false);
        resetServiceForm();
        alert("Service ajouté avec succès !");
      } else {
        alert(result.message || "Erreur lors de l'ajout du service");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout du service");
    } finally {
      setLoadingServices(false);
    }
  };

  // ========== MODIFIER UN SERVICE ==========
  const handleUpdateService = async () => {
    if (!validateServiceForm() || !editingService) return;

    setLoadingServices(true);
    try {
      const result = await serviceAPI.update(editingService.id, {
        name: serviceForm.name.trim(),
        category: serviceForm.category,
        price: parseFloat(serviceForm.price),
        description: serviceForm.description?.trim() || "",
        estimatedTime: serviceForm.estimatedTime
          ? parseFloat(serviceForm.estimatedTime)
          : null,
      });

      if (result.success) {
        setServices(
          services.map((s) => (s.id === editingService.id ? result.service : s))
        );
        setShowServiceModal(false);
        resetServiceForm();
        alert("Service modifié avec succès !");
      } else {
        alert(result.message || "Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification du service");
    } finally {
      setLoadingServices(false);
    }
  };

  // ========== SUPPRIMER UN SERVICE ==========
  const handleDeleteService = async (serviceId, serviceName) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer "${serviceName}" ?\n\nCette action est irréversible.`
    );

    if (!confirmed) return;

    setLoadingServices(true);
    try {
      const result = await serviceAPI.delete(serviceId);

      if (result.success) {
        setServices(services.filter((s) => s.id !== serviceId));
        alert("Service supprimé avec succès !");
      } else {
        alert(result.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression du service");
    } finally {
      setLoadingServices(false);
    }
  };

  // ========== GESTION DU MODAL ==========
  const openAddModal = () => {
    resetServiceForm();
    setEditingService(null);
    setShowServiceModal(true);
  };

  const openEditModal = (service) => {
    setServiceForm({
      name: service.name,
      category: service.category,
      price: service.price.toString(),
      description: service.description || "",
      estimatedTime: service.estimatedTime
        ? service.estimatedTime.toString()
        : "",
    });
    setEditingService(service);
    setServiceErrors({});
    setShowServiceModal(true);
  };

  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      category: "",
      price: "",
      description: "",
      estimatedTime: "",
    });
    setServiceErrors({});
    setEditingService(null);
  };

  const handleSubmitService = (e) => {
    e.preventDefault();
    if (editingService) {
      handleUpdateService();
    } else {
      handleAddService();
    }
  };

  // Statistics
  const stats = {
    todayOrders: 8,
    pendingOrders: 3,
    completedOrders: 5,
    todayRevenue: 45000,
    monthlyRevenue: 850000,
  };

  // Orders data
  const myOrders = [
    {
      id: "CMD001",
      clientEmail: "marie.kone@email.com",
      clientProfile: {
        name: "Marie Koné",
        phone: "+225 07 12 34 56",
      },
      status: "pending",
      createdAt: "2025-01-19T09:00:00",
      items: [
        { name: "Chemise", quantity: 2 },
        { name: "Pantalon", quantity: 1 },
      ],
      total: 8500,
    },
    {
      id: "CMD002",
      clientEmail: "yao.samuel@email.com",
      clientProfile: {
        name: "Yao Samuel",
        phone: "+225 05 67 89 12",
      },
      status: "in_progress",
      createdAt: "2025-01-19T10:30:00",
      items: [
        { name: "Costume", quantity: 1 },
        { name: "Cravate", quantity: 2 },
      ],
      total: 15000,
    },
    {
      id: "CMD003",
      clientEmail: "fatou.diallo@email.com",
      clientProfile: {
        name: "Fatou Diallo",
        phone: "+225 01 23 45 67",
      },
      status: "ready_for_delivery",
      createdAt: "2025-01-18T16:00:00",
      items: [
        { name: "Robe", quantity: 1 },
        { name: "Jupe", quantity: 1 },
      ],
      total: 12000,
    },
    {
      id: "CMD004",
      clientEmail: "aya.traore@email.com",
      clientProfile: {
        name: "Aya Traoré",
        phone: "+225 02 34 56 78",
      },
      status: "delivered",
      createdAt: "2025-01-18T14:00:00",
      items: [
        { name: "Manteau", quantity: 1 },
        { name: "Chemise", quantity: 3 },
      ],
      total: 13500,
    },
  ];

  // Delivery persons data
  const deliveryPersons = [
    {
      name: "Kouame Adama",
      phone: "+225 07 09 87 65 43",
      zone: "Cocody",
      available: true,
      rating: 4.8,
    },
    {
      name: "Aminata Touré",
      phone: "+225 05 12 34 56 78",
      zone: "Plateau",
      available: false,
      rating: 4.6,
    },
    {
      name: "Ibrahim Koné",
      phone: "+225 01 98 76 54 32",
      zone: "Yopougon",
      available: true,
      rating: 4.9,
    },
  ];

  const getStatusLabel = (status) => {
    const labels = {
      pending: "En attente",
      in_progress: "En cours",
      ready_for_pickup: "Prêt pour collecte",
      ready_for_delivery: "Prêt pour livraison",
      delivered: "Livré",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      ready_for_pickup: "bg-purple-100 text-purple-800",
      ready_for_delivery: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getNextStatus = (currentStatus) => {
    const nextStatuses = {
      pending: "in_progress",
      in_progress: "ready_for_delivery",
      ready_for_delivery: "delivered",
    };
    return nextStatuses[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      pending: "Démarrer",
      in_progress: "Prêt",
      ready_for_delivery: "Livrer",
    };
    return labels[currentStatus];
  };

  const handleStatusUpdate = (id, newStatus) => {
    console.log(`Updating order ${id} to status: ${newStatus}`);
    alert(`Commande ${id} mise à jour vers: ${getStatusLabel(newStatus)}`);
  };

  const filteredOrders = myOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientProfile?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.clientProfile?.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

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
            <div className="flex items-center">
              <div className="flex items-center space-x-2 font-bold text-lg md:text-xl">
                <img
                  src={logo}
                  alt="Logo Pressing"
                  className="h-9 md:h-11 w-auto"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">{userName}</span>
                </div>
              </div>

              <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
                <LogOut className="w-6 h-6 text-gray-700" />
              </button>

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{userName}</h1>
          <p className="text-gray-600">
            Gérez vos commandes et optimisez votre activité
          </p>
        </div>

        {/* Tabs - Desktop only */}
        <div className="hidden md:block bg-white shadow-sm mb-6 overflow-hidden rounded-full">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "orders"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Commandes
            </button>
            <button
              onClick={() => setActiveTab("pricing")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "pricing"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tarifs
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "delivery"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Livreurs
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "invoices"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Factures
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 px-6 py-2.5 text-center font-medium rounded-full transition-all ${
                activeTab === "stats"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Statistiques
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Aujourd'hui</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.todayOrders}
                    </p>
                  </div>
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">En attente</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pendingOrders}
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Terminées</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.completedOrders}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">CA Jour</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.todayRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">CA Mois</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Orders Management Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Gestion des commandes
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Suivez et gérez toutes vos commandes
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nouvelle commande
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                  <div className="flex items-center space-x-2 flex-1">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, numéro ou téléphone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="ready_for_pickup">Prêt pour collecte</option>
                    <option value="ready_for_delivery">
                      Prêt pour livraison
                    </option>
                    <option value="delivered">Livré</option>
                  </select>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Commande
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Client
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Articles
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Statut
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Total
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              #{order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              {order.clientProfile?.name || order.clientEmail}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {order.clientProfile?.phone || "N/A"}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">
                            {order.items
                              ?.map((item) => `${item.name} x${item.quantity}`)
                              .join(", ") || "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium text-gray-900">
                            {order.total || 0} FCFA
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              {getNextStatus(order.status) && (
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      order.id,
                                      getNextStatus(order.status)
                                    )
                                  }
                                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  {getNextStatusLabel(order.status)}
                                </button>
                              )}
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-12 text-gray-500"
                          >
                            Aucune commande trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== PRICING TAB - GESTION DES SERVICES ========== */}
        {activeTab === "pricing" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Grille tarifaire
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Gérez vos prix et services ({services.length} service
                    {services.length > 1 ? "s" : ""})
                  </p>
                </div>
                <button
                  onClick={openAddModal}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau service
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingServices ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="ml-3 text-gray-600">Chargement...</span>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <DollarSign className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">
                    Aucun service disponible
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Commencez par ajouter votre premier service
                  </p>
                  <button
                    onClick={openAddModal}
                    className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un service
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Service
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Catégorie
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Prix (FCFA)
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Temps estimé
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr
                          key={service.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              {service.name}
                            </div>
                            {service.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {service.description}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                              {service.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            {service.price.toLocaleString()} FCFA
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {service.estimatedTime
                              ? `${service.estimatedTime}h`
                              : "Non spécifié"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => openEditModal(service)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteService(service.id, service.name)
                                }
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delivery Tab */}
        {activeTab === "delivery" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Gestion des livreurs
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Assignez des livreurs aux commandes
                  </p>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter un livreur
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveryPersons.map((person) => (
                  <div
                    key={person.name}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {person.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Zone: {person.zone}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          person.available
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {person.available ? "Disponible" : "Occupé"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <p className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {person.phone}
                      </p>
                      <p className="flex items-center gap-2 text-gray-700">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Note: {person.rating}/5
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Assigner
                      </button>
                      <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Gestion des factures
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Générez et envoyez vos factures
                  </p>
                </div>
                <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="all">Toutes les factures</option>
                  <option value="paid">Payées</option>
                  <option value="pending">En attente</option>
                  <option value="overdue">En retard</option>
                </select>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Facture
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Montant
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Statut
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          FAC-{order.id}
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {order.clientProfile?.name || order.clientEmail}
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {order.total || 0} FCFA
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Payée
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Mail className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance mensuelle */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Performance mensuelle
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">Commandes traitées</span>
                    <span className="font-bold text-gray-900">
                      {myOrders.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">Chiffre d'affaires</span>
                    <span className="font-bold text-green-600">
                      {stats.monthlyRevenue.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">Commandes terminées</span>
                    <span className="font-bold text-gray-900">
                      {stats.completedOrders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Taux de satisfaction</span>
                    <span className="font-bold text-gray-900">4.7/5 ⭐</span>
                  </div>
                </div>
              </div>

              {/* Statistiques du jour */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Statistiques du jour
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">Nouvelles commandes</span>
                    <span className="font-bold text-gray-900">
                      {stats.todayOrders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">CA du jour</span>
                    <span className="font-bold text-green-600">
                      {stats.todayRevenue.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">En attente</span>
                    <span className="font-bold text-yellow-600">
                      {stats.pendingOrders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Terminées</span>
                    <span className="font-bold text-green-600">
                      {stats.completedOrders}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique de performance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Évolution du chiffre d'affaires
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    Graphique de performance
                  </p>
                  <p className="text-sm text-gray-500">
                    Intégration de graphique à venir
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========== MODAL D'AJOUT/MODIFICATION DE SERVICE ========== */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingService ? "Modifier le service" : "Nouveau service"}
                </h3>
                <button
                  onClick={() => {
                    setShowServiceModal(false);
                    resetServiceForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitService} className="p-6 space-y-4">
              {/* Nom du service */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nom du service <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => {
                    setServiceForm({ ...serviceForm, name: e.target.value });
                    if (serviceErrors.name) {
                      const newErrors = { ...serviceErrors };
                      delete newErrors.name;
                      setServiceErrors(newErrors);
                    }
                  }}
                  placeholder="Ex: Chemise, Pantalon, Costume"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    serviceErrors.name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-black"
                  }`}
                  required
                />
                {serviceErrors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {serviceErrors.name}
                  </p>
                )}
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => {
                    setServiceForm({
                      ...serviceForm,
                      category: e.target.value,
                    });
                    if (serviceErrors.category) {
                      const newErrors = { ...serviceErrors };
                      delete newErrors.category;
                      setServiceErrors(newErrors);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    serviceErrors.category
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-black"
                  }`}
                  required
                >
                  <option value="">Sélectionner une catégorie...</option>
                  <option value="Lavage Standard">Lavage Standard</option>
                  <option value="Nettoyage à sec">Nettoyage à sec</option>
                  <option value="Repassage">Repassage</option>
                  <option value="Détachage">Détachage</option>
                  <option value="Express">Service Express</option>
                </select>
                {serviceErrors.category && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {serviceErrors.category}
                  </p>
                )}
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prix (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) => {
                    setServiceForm({ ...serviceForm, price: e.target.value });
                    if (serviceErrors.price) {
                      const newErrors = { ...serviceErrors };
                      delete newErrors.price;
                      setServiceErrors(newErrors);
                    }
                  }}
                  placeholder="Ex: 2500"
                  min="0"
                  step="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    serviceErrors.price
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-black"
                  }`}
                  required
                />
                {serviceErrors.price && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {serviceErrors.price}
                  </p>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loadingServices}
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingServices ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingService ? "Modification..." : "Ajout..."}
                    </>
                  ) : (
                    <>
                      {editingService ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Modifier
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Ajouter
                        </>
                      )}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    resetServiceForm();
                  }}
                  disabled={loadingServices}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-xl border-t border-white/10 shadow-2xl z-50">
        <div className="flex justify-around items-center pt-3 pb-0">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "orders"
                ? "text-black bg-white/30"
                : "text-gray-700"
            }`}
          >
            <Package
              className={`w-6 h-6 mb-1 ${
                activeTab === "orders" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Commandes</span>
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "pricing"
                ? "text-black bg-white/30"
                : "text-gray-700"
            }`}
          >
            <DollarSign
              className={`w-6 h-6 mb-1 ${
                activeTab === "pricing" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Tarifs</span>
          </button>

          <button
            onClick={() => setActiveTab("delivery")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "delivery"
                ? "text-black bg-white/30"
                : "text-gray-700"
            }`}
          >
            <MapPin
              className={`w-6 h-6 mb-1 ${
                activeTab === "delivery" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Livreurs</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "invoices"
                ? "text-black bg-white/30"
                : "text-gray-700"
            }`}
          >
            <Mail
              className={`w-6 h-6 mb-1 ${
                activeTab === "invoices" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Factures</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === "stats" ? "text-black bg-white/30" : "text-gray-700"
            }`}
          >
            <TrendingUp
              className={`w-6 h-6 mb-1 ${
                activeTab === "stats" ? "stroke-2" : ""
              }`}
            />
            <span className="text-xs font-medium">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
