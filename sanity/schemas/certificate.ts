import { defineType, defineField } from '@sanity/types'

export default defineType({
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'issuer', type: 'string' }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'validUntil', type: 'date' }),
    defineField({ name: 'description_pl', title: 'Description (PL)', type: 'string' }),
    defineField({ name: 'description_en', title: 'Description (EN)', type: 'string' }),
  ],
  preview: { select: { title: 'name', subtitle: 'issuer', media: 'image' } },
})
