import { useMemo, useState } from "react";
import { ShoppingCart, Plus, Trash2, Receipt } from "lucide-react";

/**
 * RQF021 - Registro de ventas
 * Formulario para registrar una venta: selección de productos, cantidades y total.
 */
const PRODUCTOS = [
  { id: 1, nombre: "Audífonos inalámbricos", sku: "AUD-0234", precio: 89.9, stock: 42 },
  { id: 2, nombre: "Silla ergonómica", sku: "SIL-0099", precio: 159.0, stock: 8 },
  { id: 3, nombre: "Mochila urbana", sku: "MOC-0312", precio: 45.0, stock: 23 },
  { id: 4, nombre: "Lámpara de escritorio", sku: "LAM-0078", precio: 32.99, stock: 5 },
  { id: 5, nombre: "Teclado mecánico", sku: "TEC-0501", precio: 112.0, stock: 31 },
];

const VENTAS_RECIENTES = [
  { id: 101, cliente: "María López", total: 134.9, items: 2, fecha: "Hace 10 min" },
  { id: 100, cliente: "Carlos Ruiz", total: 45.0, items: 1, fecha: "Hace 1 h" },
  { id: 99, cliente: "Ana Torres", total: 271.0, items: 3, fecha: "Hace 3 h" },
];

export default function RegistroVentas() {
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [confirmacion, setConfirmacion] = useState(false);

  const subtotal = useMemo(
    () => carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [carrito]
  );
  const impuesto = subtotal * 0.19;
  const total = subtotal + impuesto;

  function agregarProducto() {
    if (!productoSeleccionado) return;
    const producto = PRODUCTOS.find((p) => p.id === Number(productoSeleccionado));
    if (!producto) return;

    setCarrito((prev) => {
      const existente = prev.find((i) => i.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setProductoSeleccionado("");
  }

  function cambiarCantidad(id, delta) {
    setCarrito((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0)
    );
  }

  function eliminarItem(id) {
    setCarrito((prev) => prev.filter((i) => i.id !== id));
  }

  function registrarVenta() {
    if (carrito.length === 0) return;
    setConfirmacion(true);
    setTimeout(() => setConfirmacion(false), 3000);
    setCarrito([]);
    setCliente("");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Registro de ventas
            </h1>
            <p className="text-sm text-slate-500">Registra una nueva venta y su detalle</p>
          </div>
        </header>

        {confirmacion && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <Receipt className="h-4 w-4 shrink-0" />
            Venta registrada correctamente.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Cliente
                  </label>
                  <input
                    type="text"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Método de pago
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div className="mb-5 flex gap-2">
                <select
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">Selecciona un producto...</option>
                  {PRODUCTOS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} — ${p.precio.toFixed(2)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={agregarProducto}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              </div>

              <div className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                {carrito.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-slate-400">
                    Agrega productos para iniciar la venta.
                  </p>
                )}
                {carrito.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.nombre}
                      </p>
                      <p className="font-mono text-xs text-slate-400">{item.sku}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cambiarCantidad(item.id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => cambiarCantidad(item.id, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold tabular-nums text-slate-900">
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </span>
                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">Resumen</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="tabular-nums text-slate-700">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">IVA (19%)</dt>
                  <dd className="tabular-nums text-slate-700">${impuesto.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold">
                  <dt className="text-slate-900">Total</dt>
                  <dd className="tabular-nums text-slate-900">${total.toFixed(2)}</dd>
                </div>
              </dl>
              <button
                onClick={registrarVenta}
                disabled={carrito.length === 0}
                className="mt-5 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Registrar venta
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Ventas recientes
              </h2>
              <div className="space-y-3">
                {VENTAS_RECIENTES.map((v) => (
                  <div key={v.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-slate-700">{v.cliente}</p>
                      <p className="text-xs text-slate-400">
                        {v.items} ítem{v.items !== 1 && "s"} · {v.fecha}
                      </p>
                    </div>
                    <span className="font-semibold tabular-nums text-slate-900">
                      ${v.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
