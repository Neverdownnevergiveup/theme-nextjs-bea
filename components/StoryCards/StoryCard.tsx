import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';

import { getStoryPublicationDate } from '@/utils/prezly';
import { StoryWithImage } from 'types';

import CategoriesList from '../CategoriesList';
import StoryImage from '../StoryImage';

import styles from './StoryCard.module.scss';

type Props = {
    story: StoryWithImage;
    size?: 'small' | 'medium' | 'big';
};

const StoryCard: FunctionComponent<Props> = ({ story, size = 'small' }) => {
    const { categories, title } = story;

    const publishedDate = getStoryPublicationDate(story);

    const HeadingTag = size === 'small' ? 'h3' : 'h2';

    return (
        <div
            className={classNames(styles.container, {
                [styles.small]: size === 'small',
                [styles.medium]: size === 'medium',
                [styles.big]: size === 'big',
            })}
        >
            <Link href={`/${story.slug}`} locale={false} passHref>
                <a className={styles.imageWrapper}>
                    <StoryImage
                        story={story}
                        className={styles.image}
                        placeholderClassName={styles.placeholder}
                    />
                </a>
            </Link>
            <div className={styles.content}>
                {categories.length > 0 && (
                    <div className={styles.categories}>
                        <CategoriesList
                            categories={categories}
                            showAllCategories={size !== 'small'}
                            isStatic
                        />
                    </div>
                )}
                <HeadingTag
                    className={classNames(styles.title, {
                        [styles.titleSmaller]: size === 'small',
                        [styles.titleLarger]: size !== 'small',
                    })}
                >
                    <Link href={`/${story.slug}`} locale={false} passHref>
                        <a className={styles.titleLink}>{title}</a>
                    </Link>
                </HeadingTag>

                {publishedDate && <p className={styles.date}>{publishedDate}</p>}
            </div>
        </div>
    );
};

export default StoryCard;
