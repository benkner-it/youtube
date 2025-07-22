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
        {block?.title}
        <RichText data={block.subtitle} />
        {image?.url}
    </div>
}
