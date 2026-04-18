import React from "react";

// Pages
import Inicio from "../pages/Inicio";
import Registro from "../pages/Registro";
import Login from "../pages/Login";
import Perfiles from "../pages/Perfiles";
// Layout
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import { FaUserCircle } from "react-icons/fa";

import {Routes, Route, BrowserRouter} from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import './Plantilla.css'

const Plantilla: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { token, logout } = useAuth();
    const handleLogout = () => {
      logout();
      setIsMenuOpen(false);
    };

    return (
        <>
        <BrowserRouter>
          <div className="layout">
            <div className="header">
              <Header />
            </div>

            <div className="nav">
              <Nav />
            </div>

            <section id="content" className="content flex flex-col items-center min-h-[calc(90vh-90px)]">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/Registro" element={<Registro />} />
                <Route path="/login" element={<Login />} />
                <Route path="/perfiles" element={<Perfiles />} />
              </Routes>
            </section>

            {token && (<FaUserCircle className="boton-lateral" onClick={() => setIsMenuOpen(!isMenuOpen)}></FaUserCircle>)}
    
            <div className={`lateral ${token && isMenuOpen ? "open" : "closed"}`}>
              <Sidebar onLogout={handleLogout} />
            </div>

            <div className="footer">
              <Footer />
            </div>
          </div>
        </BrowserRouter>
        </>
    );
}

export default Plantilla;
