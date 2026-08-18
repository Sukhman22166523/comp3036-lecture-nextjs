import { expect, test } from "./fixtures";

test.describe("Fonts and Images", () => {
  test(
    "shows image preview on the post list",
    { tag: "@images" },
    async ({ page }) => {
      await page.goto("/categories/React");

      const image = page.getByAltText(
        "Better front ends with Fatboy Slim",
      );

      await expect(image).toBeVisible();
    },
  );

  test(
    "shows placeholder when post has no image",
    { tag: "@images" },
    async ({ page }) => {
      await page.goto("/categories/React");

      const image = page.getByAltText(
        "No front end framework is the best",
      );

      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute("src", /placeholder/);
    },
  );

  test(
    "shows large image on post detail page",
    { tag: "@images" },
    async ({ page }) => {
      await page.goto(
        "/posts/better-front-ends-with-fatboy-slim",
      );

      const image = page.getByAltText(
        "Better front ends with Fatboy Slim",
      );

      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute("width", "900");
      await expect(image).toHaveAttribute("height", "500");
    },
  );

  test(
    "uses Roboto as the main site font",
    { tag: "@images" },
    async ({ page }) => {
      await page.goto("/categories");

      const fontFamily = await page.locator("body").evaluate(
        (element) => getComputedStyle(element).fontFamily,
      );

      expect(fontFamily.toLowerCase()).toContain("roboto");
    },
  );

  test(
    "uses Press Start 2P for the post title",
    { tag: "@images" },
    async ({ page }) => {
      await page.goto(
        "/posts/better-front-ends-with-fatboy-slim",
      );

      const fontFamily = await page
        .locator(".post-title")
        .evaluate(
          (element) => getComputedStyle(element).fontFamily,
        );

      expect(fontFamily.toLowerCase()).toContain("press start 2p");
    },
  );
});