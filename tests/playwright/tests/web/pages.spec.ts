import { expect, test } from "./fixtures";

test.describe("Blog pages", () => {
  test(
    "shows active post categories",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories");

      await expect(page.getByText("Node (1)")).toBeVisible();
      await expect(page.getByText("React (2)")).toBeVisible();
    },
  );

  test(
    "opens category page",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories");

      await page.getByText("React (2)").click();

      await expect(page.getByText("React Posts")).toBeVisible();
    },
  );

  test(
    "opens post details",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories/React");

      await page
        .getByText("Better front ends with Fatboy Slim")
        .click();

      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await expect(page.getByText("Title 1")).toBeVisible();
    },
  );
});