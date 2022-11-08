import Block from 'components/Block/Block';

const Blocks = (props: { blocks: { attributesJSON: string; innerBlocks: any[]; name: string }[] }) => {
  const blocks = props.blocks;

  const blockslist = blocks.map((d, index) => (
    <Block name={d['__typename']} attributesJSON={d.attributesJSON} innerBlocks={d.innerBlocks} key={index} />
  ));

  return <>{blockslist}</>;
};

export default Blocks;
