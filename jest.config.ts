import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^server-only$": "<rootDir>/__tests__/empty.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx", module: "commonjs", esModuleInterop: true } }],
  },
};

export default config;
