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
    const localeInfo = getLocale(slug, payloadConfig.localization as LocalizationConfig);

    let pageSlug = "home";
    if (localeInfo.hasLang && slug && slug[1]) {
        pageSlug = slug[1];
    }
    if (!localeInfo.hasLang && slug && slug[0]) {
        pageSlug = slug[0]
    }

    const payload = await getPayload({ config: payloadConfig })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    const { docs: [page] } = await payload.find({
        collection: "pages",
        locale: localeInfo.lang as any,
        where: {
            slug: {
                equals: pageSlug
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
        <>
            {user && <LivePreviewListener />}
            {
                user && <div>
                    <a
                        target='_blank' href={`/admin/collections/pages/${page.id}?locale=${localeInfo.lang}`}>
                        Edit
                    </a>
                </div>
            }
            Hello World - {page.title}
            <RenderBlocks blocks={page.layout} />
        </>
    )
}

function getLocale(
    slug: string[] | undefined,
    localization: LocalizationConfig): { hasLang: boolean, lang: string } {

    const defaultLocale = localization.defaultLocale;

    if (!slug) {
        return {
            hasLang: false,
            lang: defaultLocale
        }
    }

    const localeString = slug[0];

    const availableLangs = localization
        .locales
        .map((it) => (it as Locale).code)

    if (!localeString) {
        return {
            hasLang: false,
            lang: defaultLocale
        }
    }

    const normalized = localeString.toLowerCase().trim();

    if (availableLangs.includes(normalized)) {
        return {
            hasLang: true,
            lang: normalized
        };
    }
    return {
        hasLang: false,
        lang: defaultLocale
    };

    // const baseCode = normalized.split('-')[0];
    // return availableCodes.includes(baseCode) ? baseCode : defaultLocale;
};
