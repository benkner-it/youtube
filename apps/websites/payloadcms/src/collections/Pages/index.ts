import type { CollectionConfig } from 'payload'

import { superAdminOrTenantAdminAccess } from './access/superAdminOrTenantAdmin'
import { ContentTab } from './tabs/content-tab'
import { SeoTab } from './tabs/seo-tab'
import { NavigationTab } from './tabs/navigation-tab'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: {
      en: 'Page',
      de: 'Webseite',
      es: 'Pagina',
    },
    plural: {
      en: 'Pages',
      de: 'Webseiten',
      es: 'Paginas',
    },
  },
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
      url: async ({ data, collectionConfig, locale, req }) => {
        const tenantId = data.tenant
        //TODO is there a better way?
        const foundTenant = await req.payload.findByID({
          collection: 'tenants',
          id: tenantId,
        })

        const url =
          '/' + [foundTenant.slug, locale.code, data.slug].filter((it) => Boolean(it)).join('/')

        return url
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
      type: 'tabs',
      tabs: [ContentTab, SeoTab, NavigationTab],
    },
  ],
}
