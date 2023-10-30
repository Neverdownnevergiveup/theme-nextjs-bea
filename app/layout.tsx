import type { ReactNode } from 'react';

import { Branding, Preconnect } from '@/modules';
import { Intl } from '@/modules/Layout';
import { locale } from '@/theme-kit';
import { generateRootMetadata } from '@/theme-kit/metadata';

interface Props {
    children: ReactNode;
}

export async function generateMetadata() {
    return generateRootMetadata({
        localeCode: locale().code,
        indexable: !process.env.VERCEL,
    });
}

export default async function Document({ children }: Props) {
    const { isoCode, direction } = locale();

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                <Branding />
            </head>
            <body>
                <Intl>
                    {children}
                </Intl>
            </body>
        </html>
    );
}
