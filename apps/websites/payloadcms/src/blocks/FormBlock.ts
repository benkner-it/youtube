import { Block } from "payload";

export const FormBlock: Block = {
    slug: 'form',
    fields: [
        {
            name: 'title',
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