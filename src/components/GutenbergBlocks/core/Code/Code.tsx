import React from 'react';
import * as DOMPurify from 'dompurify';

const Code: React.FC<{
  // eslint-disable-next-line no-undef
  children?: string;
  attributes: { main: { anchor: string; content: string } };
}> = (props) => {
  const attributes = props.attributes.main;

  const cleanContent = DOMPurify.sanitize(attributes.content || props.children);

  return <p id={attributes.anchor} dangerouslySetInnerHTML={{ __html: cleanContent }} />;
};

export default Code;
