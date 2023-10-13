import type { Culture } from '@prezly/sdk';
import type { ReactNode } from 'react';

export async function Layout(props: { children: ReactNode; locale: Culture['code'] }) {
    return (
        <html lang={props.locale}>
            <body>
                <h1>Root layout</h1>
                {props.children}
            </body>
        </html>
    );
}
