import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { FormBlock } from '@/blocks/FormBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { generatePreviewPath } from '@/utils/generatePreviewPath'
import type { CollectionConfig, Tab } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

const ContentTab: Tab = {
  label: 'Content',
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [HeroBlock, FormBlock],
    },
  ],
}

const SeoTab: Tab = {
  label: 'SEO',
  name: 'meta',
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
    }),
    MetaTitleField({
      hasGenerateFn: false,
    }),
    MetaImageField({
      relationTo: 'media',
    }),
    MetaDescriptionField({}),
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  defaultPopulate: {
    title: true,
    slug: true,
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, collectionConfig, locale }) => {
        const slug: string = data.slug === 'home' ? '' : data.slug

        const path = generatePreviewPath({
          slug: slug,
          collection: 'pages',
        })

        return path
      },
    },
  },
  // auth: true,

  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: false,
      validate: false,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      type: 'tabs',
      tabs: [ContentTab, SeoTab],
    },
  ],
}
