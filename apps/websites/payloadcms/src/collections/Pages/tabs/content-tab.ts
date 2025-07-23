import { Tab } from "payload";
import { HeroBlock } from "../blocks/HeroBlock";
import { FormBlock } from "../blocks/FormBlock";

export const ContentTab: Tab = {
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