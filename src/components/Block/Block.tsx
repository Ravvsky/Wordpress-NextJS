const Block = (props) => {
  const { name } = props;

  switch (name) {
    case 'acf/button':
      return <div>buton</div>;
    case 'core/paragraph':
      return <div>paragraph</div>;
    default:
      return <div>{name}</div>;
  }
};

export default Block;
