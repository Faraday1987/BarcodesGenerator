import JsBarcode from "jsbarcode";
import { DOMImplementation, XMLSerializer } from "xmldom";
import { DEFAULT_SHARED_OPTIONS } from "./config";

export function generarCodigoBarrasEAN13(codigo, sharedOptions = {}) {
  const codigoStr = codigo.toString().trim();

  if (!/^\d{13}$/.test(codigoStr)) {
    throw new Error(`Código EAN13 inválido: ${codigoStr}`);
  }

  const options = {
    format: "EAN13",
    ...DEFAULT_SHARED_OPTIONS,
    ...sharedOptions
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