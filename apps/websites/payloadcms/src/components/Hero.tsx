import { Media, Page } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Block } from "payload";

type HeroProps = Extract<Page['layout'][0], { blockType: 'hero' }>;

type Props = {
    block: HeroProps;
}

export function HeroComponent({ block }: Props) {
    const image: Media = block.image as Media
    return <div>
        {block.title}
        <RichText data={block.subtitle} />
        {image.url}
    </div>
}

export const HeroBlock: Block = {
    slug: 'hero',
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'subtitle',
            type: 'richText',
            required: true,
        },
        {
            name: 'image',
            type: 'upload',
            required: true,
            relationTo: 'media',
        },
        {
            name: 'cta_button',
            type: 'group',
            fields: [
                {
                    name: 'label',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'link',
                    type: 'text',
                    required: true,
                },
            ],
        },
    ],
}