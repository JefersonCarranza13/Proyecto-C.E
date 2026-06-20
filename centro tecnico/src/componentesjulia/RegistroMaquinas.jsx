import { useState } from "react";
import { Cog, Check, AlertCircle, Wrench } from "lucide-react";

/**
 * RQF024 - Registro de máquinas
 * Formulario para registrar maquinaria o equipos usados en producción/operación.
 */
export default function RegistroMaquinas() {
  const initialForm = {
    nombre: "",
    codigo: "",
    tipo: "",
    marca: "",
    modelo: "",
    fechaAdquisicion: "",
    ubicacion: "",
    estado: "operativa",
    notas: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const tipos = ["Producción", "Empaque", "Transporte", "Refrigeración", "Herramienta eléctrica", "Otro"];
  const estados = [
    { valor: "operativa", label: "Operativa" },
    { valor: "mantenimiento", label: "En mantenimiento" },
    { valor: "fuera_servicio", label: "Fuera de servicio" },
  ];

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: null }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.codigo.trim()) nuevosErrores.codigo = "El código es obligatorio.";
    if (!form.tipo) nuevosErrores.tipo = "Selecciona un tipo de máquina.";
    if (!form.fechaAdquisicion) nuevosErrores.fechaAdquisicion = "Indica la fecha de adquisición.";
    if (!form.ubicacion.trim()) nuevosErrores.ubicacion = "Indica la ubicación.";
    return nuevosErrores;
  }

  function manejarEnvio(e) {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
      setForm(initialForm);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
            <Cog className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Registro de máquinas
            </h1>
            <p className="text-sm text-slate-500">
              Añade un nuevo equipo o maquinaria al inventario técnico
            </p>
          </div>
        </header>

        {enviado && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4 shrink-0" />
            Máquina registrada correctamente.
          </div>
        )}

        <form
          onSubmit={manejarEnvio}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Campo label="Nombre de la máquina" error={errores.nombre} required>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => actualizarCampo("nombre", e.target.value)}
                placeholder="Ej. Empacadora al vacío"
                className={inputClase(errores.nombre)}
              />
            </Campo>

            <Campo label="Código / Identificador" error={errores.codigo} required>
              <input
                type="text"
                value={form.codigo}
                onChange={(e) => actualizarCampo("codigo", e.target.value)}
                placeholder="Ej. MAQ-0012"
                className={inputClase(errores.codigo)}
              />
            </Campo>

            <Campo label="Tipo de máquina" error={errores.tipo} required>
              <select
                value={form.tipo}
                onChange={(e) => actualizarCampo("tipo", e.target.value)}
                className={inputClase(errores.tipo)}
              >
                <option value="">Selecciona un tipo</option>
                {tipos.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Campo>

            <Campo label="Marca">
              <input
                type="text"
                value={form.marca}
                onChange={(e) => actualizarCampo("marca", e.target.value)}
                placeholder="Ej. Bosch"
                className={inputClase()}
              />
            </Campo>

            <Campo label="Modelo">
              <input
                type="text"
                value={form.modelo}
                onChange={(e) => actualizarCampo("modelo", e.target.value)}
                placeholder="Ej. GSB 550"
                className={inputClase()}
              />
            </Campo>

            <Campo label="Fecha de adquisición" error={errores.fechaAdquisicion} required>
              <input
                type="date"
                value={form.fechaAdquisicion}
                onChange={(e) => actualizarCampo("fechaAdquisicion", e.target.value)}
                className={inputClase(errores.fechaAdquisicion)}
              />
            </Campo>

            <Campo label="Ubicación" error={errores.ubicacion} required>
              <input
                type="text"
                value={form.ubicacion}
                onChange={(e) => actualizarCampo("ubicacion", e.target.value)}
                placeholder="Ej. Planta 2 - Línea A"
                className={inputClase(errores.ubicacion)}
              />
            </Campo>

            <Campo label="Estado inicial">
              <div className="flex gap-2">
                {estados.map((e) => (
                  <button
                    key={e.valor}
                    type="button"
                    onClick={() => actualizarCampo("estado", e.valor)}
                    className={`flex-1 rounded-lg border px-3 py-2.5 text-xs font-medium transition ${
                      form.estado === e.valor
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </Campo>

            <div className="sm:col-span-2">
              <Campo label="Notas adicionales">
                <textarea
                  value={form.notas}
                  onChange={(e) => actualizarCampo("notas", e.target.value)}
                  placeholder="Especificaciones técnicas, observaciones..."
                  rows={3}
                  className={`${inputClase()} resize-none`}
                />
              </Campo>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setErrores({});
              }}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Limpiar formulario
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              <Wrench className="h-4 w-4" />
              Registrar máquina
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, error, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-amber-600">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function inputClase(error) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 ${
    error
      ? "border-red-300 focus:border-red-400"
      : "border-slate-200 focus:border-slate-400"
  }`;
}
