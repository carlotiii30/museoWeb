import { test, expect } from "@playwright/test";

test("Formulario de búsqueda vacío", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.click('button:has-text("Buscar")');
  await expect(page).toHaveURL("http://localhost:8000/");
});

test("Acceso a una obra específica", async ({ page }) => {
  await page.goto("http://localhost:8000/obras/129");
  await expect(
    page.getByRole("heading", { name: "Molar de homínido (Homo s.p.)" })
  ).toBeVisible();
});

test('Botón "Explorar Ahora"', async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.click('a:has-text("Explorar Ahora")');
  await expect(page).toHaveURL("http://localhost:8000/obras");
});
