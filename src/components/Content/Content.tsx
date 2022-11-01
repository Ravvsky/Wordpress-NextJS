import ClassName from 'models/classname';
import React from 'react';
import styles from './Content.module.scss';

const Content = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const contentClassName = new ClassName(styles.content);
  contentClassName.addIf(className, className);

  return <div className={contentClassName.toString()}>{children}</div>;
};

export default Content;
