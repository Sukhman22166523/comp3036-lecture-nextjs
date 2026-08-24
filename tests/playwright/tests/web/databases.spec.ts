import { expect, test } from "@playwright/test";

test.describe("Database features @databases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads posts from the database @databases", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Blog Posts" }),
    ).toBeVisible();

    const posts = page.locator("article");

    await expect(posts.first()).toBeVisible();
    expect(await posts.count()).toBeGreaterThan(0);
  });

  test("shows available tags @databases", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Available Tags" }),
    ).toBeVisible();

    const tagsSection = page.locator("section");

    const tagLinks = tagsSection.getByRole("link");

    expect(await tagLinks.count()).toBeGreaterThan(0);
  });

  test("filters posts by tag @databases", async ({ page }) => {
    const tagsSection = page.locator("section");
    const firstTag = tagsSection.getByRole("link").first();

    const tagName = (await firstTag.textContent())?.trim();

    expect(tagName).toBeTruthy();

    await firstTag.click();

    await expect(
      page.getByRole("heading", {
        name: `Posts tagged: ${tagName}`,
      }),
    ).toBeVisible();

    const posts = page.locator("article");

    await expect(posts.first()).toBeVisible();

    const count = await posts.count();

    for (let i = 0; i < count; i++) {
      await expect(posts.nth(i)).toContainText(tagName!);
    }
  });

  test("can like a post @databases", async ({ page }) => {
    const firstPostLink = page.locator("article h2 a").first();

    await firstPostLink.click();

    const likesText = page.getByText(/^\d+ likes$/);

    await expect(likesText).toBeVisible();

    const beforeText = await likesText.textContent();
    const beforeLikes = Number(beforeText?.split(" ")[0]);

    await page.getByRole("button", { name: "Like" }).click();

    await expect(likesText).toHaveText(`${beforeLikes + 1} likes`);
  });

  test("can update a post @databases", async ({ page }) => {
    const firstPostLink = page.locator("article h2 a").first();

    await firstPostLink.click();

    await expect(
      page.getByRole("heading", { name: "Edit Post" }),
    ).toBeVisible();

    const titleInput = page.getByLabel("Title");
    const descriptionInput = page.getByLabel("Description");

    const originalTitle = await titleInput.inputValue();
    const originalDescription = await descriptionInput.inputValue();

    const updatedTitle = `${originalTitle} Updated`;

    await titleInput.fill(updatedTitle);
    await descriptionInput.fill(
      `${originalDescription} Updated`,
    );

    await page
      .getByRole("button", { name: "Update Post" })
      .click();

    await expect(
      page.getByText("Post updated successfully"),
    ).toBeVisible();

    // Restore the original data so repeated test runs
    // do not permanently modify the seed post.
    await titleInput.fill(originalTitle);
    await descriptionInput.fill(originalDescription);

    await page
      .getByRole("button", { name: "Update Post" })
      .click();

    await expect(
      page.getByText("Post updated successfully"),
    ).toBeVisible();
  });

  test("requires valid update data @databases", async ({ page }) => {
    const firstPostLink = page.locator("article h2 a").first();

    await firstPostLink.click();

    const titleInput = page.getByLabel("Title");

    await titleInput.fill("");

    await page
      .getByRole("button", { name: "Update Post" })
      .click();

    await expect(titleInput).toHaveAttribute("required", "");
  });
});