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
    rules: {
      // Turn off strict TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // Turn off strict Next.js rules
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      
      // Turn off strict React rules
      "react/no-unescaped-entities": "warn",
      "react/display-name": "warn",
      "react/jsx-key": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "warn",
      
      // Allow console statements (common in development)
      "no-console": "warn",
      
      // Allow unused variables (common during development)
      "no-unused-vars": "warn",
      
      // Turn off import/export strict rules
      "import/no-anonymous-default-export": "warn",
      
      // Allow any type usage
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      
      // Allow empty functions
      "@typescript-eslint/no-empty-function": "warn",
      
      // Allow require statements
      "@typescript-eslint/no-var-requires": "warn",
      
      // Allow empty object types (common in component libraries)
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
];

export default eslintConfig;
