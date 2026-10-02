const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  use: { baseURL: "http://127.0.0.1:3000", channel: process.env.PLAYWRIGHT_CHANNEL || "chrome", headless: true },
  reporter: [["list"]],
  webServer: {
    command: "npm start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
});
