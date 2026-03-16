import JsBarcode from "jsbarcode";
import { DOMImplementation, XMLSerializer } from "xmldom";
import { DEFAULT_SHARED_OPTIONS } from "./config";

export function generarCodigoBarrasUPC(codigo, sharedOptions = {}) {
  const codigoStr = codigo.toString().trim();

  if (!/^\d{12}$/.test(codigoStr)) {
    throw new Error(`Código UPC-A inválido: ${codigoStr}`);
  }

  const options = {
    format: "UPC",
    ...DEFAULT_SHARED_OPTIONS,
    ...sharedOptions,
    text: codigoStr,
    fontOptions: "bold",
    fontSize: 16
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

  return {
    codigo: codigoStr,
    svg: xmlSerializer.serializeToString(svgNode)
  };
}