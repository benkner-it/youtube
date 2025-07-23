import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField } from "@payloadcms/plugin-seo/fields";
import { Tab } from "payload";

export const SeoTab: Tab = {
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

