import { test, expect } from "@playwright/test";

test("Título de la página", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page).toHaveTitle("Bienvenido al Museo Arqueológico");
});

test("Busco oro", async ({ page }) => {
  await page.goto("http://localhost:8000/obras/buscar?búsqueda=oro");
  await expect(
    page.getByRole("heading", { name: "Reproducción de diadema" })
  ).toBeVisible();
});

test("Logging pp", async ({ page }) => {
  await page.goto("http://localhost:8000/usuarios/login");

  await page.fill("#correo", "pp@pp.com");
  await page.fill("#password", "contraseñadepp");
  await page.click('button:has-text("Iniciar sesión")');

  await expect(
    page.getByRole("heading", { name: "Bienvenido al Museo Arqueológico" })
  ).toBeVisible();
});
