import { expect, test } from "./fixtures";

test.describe("Home screen", () => {
  test(
    "shows the blog posts",
    {
      tag: "@home",
    },
    async ({ page }) => {
      await page.goto("/");

      await expect(
        page.getByRole("heading", { name: "Blog Posts" }),
      ).toBeVisible();

      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await expect(
        page.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );
});