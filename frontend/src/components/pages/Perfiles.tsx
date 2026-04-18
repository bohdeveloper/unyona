import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import avatar from "../../assets/images/avatar-inicial.png";
import { useRef } from "react";

import './Perfiles.css';
interface Perfil {
  nombrePerfil: string;
  avatar: string;
  esInfantil: boolean;
}

export default function Perfiles() {
  const { token } = useAuth();
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [error, setError] = useState("");

  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [perfilEditando, setPerfilEditando] = useState<number | null>(null);
  const esEdicion = perfilEditando !== null;
  const [nombrePerfil, setNombrePerfil] = useState("");
  const [esInfantil, setEsInfantil] = useState(false);
  const [loading, setLoading] = useState(false);
  const { seleccionarPerfil } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchPerfiles = async () => {
      try {
        const res = await fetch("http://localhost:5000/perfiles", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Error al cargar perfiles");
          return;
        }

        setPerfiles(data);
      } catch {
        setError("Error de conexión");
      }
    };

    fetchPerfiles();
  }, [token]);

  const seleccionarPerfilActivo = async (index: number) => {
    try {
      const res = await fetch(
        "http://localhost:5000/perfiles/seleccionar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ index })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al seleccionar perfil");
        return;
      }
      console.log(data);
      seleccionarPerfil(data.token, data.perfilActivo);
    } catch {
      setError("Error de conexión");
    }
  };

  const crearPerfil = async () => {
  if (!nombrePerfil) return;

  setLoading(true);
  
  const url = esEdicion
    ? `http://localhost:5000/perfiles/${perfilEditando}`
    : "http://localhost:5000/perfiles";

  const method = esEdicion ? "PUT" : "POST";

  const formData = new FormData();
  formData.append("nombrePerfil", nombrePerfil);
  formData.append("esInfantil", String(esInfantil));

  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  const res = await fetch(url, {
  method,
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: formData
});


  const data = await res.json();

  if (!res.ok) {
    setError(data.message);
    setLoading(false);
    return;
  }

  setNombrePerfil("");
  setAvatarPreview(null);
  setAvatarFile(null);
  setEsInfantil(false);
  setMostrandoFormulario(false);
  setLoading(false);

  if (esEdicion) {
    setPerfilEditando(null);
    setMostrandoFormulario(false);
    setPerfiles(prev =>
      prev.map((p, i) => (i === perfilEditando ? data : p))
    );
  } else {
    setPerfiles(data);
  }

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
  
};

const eliminarPerfil = async (index: number) => {
  const confirmar = window.confirm(
    "¿Seguro que quieres eliminar este perfil?"
  );

  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:5000/perfiles/${index}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Error al eliminar perfil");
      return;
    }

    setPerfiles(data); // ✅ backend devuelve lista
    
    if (perfilEditando === index) {
      resetFormulario();
      setMostrandoFormulario(false);
    }

  } catch {
    setError("Error de conexión");
  }
};

const resetFormulario = () => {
    setPerfilEditando(null);
    setNombrePerfil("");
    setEsInfantil(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
}

  return (
<div className="p-5 pt-20 text-white flex flex-col items-center justify-center">      
  <h1 className="text-2xl mb-6">
    {mostrandoFormulario || perfiles.length === 0
      ? esEdicion ? "Editar perfil" : "Crear perfil"
      : "Elige tu perfil"}
  </h1>

  {error && <p className="text-red-500 mb-4">{error}</p>}

  {(mostrandoFormulario || perfiles.length === 0) ? (
    /* ===== FORMULARIO ===== */
    <div className="bg-gray-800 p-6 rounded w-80">
      <label className="block cursor-pointer mb-4">
        <div className="w-30 h-30 mx-auto rounded-md bg-gray-700 flex items-center justify-center overflow-hidden">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-300 p-3">Imagen de perfil</span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              setAvatarFile(file);
              setAvatarPreview(URL.createObjectURL(file));
            }
          }}
        />
      </label>

      <input
        type="text"
        placeholder="Nombre del perfil"
        value={nombrePerfil}
        onChange={e => setNombrePerfil(e.target.value)}
        className="w-full mb-3 p-2 rounded text-black"
      />

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={esInfantil}
          onChange={e => setEsInfantil(e.target.checked)}
        />
        Perfil infantil
      </label>
      
      <button
        onClick={crearPerfil}
        disabled={loading || !nombrePerfil.trim()}
        className="w-full bg-red-600 p-2 rounded mb-2 disabled:opacity-50"
      >
        {loading ? "Creando..." : esEdicion ? "Guardar cambios" : "Crear perfil"}
      </button>

      {esEdicion && (
        <button
          onClick={() => eliminarPerfil(perfilEditando!)}
          className="w-full bg-red-800 p-2 rounded mb-2"
        >
          Eliminar perfil
        </button>
      )}

      {perfiles.length > 0 && (
        <button          
          onClick={() => {
            resetFormulario();
            setMostrandoFormulario(false);
          }}
          className="w-full bg-gray-600 p-2 rounded"
        >
          Cancelar
        </button>
      )}
    </div>
  ) : (
    /* ===== LISTA DE PERFILES ===== */
    <div className="flex gap-6">
      {perfiles.map((perfil, index) => (
        <div key={index} className="text-center">
          {/* ✅ SELECCIONAR PERFIL */}
          <div
            onClick={() => seleccionarPerfilActivo(index)}
            className="w-24 h-24 bg-gray-700 rounded-full mb-2 flex items-center justify-center cursor-pointer"
          >
            {perfil.avatar ? (
              <img
                src={`http://localhost:5000${perfil.avatar}`}
                alt={perfil.nombrePerfil}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <img
                src={avatar}
                alt="Avatar nitflex"
                className="avatar-nitflex rounded-full"
              />
            )}
          </div>

          <p>{perfil.nombrePerfil}</p>

          {perfil.esInfantil && (
            <span className="text-xs text-yellow-400 block">Infantil</span>
          )}

          {/* ✅ EDITAR PERFIL */}
          <button
            onClick={() => {
              setPerfilEditando(index);
              setNombrePerfil(perfil.nombrePerfil);
              setEsInfantil(perfil.esInfantil);
              setAvatarPreview(
                perfil.avatar
                  ? `http://localhost:5000${perfil.avatar}`
                  : null
              );
              setMostrandoFormulario(true);
            }}
            className="text-xs text-gray-400 mt-1 hover:underline"
          >
            Editar
          </button>
        </div>
      ))}

      {/* ✅ AÑADIR PERFIL */}
      <div
        onClick={() => {
          resetFormulario();
          setMostrandoFormulario(true);
        }}
        className="text-center cursor-pointer"
      >
        <div className="w-24 h-24 bg-gray-600 rounded-full mb-2 flex items-center justify-center text-3xl">
          +
        </div>
        <p className="text-sm">Añadir perfil</p>
      </div>
    </div>
  )}
</div>
  );
}