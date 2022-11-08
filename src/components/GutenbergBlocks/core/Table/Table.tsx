const Table = (props) => {
  const elements = [];
  const attributes = props.attributes.main;

  const tableElement = (element, WrapperTag) => {
    const innerElements = [];
    for (let i = 0; i < element.length; i++) {
      const elements = [];

      for (let j = 0; j < element[i].cells.length; j++) {
        const Tag = element[i].cells[j].tag;
        elements.push(<Tag key={j}>{element[i].cells[j].content}</Tag>);
      }
      // const test = <th>{}</th>;
      innerElements.push(<tr key={i}>{elements}</tr>);
    }

    return <WrapperTag key={WrapperTag}>{innerElements}</WrapperTag>;
  };

  if (attributes.head.length > 0) {
    elements.push(tableElement(attributes.head, 'thead'));
  }
  if (attributes.body.length > 0) {
    elements.push(tableElement(attributes.body, 'tbody'));
  }
  if (attributes.foot.length > 0) {
    elements.push(tableElement(attributes.foot, 'tfoot'));
  }

  return (
    <table>
      {elements}
      <caption>{attributes.caption}</caption>
    </table>
  );
};

export default Table;
