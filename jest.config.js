import path from "path";

export default {
  roots: [path.join(__dirname, "./")],
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
  moduleNameMapper: {
    "@graphql(.*)": "<rootDir>/graphql/$1",
    "@db(.*)": "<rootDir>/db/$1",
    "@utils(.*)": "<rootDir>/utils/$1",
    "@components(.*)": "<rootDir>/src/components/$1",
    "@test(.*)": "<rootDir>/test/$1",
    "@dog(.*)": "<rootDir>/src/components/dog",
    "@attendance(.*)": "<rootDir>/src/components/attendance",
    "@owner(.*)": "<rootDir>/src/components/owner",
    "@pass(.*)": "<rootDir>/src/components/pass",
  },
};
