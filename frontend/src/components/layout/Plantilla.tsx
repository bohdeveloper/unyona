import React from "react";

// Pages
import Inicio from "../pages/Inicio";
import Home from "../pages/Home";
import Registro from "../pages/Registro";
import Login from "../pages/Login";
import Perfiles from "../pages/Perfiles";

// Layout
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import { FaUserCircle } from "react-icons/fa";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../routing/ProtectedRoute";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import "./Plantilla.css";

const Plantilla: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, perfilActivo, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Router principal de la aplicación */}
      <BrowserRouter>
        <div className="layout">
          {/* Cabecera */}
          <div className="header">
            <Header />
          </div>

          {/* Navegación principal */}
          <div className="nav">
            <Nav />
          </div>

          {/* Contenido principal */}
          <section
            id="content"
            className="content flex flex-col items-center min-h-[calc(90vh-90px)]"
          >
            <Routes>
              {/* Públicas */}              
              <Route
                path="/"
                element={
                  token
                    ? perfilActivo
                      ? <Home />
                      : <Perfiles />
                    : <Inicio />
                }
              />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Registro" element={<Registro />} />
              
              {/* Autenticado SIN perfil */}
              <Route
                path="/perfiles"
                element={
                  <ProtectedRoute>
                    <Perfiles onCloseMenu={() => setIsMenuOpen(false)} />
                  </ProtectedRoute>
                }
              />

              {/* Autenticado + perfil */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute requireProfile>
                    <Home />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </section>

          {/* Botón flotante para abrir/cerrar el menú lateral
              Solo se muestra si el usuario está autenticado */}
          {token && (            
            <button
              className="boton-lateral w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {perfilActivo ? (              
                <img
                  src={`http://localhost:5000${perfilActivo.avatar}?t=${Date.now()}`}
                  alt="Perfil activo"
                  className="rounded-full object-cover"
                />
              ) : (
                <FaUserCircle size={75} className="bg-white text-red-600 rounded-full object-cover" />
              )}
            </button>
          )}

          {/* Menú lateral (sidebar)
              - Solo se muestra si hay token
              - La clase open/closed controla la animación */}
          <div className={`lateral ${token && isMenuOpen ? "open" : "closed"}`}>
            <Sidebar onLogout={handleLogout} />
          </div>

          {/* Pie de página */}
          <div className="footer">
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default Plantilla;