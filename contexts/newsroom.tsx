import type {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
    Story,
} from '@prezly/sdk';
import { createContext, FunctionComponent, useContext, useMemo } from 'react';
import { IntlProvider } from 'react-intl';

import { AnalyticsContextProvider } from '@/modules/analytics';
import { DEFAULT_LOCALE } from '@/utils/lang';
import { LocaleObject } from '@/utils/localeObject';
import { Translations } from 'types';

interface Context {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    selectedCategory?: Category;
    selectedStory?: Story;
    languages: NewsroomLanguageSettings[];
    locale: LocaleObject;
    hasError?: boolean;
}

interface Props extends Omit<Context, 'locale'> {
    isTrackingEnabled?: boolean;
    localeCode: string;
    translations: Translations;
}

const NewsroomContext = createContext<Context | undefined>(undefined);

export const useNewsroomContext = () => {
    const newsroomContext = useContext(NewsroomContext);
    if (!newsroomContext) {
        throw new Error('No `NewsroomContextProvider` found when calling `useNewsroomContext`');
    }

    return newsroomContext;
};

export const NewsroomContextProvider: FunctionComponent<Props> = ({
    categories,
    newsroom,
    selectedCategory,
    selectedStory,
    companyInformation,
    languages,
    localeCode,
    hasError,
    isTrackingEnabled,
    translations,
    children,
}) => {
    const locale = useMemo(() => LocaleObject.fromAnyCode(localeCode), [localeCode]);

    return (
        <NewsroomContext.Provider
            value={{
                categories,
                newsroom,
                selectedCategory,
                selectedStory,
                companyInformation,
                languages,
                locale,
                hasError,
            }}
        >
            <IntlProvider
                locale={locale.toHyphenCode()}
                defaultLocale={DEFAULT_LOCALE}
                messages={translations}
            >
                <AnalyticsContextProvider
                    isEnabled={isTrackingEnabled}
                    newsroom={newsroom}
                    story={selectedStory}
                >
                    {children}
                </AnalyticsContextProvider>
            </IntlProvider>
        </NewsroomContext.Provider>
    );
};
