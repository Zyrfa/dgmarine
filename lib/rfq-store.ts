import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RFQItem {
  id: string
  name: string
  slug: string
  quantity: string
  unit: string
  notes: string
}

interface RFQStore {
  items: RFQItem[]
  portOfDelivery: string
  vesselName: string
  imoNumber: string
  email: string
  add: (item: Omit<RFQItem, 'quantity' | 'notes'>) => void
  remove: (id: string) => void
  update: (id: string, patch: Partial<RFQItem>) => void
  setField: (field: keyof Pick<RFQStore, 'portOfDelivery' | 'vesselName' | 'imoNumber' | 'email'>, value: string) => void
  clear: () => void
  has: (id: string) => boolean
}

export const useRFQStore = create<RFQStore>()(
  persist(
    (set, get) => ({
      items: [],
      portOfDelivery: '',
      vesselName: '',
      imoNumber: '',
      email: '',

      add: (item) => {
        if (get().has(item.id)) return
        set((s) => ({ items: [...s.items, { ...item, quantity: '1', notes: '' }] }))
      },

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),

      setField: (field, value) => set({ [field]: value }),

      clear: () => set({ items: [], portOfDelivery: '', vesselName: '', imoNumber: '', email: '' }),

      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: 'dgmarine-rfq' }
  )
)
