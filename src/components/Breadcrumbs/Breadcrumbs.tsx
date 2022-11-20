import Link from 'next/link';

import ClassName from 'models/classname';

import styles from './Breadcrumbs.module.scss';

const Breadcrumbs = ({
  className,
  breadcrumbs,
}: {
  className?: string;
  breadcrumbs: {
    [x: string]: any;
    title?: string;
    uri?: string;
    text?: string;
    url?: string;
  };
}) => {
  const breadcrumbsClassName = new ClassName(styles.breadcrumbs);

  breadcrumbsClassName.addIf(className, className);

  return (
    <ul className={breadcrumbsClassName.toString()}>
      {breadcrumbs.map(({ title, uri, text, url }, index) => {
        return (
          <li key={index}>
            {!(uri || url) && (title || text)}
            {(uri || url) && (
              <Link href={uri || url}>
                <a>{title || text}</a>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Breadcrumbs;
