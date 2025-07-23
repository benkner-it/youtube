import type { CollectionConfig } from 'payload'

import { ensureUniqueSlug } from './hooks/ensureUniqueSlug'
import { superAdminOrTenantAdminAccess } from './access/superAdminOrTenantAdmin'
import { ContentTab } from './tabs/content-tab'
import { SeoTab } from './tabs/seo-tab'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: () => true,
    update: superAdminOrTenantAdminAccess,
  },

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
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      defaultValue: 'home',
      hooks: {
        beforeValidate: [ensureUniqueSlug],
      },
      index: true,
    },
    // ...slugField('title'),
    {
      type: 'tabs',
      tabs: [ContentTab, SeoTab],
    },
  ],
  // fields: [
  //   {
  //     name: 'title',
  //     type: 'text',
  //   },
  //   {
  //     name: 'slug',
  //     type: 'text',
  //     defaultValue: 'home',
  //     hooks: {
  //       beforeValidate: [ensureUniqueSlug],
  //     },
  //     index: true,
  //   },

  // ],
}
