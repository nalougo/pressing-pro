import { useState } from "react";
import {
  User,
  Lock,
  Phone,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import du service d'authentification
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const authService = {
  login: async (phone, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    return response.json();
  },

  register: async (name, phone, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password }),
    });
    return response.json();
  },
};

export default function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("connexion");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  // États de validation
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // État connexion
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // État inscription
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation du téléphone ivoirien
  const validatePhone = (phone) => {
    const phoneRegex = /^(\+225|225)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Validation du mot de passe
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Validation du nom
  const validateName = (name) => {
    return name.trim().length >= 3;
  };

  // Gestionnaire de validation en temps réel
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };

    switch (field) {
      case "loginPhone":
        if (!loginPhone) {
          newErrors.loginPhone = "Le numéro de téléphone est requis";
        } else if (!validatePhone(loginPhone)) {
          newErrors.loginPhone = "Format invalide (ex: +225 0123456789)";
        } else {
          delete newErrors.loginPhone;
        }
        break;
      case "loginPassword":
        if (!loginPassword) {
          newErrors.loginPassword = "Le mot de passe est requis";
        } else if (loginPassword.length < 8) {
          newErrors.loginPassword = "Minimum 8 caractères";
        } else {
          delete newErrors.loginPassword;
        }
        break;
      case "signupName":
        if (!signupName) {
          newErrors.signupName = "Le nom est requis";
        } else if (!validateName(signupName)) {
          newErrors.signupName = "Le nom doit contenir au moins 3 caractères";
        } else {
          delete newErrors.signupName;
        }
        break;
      case "signupPhone":
        if (!signupPhone) {
          newErrors.signupPhone = "Le numéro de téléphone est requis";
        } else if (!validatePhone(signupPhone)) {
          newErrors.signupPhone = "Format invalide (ex: +225 0123456789)";
        } else {
          delete newErrors.signupPhone;
        }
        break;
      case "signupPassword":
        if (!signupPassword) {
          newErrors.signupPassword = "Le mot de passe est requis";
        } else if (!validatePassword(signupPassword)) {
          newErrors.signupPassword = "Minimum 8 caractères requis";
        } else {
          delete newErrors.signupPassword;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction de connexion modifiée
  const handleLogin = async () => {
    const fieldsToValidate = ["loginPhone", "loginPassword"];
    const newTouched = {};
    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    fieldsToValidate.forEach((field) => validateField(field));

    if (!validatePhone(loginPhone) || !validatePassword(loginPassword)) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const result = await authService.login(loginPhone, loginPassword);

      if (result.success) {
        // Stocker les données dans localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Réinitialiser le formulaire
        setLoginPhone("");
        setLoginPassword("");
        setErrors({});
        setTouched({});

        navigate("/client");

        // Fermer le modal
        onClose();
      } else {
        setApiError(result.message || "Erreur de connexion");
      }
    } catch (error) {
      setApiError("Erreur serveur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription modifiée
  const handleSignup = async () => {
    const fieldsToValidate = ["signupName", "signupPhone", "signupPassword"];
    const newTouched = {};
    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    fieldsToValidate.forEach((field) => validateField(field));

    if (!acceptTerms) {
      setErrors({ ...errors, terms: "Vous devez accepter les conditions" });
      return;
    }

    if (
      !validateName(signupName) ||
      !validatePhone(signupPhone) ||
      !validatePassword(signupPassword)
    ) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const result = await authService.register(
        signupName,
        signupPhone,
        signupPassword
      );

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        setLoginPhone("");
        setLoginPassword("");
        setErrors({});
        setTouched({});

        navigate("/client"); // ← Ajoutez cette ligne
        onClose();
      } else {
        setApiError(result.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setApiError("Erreur serveur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-[320px] sm:max-w-sm animate-in fade-in zoom-in duration-200">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-black text-white p-3 sm:p-4 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-base">🧺</span>
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold">Pressing Pro</h2>
                <p className="text-gray-300 text-xs">
                  Votre pressing de confiance
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-50 p-1.5 border-b border-gray-100">
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  setActiveTab("connexion");
                  setErrors({});
                  setTouched({});
                  setApiError("");
                }}
                className={`flex-1 px-3 sm:px-4 py-2 text-center text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "connexion"
                    ? "bg-gradient-to-r from-gray-900 to-black text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  setActiveTab("inscription");
                  setErrors({});
                  setTouched({});
                  setApiError("");
                }}
                className={`flex-1 px-4 py-2.5 text-center text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "inscription"
                    ? "bg-gradient-to-r from-gray-900 to-black text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Inscription
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-3 sm:p-4 max-h-[70vh] overflow-y-auto">
            {/* Afficher les erreurs API */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800">{apiError}</p>
              </div>
            )}

            {/* Formulaire de connexion */}
            {activeTab === "connexion" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900">
                      Information
                    </p>
                    <p className="text-xs text-blue-800">
                      Utilisez votre numéro de téléphone
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => {
                        setLoginPhone(e.target.value);
                        if (touched.loginPhone) validateField("loginPhone");
                      }}
                      onBlur={() => handleBlur("loginPhone")}
                      placeholder="+225 0123456789"
                      className={`w-full text-sm pl-10 pr-3 py-3 bg-gray-50 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                        errors.loginPhone && touched.loginPhone
                          ? "border-red-300 focus:ring-red-500/20"
                          : "border-gray-200 focus:ring-black/20 focus:border-gray-400"
                      }`}
                    />
                  </div>
                  {errors.loginPhone && touched.loginPhone && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.loginPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (touched.loginPassword)
                          validateField("loginPassword");
                      }}
                      onBlur={() => handleBlur("loginPassword")}
                      placeholder="••••••••"
                      className={`w-full text-sm pl-10 pr-10 py-3 bg-gray-50 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                        errors.loginPassword && touched.loginPassword
                          ? "border-red-300 focus:ring-red-500/20"
                          : "border-gray-200 focus:ring-black/20 focus:border-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.loginPassword && touched.loginPassword && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.loginPassword}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white text-sm font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </div>
            )}

            {/* Formulaire d'inscription */}
            {activeTab === "inscription" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => {
                        setSignupName(e.target.value);
                        if (touched.signupName) validateField("signupName");
                      }}
                      onBlur={() => handleBlur("signupName")}
                      placeholder="Jean François Kouassi"
                      className={`w-full text-sm pl-10 pr-3 py-3 bg-gray-50 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                        errors.signupName && touched.signupName
                          ? "border-red-300 focus:ring-red-500/20"
                          : "border-gray-200 focus:ring-black/20 focus:border-gray-400"
                      }`}
                    />
                  </div>
                  {errors.signupName && touched.signupName && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.signupName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => {
                        setSignupPhone(e.target.value);
                        if (touched.signupPhone) validateField("signupPhone");
                      }}
                      onBlur={() => handleBlur("signupPhone")}
                      placeholder="+225 0123456789"
                      className={`w-full text-sm pl-10 pr-3 py-3 bg-gray-50 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                        errors.signupPhone && touched.signupPhone
                          ? "border-red-300 focus:ring-red-500/20"
                          : "border-gray-200 focus:ring-black/20 focus:border-gray-400"
                      }`}
                    />
                  </div>
                  {errors.signupPhone && touched.signupPhone && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.signupPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (touched.signupPassword)
                          validateField("signupPassword");
                      }}
                      onBlur={() => handleBlur("signupPassword")}
                      placeholder="••••••••"
                      className={`w-full text-sm pl-10 pr-10 py-3 bg-gray-50 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                        errors.signupPassword && touched.signupPassword
                          ? "border-red-300 focus:ring-red-500/20"
                          : "border-gray-200 focus:ring-black/20 focus:border-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSignupPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.signupPassword && touched.signupPassword ? (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.signupPassword}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1.5">
                      Minimum 8 caractères
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600">
                    J'accepte les conditions d'utilisation
                  </label>
                </div>

                {errors.terms && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.terms}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white text-sm font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Créer mon compte
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
