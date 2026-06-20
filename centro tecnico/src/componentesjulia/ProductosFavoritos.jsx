import { useMemo, useState } from "react";
import { Heart, Star, Search, X } from "lucide-react";

/**
 * RQF020 - Productos favoritos
 * Permite marcar productos como favoritos y consultarlos en una vista dedicada.
 */
const PRODUCTOS = [
  { id: 1, nombre: "Audífonos inalámbricos", sku: "AUD-0234", categoria: "Electrónica", precio: 89.9, stock: 42 },
  { id: 2, nombre: "Silla ergonómica", sku: "SIL-0099", categoria: "Hogar", precio: 159.0, stock: 8 },
  { id: 3, nombre: "Cafetera de goteo", sku: "CAF-0145", categoria: "Hogar", precio: 64.5, stock: 0 },
  { id: 4, nombre: "Mochila urbana", sku: "MOC-0312", categoria: "Ropa", precio: 45.0, stock: 23 },
  { id: 5, nombre: "Lámpara de escritorio", sku: "LAM-0078", categoria: "Oficina", precio: 32.99, stock: 5 },
  { id: 6, nombre: "Teclado mecánico", sku: "TEC-0501", categoria: "Electrónica", precio: 112.0, stock: 31 },
  { id: 7, nombre: "Set de ollas", sku: "OLL-0220", categoria: "Hogar", precio: 78.0, stock: 14 },
];

const FAVORITOS_INICIALES = new Set([1, 3, 6]);

export default function ProductosFavoritos() {
  const [favoritos, setFavoritos] = useState(FAVORITOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [verSoloFavoritos, setVerSoloFavoritos] = useState(true);

  function alternarFavorito(id) {
    setFavoritos((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  }

  const visibles = useMemo(() => {
    return PRODUCTOS.filter((p) => {
      const coincideBusqueda =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.sku.toLowerCase().includes(busqueda.toLowerCase());
      const coincideFiltro = !verSoloFavoritos || favoritos.has(p.id);
      return coincideBusqueda && coincideFiltro;
    });
  }, [busqueda, verSoloFavoritos, favoritos]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-600">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Productos favoritos
              </h1>
              <p className="text-sm text-slate-500">
                {favoritos.size} producto{favoritos.size !== 1 && "s"} marcado{favoritos.size !== 1 && "s"} como favorito
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-white p-1 ring-1 ring-slate-200">
            <button
              onClick={() => setVerSoloFavoritos(true)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                verSoloFavoritos ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Favoritos
            </button>
            <button
              onClick={() => setVerSoloFavoritos(false)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                !verSoloFavoritos ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Todos
            </button>
          </div>
        </header>

        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar entre tus favoritos..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((p) => {
            const esFavorito = favoritos.has(p.id);
            return (
              <div
                key={p.id}
                className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <button
                  onClick={() => alternarFavorito(p.id)}
                  className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition ${
                    esFavorito
                      ? "bg-rose-50 text-rose-600"
                      : "bg-slate-50 text-slate-300 hover:text-rose-400"
                  }`}
                  aria-label={esFavorito ? "Quitar de favoritos" : "Marcar como favorito"}
                >
                  <Heart className="h-4 w-4" fill={esFavorito ? "currentColor" : "none"} />
                </button>

                <div className="mb-3 flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3" fill={i < 4 ? "currentColor" : "none"} />
                  ))}
                </div>

                <h3 className="mb-0.5 pr-8 font-semibold text-slate-900">{p.nombre}</h3>
                <p className="mb-3 font-mono text-xs text-slate-400">{p.sku}</p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold tabular-nums text-slate-900">
                    ${p.precio.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      p.stock === 0 ? "text-red-500" : "text-slate-500"
                    }`}
                  >
                    {p.stock === 0 ? "Sin stock" : `${p.stock} disp.`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {visibles.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Heart className="mx-auto mb-2 h-6 w-6 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">
              {verSoloFavoritos
                ? "Aún no tienes productos favoritos"
                : "No se encontraron productos"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {verSoloFavoritos && "Marca el corazón en cualquier producto para guardarlo aquí."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
