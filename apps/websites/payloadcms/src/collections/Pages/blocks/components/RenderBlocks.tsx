import { HeroComponent } from "./HeroComponent";
import { FormComponent } from "./FormComponent";

type Props = {
    blocks: any[];
}
export function RenderBlocks({ blocks }: Props) {

    return blocks.map(it => {
        switch (it.blockType) {
            case "hero":
                return <HeroComponent block={it} key={it.id} />
            case "form":
                return <FormComponent block={it} key={it.id} />
            default:
                return <pre key={new Date().toISOString()}>{JSON.stringify(it, null, 2)}</pre>
        }
    })

}