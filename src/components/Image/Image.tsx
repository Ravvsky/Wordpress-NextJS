import ClassName from 'models/classname';
import React from 'react';
import styles from './Image.module.scss';

const Image = ({
  children,
  className,
  width = '100%',
  height = 'auto',
  src,
  alt,
  srcSet,
  sizes,
  dangerouslySetInnerHTML,
}: {
  children?: React.ReactNode;
  className?: { base: string[] };
  width?: string;
  height?: string;
  src?: string;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  dangerouslySetInnerHTML?: string;
}) => {
  const imageClassName = new ClassName(styles.image);
  imageClassName.addIf(className, className);
  return (
    <figure className={imageClassName.toString()}>
      <div className={styles.featuredImageImg}>
        <img width={width} height={height} src={src} alt={alt || ''} srcSet={srcSet} sizes={sizes} />
      </div>
      {children && <figcaption>{children}</figcaption>}
      {dangerouslySetInnerHTML && (
        <figcaption
          dangerouslySetInnerHTML={{
            __html: dangerouslySetInnerHTML,
          }}
        />
      )}
    </figure>
  );
};

export default Image;
