import { Tab } from 'payload'
// import { ensureUniqueSlug } from '../hooks/ensureUniqueSlug'

export const NavigationTab: Tab = {
  label: 'Navigation',
  fields: [
    {
      name: 'nav_title',
      type: 'text',
      defaultValue: 'home',
    },
    {
      name: 'slug',
      type: 'text',
      defaultValue: 'home',
    //   hooks: {
    //     beforeValidate: [ensureUniqueSlug],
    //   },
      index: true,
    },
  ],
}
