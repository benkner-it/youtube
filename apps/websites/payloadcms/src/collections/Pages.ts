import { FormBlock } from '@/blocks/FormBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  //   auth: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [HeroBlock, FormBlock],
    },
  ],
}
