import { expect, test } from "./fixtures";

test.describe("Post components", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/categories/React");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test(
    "can hide a post",
    { tag: "@components" },
    async ({ page }) => {
      const postTitle = page.getByText(
        "Better front ends with Fatboy Slim",
      );

      await expect(postTitle).toBeVisible();

      await page
        .getByRole("button", { name: "Hide post" })
        .first()
        .click();

      await expect(postTitle).not.toBeVisible();
    },
  );

  test(
    "can unhide all posts",
    { tag: "@components" },
    async ({ page }) => {
      const postTitle = page.getByText(
        "Better front ends with Fatboy Slim",
      );

      await page
        .getByRole("button", { name: "Hide post" })
        .first()
        .click();

      await expect(postTitle).not.toBeVisible();

      await page
        .getByRole("button", { name: "Unhide all posts" })
        .click();

      await expect(postTitle).toBeVisible();
    },
  );

  test(
    "keeps hidden posts hidden after reload",
    { tag: "@components" },
    async ({ page }) => {
      const postTitle = page.getByText(
        "Better front ends with Fatboy Slim",
      );

      await page
        .getByRole("button", { name: "Hide post" })
        .first()
        .click();

      await expect(postTitle).not.toBeVisible();

      await page.reload();

      await expect(postTitle).not.toBeVisible();
    },
  );

  test(
    "gets a random image when post has no image",
    { tag: "@components" },
    async ({ page }) => {
      await page.route(
        "https://dog.ceo/api/breeds/image/random",
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              message: "https://example.com/random-dog.jpg",
              status: "success",
            }),
          });
        },
      );

      await page.goto("/categories/React");

      const image = page.getByAltText(
        "No front end framework is the best",
      );

      await expect(image).toBeVisible();

      await expect(image).toHaveAttribute(
        "src",
        "https://example.com/random-dog.jpg",
      );
    },
  );
});
