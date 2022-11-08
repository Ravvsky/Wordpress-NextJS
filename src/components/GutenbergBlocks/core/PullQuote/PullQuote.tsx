const PullQuote = (props) => {
  const attributes = props.attributes.main;

  return (
    <div id={attributes.anchor > 0 ? attributes.anchor : ''}>
      <div>{attributes.citation}</div>
      <div>{attributes.value}</div>
    </div>
  );
};

export default PullQuote;
