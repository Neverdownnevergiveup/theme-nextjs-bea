import { NewsroomGallery } from '@prezly/sdk';
import { FunctionComponent } from 'react';

import SlateRenderer from '@/components/SlateRenderer';
import { getUploadcareGroupUrl } from '@/utils/prezly';

import DownloadLink from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    gallery: NewsroomGallery;
}

const Gallery: FunctionComponent<Props> = ({ gallery }) => {
    const { content, title, uploadcare_group_uuid } = gallery;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            {uploadcare_group_uuid && (
                <DownloadLink href={getUploadcareGroupUrl(uploadcare_group_uuid, title)} />
            )}
            <div className={styles.divider} />
            <SlateRenderer nodes={JSON.parse(content)} />
        </div>
    );
};

export default Gallery;
