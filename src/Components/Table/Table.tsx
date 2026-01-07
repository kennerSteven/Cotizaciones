import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";

import img from "../Table/img.jpeg";
type Item = {
  cantidad: number | "";
  unidad: "Unid" | "ml" | "l";
  descripcion: string;
  valorUnitario: number | "";
};

type Section = {
  titulo: string;
  items: Item[];
};

export default function Cotizacion() {
  const pdfRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState<Section[]>([
    {
      titulo: "CASA DE HABITACIÓN",
      items: [
        { cantidad: "", unidad: "Unid", descripcion: "", valorUnitario: "" },
      ],
    },
  ]);

  const [comentarios, setComentarios] = useState<string[]>([]);

  function addSection() {
    setSections([
      ...sections,
      {
        titulo: "NUEVA SECCIÓN",
        items: [
          { cantidad: "", unidad: "Unid", descripcion: "", valorUnitario: "" },
        ],
      },
    ]);
  }

  function addItem(s: number) {
    const copy = [...sections];
    copy[s].items.push({
      cantidad: "",
      unidad: "Unid",
      descripcion: "",
      valorUnitario: "",
    });
    setSections(copy);
  }

  function updateItem<K extends keyof Item>(
    s: number,
    i: number,
    field: K,
    value: Item[K] | string
  ) {
    const copy = [...sections];
    const item = copy[s].items[i];

    if ((field === "cantidad" || field === "valorUnitario") && value !== "") {
      item[field] = Number(value) as Item[K];
    } else {
      item[field] = value as Item[K];
    }

    setSections(copy);
  }

  const updateTitle = (s: number, value: string) => {
    const copy = [...sections];
    copy[s].titulo = value;
    setSections(copy);
  };

  const removeItem = (s: number, i: number) => {
    const copy = [...sections];
    if (copy[s].items.length === 1) return;
    copy[s].items.splice(i, 1);
    setSections(copy);
  };

  const addComentario = () => setComentarios([...comentarios, ""]);

  const updateComentario = (i: number, value: string) => {
    const copy = [...comentarios];
    copy[i] = value;
    setComentarios(copy);
  };

  const itemTotal = (item: Item) => {
    const cant = item.cantidad === "" ? 0 : item.cantidad;
    const val = item.valorUnitario === "" ? 0 : item.valorUnitario;
    return cant * val;
  };

  const totalGeneral = sections.reduce(
    (acc, sec) => acc + sec.items.reduce((s, i) => s + itemTotal(i), 0),
    0
  );

  const generarPDF = () => {
    const element = pdfRef.current;
    if (!element) return;

    const opt = {
      margin: [10, 10],
      filename: "cotizacion.pdf",
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 3,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    } as const;

    (html2pdf() as any).set(opt).from(element).save();
  };

  return (
    <div className=" ">
      <div className="no-pdf d-flex justify-content-center w-100 bg-white shadow-sm py-2  ">
        <button className="btn btn-danger btn-lg shadow" onClick={generarPDF}>
          Generar PDF
        </button>
      </div>

      <div
        ref={pdfRef}
        className="bg-white p-5 shadow-sm mx-auto"
        style={{ maxWidth: "850px", color: "#333", minHeight: "1000px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-4">
          <div>
            <img src={img} alt="" style={{ width: "80px" }} />
            <p className="text-muted mb-0 fs-5 py-3">
              Fecha: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-end">
            <h4 className="fw-bold mb-1">Cocinas Maldonado</h4>
            <p className="small mb-0 text-muted">NIT 9.467.206</p>
            <p className="small mb-0 text-muted">Tel: 322 4179897</p>
          </div>
        </div>

        {sections.map((section, sIndex) => (
          <div key={sIndex} className="mb-5 section-block">
            <div className="bg-light p-2 mb-3 border-start border-4 border-danger">
              <input
                type="text"
                className="form-control form-control-lg fw-bold border-0 bg-transparent no-pdf"
                value={section.titulo}
                onChange={(e) => updateTitle(sIndex, e.target.value)}
              />
              <h4 className="fw-bold m-0 d-none d-print-block">
                {section.titulo}
              </h4>
            </div>

            <table className="table table-sm border">
              <thead className="table-dark">
                <tr>
                  <th className="text-center" style={{ width: "1%", fontSize: "14px" }}>
                    #
                  </th>
                  <th style={{ width: "2%", fontSize: "14px" }}>Cantidad</th>
                  <th style={{ width: "14%", fontSize: "14px" }}>Unidad</th>
                  <th style={{ width: "55%", fontSize: "14px" }}>Descripción</th>
                  <th className="text-end" style={{ width: "20%" , fontSize: "14px" }}>
                    V. Unit
                  </th>
                  <th
                    className="text-end"
                    style={{ width: "10%", fontSize: "14px" }}
                  >
                    Subtotal
                  </th>
                  <th className="no-pdf" style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {section.items.map((item, i) => (
                  <tr key={i} className="align-middle">
                    <td className="text-center text-muted">{i + 1}</td>
                    <td>
                      <input
                        type="number"
                        step="any"
                        className="form-control form-control-sm border-0 no-pdf text-center"
                        value={item.cantidad}
                        onChange={(e) =>
                          updateItem(sIndex, i, "cantidad", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                      style={{fontSize:"11px"}}
                        className="form-select form-select-sm border-0 no-pdf"
                        value={item.unidad}
                        onChange={(e) =>
                          updateItem(sIndex, i, "unidad", e.target.value)
                        }
                      >
                        <option value="Unid">U</option>
                        <option value="ml">m</option>
                        <option value="l">l</option>
                      </select>
                      <div className="d-none d-print-block text-center">
                        {item.unidad}
                      </div>
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm border-0 no-pdf"
                        style={{ fontSize: "11px" }}
                        value={item.descripcion}
                        onChange={(e) =>
                          updateItem(sIndex, i, "descripcion", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-end">
                      <input
                      
                        type="number"
                        className="form-control form-control-sm border-0 no-pdf text-end"
                        value={item.valorUnitario}
                        onChange={(e) =>
                          updateItem(sIndex, i, "valorUnitario", e.target.value)
                        }
                      />
                      <div className="d-none d-print-block text-end">
                        ${Number(item.valorUnitario).toLocaleString()}
                      </div>
                    </td>
                    <td className="text-end fw-bold">
                      ${itemTotal(item).toLocaleString("es-CO")}
                    </td>
                    <td className="text-center no-pdf">
                      <button
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={() => removeItem(sIndex, i)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex  gap-3" style={{ width: "300px" }}>
              <div>
                <button
                  className="btn btn-success no-pdf"
                  onClick={() => addItem(sIndex)}
                >
                  Nuevo item
                </button>
              </div>
              <div>
                <button className="btn btn-primary  " onClick={addSection}>
                  Nueva Seccion
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="row justify-content-center mt-4">
          <div className="col-6">
            <div
              className="p-3 border-top border-4 border-danger bg-light"
              style={{ width: "400px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-4">TOTAL GENERAL:</span>
                <span className="fw-bold fs-4" style={{ color: "#c32121" }}>
                  ${totalGeneral.toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <hr />

          <p>
            Se cancela el 50% por adelantado y el 25% al estar el 50% de la bora
            hecha y el otro 25% al terminar
          </p>
          <h6 className="fs-4 fw-bold">Nota</h6>
          {comentarios.map((c, i) => (
            <div key={i} className="mb-2">
              <input
                className=" form-control-sm no-pdf"
                style={{
                  width: "300px",
                  fontSize: "11px",
                  outline: "none",
                  border: "none",
                  borderBottom: "1px solid gray",
                }}
                value={c}
                onChange={(e) => updateComentario(i, e.target.value)}
              />
            </div>
          ))}
          <button
            className="btn btn-sm btn-link no-pdf p-0"
            onClick={addComentario}
          >
            + Agregar nota
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          .no-pdf { display: none !important; }
          .d-print-block { display: block !important; }
          .section-block { page-break-inside: avoid; }
          input, select, textarea { display: none !important; }
          table { width: 100% !important; border-collapse: collapse; }
          .container { width: 100% !important; max-width: none !important; margin: 0 !important; }
        }
        .table-sm td, .table-sm th { padding: 0.5rem; }
        textarea { resize: none; overflow: hidden; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
