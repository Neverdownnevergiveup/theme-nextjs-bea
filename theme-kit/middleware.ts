/* eslint-disable @typescript-eslint/no-use-before-define */
import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { api } from './api';
import { locale } from './locale';
import { createRouter, route } from './router';

export async function middleware(request: NextRequest) {
    const router = createAppRouter();

    const { contentDelivery } = api();

    const languages = await contentDelivery.languages();
    const defaultLocale = (await contentDelivery.defaultLanguage()).locale.code;

    const { pathname, searchParams } = request.nextUrl;

    const matched = await router.match(pathname, searchParams);

    if (matched) {
        const params = matched.params as Record<string, unknown> & {
            locale: Locale.Code;
            localeSlug?: Locale.AnySlug;
        };

        if (params.localeSlug) {
            // If there is :localeSlug, and it is resolved to the default newsroom locale -- remove it.
            if (params.locale === defaultLocale) {
                return NextResponse.redirect(
                    new URL(
                        matched.route.generate({ ...params, localeSlug: undefined } as any),
                        request.nextUrl,
                    ),
                );
            }

            const expectedLocaleSlug = getShortestLocaleSlug(languages, params.locale);

            // If there is :localeSlug, and it is not matching the expected shortest locale slug -- redirect.
            if (expectedLocaleSlug && expectedLocaleSlug !== params.localeSlug) {
                return NextResponse.redirect(
                    new URL(
                        matched.route.generate({
                            ...params,
                            localeSlug: expectedLocaleSlug,
                        } as any),
                        request.nextUrl,
                    ),
                );
            }
        }

        return NextResponse.rewrite(
            new URL(matched.route.rewrite(matched.params as any), request.nextUrl),
            {
                headers: withAddedHeaders(request.headers, {
                    [locale.HEADER]: matched.params.locale,
                }),
            },
        );
    }

    const possiblyLocaleSlug = pathname.split('/').filter(Boolean)[0] ?? '';
    const localized = await router.match(`/${possiblyLocaleSlug}`, searchParams);

    if (localized) {
        return NextResponse.rewrite(new URL(`/${localized.params.locale}/404`, request.nextUrl), {
            headers: withAddedHeaders(request.headers, {
                [locale.HEADER]: localized.params.locale,
            }),
        });
    }

    return NextResponse.rewrite(new URL(`/${defaultLocale}/404`, request.nextUrl), {
        headers: withAddedHeaders(request.headers, {
            [locale.HEADER]: defaultLocale,
        }),
    });
}

export namespace middleware {
    export const config = {
        matcher: [
            /*
             * Match all request paths except for the ones starting with:
             * - api (API routes)
             * - _next/static (static files)
             * - _next/image (image optimization files)
             * - favicon.ico (favicon file)
             */
            '/',
            '/((?!api|_next/static|_next/image|favicon.ico).*)',
        ],
    };
}

function createAppRouter() {
    const { contentDelivery } = api();

    return createRouter([
        route('/(:localeSlug)', '/:locale'),
        route('(/:localeSlug)/category/:slug', '/:locale/category/:slug'),
        route('(/:localeSlug)/media', '/:locale/media'),
        route('(/:localeSlug)/media/album/:uuid', '/:locale/media/album/:uuid'),
        route('(/:localeSlug)/search', '/:locale/search'),

        route('/s/:uuid', '/:locale/s/:uuid', {
            async resolveImplicitLocale({ uuid }) {
                const story = await contentDelivery.story({ uuid });
                return story?.culture.code;
            },
        }),

        route('/:slug', '/:locale/:slug', {
            async resolveImplicitLocale({ slug }) {
                const story = await contentDelivery.story({ slug });
                return story?.culture.code;
            },
        }),
    ]);
}

function withAddedHeaders(headers: Headers, extra: Record<string, string>) {
    const extended = new Headers(headers);
    Object.entries(extra).forEach(([name, value]) => {
        extended.set(name, value);
    });
    return extended;
}
