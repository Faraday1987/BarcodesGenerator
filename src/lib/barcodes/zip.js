import JSZip from "jszip";

export async function crearZipDeSVGs(items) {
  const zip = new JSZip();

  items.forEach((item) => {
    zip.file(`${item.codigo}.svg`, item.svg);
  });

  return await zip.generateAsync({ type: "uint8array" });
}