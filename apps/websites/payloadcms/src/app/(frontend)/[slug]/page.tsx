import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { RenderBlocks } from '../components/RenderBlocks'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import { LivePreviewListener } from '@/components/LivePreviewListener'

type Props = {
    params: Promise<{ slug?: string }>
}

export default async function Page({ params }: Props) {
    const { slug = "home" } = await params;
    const payloadConfig = await config;
    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    const { docs: [page] } = await payload.find({
        collection: "pages",
        where: {
            slug: {
                equals: slug
            },
        },
        overrideAccess: Boolean(user),
        draft: Boolean(user),
    })

    if (!page) {
        return notFound();
    }

    return (
        <div>
            {user && <LivePreviewListener />}
            {user && <div><a target='_blank' href={`/admin/collections/pages/${page.id}`}>Edit</a></div>}
            Hello World - {page.title}
            <RenderBlocks blocks={page.layout} />
        </div>
    )
}
