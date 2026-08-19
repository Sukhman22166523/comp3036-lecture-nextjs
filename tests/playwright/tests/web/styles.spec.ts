import { expect, test } from "./fixtures";

test.describe("Blog styles", () => {
  test(
    "shows post metadata in a different color",
    {
      tag: "@styles",
    },
    async ({ page }) => {
      await page.goto("/categories/React");

      const metadata = page.locator(".post-metadata").first();

      await expect(metadata).toBeVisible();

      await expect(
        metadata.getByText("Tags:", { exact: false }),
      ).toBeVisible();

      await expect(
        metadata.getByText("Category:", { exact: false }),
      ).toBeVisible();

      await expect(
        metadata.getByText("Date posted:", { exact: false }),
      ).toBeVisible();

      const metadataColor = await metadata.evaluate(
        (element) => getComputedStyle(element).color,
      );

      const bodyColor = await page.locator("body").evaluate(
        (element) => getComputedStyle(element).color,
      );

      expect(metadataColor).not.toBe(bodyColor);
    },
  );
});
