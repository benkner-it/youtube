import { getPayload, Locale, LocalizationConfig } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { RenderBlocks } from '../../../../collections/Pages/blocks/components/RenderBlocks'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import { LivePreviewListener } from '@/components/LivePreviewListener'

type Props = {
    params: Promise<{ tenant: string, slug?: string[] }>
}

export default async function Page({ params }: Props) {
    const payloadConfig = await config;

    const { tenant, slug } = await params;
    const paramsConfig = {
        tenant: tenant,
        locale: "es",
        page: "home"
    }

    // more stable
    const localizationConfig = (payloadConfig.localization as LocalizationConfig)
    const locales = (payloadConfig.localization as LocalizationConfig)
        .locales
        .map((it) => (it as Locale).code)

    let locale = localizationConfig.defaultLocale;

    if (slug && slug[0] && locales.includes(slug[0])) {
        locale = slug[0];
    } else {
        if (slug && slug[0]) {
            paramsConfig.page = slug[0]
        }
    }

    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    const { docs: [page] } = await payload.find({
        collection: "pages",
        locale: locale as any,
        where: {
            slug: {
                equals: "home"
            },
            'tenant.slug': {
                equals: tenant
            }
        },
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
