import Block from 'components/Block';
const Quote = (props) => {
  const main = props.attributes.main;
  const innerBlocks = props.attributes.innerBlocks;

  const topSection = innerBlocks.map((d, index) => (
    <Block key={index} name={d['__typename']} attributesJSON={d.attributesJSON} innerBlocks={d.innerBlocks} />
  ));

  return (
    <>
      {topSection}
      <p id={main.anchor.lenght > 0 ? main.anchor : ''}>{main.citation}</p>
    </>
  );
};
export default Quote;
