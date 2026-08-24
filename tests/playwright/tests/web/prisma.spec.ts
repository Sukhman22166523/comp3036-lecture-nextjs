import { expect, test } from "./fixtures";

test.describe("Prisma features", () => {
  test(
    "loads posts from Prisma database @prisma",
    {
      tag: "@prisma",
    },
    async ({ page }) => {
      await page.goto("/");

      await expect(
        page.getByRole("heading", { name: "Blog Posts" }),
      ).toBeVisible();

      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();
    },
  );

  test(
    "shows available tags from Prisma @prisma",
    {
      tag: "@prisma",
    },
    async ({ page }) => {
      await page.goto("/");

      await expect(
        page.getByRole("heading", { name: "Available Tags" }),
      ).toBeVisible();

      await expect(
        page.getByRole("link", { name: "Back-End" }),
      ).toBeVisible();

      await expect(
        page.getByRole("link", { name: "Front-End" }),
      ).toBeVisible();
    },
  );

  test(
    "filters posts by tag using Prisma @prisma",
    {
      tag: "@prisma",
    },
    async ({ page }) => {
      await page.goto("/");

      await page
        .getByRole("link", { name: "Front-End" })
        .click();

      await expect(
        page.getByRole("heading", {
          name: "Posts tagged: Front-End",
        }),
      ).toBeVisible();

      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();
    },
  );

  test(
    "can open a post from Prisma data @prisma",
    {
      tag: "@prisma",
    },
    async ({ page }) => {
      await page.goto("/");

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
    "can like a post using Prisma @prisma",
    {
      tag: "@prisma",
    },
    async ({ page }) => {
      await page.goto(
        "/posts/better-front-ends-with-fatboy-slim",
      );

      const likesText = page.getByText(/^\d+ likes$/);

      await expect(likesText).toBeVisible();

      const beforeText = await likesText.textContent();

      const beforeLikes = Number(
        beforeText?.split(" ")[0],
      );

      await page
        .getByRole("button", { name: "Like" })
        .click();

      await expect(likesText).toHaveText(
        `${beforeLikes + 1} likes`,
      );
    },
  );

  test(
    "can update a post using Prisma @prisma",
    {
      tag: "@prisma",
    },
    async ({ page }) => {
      await page.goto(
        "/posts/better-front-ends-with-fatboy-slim",
      );

      const title = page.getByLabel("Title");

      const description =
        page.getByLabel("Description");

      await title.fill("Prisma Updated Post");

      await description.fill(
        "Updated description from Prisma test.",
      );

      await page
        .getByRole("button", { name: "Update Post" })
        .click();

      await expect(
        page.getByText("Post updated successfully."),
      ).toBeVisible();

      await expect(title).toHaveValue(
        "Prisma Updated Post",
      );

      // Restore original post data
      await title.fill(
        "Better front ends with Fatboy Slim",
      );

      await description.fill(
        "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.",
      );

      await page
        .getByRole("button", { name: "Update Post" })
        .click();

      await expect(
        page.getByText("Post updated successfully."),
      ).toBeVisible();
    },
  );

  test(
    "preloads a post when hovering over its link @prisma",
    {
      tag: "@prisma",
    },
    async ({ page }) => {
      await page.goto("/");

      const postLink = page.getByRole("link", {
        name: "Better front ends with Fatboy Slim",
      });

      await expect(postLink).toBeVisible();

      await postLink.hover();

      await expect(postLink).toHaveAttribute(
        "href",
        "/posts/better-front-ends-with-fatboy-slim",
      );
    },
  );
});