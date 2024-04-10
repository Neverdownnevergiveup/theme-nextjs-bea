import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateMediaGalleryPageMetadata, routing } from '@/adapters/server';
import { BroadcastGallery, BroadcastTranslations } from '@/modules/Broadcast';
import { Gallery } from '@/modules/Gallery';

interface Props {
    params: {
        localeCode: Locale.Code;
        uuid: NewsroomGallery['uuid'];
    };
}

async function resolve({ uuid }: Props['params']) {
    const gallery = (await app().gallery(uuid)) ?? notFound();

    return { gallery };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gallery } = await resolve(params);
    return generateMediaGalleryPageMetadata({ locale: params.localeCode, gallery });
}

export default async function AlbumPage({ params }: Props) {
    const { gallery } = await resolve(params);
    const { generateAbsoluteUrl } = await routing();

    return (
        <>
            <BroadcastGallery gallery={gallery} />
            <BroadcastTranslations routeName="mediaGallery" params={{ uuid: gallery.uuid }} />
            <Gallery
                localeCode={params.localeCode}
                gallery={gallery}
                href={generateAbsoluteUrl('mediaGallery', { uuid: gallery.uuid })}
            />
        </>
    );
}
