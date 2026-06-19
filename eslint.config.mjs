import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This project fetches from Supabase on mount via plain useEffect + setState
      // (no SWR/React Query). That's the standard fetch-on-mount pattern and is
      // intentional here, not a bug the React Compiler rule needs to flag.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Third-party Claude Code skill, not part of this project's source.
    ".claude/**",
  ]),
]);

export default eslintConfig;
