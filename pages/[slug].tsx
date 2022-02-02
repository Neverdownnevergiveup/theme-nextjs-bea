import {
    DUMMY_DEFAULT_LOCALE,
    getNewsroomServerSideProps,
    getPrezlyApi,
    processRequest,
    useCurrentStory,
} from '@prezly/theme-kit-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

import { importMessages } from '@/utils';
import { BasePageProps } from 'types';

const Story = dynamic(() => import('@/modules/Story'), { ssr: true });

const StoryPage: NextPage<BasePageProps> = () => {
    const currentStory = useCurrentStory();

    return <Story story={currentStory!} />;
};

export const getServerSideProps: GetServerSideProps<BasePageProps> = async (context) => {
    const api = getPrezlyApi(context.req);

    const { slug } = context.params as { slug?: string };
    const story = slug ? await api.getStoryBySlug(slug) : null;
    if (!story) {
        return { notFound: true };
    }

    const { serverSideProps } = await getNewsroomServerSideProps(context, { story });

    const { locale } = context;
    if (locale && locale !== DUMMY_DEFAULT_LOCALE) {
        return {
            redirect: {
                destination: `/${slug}`,
                permanent: true,
            },
        };
    }

    return processRequest(context, {
        ...serverSideProps,
        newsroomContextProps: {
            ...serverSideProps.newsroomContextProps,
            currentStory: story,
        },
        translations: await importMessages(serverSideProps.newsroomContextProps.localeCode),
    });
};

export default StoryPage;
