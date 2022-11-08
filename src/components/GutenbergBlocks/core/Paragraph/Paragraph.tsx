import { stylesInterface } from 'types/Styles';
import React from 'react';
import * as DOMPurify from 'dompurify';

const Paragraph: React.FC<{
  // eslint-disable-next-line no-undef
  children?: string | JSX.Element;
  attributes: {
    main: { anchor: string; content: string; dropCap: boolean; style: stylesInterface };
    innerBlocks?: any;
  };
}> = (props) => {
  const attributes = props.attributes.main;

  // const style = attributes.style;
  //TODO apply styles to component

  // eslint-disable-next-line no-undef
  if (attributes.content.length > 0) {
    const cleanContent = DOMPurify.sanitize(attributes.content);
    return <p id={attributes.anchor} dangerouslySetInnerHTML={{ __html: cleanContent }} />;
  } else if (props.children) {
    return <p id={attributes.anchor}>{props.children}</p>;
  }

  return;
};

export default Paragraph;
