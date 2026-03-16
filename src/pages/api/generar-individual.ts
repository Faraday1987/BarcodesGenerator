export const prerender = false;

import type { APIRoute } from "astro";
import { generarCodigoBarrasEAN13 } from "@src/lib/barcodes/ean13";
import { generarCodigoBarrasGTIN14 } from "@src/lib/barcodes/gtin14";
import { generarCodigoBarrasUPC } from "@src/lib/barcodes/upc";
import { normalizarSharedOptions } from "@src/lib/barcodes/config";

type BarcodeResult = {
  codigo: string;
  svg: string;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const tipoRaw = formData.get("tipo");
    const codigoRaw = formData.get("codigo");

    const tipo = typeof tipoRaw === "string" ? tipoRaw.trim().toLowerCase() : "";
    const codigo = typeof codigoRaw === "string" ? codigoRaw.trim() : "";

    console.log("[generar-individual] tipo:", tipo);
    console.log("[generar-individual] codigo:", codigo);

    if (!tipo) {
      return jsonResponse(
        {
          ok: false,
          error: "Debes seleccionar un tipo de código."
        },
        400
      );
    }

    if (!["ean13", "gtin14", "upc"].includes(tipo)) {
      return jsonResponse(
        {
          ok: false,
          error: "Formato no soportado."
        },
        400
      );
    }

    if (!codigo) {
      return jsonResponse(
        {
          ok: false,
          error: "Debes escribir un código."
        },
        400
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

    console.log("[generar-individual] sharedOptions:", sharedOptions);

    let resultado: BarcodeResult;

    switch (tipo) {
      case "ean13":
        resultado = generarCodigoBarrasEAN13(codigo, sharedOptions);
        break;

      case "gtin14":
        resultado = generarCodigoBarrasGTIN14(codigo, sharedOptions);
        break;

      case "upc":
        resultado = generarCodigoBarrasUPC(codigo, sharedOptions);
        break;

      default:
        return jsonResponse(
          {
            ok: false,
            error: "Formato no soportado."
          },
          400
        );
    }

    if (!resultado?.svg || !resultado?.codigo) {
      return jsonResponse(
        {
          ok: false,
          error: "No se pudo generar el SVG."
        },
        500
      );
    }

    return jsonResponse(
      {
        ok: true,
        codigo: resultado.codigo,
        svg: resultado.svg,
        filename: `${resultado.codigo}.svg`
      },
      200
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "No se pudo generar el código.";

    console.error("[generar-individual] ERROR:", error);

    return jsonResponse(
      {
        ok: false,
        error: message
      },
      400
    );
  }
};

function jsonResponse(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}