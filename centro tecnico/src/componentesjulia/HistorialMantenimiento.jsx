import { useMemo, useState } from "react";
import { History, Wrench, Plus, Calendar, X } from "lucide-react";

/**
 * RQF025 - Historial de mantenimiento
 * Línea de tiempo de mantenimientos realizados a una máquina, con registro de nuevos eventos.
 */
const MAQUINAS = [
  { id: 1, nombre: "Empacadora al vacío", codigo: "MAQ-0012" },
  { id: 2, nombre: "Compresor industrial", codigo: "MAQ-0034" },
  { id: 3, nombre: "Cinta transportadora", codigo: "MAQ-0021" },
];

const HISTORIAL_INICIAL = [
  { id: 1, maquinaId: 1, tipo: "preventivo", descripcion: "Cambio de sellos y lubricación general.", fecha: "2026-06-10", tecnico: "Jorge Salas", costo: 85000 },
  { id: 2, maquinaId: 1, tipo: "correctivo", descripcion: "Reemplazo de motor de bomba de vacío.", fecha: "2026-05-02", tecnico: "Laura Méndez", costo: 320000 },
  { id: 3, maquinaId: 2, tipo: "preventivo", descripcion: "Revisión de presión y filtros de aire.", fecha: "2026-06-15", tecnico: "Jorge Salas", costo: 45000 },
  { id: 4, maquinaId: 3, tipo: "correctivo", descripcion: "Ajuste de tensión de banda transportadora.", fecha: "2026-04-20", tecnico: "Andrés Pino", costo: 60000 },
];

const TIPOS = {
  preventivo: { label: "Preventivo", color: "bg-sky-50 text-sky-700", punto: "bg-sky-500" },
  correctivo: { label: "Correctivo", color: "bg-amber-50 text-amber-700", punto: "bg-amber-500" },
};

export default function HistorialMantenimiento() {
  const [maquinaId, setMaquinaId] = useState(1);
  const [historial, setHistorial] = useState(HISTORIAL_INICIAL);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevo, setNuevo] = useState({ tipo: "preventivo", descripcion: "", fecha: "", tecnico: "", costo: "" });

  const eventos = useMemo(
    () =>
      historial
        .filter((h) => h.maquinaId === maquinaId)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [historial, maquinaId]
  );

  const maquinaActual = MAQUINAS.find((m) => m.id === maquinaId);
  const costoTotal = eventos.reduce((acc, e) => acc + e.costo, 0);

  function agregarEvento() {
    if (!nuevo.descripcion.trim() || !nuevo.fecha) return;
    setHistorial((prev) => [
      ...prev,
      {
        id: Date.now(),
        maquinaId,
        tipo: nuevo.tipo,
        descripcion: nuevo.descripcion,
        fecha: nuevo.fecha,
        tecnico: nuevo.tecnico || "Sin asignar",
        costo: Number(nuevo.costo) || 0,
      },
    ]);
    setNuevo({ tipo: "preventivo", descripcion: "", fecha: "", tecnico: "", costo: "" });
    setModalAbierto(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Historial de mantenimiento
              </h1>
              <p className="text-sm text-slate-500">Eventos de mantenimiento por máquina</p>
            </div>
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Registrar mantenimiento
          </button>
        </header>

        {/* Selector de máquina */}
        <div className="mb-6 flex flex-wrap gap-2">
          {MAQUINAS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMaquinaId(m.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                maquinaId === m.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {m.nombre}
            </button>
          ))}
        </div>

        {/* Resumen */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Eventos registrados
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{eventos.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Costo acumulado
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              ${costoTotal.toLocaleString("es-CO")}
            </p>
          </div>
        </div>

        {/* Línea de tiempo */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Wrench className="h-4 w-4 text-slate-400" />
            {maquinaActual?.nombre} <span className="font-mono text-xs text-slate-400">{maquinaActual?.codigo}</span>
          </h2>

          {eventos.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Esta máquina no tiene mantenimientos registrados.
            </p>
          ) : (
            <ol className="relative space-y-6 border-l border-slate-200 pl-6">
              {eventos.map((evento) => {
                const config = TIPOS[evento.tipo];
                return (
                  <li key={evento.id} className="relative">
                    <span
                      className={`absolute -left-[29px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${config.punto}`}
                    />
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(evento.fecha).toLocaleDateString("es-CO", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-700">{evento.descripcion}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Técnico: {evento.tecnico} · Costo: ${evento.costo.toLocaleString("es-CO")}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>

      {/* Modal nuevo evento */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Registrar mantenimiento
              </h2>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo</label>
                <div className="flex gap-2">
                  {Object.entries(TIPOS).map(([clave, t]) => (
                    <button
                      key={clave}
                      onClick={() => setNuevo({ ...nuevo, tipo: clave })}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        nuevo.tipo === clave
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripción</label>
                <textarea
                  value={nuevo.descripcion}
                  onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
                  rows={2}
                  placeholder="Ej. Cambio de filtro de aceite"
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Fecha</label>
                  <input
                    type="date"
                    value={nuevo.fecha}
                    onChange={(e) => setNuevo({ ...nuevo, fecha: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Costo</label>
                  <input
                    type="number"
                    value={nuevo.costo}
                    onChange={(e) => setNuevo({ ...nuevo, costo: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Técnico responsable</label>
                <input
                  type="text"
                  value={nuevo.tecnico}
                  onChange={(e) => setNuevo({ ...nuevo, tecnico: e.target.value })}
                  placeholder="Nombre del técnico"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalAbierto(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={agregarEvento}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
