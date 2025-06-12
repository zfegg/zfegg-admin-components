import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        reactHooks.configs['recommended-latest'],
        reactRefresh.configs.vite,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-unsafe-function-type": ["off"],
        "no-prototype-builtins": ["off"],
        "no-case-declarations": ["off"],
        "react-refresh/only-export-components": ["off"],
        "react-hooks/exhaustive-deps": ["off"],
    },
  },
)
