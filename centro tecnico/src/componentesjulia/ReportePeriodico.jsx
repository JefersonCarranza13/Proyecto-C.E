import { useMemo, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Download } from "lucide-react";

/**
 * RQF022 - Reporte semanal/mensual
 * Resumen visual de ventas e inventario, alternando entre periodo semanal y mensual.
 */
const DATOS_SEMANA = [
  { etiqueta: "Lun", ventas: 420 },
  { etiqueta: "Mar", ventas: 380 },
  { etiqueta: "Mié", ventas: 510 },
  { etiqueta: "Jue", ventas: 460 },
  { etiqueta: "Vie", ventas: 690 },
  { etiqueta: "Sáb", ventas: 740 },
  { etiqueta: "Dom", ventas: 320 },
];

const DATOS_MES = [
  { etiqueta: "Sem 1", ventas: 2680 },
  { etiqueta: "Sem 2", ventas: 3120 },
  { etiqueta: "Sem 3", ventas: 2950 },
  { etiqueta: "Sem 4", ventas: 3410 },
];

const PRODUCTOS_TOP = [
  { nombre: "Audífonos inalámbricos", unidades: 86, ingresos: 7731.4 },
  { nombre: "Teclado mecánico", unidades: 54, ingresos: 6048.0 },
  { nombre: "Mochila urbana", unidades: 71, ingresos: 3195.0 },
  { nombre: "Silla ergonómica", unidades: 19, ingresos: 3021.0 },
];

export default function ReportePeriodico() {
  const [periodo, setPeriodo] = useState("semanal");

  const datos = periodo === "semanal" ? DATOS_SEMANA : DATOS_MES;
  const maxVenta = Math.max(...datos.map((d) => d.ventas));

  const totalVentas = useMemo(
    () => datos.reduce((acc, d) => acc + d.ventas, 0),
    [datos]
  );
  const variacion = periodo === "semanal" ? 8.4 : -3.2;
  const esPositiva = variacion >= 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Reporte {periodo === "semanal" ? "semanal" : "mensual"}
              </h1>
              <p className="text-sm text-slate-500">Resumen de desempeño de ventas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-white p-1 ring-1 ring-slate-200">
              <button
                onClick={() => setPeriodo("semanal")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  periodo === "semanal" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setPeriodo("mensual")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  periodo === "mensual" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Mensual
              </button>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
              <Download className="h-3.5 w-3.5" />
              Exportar
            </button>
          </div>
        </header>

        {/* Resumen */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Ventas totales
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              ${totalVentas.toLocaleString("es-CO")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Variación vs. periodo anterior
            </p>
            <p
              className={`mt-1 flex items-center gap-1 text-2xl font-semibold tabular-nums ${
                esPositiva ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {esPositiva ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {Math.abs(variacion)}%
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Promedio por {periodo === "semanal" ? "día" : "semana"}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              ${Math.round(totalVentas / datos.length).toLocaleString("es-CO")}
            </p>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-slate-900">
            Ventas por {periodo === "semanal" ? "día" : "semana"}
          </h2>
          <div className="flex items-end justify-between gap-3" style={{ height: 180 }}>
            {datos.map((d) => (
              <div key={d.etiqueta} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium tabular-nums text-slate-500">
                  ${d.ventas}
                </span>
                <div
                  className="w-full rounded-t-md bg-slate-900 transition hover:bg-slate-700"
                  style={{ height: `${(d.ventas / maxVenta) * 130}px` }}
                />
                <span className="text-xs text-slate-400">{d.etiqueta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top productos */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Productos más vendidos
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {PRODUCTOS_TOP.map((p, i) => (
              <div key={p.nombre} className="flex items-center gap-4 px-6 py-3.5">
                <span className="w-5 text-sm font-semibold text-slate-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {p.nombre}
                  </p>
                  <p className="text-xs text-slate-400">{p.unidades} unidades vendidas</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-slate-900">
                  ${p.ingresos.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
