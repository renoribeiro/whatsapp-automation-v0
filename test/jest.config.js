module.exports = {
  displayName: "Backend Tests",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testMatch: ["**/*.spec.ts", "**/*.e2e-spec.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.(t|j)s", "!src/**/*.spec.ts", "!src/**/*.e2e-spec.ts", "!src/main.ts"],
  coverageDirectory: "../coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "../",
  testRegex: ".*\\.spec\\.ts$",
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
}
