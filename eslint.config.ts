import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', 'work/**', 'src/views/**', 'src/pages/dock-iterations.vue', 'src/pages/tailwind-test.vue', 'env.d.ts', 'src/components/ui/Icon.spec.vue'] },
  ...tseslint.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: { ts: tseslint.parser, tsx: tseslint.parser, js: 'espree', jsx: 'espree' },
        ecmaVersion: 2024,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: { ...tseslint.configs.eslintRecommended.rules, 'vue/block-lang': ['error', { script: { lang: ['ts'], allowNoLang: false } }] },
  },
  { rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] } },
  { files: ['*.js'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
  { files: ['src/components/ui/Icon.vue'], rules: { 'vue/multi-word-component-names': 'off' } },
  { files: ['src/services/mcpClient.ts'], rules: { '@typescript-eslint/no-explicit-any': 'off', '@typescript-eslint/no-unused-vars': 'off' } },
)
