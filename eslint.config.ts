import vue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  { ignores: ['node_modules/**', 'dist/**', 'work/**', 'src/views/**', 'src/pages/dock-iterations.vue', 'src/pages/tailwind-test.vue', 'env.d.ts', 'src/components/ui/Icon.spec.vue'] },
  vue.configs['flat/essential'],
  vueTsConfigs.recommended,
  { rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] } },
  { files: ['*.js'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
  { files: ['src/components/ui/Icon.vue'], rules: { 'vue/multi-word-component-names': 'off' } },
  { files: ['src/services/mcpClient.ts'], rules: { '@typescript-eslint/no-explicit-any': 'off', '@typescript-eslint/no-unused-vars': 'off' } },
)
