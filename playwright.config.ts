import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["list"],
  ],

  use: {
    baseURL: process.env.BASE_URL || "https://reqres.in",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // --- Browser projects ---
    {
      name: "chromium",
      testMatch: "tests/e2e/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testMatch: "tests/e2e/**/*.spec.ts",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testMatch: "tests/e2e/**/*.spec.ts",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      testMatch: "tests/e2e/**/*.spec.ts",
      use: { ...devices["Pixel 5"] },
    },

    // --- API project (no browser) ---
    {
      name: "api",
      testMatch: "tests/api/**/*.spec.ts",
      use: { baseURL: process.env.API_BASE_URL || "https://reqres.in" },
    },
  ],

  outputDir: "test-results/",
});
