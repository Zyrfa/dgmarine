import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CompareItem {
  id: string
  name: string
  slug: string
  zones: string[]
  tags: string[]
  dosage?: { baseConc: number; unit: string }
}

const MAX = 4

interface CompareStore {
  items: CompareItem[]
  add: (item: CompareItem) => boolean
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
  isFull: () => boolean
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        if (get().isFull() || get().has(item.id)) return false
        set((s) => ({ items: [...s.items, item] }))
        return true
      },

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),

      has: (id) => get().items.some((i) => i.id === id),

      isFull: () => get().items.length >= MAX,
    }),
    { name: 'dgmarine-compare' }
  )
)
