import { defineType, defineField } from '@sanity/types'

export const SHIP_ZONES = [
  'engine_room', 'cargo_hold', 'deck', 'bilge',
  'ballast_tank', 'cooling', 'fuel', 'galley', 'accommodation',
] as const

export type ShipZone = typeof SHIP_ZONES[number]

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name_pl', title: 'Name (PL)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'name_en', title: 'Name (EN)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'name_de', title: 'Name (DE)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name_en' }, validation: (r) => r.required() }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description_pl', title: 'Description (PL)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_en', title: 'Description (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_de', title: 'Description (DE)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'shipZones',
      title: 'Ship Zones',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: SHIP_ZONES.map((z) => ({ title: z.replace('_', ' '), value: z })) },
    }),
    defineField({ name: 'tags', title: 'Search Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'isBiological', title: 'Biological Product', type: 'boolean', initialValue: false }),
    defineField({
      name: 'dosage',
      title: 'Dosage',
      type: 'object',
      fields: [
        defineField({ name: 'baseConc', title: 'Base Concentration', type: 'number' }),
        defineField({
          name: 'unit',
          type: 'string',
          options: { list: ['ml/L', '%', 'g/L'] },
        }),
        defineField({ name: 'notes_pl', title: 'Notes (PL)', type: 'string' }),
        defineField({ name: 'notes_en', title: 'Notes (EN)', type: 'string' }),
      ],
    }),
    defineField({ name: 'datasheet', title: 'Safety Datasheet (PDF)', type: 'file' }),
    defineField({ name: 'relatedProducts', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'name_en', subtitle: 'slug.current', media: 'image' },
  },
})
