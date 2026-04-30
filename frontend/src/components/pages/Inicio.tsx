import React from "react";
import { NavLink } from 'react-router-dom';

const Inicio: React.FC = () => {
return (
    <>
    <div className="items-center mt-20 max-w-[120vh] min-h-[50vh] text-center">
      <h1 className="font-bold text-8xl">
        Tu sitio para conocer gente de tu zona y hacer planes
      </h1>

      <h2 className="font-bold text-4xl mt-4">
        Somos personas sociales
      </h2>
      
      <div className="flex items-center justify-center gap-2 mt-6">
        <p className="text-2xl">
          Que es el éxito si estás solo
        </p>
        <span className="w-10 h-[1px] bg-rose-400"></span>
        <NavLink className="hover:text-rose-400 text-2xl" to="/registro"> Registrate</NavLink>
      </div>
    </div>
  </>
  );
};

export default Inicio;