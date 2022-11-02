import Block from 'components/Block/Block';

const Blocks = (props: { blocks: { attributesJSON: string; name: string }[] }) => {
  const blocks = props.blocks;
  const blockslist = blocks.map((d, index) => <Block name={d.name} key={index} />);

  return <>{blockslist}</>;
};

export default Blocks;
