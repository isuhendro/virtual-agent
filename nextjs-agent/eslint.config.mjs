import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // File size limits (300 lines per file, excluding blank lines and comments)
      "max-lines": [
        "error",
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      // Function size limits (100 lines per function, excluding blank lines and comments)
      "max-lines-per-function": [
        "error",
        {
          max: 100,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      // Cyclomatic complexity limit
      complexity: ["error", 10],
      // Max depth of nested callbacks
      "max-depth": ["error", 4],
      // Max number of parameters in function definitions
      "max-params": ["error", 5],
    },
  },
];

export default eslintConfig;
