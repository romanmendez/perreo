const path = require("path");

module.exports = {
  roots: [path.join(__dirname, "./src")],
  rootDir: path.join(__dirname, "."),
  testEnvironment: "node",
  testMatch: ["**/__tests__/**"],
  moduleDirectories: [
    "node_modules",
    path.join(__dirname, "./src"),
    path.join(__dirname, "./test"),
  ],
  collectCoverageFrom: ["**/src/**/*.js"],
  coveragePathIgnorePatterns: [".*/__tests__/.*"],
};
