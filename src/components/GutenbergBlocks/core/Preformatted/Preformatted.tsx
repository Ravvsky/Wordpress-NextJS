const Preformatted = (props) => {
  const attributes = props.attributes.main;
  return <pre id={attributes.anchor.length > 0 ? attributes.anchor : ''}>{attributes.content}</pre>;
};

export default Preformatted;
