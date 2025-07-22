import { Block } from "payload";

export const FormBlock: Block = {
    slug: 'form',
    fields: [
        {
            name: 'form_title',
            label: "Title",
            type: 'text',
            required: true,
        },
        {
            name: "form",
            type: "relationship",
            relationTo: "forms",
            required: true,
        }
    ],
}