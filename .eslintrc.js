module.exports = {
  root: true,
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "coverage/",
    ".eslintrc.cjs",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*.test.ts",
    "**/*.test.tsx",
    "next.config.js",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "next/core-web-vitals",
    "prettier",
  ],
  plugins: ["eslint-plugin-react-compiler"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "react-compiler/react-compiler": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
          properties: false,
          variables: false,
        },
      },
    ],
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
      },
    ],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowAny: false,
        allowBoolean: false,
        allowNullish: false,
        allowNumber: true,
        allowRegExp: false,
        allowNever: true,
      },
    ],
  },
};
