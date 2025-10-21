// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    // Dieser Block gilt nur für Dateien, die auf .spec.ts enden
    files: ["**/*.spec.ts"],
    rules: {
      // Deaktiviert die Regel, die die explizite Verwendung von 'any' verbietet
      "@typescript-eslint/no-explicit-any": "off",

      // OPTIONAL: Oft ist es in Tests auch sinnvoll, die Regel für
      // das "Non-null assertion operator" (!) zu deaktivieren.
      // "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
