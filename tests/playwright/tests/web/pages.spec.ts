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
    "opens category page and shows only posts from that category",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories");

      await page.getByText("React (2)").click();

      await expect(page.getByText("React Posts")).toBeVisible();

      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await expect(
        page.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "post list shows title description category and date",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories/React");

      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await expect(
        page.getByText(
          "Illo sint voluptas. Error voluptates culpa eligendi.",
          { exact: false },
        ).first(),
      ).toBeVisible();

      await expect(page.getByText("Category: React").first()).toBeVisible();

      await expect(
        page.getByText("Date posted:", { exact: false }).first(),
      ).toBeVisible();
    },
  );

  test(
    "clicking post title opens post details page",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories/React");

      await page
        .getByText("Better front ends with Fatboy Slim")
        .click();

      await expect(page).toHaveURL(
        /\/posts\/better-front-ends-with-fatboy-slim/,
      );

      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();
    },
  );

  test(
    "post details page shows title and content",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto(
        "/posts/better-front-ends-with-fatboy-slim",
      );

      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await expect(page.getByText("Title 1")).toBeVisible();
    },
  );
});