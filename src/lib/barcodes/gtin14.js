import JsBarcode from "jsbarcode";
import { DOMImplementation, XMLSerializer } from "xmldom";
import { DEFAULT_SHARED_OPTIONS } from "./config";

export function generarCodigoBarrasGTIN14(codigo, sharedOptions = {}) {
  const codigoStr = codigo.toString().trim();

  if (!/^\d{14}$/.test(codigoStr)) {
    throw new Error(`Código GTIN-14 inválido: ${codigoStr}`);
  }

  const options = {
    format: "ITF14",
    ...DEFAULT_SHARED_OPTIONS,
    ...sharedOptions,
    text: codigoStr,
    fontOptions: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20
  };

  const document = new DOMImplementation().createDocument(
    "http://www.w3.org/1999/xhtml",
    "html",
    null
  );

  const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  JsBarcode(svgNode, codigoStr, {
    ...options,
    xmlDocument: document
  });

  const xmlSerializer = new XMLSerializer();
  let svgText = xmlSerializer.serializeToString(svgNode);

  svgText = svgText.replace(
    "</svg>",
    `<text x="50%" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="14"></text></svg>`
  );

  return {
    codigo: codigoStr,
    svg: svgText
  };
}