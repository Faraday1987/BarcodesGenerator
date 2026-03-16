export const prerender = false;

import type { APIRoute } from "astro";
import { leerCodigosDesdeExcel } from "@src/lib/barcodes/excel";
import { generarCodigoBarrasEAN13 } from "@src/lib/barcodes/ean13";
import { generarCodigoBarrasGTIN14 } from "@src/lib/barcodes/gtin14";
import { generarCodigoBarrasUPC } from "@src/lib/barcodes/upc";
import { crearZipDeSVGs } from "@src/lib/barcodes/zip";
import { normalizarSharedOptions } from "@src/lib/barcodes/config";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const tipo = formData.get("tipo");
    const archivo = formData.get("archivo");

    if (!tipo || typeof tipo !== "string") {
      return new Response(
        JSON.stringify({ error: "Debes seleccionar un tipo de código." }),
        { status: 400 }
      );
    }

    if (!archivo || !(archivo instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Debes subir un archivo Excel válido." }),
        { status: 400 }
      );
    }

    const sharedOptions = normalizarSharedOptions({
      width: formData.get("width"),
      height: formData.get("height"),
      displayValue: formData.get("displayValue"),
      margin: formData.get("margin"),
      background: formData.get("background"),
      lineColor: formData.get("lineColor")
    });

    const arrayBuffer = await archivo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const codigos = leerCodigosDesdeExcel(buffer, tipo);

    const resultados = [];
    const errores = [];

    for (const item of codigos) {
      try {
        let generado;

        if (tipo === "ean13") {
          generado = generarCodigoBarrasEAN13(item.codigo, sharedOptions);
        } else if (tipo === "gtin14") {
          generado = generarCodigoBarrasGTIN14(item.codigo, sharedOptions);
        } else {
          generado = generarCodigoBarrasUPC(item.codigo, sharedOptions);
        }

        resultados.push(generado);
      } catch (error: any) {
        errores.push(`Fila ${item.row}: ${error.message}`);
      }
    }

    if (!resultados.length) {
      return new Response(
        JSON.stringify({
          error: "No se pudo generar ningún código.",
          details: errores
        }),
        { status: 400 }
      );
    }

    const zipBuffer = await crearZipDeSVGs(resultados);

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="codigos-${tipo}.zip"`
      }
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Error interno al procesar el archivo.",
        details: error.message
      }),
      { status: 500 }
    );
  }
};