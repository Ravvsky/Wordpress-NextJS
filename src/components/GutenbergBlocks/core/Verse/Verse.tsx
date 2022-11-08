import * as DOMPurify from 'dompurify';

const Verse = (props) => {
  const attributes = props.attributes.main;
  const cleanContent = DOMPurify.sanitize(attributes.content);

  return <p id={attributes.anchor.length > 0 ? attributes.anchor : ''}>{cleanContent}</p>;
};

export default Verse;
