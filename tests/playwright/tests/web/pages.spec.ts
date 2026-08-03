import { expect, test } from "./fixtures";

test.describe("Blog pages", () => {
  test(
    "shows categories of active posts",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories");

      await expect(
        page.getByRole("heading", {
          name: "Categories",
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("link", {
          name: "Node (1)",
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("link", {
          name: "React (2)",
        }),
      ).toBeVisible();
    },
  );

  test(
    "clicking a category shows only posts from that category",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories");

      await page
        .getByRole("link", {
          name: "React (2)",
        })
        .click();

      await expect(
        page.getByRole("heading", {
          name: "React Posts",
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("link", {
          name: "Better front ends with Fatboy Slim",
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("link", {
          name: "No front end framework is the best",
        }),
      ).toBeVisible();

      await expect(
        page.getByText("Boost your conversion rate"),
      ).not.toBeVisible();

      await expect(
        page.getByText("Visual Basic is the future"),
      ).not.toBeVisible();
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
        page.getByRole("link", {
          name: "Better front ends with Fatboy Slim",
        }),
      ).toBeVisible();

      await expect(
        page
          .getByText(
            /Illo sint voluptas\. Error voluptates culpa eligendi\./,
          )
          .first(),
      ).toBeVisible();

      await expect(
        page.getByText("Category: React").first(),
      ).toBeVisible();

      await expect(
        page.getByText("Date posted: 16/03/2020"),
      ).toBeVisible();
    },
  );

  test(
    "clicking a post title opens the post details page",
    {
      tag: "@pages",
    },
    async ({ page }) => {
      await page.goto("/categories/React");

      await page
        .getByRole("link", {
          name: "Better front ends with Fatboy Slim",
        })
        .click();

      await expect(page).toHaveURL(
        /\/posts\/better-front-ends-with-fatboy-slim$/,
      );
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
        page.getByRole("heading", {
          level: 1,
          name: "Better front ends with Fatboy Slim",
        }),
      ).toBeVisible();

      await expect(
        page.getByText(/Title 1/),
      ).toBeVisible();

      await expect(
        page.getByText(/post2/),
      ).toBeVisible();
    },
  );
});