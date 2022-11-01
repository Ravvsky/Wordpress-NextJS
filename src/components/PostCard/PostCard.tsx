import Link from 'next/link';

import { postPathBySlug, sanitizeExcerpt } from 'lib/posts';

import Metadata from 'components/Metadata';

import { FaMapPin } from 'react-icons/fa';
import styles from './PostCard.module.scss';

const PostCard = ({
  post,
  options = {},
}: {
  post: {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    author: {
      avatar: {
        height: number;
        url: string;
        width: number;
      };
      id: string;
      name: string;
      slug: string;
    };
    categories: {
      databaseId: number;
      id: string;
      name: string;
      slug: string;
    };
    isSticky: boolean;
  };
  options: { excludeMetadata?: string[] };
}) => {
  const { title, excerpt, slug, date, author, categories, isSticky = false } = post;
  const { excludeMetadata = [] } = options;

  const metadata: {
    author: {
      avatar: {
        height: number;
        url: string;
        width: number;
      };
      id: string;
      name: string;
      slug: string;
    };
    date: string;
    categories: {
      databaseId: number;
      id: string;
      name: string;
      slug: string;
    };
  } = {
    author: {
      avatar: {
        height: 0,
        url: '',
        width: 0,
      },
      id: '',
      name: '',
      slug: '',
    },
    date: '',
    categories: {
      databaseId: 0,
      id: '',
      name: '',
      slug: '',
    },
  };

  if (!excludeMetadata.includes('author')) {
    metadata.author = author;
  }

  if (!excludeMetadata.includes('date')) {
    metadata.date = date;
  }

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories;
  }

  let postCardStyle = styles.postCard;

  if (isSticky) {
    postCardStyle = `${postCardStyle} ${styles.postCardSticky}`;
  }

  return (
    <div className={postCardStyle}>
      {isSticky && <FaMapPin aria-label="Sticky Post" />}
      <Link href={postPathBySlug(slug)}>
        <a>
          <h3
            className={styles.postCardTitle}
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        </a>
      </Link>
      <Metadata className={styles.postCardMetadata} {...metadata} />
      {excerpt && (
        <div
          className={styles.postCardContent}
          dangerouslySetInnerHTML={{
            __html: sanitizeExcerpt(excerpt),
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
