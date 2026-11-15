
import { useEffect, useMemo, useState } from "react";
import { obtenerSkins } from "./services/fortniteApi";
import "./App.css";

function App() {
  const [skins, setSkins] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [rareza, setRareza] = useState("todas");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favoritosFortnite")) || [];
    } catch {
      return [];
    }
  });
  const [seleccionada, setSeleccionada] = useState(null);
  const [limite, setLimite] = useState(24);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerSkins();
        setSkins(datos);
      } catch {
        setError("No pudimos cargar las skins. Intenta recargar la página.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  useEffect(() => {
    localStorage.setItem("favoritosFortnite", JSON.stringify(favoritos));
  }, [favoritos]);

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape") setSeleccionada(null);
    }
    window.addEventListener("keydown", cerrarConEscape);
    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, []);

  const rarezas = useMemo(() => {
    const valores = skins
      .map((skin) => skin.series?.displayValue || skin.rarity?.displayValue)
      .filter(Boolean);
    return [...new Set(valores)].sort();
  }, [skins]);

  const skinsFiltradas = useMemo(() => {
    return skins.filter((skin) => {
      const coincideNombre = (skin.name || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const rarezaSkin =
        skin.series?.displayValue || skin.rarity?.displayValue || "";

      const coincideRareza =
        rareza === "todas" || rarezaSkin === rareza;

      const coincideFavorito =
        !soloFavoritos || favoritos.includes(skin.id);

      return coincideNombre && coincideRareza && coincideFavorito;
    });
  }, [skins, busqueda, rareza, soloFavoritos, favoritos]);

  function alternarFavorito(id) {
    setFavoritos((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((item) => item !== id)
        : [...anteriores, id]
    );
  }

  function reiniciarFiltros() {
    setBusqueda("");
    setRareza("todas");
    setSoloFavoritos(false);
    setLimite(24);
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          F<span>N</span> <small>EXPLORER</small>
        </div>
        <span className="nav-etiqueta">FORTNITE COSMETICS DATABASE</span>
      </nav>

      <header className="hero">
        <div className="hero-contenido">
          <span className="hero-badge">¿CUÁL SERÁ TU PRÓXIMA SKIN?</span>
          <h1>
            UNIVERSO
            <br />
            <span>FORTNITE.</span>
          </h1>
          <p>
            Explora personajes de Fortnite, descubre sus rarezas
            y crea tu colección de skins favoritas.
          </p>
          <a href="#catalogo" className="hero-boton">
            EXPLORAR SKINS ↓
          </a>
        </div>
        <div className="hero-decoracion">F</div>
      </header>

      <section className="estadisticas">
        <div>
          <strong>{skins.length.toLocaleString()}</strong>
          <span>SKINS DISPONIBLES</span>
        </div>
        <div>
          <strong>{favoritos.length}</strong>
          <span>MIS FAVORITAS</span>
        </div>
        <div>
          <strong>{skinsFiltradas.length.toLocaleString()}</strong>
          <span>RESULTADOS</span>
        </div>
      </section>

      <main id="catalogo">
        <div className="seccion-titulo">
          <div>
            <span className="subtitulo">ELIGE TU ESTILO</span>
            <h2>CATÁLOGO DE SKINS</h2>
          </div>
          <p>Encuentra tus personajes favoritos</p>
        </div>

        <div className="filtros">
          <input
            type="search"
            placeholder="Buscar skin por nombre..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setLimite(24);
            }}
          />

          <select
            value={rareza}
            onChange={(e) => {
              setRareza(e.target.value);
              setLimite(24);
            }}
          >
            <option value="todas">Todas las rarezas</option>
            {rarezas.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>

          <button
            className={soloFavoritos ? "filtro-activo" : ""}
            onClick={() => {
              setSoloFavoritos(!soloFavoritos);
              setLimite(24);
            }}
          >
            ♥ Favoritas
          </button>

          <button className="limpiar" onClick={reiniciarFiltros}>
            Limpiar filtros
          </button>
        </div>

        {cargando && <p className="mensaje">Cargando skins...</p>}
        {error && <p className="mensaje error">{error}</p>}

        {!cargando && !error && (
          <>
            <div className="grid-skins">
              {skinsFiltradas.slice(0, limite).map((skin) => {
                const esFavorita = favoritos.includes(skin.id);
                const rarezaSkin =
                  skin.series?.displayValue ||
                  skin.rarity?.displayValue ||
                  "Sin clasificación";

                return (
                  <article className="skin-card" key={skin.id}>
                    <button
                      className={`favorito ${esFavorita ? "marcado" : ""}`}
                      onClick={() => alternarFavorito(skin.id)}
                      aria-label={
                        esFavorita
                          ? "Quitar de favoritos"
                          : "Agregar a favoritos"
                      }
                    >
                      {esFavorita ? "♥" : "♡"}
                    </button>

                    <button
                      className="skin-imagen"
                      onClick={() => setSeleccionada(skin)}
                      aria-label={`Ver detalles de ${skin.name}`}
                    >
                      <img
                        src={skin.images?.icon}
                        alt={skin.name}
                        loading="lazy"
                      />
                    </button>

                    <div className="skin-info">
                      <span className="rareza">{rarezaSkin}</span>
                      <h3>{skin.name}</h3>
                      <button
                        className="detalles-boton"
                        onClick={() => setSeleccionada(skin)}
                      >
                        VER DETALLES →
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {skinsFiltradas.length === 0 && (
              <div className="sin-resultados">
                <h3>No encontramos skins</h3>
                <p>Prueba con otro nombre o cambia los filtros.</p>
                <button onClick={reiniciarFiltros}>Ver todas</button>
              </div>
            )}

            {limite < skinsFiltradas.length && (
              <button
                className="mostrar-mas"
                onClick={() => setLimite((actual) => actual + 24)}
              >
                MOSTRAR MÁS SKINS ↓
              </button>
            )}
          </>
        )}
      </main>

      <footer>
        <strong>FN EXPLORER</strong>
        <p>Proyecto académico con React y Fortnite-API.</p>
        <p>No afiliado a Epic Games.</p>
      </footer>

      {seleccionada && (
        <div
          className="modal-fondo"
          onClick={() => setSeleccionada(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles de ${seleccionada.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="cerrar-modal"
              onClick={() => setSeleccionada(null)}
              aria-label="Cerrar detalles"
            >
              ✕
            </button>

            <div className="modal-imagen">
              <img
                src={
                  seleccionada.images?.featured ||
                  seleccionada.images?.icon
                }
                alt={seleccionada.name}
              />
            </div>

            <div className="modal-contenido">
              <span className="subtitulo">DETALLES DEL PERSONAJE</span>
              <h2>{seleccionada.name}</h2>
              <p>{seleccionada.description || "Sin descripción disponible."}</p>

              <div className="modal-datos">
                <div>
                  <span>RAREZA / SERIE</span>
                  <strong>
                    {seleccionada.series?.displayValue ||
                      seleccionada.rarity?.displayValue ||
                      "No disponible"}
                  </strong>
                </div>
                <div>
                  <span>INTRODUCCIÓN</span>
                  <strong>
                    {seleccionada.introduction?.text ||
                      "No disponible"}
                  </strong>
                </div>
                <div>
                  <span>CONJUNTO</span>
                  <strong>
                    {seleccionada.set?.value ||
                      "Sin conjunto"}
                  </strong>
                </div>
              </div>

              <button
                className="modal-favorito"
                onClick={() => alternarFavorito(seleccionada.id)}
              >
                {favoritos.includes(seleccionada.id)
                  ? "♥ QUITAR DE FAVORITOS"
                  : "♡ AGREGAR A FAVORITOS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
