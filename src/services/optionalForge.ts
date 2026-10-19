import { defineAsyncComponent, h, type Component } from 'vue'

// A development-only sibling package must not become a production dependency.
export function optionalForge(name: string) {
  const moduleName = 'component-forge'
  return defineAsyncComponent({
    loader: async () => {
      const module: Record<string, unknown> = await import(/* @vite-ignore */ moduleName)
      const component = module[name]
      if (!component || (typeof component !== 'object' && typeof component !== 'function')) throw new Error('Optional component unavailable')
      return component as Component
    },
    errorComponent: { render: () => h('p', { role: 'status' }, 'Optional Component Forge package is unavailable in this workspace.') },
  })
}
