import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import VisualizationContainer from './VisualizationContainer.vue'
import { useTournamentStore } from '@/stores/tournament'

class DeferredReader {
  static readers: DeferredReader[] = []
  result: string | null = null
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  aborted = false
  constructor() { DeferredReader.readers.push(this) }
  readAsText(_file: File) { /* Controlled completion models slow external reads. */ }
  abort() { this.aborted = true }
  finish(result: string) { this.result = result; this.onload?.() }
}
afterEach(() => { vi.unstubAllGlobals(); DeferredReader.readers = [] })
describe('tournament import lifecycle', () => {
  it('shows loading, aborts superseded reads and retains stale data on invalid JSON', async () => {
    vi.stubGlobal('FileReader', DeferredReader)
    const pinia = createPinia(); setActivePinia(pinia)
    const wrapper = mount(VisualizationContainer, { props: { tournamentId: 'ewc-2025' }, global: { plugins: [pinia], stubs: { ThemeSelector: true, TimelineControls: true, RouterLink: true } } })
    await flushPromises()
    const store = useTournamentStore()
    const prior = store.currentTournament
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [new File(['{}'], 'data.json')], configurable: true })
    await input.trigger('change')
    expect(wrapper.get('[role="status"]').text()).toBe('Loading tournament')
    await input.trigger('change')
    expect(DeferredReader.readers[0].aborted).toBe(true)
    DeferredReader.readers[0].finish('{"name":"superseded"}')
    await flushPromises()
    expect(store.isLoading).toBe(true)
    DeferredReader.readers[1].finish('{}')
    await flushPromises()
    expect(store.currentTournament).toEqual(prior)
    expect(wrapper.get('[role="alert"]').text()).toContain('Showing stale sample data: EWC 2025')
    await wrapper.get('[role="alert"] button').trigger('click')
    expect(DeferredReader.readers).toHaveLength(3)
    const oversized = new File(['{}'], 'large.json')
    Object.defineProperty(oversized, 'size', { value: 2_000_001 })
    Object.defineProperty(input.element, 'files', { value: [oversized], configurable: true })
    await input.trigger('change')
    expect(store.isLoading).toBe(false)
    expect(wrapper.get('[role="alert"]').text()).toContain('under 2 MB')
    wrapper.unmount()
    expect(DeferredReader.readers[2].aborted).toBe(true)
  })
})
