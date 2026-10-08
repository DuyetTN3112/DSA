// ESLint nghiêm ngặt nhất: TS strict type-checked + Svelte + cấm any/unknown + max 300 dòng/file
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  // Forward type-info cho svelte-eslint-parser -> @typescript-eslint/parser
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        extraFileExtensions: ['.svelte'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Cấm any hoàn toàn
      '@typescript-eslint/no-explicit-any': 'error',
      // Cấm unknown: bắt buộc dùng type cụ thể
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSUnknownKeyword',
          message: 'Cấm unknown: khai báo type cụ thể thay thế.',
        },
      ],
      // Cấm non-null assertion: bắt buộc narrow đúng cách
      '@typescript-eslint/no-non-null-assertion': 'error',
      // Không file nào quá 300 dòng (quy định của dự án)
      'max-lines': [
        'error',
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
    },
  },
);
