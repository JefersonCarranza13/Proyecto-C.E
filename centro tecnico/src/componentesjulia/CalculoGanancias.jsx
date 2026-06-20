import { useMemo, useState } from "react";
import { Calculator, DollarSign, TrendingUp, Percent } from "lucide-react";

/**
 * RQF023 - Cálculo de ganancias
 * Calcula margen, ganancia bruta y neta a partir de costos, precio de venta y gastos.
 */
export default function CalculoGanancias() {
  const [precioCompra, setPrecioCompra] = useState("25.00");
  const [precioVenta, setPrecioVenta] = useState("45.00");
  const [unidadesVendidas, setUnidadesVendidas] = useState("120");
  const [gastosOperativos, setGastosOperativos] = useState("350");

  const calculo = useMemo(() => {
    const compra = Number(precioCompra) || 0;
    const venta = Number(precioVenta) || 0;
    const unidades = Number(unidadesVendidas) || 0;
    const gastos = Number(gastosOperativos) || 0;

    const gananciaUnitaria = venta - compra;
    const margenUnitario = venta > 0 ? (gananciaUnitaria / venta) * 100 : 0;
    const ingresoTotal = venta * unidades;
    const costoTotal = compra * unidades;
    const gananciaBruta = ingresoTotal - costoTotal;
    const gananciaNeta = gananciaBruta - gastos;
    const margenNeto = ingresoTotal > 0 ? (gananciaNeta / ingresoTotal) * 100 : 0;

    return {
      gananciaUnitaria,
      margenUnitario,
      ingresoTotal,
      costoTotal,
      gananciaBruta,
      gananciaNeta,
      margenNeto,
    };
  }, [precioCompra, precioVenta, unidadesVendidas, gastosOperativos]);

  const esGananciaPositiva = calculo.gananciaNeta >= 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Cálculo de ganancias
            </h1>
            <p className="text-sm text-slate-500">
              Estima el margen y la rentabilidad de tus productos
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Formulario */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Datos de entrada</h2>
            <div className="space-y-4">
              <Campo label="Precio de compra (por unidad)">
                <CampoMoneda valor={precioCompra} onChange={setPrecioCompra} />
              </Campo>
              <Campo label="Precio de venta (por unidad)">
                <CampoMoneda valor={precioVenta} onChange={setPrecioVenta} />
              </Campo>
              <Campo label="Unidades vendidas">
                <input
                  type="number"
                  min="0"
                  value={unidadesVendidas}
                  onChange={(e) => setUnidadesVendidas(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                />
              </Campo>
              <Campo label="Gastos operativos del periodo">
                <CampoMoneda valor={gastosOperativos} onChange={setGastosOperativos} />
              </Campo>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">Por unidad</h2>
              <div className="grid grid-cols-2 gap-4">
                <Resultado
                  etiqueta="Ganancia unitaria"
                  valor={`$${calculo.gananciaUnitaria.toFixed(2)}`}
                  icono={<DollarSign className="h-4 w-4" />}
                  positivo={calculo.gananciaUnitaria >= 0}
                />
                <Resultado
                  etiqueta="Margen unitario"
                  valor={`${calculo.margenUnitario.toFixed(1)}%`}
                  icono={<Percent className="h-4 w-4" />}
                  positivo={calculo.margenUnitario >= 0}
                />
              </div>
            </div>

            <div
              className={`rounded-xl border p-6 shadow-sm ${
                esGananciaPositiva
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-red-200 bg-red-50/60"
              }`}
            >
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                Total del periodo
              </h2>
              <dl className="space-y-2.5 text-sm">
                <FilaResultado etiqueta="Ingreso total" valor={calculo.ingresoTotal} />
                <FilaResultado etiqueta="Costo total" valor={calculo.costoTotal} negativo />
                <FilaResultado etiqueta="Ganancia bruta" valor={calculo.gananciaBruta} />
                <FilaResultado etiqueta="Gastos operativos" valor={Number(gastosOperativos) || 0} negativo />
                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                  <dt className="font-semibold text-slate-900">Ganancia neta</dt>
                  <dd
                    className={`flex items-center gap-1 text-lg font-bold tabular-nums ${
                      esGananciaPositiva ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    ${calculo.gananciaNeta.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <dt>Margen neto sobre ingresos</dt>
                  <dd className="font-medium tabular-nums">{calculo.margenNeto.toFixed(1)}%</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function CampoMoneda({ valor, onChange }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
        $
      </span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pl-7 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
      />
    </div>
  );
}

function Resultado({ etiqueta, valor, icono, positivo }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="mb-1 flex items-center gap-1 text-xs text-slate-500">
        {icono}
        {etiqueta}
      </p>
      <p
        className={`text-lg font-semibold tabular-nums ${
          positivo ? "text-slate-900" : "text-red-600"
        }`}
      >
        {valor}
      </p>
    </div>
  );
}

function FilaResultado({ etiqueta, valor, negativo }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-600">{etiqueta}</dt>
      <dd className="tabular-nums text-slate-800">
        {negativo ? "−" : ""}${Math.abs(valor).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
      </dd>
    </div>
  );
}
