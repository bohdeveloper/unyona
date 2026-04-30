import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/images/avatar-inicial.png";

import "./Perfiles.css";

interface Perfil {
  id: number;
  nombrePerfil: string;
  avatar: string;
  esInfantil: boolean;
}

interface PerfilesProps {
  onCloseMenu?: () => void;
}

export default function Perfiles({ onCloseMenu }: PerfilesProps) {
  const { token, seleccionarPerfil, perfilActivo, limpiarPerfil, actualizarPerfilActivo  } = useAuth();

  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [perfilEditando, setPerfilEditando] = useState<number | null>(null);

  const [nombrePerfil, setNombrePerfil] = useState("");
  const [esInfantil, setEsInfantil] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const esEdicion = perfilEditando !== null;

  const navigate = useNavigate();

  /* =========================
     CARGAR PERFILES
     ========================= */
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

  useEffect(() => {
    if (perfilActivo?.id) {
      setPerfilSeleccionado(perfilActivo.id);
    } else {
      setPerfilSeleccionado(null);
    }
  }, [perfilActivo]);

  /* =========================
     SELECCIONAR PERFIL
     ========================= */
 const seleccionarPerfilActivo = async (perfilId: number) => {
  try {
    const res = await fetch("http://localhost:5000/perfiles/seleccionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ perfilId })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Error al seleccionar perfil");
      setPerfilSeleccionado(null);
      return;
    }

    seleccionarPerfil(data.token, data.perfilActivo);
    setPerfilSeleccionado(perfilId);
    navigate("/home");
  } catch {
    setError("Error de conexión");
    setPerfilSeleccionado(null);
  }
};

  /* =========================
     CREAR / EDITAR PERFIL
     ========================= */
  const crearPerfil = async () => {
    if (!nombrePerfil.trim()) return;

    setLoading(true);
    setError("");

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

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al guardar perfil");
        setLoading(false);
        return;
      }

      if (esEdicion) {
        setPerfiles(prev =>
          prev.map(p => (p.id === perfilEditando ? data : p))
        );

        if (perfilActivo && perfilActivo.id === perfilEditando) {
          actualizarPerfilActivo(data);
        }
      } else {
        setPerfiles(prev => [...prev, data]);
      }

      resetFormulario();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ELIMINAR PERFIL
     ========================= */
  const eliminarPerfil = async (perfilId: number) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este perfil?");
    if (!confirmar) return;

    try {
      const res = await fetch(
        `http://localhost:5000/perfiles/${perfilId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al eliminar perfil");
        return;
      }

      setPerfiles(data);

      if (perfilEditando === perfilId) {
        resetFormulario();
        setMostrandoFormulario(false);
      }
    } catch {
      setError("Error de conexión");
    }
  };

  /* =========================
     RESET FORMULARIO
     ========================= */
  const resetFormulario = () => {
    setPerfilEditando(null);
    setNombrePerfil("");
    setEsInfantil(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setMostrandoFormulario(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="p-5 pt-20 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl mb-6">
        {mostrandoFormulario || perfiles.length === 0
          ? esEdicion ? "Edita tu perfil" : "Crea tu perfil"
          : "¿Quien eres? Elige tu perfil"}
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
                <span className="text-sm text-gray-300 p-3">
                  Imagen de perfil
                </span>
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
            {loading
              ? "Guardando..."
              : esEdicion
              ? "Guardar cambios"
              : "Crear perfil"}
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
        <>
        {/* ===== SELECCIÓN DE PERFILES ===== */} 
          {perfilActivo && (
            <button
              onClick={() => {
                limpiarPerfil();
                setPerfilSeleccionado(null);
                onCloseMenu?.();
              }}
              className="mb-6 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Cambiar perfil
            </button>
          )}
        {/* ===== LISTA DE PERFILES ===== */}
        <div className="flex gap-6">
          {perfiles.map((perfil) => (
              <div
                key={perfil.id}
                className={`text-center transition-opacity duration-300
                  ${perfilSeleccionado !== null && perfilSeleccionado !== perfil.id
                    ? "perfil-inactivo-wrapper"
                    : ""}
                `}
              >
                {/* Seleccionar perfil */}
                <div
                  onClick={() => seleccionarPerfilActivo(perfil.id)}                  
                  className={`
                    w-24 h-24 bg-gray-700 rounded-full mb-2
                    flex items-center justify-center cursor-pointer
                    transition-all duration-300
                    ${perfilSeleccionado === perfil.id
                      ? "perfil-activo"
                      : "hover:scale-95"}
                  `}
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
                    alt="Avatar"
                    className="rounded-full"
                  />
                )}
              </div>

              <p>{perfil.nombrePerfil}</p>

              {perfil.esInfantil && (
                <span className="text-xs text-yellow-400 block">
                  Infantil
                </span>
              )}

              <button
                onClick={() => {
                  setPerfilEditando(perfil.id);
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
                disabled={
                  perfilActivo !== null &&
                  perfilActivo.id !== perfil.id
                }
              >
                Editar
              </button>
            </div>
          ))}

          <div
            onClick={() => {
              resetFormulario();
              setMostrandoFormulario(true);
            }}
            className={`text-center cursor-pointer transition-opacity duration-300
              ${perfilSeleccionado !== null ? "perfil-inactivo-wrapper" : ""}
            `}
          >
            <div className="w-24 h-24 bg-gray-600 rounded-full mb-2 flex items-center justify-center text-3xl">
              +
            </div>
            <p className="text-sm">Añadir perfil</p>
          </div>
        </div>
        </>
      )}
    </div>
  );
}