import { Page } from "@/payload-types"

type FormProps = Extract<Page['layout'][0], { blockType: 'form' }>;

type Props = {
    block: FormProps;
}

export function FormComponent({ block }: Props) {
    return <div>
        Hello Form
    </div>
}
