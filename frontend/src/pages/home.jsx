import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Store, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "../pages/form"; // Ajoutez cette ligne
import PressingAuthModal from "../pages/preform";

import linge from "../assets/image/linge.jpg";
import logo from "../assets/image/logopro.png";
import machine from "../assets/icons/machine.png";
import nettoyage from "../assets/icons/nettoyage.png";
import repassage from "../assets/icons/repassage.png";
import tempsRapide from "../assets/icons/temps-rapide.png";
import livraisonRapide from "../assets/icons/livraison-rapide.png";
import paiementSecurise from "../assets/icons/paiement-securise.png";
import laSatisfaction from "../assets/icons/la-satisfaction.png";
import nouveauCompte from "../assets/icons/nouveau-compte.png";
import magasin from "../assets/icons/magasin (1).png";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const [showPressingAuthModal, setShowPressingAuthModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e1eff4] to-[#FFFFFF] text-[#000000]">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-[#F0F0F2]/35 backdrop-blur-md shadow-lg"
            : "bg-[#F0F0F2] shadow-md"
        }`}
      >
        <div className="flex items-center space-x-2 font-bold text-lg md:text-xl">
          <img src={logo} alt="Logo Pressing" className="h-9 md:h-11 w-auto" />
        </div>

        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => scrollToSection("services")}
            className="px-4 py-1 rounded-full bg-[#FFFFFF] border border-[#000000] shadow-md hover:shadow-lg transition-shadow"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection("plateforme")}
            className="px-4 py-1 rounded-full bg-[#FFFFFF] border border-[#000000] shadow-md hover:shadow-lg transition-shadow"
          >
            Plateforme
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="px-4 py-1 rounded-full bg-[#FFFFFF] border border-[#000000] shadow-md hover:shadow-lg transition-shadow"
          >
            Contact
          </button>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-1 rounded-full bg-[#FFFFFF] border border-[#000000] shadow-md hover:shadow-lg transition-shadow"
          >
            Se connecter
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-1 rounded-full bg-[#000000] text-[#FFFFFF] shadow-md hover:shadow-lg flex items-center space-x-1 transition-shadow"
          >
            <span>👤</span>
            <span>S'inscrire</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed top-[72px] left-0 right-0 shadow-lg md:hidden z-40 transition-all duration-300 ease-in-out ${
          scrolled ? "bg-[#F0F0F2]/35 backdrop-blur-md" : "bg-[#F0F0F2]"
        } ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-3">
          <button
            onClick={() => scrollToSection("services")}
            className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#000000] shadow-md hover:shadow-lg text-left transition-shadow"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection("plateforme")}
            className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#000000] shadow-md hover:shadow-lg text-left transition-shadow"
          >
            Plateforme
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#000000] shadow-md hover:shadow-lg text-left transition-shadow"
          >
            Contact
          </button>
          <hr className="border-gray-300" />
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#000000] shadow-md hover:shadow-lg text-left transition-shadow"
          >
            Se connecter
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-full bg-[#000000] text-[#FFFFFF] shadow-md hover:shadow-lg flex items-center space-x-2 transition-shadow"
          >
            <span>👤</span>
            <span>S'inscrire</span>
          </button>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="w-full grid grid-cols-1 md:grid-cols-2 items-center py-24 md:py-32 gap-8 md:gap-12 px-4 md:px-12 mt-16">
        <div className="space-y-6 text-center md:text-left animate-fade-in">
          <span className="inline-block bg-[#000000] text-[#FFFFFF] px-4 py-1 rounded-full text-xs md:text-sm">
            Du nouveau en Côte d'Ivoire
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-snug md:leading-tight">
            Votre pressing à <br className="hidden md:block" /> portée de{" "}
            <span className="text-[#3ABEFF]">clic</span>
          </h1>

          <p className="text-base md:text-lg text-[#000000] max-w-lg mx-auto md:mx-0">
            Commandez, suivez et payez vos services de lavage en ligne. <br />
            Collecte et livraison à domicile garanties.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <Button className="bg-[#3ABEFF] hover:bg-[#2a9dcc] text-[#FFFFFF] font-semibold flex items-center justify-center space-x-2 px-6 py-3 rounded-md shadow-lg w-full md:w-auto transition-all hover:scale-105">
              <MapPin className="w-5 h-5" />
              <span>Localiser un pressing</span>
            </Button>

            <Button className="bg-[#FFFFFF] border border-[#000000] text-[#000000] hover:bg-[#D3D3D3] flex items-center justify-center space-x-2 px-6 py-3 rounded-md shadow-md w-full md:w-auto transition-all hover:scale-105">
              <Store className="w-5 h-5" />
              <span>Pressing dispo</span>
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-8 md:mt-0 animate-slide-in">
          <img
            src={linge}
            alt="Panier de linge"
            className="object-cover w-[300px] h-[350px] md:w-[470px] md:h-[541px] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
          />
        </div>
      </main>

      {/* Services Section */}
      <section
        id="services"
        className="py-16 px-6 md:px-12 bg-white scroll-mt-20"
      >
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Nos services
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Des services de pressing professionnel adaptés à tous vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-center">
              <h3 className="text-xl font-bold text-black mb-4">
                Lavage Standard
              </h3>
              <div className="mb-6 flex justify-center">
                <img
                  src={machine}
                  alt="Lavage Standard"
                  className="w-20 h-20"
                />
              </div>
              <p className="text-black text-sm">
                Nettoyage professionnel de vos vêtements du quotidien
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-center">
              <h3 className="text-xl font-bold text-black mb-4">
                Nettoyage à Sec
              </h3>
              <div className="mb-6 flex justify-center">
                <img
                  src={nettoyage}
                  alt="Nettoyage à Sec"
                  className="w-20 h-20"
                />
              </div>
              <p className="text-black text-sm">
                Traitement spécialisé pour vos pièces délicates
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-center">
              <h3 className="text-xl font-bold text-black mb-4">
                Repassage Express
              </h3>
              <div className="mb-6 flex justify-center">
                <img
                  src={repassage}
                  alt="Repassage Express"
                  className="w-20 h-20"
                />
              </div>
              <p className="text-black text-sm">
                Service de repassage rapide et soigné
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center transform transition-transform hover:scale-105">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <img src={tempsRapide} alt="Service Rapide" className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-black mb-2">Service Rapide</h4>
            <p className="text-black text-sm">
              Collecte et livraison en 24-72h maximum
            </p>
          </div>

          <div className="text-center transform transition-transform hover:scale-105">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <img
                src={livraisonRapide}
                alt="Livraison possible"
                className="w-8 h-8"
              />
            </div>
            <h4 className="font-bold text-black mb-2">Livraison possible</h4>
            <p className="text-black text-sm">
              Collecte et livraison à domicile incluses
            </p>
          </div>

          <div className="text-center transform transition-transform hover:scale-105">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <img
                src={paiementSecurise}
                alt="Paiement mobile"
                className="w-8 h-8"
              />
            </div>
            <h4 className="font-bold text-black mb-2">Paiement mobile</h4>
            <p className="text-black text-sm">
              Orange Money, MTN Money et Wave acceptés
            </p>
          </div>

          <div className="text-center transform transition-transform hover:scale-105">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <img
                src={laSatisfaction}
                alt="Service de qualité"
                className="w-8 h-8"
              />
            </div>
            <h4 className="font-bold text-black mb-2">Service de qualité</h4>
            <p className="text-black text-sm">Satisfaction garantie</p>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section
        id="plateforme"
        className="py-16 px-6 md:px-12 bg-white scroll-mt-20"
      >
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Rejoignez notre plateforme
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Que vous soyez client, livreur ou propriétaire de pressing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={nouveauCompte} alt="Client" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                Je suis Client
              </h3>
              <p className="text-black text-sm mb-6">
                Commandez votre pressing en ligne et suivez votre commande
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md w-full transition-all"
              >
                Trouver un pressing
              </Button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={livraisonRapide} alt="Livreur" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                Je suis Livreur
              </h3>
              <p className="text-black text-sm mb-6">
                Rejoignez notre équipe et effectuez des livraisons
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-white border border-black text-black hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg shadow-md w-full transition-all"
              >
                S'inscrire
              </Button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src={magasin} alt="Propriétaire" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                J'ai un pressing
              </h3>
              <p className="text-black text-sm mb-6">
                Digitalisez votre pressing et augmentez votre clientèle
              </p>
              {/* Bouton Partenaire */}
              <Button
                onClick={() => setShowPressingAuthModal(true)}
                className="bg-white border border-black text-black hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg shadow-md w-full transition-all"
              >
                Partenaire
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-black py-16 px-6 md:px-12 scroll-mt-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à commencer?
          </h2>
          <p className="text-lg text-white mb-8">
            Rejoignez des centaines de clients satisfaits
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-8 py-4 rounded-lg shadow-md text-lg transition-all hover:scale-105"
          >
            Trouver un pressing à proximité
          </Button>
        </div>
      </footer>

      {/* Modal d'authentification - DOIT ÊTRE ICI, À LA FIN */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Modal d'authentification pressing */}
      <PressingAuthModal
        isOpen={showPressingAuthModal}
        onClose={() => setShowPressingAuthModal(false)}
      />
    </div>
  );
}
