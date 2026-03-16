import * as XLSX from "xlsx";

export function leerCodigosDesdeExcel(fileBuffer, tipo) {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const datos = XLSX.utils.sheet_to_json(worksheet);

  if (!datos.length) {
    throw new Error("El Excel no contiene filas válidas.");
  }

  const codigos = [];

  datos.forEach((fila, index) => {
    let codigo;

    if (tipo === "ean13") {
      codigo = fila.CODIGO || fila.codigo || Object.values(fila)[0];
    }

    if (tipo === "gtin14") {
      codigo =
        fila.GTIN ||
        fila.GTIN14 ||
        fila.CODIGO ||
        fila.codigo ||
        fila["GTIN-14"] ||
        fila["Código"] ||
        Object.values(fila)[0];
    }

    if (tipo === "upc") {
      codigo =
        fila.UPC ||
        fila.UPCA ||
        fila.CODIGO ||
        fila.codigo ||
        fila["UPC-A"] ||
        fila["Código"] ||
        Object.values(fila)[0];
    }

    if (!codigo) return;

    const codigoStr = codigo.toString().trim();
    codigos.push({
      row: index + 2,
      codigo: codigoStr
    });
  });

  if (!codigos.length) {
    throw new Error("No se encontraron códigos válidos en el archivo.");
  }

  return codigos;
}