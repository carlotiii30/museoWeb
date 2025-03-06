import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

// Función para generar las URLs
function generarURLs(paginas, base) {
  const urls = [];
  for (let i = 1; i <= paginas; i++) {
    urls.push(`${base}${i}`);
  }
  return urls;
}

// Función para recuperar URLs de obras singulares de una página
async function obtenerUrlsDeObras(pag) {
  const pags = [];
  await page.goto(pag);
  const locators = page.locator(".descripcion > a");
  for (const locator of await locators.all()) {
    pags.push(await locator.getAttribute("href"));
  }
  return pags;
}

// Función para recuperar información de una obra singular
async function obtenerInfoDeObra(url) {
  await page.goto(url);

  const titulo = await page.locator(".header-title").innerText();
  const descripcion = await page.locator(".body-content").first().innerText();
  const procedencia = await page.locator(".body-content").nth(1).innerText();
  const comentario = await page.locator(".body-content").nth(2).innerText();
  const imagen = await page.locator(".wrap-img").getAttribute("src");

  return { titulo, descripcion, procedencia, comentario, imagen };
}

// Función para guardar datos en un archivo JSON
async function guardarEnDisco(nombreArchivo, datos) {
  const dir = path.dirname(nombreArchivo);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(nombreArchivo, JSON.stringify(datos, null, 2));
  console.log("🚀 Archivo guardado: ", nombreArchivo);
}

// Función principal
const browser = await chromium.launch();
const page = await browser.newPage();

// lista de páginas con enlaces a 'obras-singulares'
const baseUrl =
  "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=";
const paginas = 6;
const obras_singulares = generarURLs(paginas, baseUrl);

// recuperamos los enlaces de las obras de cada pagina
const enlaces_de_obras_singulares = [];
const lista_info_para_BD = [];

for (const pag of obras_singulares) {
  const urls = await obtenerUrlsDeObras(pag);
  enlaces_de_obras_singulares.push(...urls); // ... operador spread ES6 -> Convierte la lista en elementos
}
console.log("🚀 Hay ", enlaces_de_obras_singulares.length, " obras singulares");

for (const url of enlaces_de_obras_singulares) {
  const info_obra = await obtenerInfoDeObra(url);
  lista_info_para_BD.push(info_obra);
}
console.log("🚀 Se han extraído todas las obras");

guardarEnDisco("./data/info_obras.json", lista_info_para_BD);

await browser.close();
