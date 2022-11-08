import * as DOMPurify from 'dompurify';

const FreeForm = (props) => {
  const attributes = props.attributes.main;
  const cleanContent = DOMPurify.sanitize(attributes.content || props.children);

  return <div dangerouslySetInnerHTML={{ __html: cleanContent }} />;
};

export default FreeForm;
