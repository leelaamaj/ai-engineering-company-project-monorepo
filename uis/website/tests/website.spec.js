const { test, expect } = require("@playwright/test");
const submit = (page) => page.locator('button[type="submit"]').click();
async function valid(page, volume = "101-500") {
  await page.locator("#company_name").fill("Example Brand");
  await page.locator("#contact_person").fill("Alex Rivera");
  await page.locator("#email").fill("alex@example.com");
  await page.locator("#phone").fill("+1 213 555 0147");
  await page.locator("#country").selectOption("Both");
  await page.locator("#product_type").selectOption("Fashion");
  await page.locator("#monthly_volume").selectOption(volume);
  await page.locator("#services0").check();
  await page.locator("#current_3pl1").check();
  await page.locator("#privacy").check();
}
test("homepage sections, company schema and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(
    "Logistics that scales with your e-commerce",
  );
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  );
  expect(schema.name).toBe("TrackFlow");
  expect(schema.address.map((x) => x.addressCountry)).toEqual(["US", "ES"]);
  expect(
    await page
      .locator("main section")
      .evaluateAll((nodes) => nodes.map((n) => n.id)),
  ).toEqual(["home", "services", "coverage", "", "contact"]);
  await page.getByRole("link", { name: "Request information" }).first().click();
  await expect(page).toHaveURL(/application.html$/);
});
test("empty form reports all required errors and focuses company name", async ({
  page,
}) => {
  await page.goto("/application.html");
  await submit(page);
  await expect(page.locator("#error-summary")).toBeVisible();
  await expect(page.locator("#company_name")).toBeFocused();
  for (const name of [
    "company_name",
    "contact_person",
    "email",
    "phone",
    "country",
    "product_type",
    "monthly_volume",
    "services",
    "current_3pl",
    "privacy",
  ])
    await expect(page.locator(`#${name}-error`)).toBeVisible();
  await expect(page.locator("#website-error")).toBeHidden();
  await expect(page.locator("#comments-error")).toBeHidden();
  await expect(page.locator("#success-message")).toBeHidden();
});
for (const [field, bad, good] of [
  ["company_name", "A", "AB"],
  ["contact_person", "Alex", "Alex Rivera"],
  ["email", "alex@", "alex@example.com"],
  ["phone", "2135550147", "+34 976 123 456"],
  ["website", "ftp://example.com", "https://example.com"],
]) {
  test(`${field}: blur validation, correction, and invalid submission`, async ({
    page,
  }) => {
    await page.goto("/application.html");
    await valid(page);
    await page.locator(`#${field}`).fill(bad);
    await page.locator(`#${field}`).press("Tab");
    await expect(page.locator(`#${field}-error`)).toBeVisible();
    await submit(page);
    await expect(page.locator("#success-message")).toBeHidden();
    await page.locator(`#${field}`).fill(good);
    await expect(page.locator(`#${field}-error`)).toBeHidden();
    await submit(page);
    await expect(page.locator("#success-message")).toBeVisible();
  });
}
test("services, provider, and consent prevent success", async ({ page }) => {
  await page.goto("/application.html");
  await valid(page);
  await page.locator("#services0").uncheck();
  await page.locator("#privacy").uncheck();
  await submit(page);
  await expect(page.locator("#services-error")).toBeVisible();
  await expect(page.locator("#privacy-error")).toBeVisible();
  await expect(page.locator("#success-message")).toBeHidden();
  await page.locator("#services2").check();
  await page.locator("#privacy").check();
  await submit(page);
  await expect(page.locator("#success-message")).toBeVisible();
});
test("500 comments accepted, 501 blocked, visible counter", async ({
  page,
}) => {
  await page.goto("/application.html");
  await valid(page);
  await page.locator("#comments").fill("a".repeat(500));
  await submit(page);
  await expect(page.locator("#success-message")).toBeVisible();
  await expect(page.locator("#comments-counter")).toHaveText("500 / 500");
  await page.locator("#comments").fill("a".repeat(501));
  await submit(page);
  await expect(page.locator("#comments-error")).toContainText(
    "Comments cannot exceed 500",
  );
  await expect(page.locator("#success-message")).toBeHidden();
});
test("low volume needs explicit confirmation; changing product revokes it", async ({
  page,
}) => {
  await page.goto("/application.html");
  await valid(page, "0-100");
  await submit(page);
  await expect(page.locator("#low-volume-warning")).toBeVisible();
  await expect(page.locator("#confirm-low-volume")).toBeFocused();
  await expect(page.locator("#success-message")).toBeHidden();
  await page.locator("#confirm-low-volume").check();
  await submit(page);
  await expect(page.locator("#success-message")).toBeVisible();
  await page.locator("#product_type").selectOption("Electronics");
  await expect(page.locator("#confirm-low-volume")).not.toBeChecked();
  await submit(page);
  await expect(page.locator("#success-message")).toBeHidden();
  await page.locator("#monthly_volume").selectOption("501-2000");
  await expect(page.locator("#low-volume-warning")).toBeHidden();
  await submit(page);
  await expect(page.locator("#success-message")).toBeVisible();
});
test("language switches preserve entered values and translate errors and options", async ({
  page,
}) => {
  await page.goto("/application.html");
  await valid(page);
  await page.locator("#contact_person").fill("Alex");
  await submit(page);
  await page.locator('[data-language="es"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("#company_name")).toHaveValue("Example Brand");
  await expect(page.locator("#contact_person-error")).toContainText(
    "nombre y apellido",
  );
  await expect(page.locator("#country")).toHaveValue("Both");
  await expect(page.locator('#country option[value="Both"]')).toHaveText(
    "Ambos",
  );
  await page.locator("#contact_person").fill("Alex Rivera");
  await submit(page);
  await expect(page.locator("#success-message")).toContainText("¡Gracias");
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Logística");
});
test("clear resets values, success, warnings, counter, and errors", async ({
  page,
}) => {
  await page.goto("/application.html");
  await valid(page, "0-100");
  await page.locator("#comments").fill("Test");
  await page.locator("#confirm-low-volume").check();
  await submit(page);
  await page.locator('button[type="reset"]').click();
  await expect(page.locator("#company_name")).toHaveValue("");
  await expect(page.locator("#services0")).not.toBeChecked();
  await expect(page.locator("#success-message")).toBeHidden();
  await expect(page.locator("#low-volume-warning")).toBeHidden();
  await expect(page.locator("#comments-counter")).toHaveText("0 / 500");
  await submit(page);
  await page.locator('button[type="reset"]').click();
  await expect(page.locator("#error-summary")).toBeHidden();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
});
test("keyboard skip link, group controls, and form labels", async ({
  page,
}) => {
  await page.goto("/application.html");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.locator("#services0").focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#services0")).toBeChecked();
  for (const control of await page.locator("input, select, textarea").all()) {
    const id = await control.getAttribute("id");
    expect(id).toBeTruthy();
    await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
  }
});
test("requests remain local, console is clean, only language persists", async ({
  page,
}) => {
  const errors = [],
    external = [],
    methods = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => {
    methods.push(r.method());
    if (!r.url().startsWith("http://127.0.0.1:3000")) external.push(r.url());
  });
  await page.goto("/application.html");
  await valid(page);
  await submit(page);
  await expect(page.locator("#success-message")).toBeVisible();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(methods.every((x) => x === "GET")).toBe(true);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([
    "trackflow-language",
  ]);
  await page.reload();
  await expect(page.locator("#company_name")).toHaveValue("");
});
for (const width of [375, 768, 1440])
  for (const lang of ["en", "es"]) {
    test(`responsive ${width}px ${lang}: both pages have no horizontal overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.locator(`[data-language="${lang}"]`).click();
      for (const path of ["/", "/application.html"]) {
        await page.goto(path);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await expect(page.locator("h1")).toBeVisible();
        if (path === "/application.html") {
          await valid(page);
          await submit(page);
          await expect(page.locator("#success-message")).toBeVisible();
        }
      }
    });
  }
