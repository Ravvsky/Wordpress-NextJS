import ClassName from 'models/classname';
import React from 'react';
import styles from './Container.module.scss';

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const containerClassName = new ClassName(styles.container);

  containerClassName.addIf(className, className);

  return <div className={containerClassName.toString()}>{children}</div>;
};

export default Container;
