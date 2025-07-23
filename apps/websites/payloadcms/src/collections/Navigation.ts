import {  CollectionConfig } from 'payload'

export const Navigation: CollectionConfig = {
  admin: {
    useAsTitle: 'name',
  },
  slug: 'navigation',
  fields: [
    // remember, you own these fields
    // these are merely suggestions/examples
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      required: true,
    },
  ],
}
