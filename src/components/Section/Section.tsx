import ClassName from 'models/classname';
import React from 'react';
import styles from './Section.module.scss';

const Section = ({ children, className, ...rest }: { children: React.ReactNode; className?: string }) => {
  const sectionClassName = new ClassName(styles.section);

  sectionClassName.addIf(className, className);

  return (
    <section className={sectionClassName.toString()} {...rest}>
      {children}
    </section>
  );
};

export default Section;
