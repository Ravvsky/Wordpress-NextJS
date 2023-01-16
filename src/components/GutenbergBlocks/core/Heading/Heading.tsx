import DOMPurify from 'isomorphic-dompurify';
import React, { ElementType } from 'react';

import { stylesInterface } from 'types/Styles';
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  headingLevel: React.ElementType;
  // eslint-disable-next-line no-undef
  content: string | JSX.Element;
}

const TsHeading: React.FC<HeadingProps> = ({ headingLevel, className, content }) => {
  const HeadingLevel = headingLevel;
  if (typeof content === 'string') {
    const cleanContent = DOMPurify.sanitize(content);
    return <HeadingLevel className={className} dangerouslySetInnerHTML={{ __html: cleanContent }} />;
  } else {
    return <HeadingLevel className={className}>{content}</HeadingLevel>;
  }
};

const Heading: React.FC<{
  // eslint-disable-next-line no-undef
  children?: string | JSX.Element;
  attributes: { main: { anchor: string; content: string; level: number; style: stylesInterface } };
}> = (props) => {
  const attributes = props.attributes.main;
  // const style = attributes.style;
  //TODO apply styles to component

  const headingLevel = `h${attributes.level}` as ElementType<any>;

  return <TsHeading headingLevel={headingLevel} content={attributes.content || props.children} />;
};

export default Heading;
