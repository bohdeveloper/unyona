import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMe } from "../../hooks/useMe";
import { useNavigate } from "react-router-dom";
import './Sidebar.css';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const usuario = useMe();
    const navigate = useNavigate();
    return (
        <>
        <aside>
            <div className="flex items-center justify-center gap-2 mt-6">
              <p className="text-white text-2xl">
              ·
              </p>
              <span className="w-10 h-[1px] bg-red-600"></span>
              <h2 className='pb-1 text-red-800 text-4xl'>{usuario && <p>{usuario.nombre}</p>}</h2>                
            </div>
            <ul className='pl-5'>
                <li className='text-gray-300'><NavLink to="/perfiles">Perfiles</NavLink></li>
                <li className='text-gray-300'><NavLink to="/ayuda">Ayuda</NavLink></li>
                <li className='text-gray-300 cursor-pointer' onClick={() => {onLogout(); navigate("/");}}>Cerrar sesión</li>
            </ul>
        </aside>
        </>
    );
};

export default Sidebar;