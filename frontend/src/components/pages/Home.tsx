import React from "react";
import { useMe } from "../../hooks/useMe";

const Home: React.FC = () => {
    const usuario = useMe();
return (
    <>
    <div className="items-center mt-20 max-w-[120vh] min-h-[50vh] text-center">
        <h1 className="text-start font-bold text-8xl max-w-[60vh]">
            {usuario && <p>Hola, {usuario.nombre}</p>}
        </h1>

        <h2 className="font-bold text-3xl mt-4 pb-2 text-start">
            Que deseas hacer.
        </h2>                            
    </div>
  </>
  );
};

export default Home;