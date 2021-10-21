import { ExtendedStory } from '@prezly/sdk';
import { FunctionComponent, useEffect } from 'react';

import StoryShareSocial from './StoryShareSocial';
import StoryShareUrl from './StoryShareUrl';

import styles from './StoryStickyBar.module.scss';

interface Props {
    story: ExtendedStory;
}

const StoryStickyBar: FunctionComponent<Props> = ({ story }) => {
    const url = story.links.short || story.links.newsroom_view;

    useEffect(() => {
        if (url) {
            document.body.classList.add(styles.body);
        }

        return () => {
            document.body.classList.remove(styles.body);
        };
    }, [url]);

    if (!url) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <StoryShareSocial url={url} />
                <StoryShareUrl url={url} />
            </div>
        </div>
    );
};

export default StoryStickyBar;
