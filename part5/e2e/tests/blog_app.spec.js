import { test, expect, describe, beforeEach } from "@playwright/test";
import { createBlog, createUser, userLogin } from "./helper";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await createUser(
      request,
      "User Playwright",
      "userplaywright",
      "userplaywright"
    );
    await createUser(
      request,
      "User2 Playwright",
      "user2playwright",
      "user2playwright"
    );

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = page.getByRole("heading", { name: "login to application" });
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await userLogin(page, "userplaywright", "userplaywright");
      await expect(page.getByText("User Playwright logged-in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await userLogin(page, "userplaywright", "wrong");
      await expect(
        page.getByText("User Playwright logged-in")
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await userLogin(page, "userplaywright", "userplaywright");

      await expect(page.getByText("User Playwright logged-in")).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "New blog title",
        "Blog author",
        "http://example.com"
      );
      await expect(page.getByText("New blog title Blog author")).toBeVisible();
    });

    describe("after new blog created", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "New blog title",
          "Blog author",
          "http://example.com"
        );
      });

      test("a blog can liked", async ({ page }) => {
        await page.getByRole("button", { name: "View" }).click();
        await expect(page.getByText("0")).toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("1")).toBeVisible();
      });

      test("a blog can be deleted", async ({ page }) => {
        await page.getByRole("button", { name: "View" }).click();

        page.once("dialog", async (dialog) => {
          expect(dialog.type()).toBe("confirm");
          await dialog.accept();
        });

        await page.getByRole("button", { name: "Remove" }).click();
        await expect(
          page.getByText("New blog title Blog author")
        ).not.toBeVisible();
      });

      test("only the creator can see the remove button", async ({ page }) => {
        // Button visible to User Playwright
        await page.getByRole("button", { name: "View" }).click();
        await expect(page.getByText("Remove")).toBeVisible();

        // User Playwright logs out
        await page.getByRole("button", { name: "logout" }).click();
        await expect(page.getByText("login to application")).toBeVisible();

        // User2 Playwright logs in
        await userLogin(page, "user2playwright", "user2playwright");
        await expect(
          page.getByText("User2 Playwright logged-in")
        ).toBeVisible();

        // Button not visible to User2 Playwright
        await page.getByRole("button", { name: "View" }).click();
        await expect(page.getByText("Remove")).not.toBeVisible();
      });
    });

    test("blogs are arranged in descending order of likes", async ({
      page,
    }) => {
      // Create blogs
      await createBlog(page, "First Blog", "Author A", "http://example.com/a");
      await createBlog(page, "Second Blog", "Author B", "http://example.com/b");
      await expect(page.getByText("Second Blog Author B")).toBeVisible();

      // Find blog containers
      const firstBlog = page.locator(".blog", { hasText: "First Blog" });
      const secondBlog = page.locator(".blog", { hasText: "Second Blog" });

      // Like "Second Blog" twice
      await secondBlog.getByRole("button", { name: "View" }).click();
      await secondBlog.getByRole("button", { name: "like" }).click();
      await expect(secondBlog.getByText("1")).toBeVisible();

      await secondBlog.getByRole("button", { name: "like" }).click();
      await expect(secondBlog.getByText("2")).toBeVisible();

      // Like "First Blog" once
      await firstBlog.getByRole("button", { name: "View" }).click();
      await firstBlog.getByRole("button", { name: "like" }).click();
      await expect(firstBlog.getByText("1")).toBeVisible();

      // Verify ordering in DOM
      const blogs = page.locator(".blog");
      const titles = await blogs.allTextContents();

      expect(titles[0]).toContain("Second Blog");
      expect(titles[1]).toContain("First Blog");
    });
  });
});
