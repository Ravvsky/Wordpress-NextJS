import dynamic from 'next/dynamic';
const Block = (props) => {
  const { name } = props;

  const Paragraph = dynamic(() => import('../GutenbergBlocks/core/Paragraph'));
  const Heading = dynamic(() => import('../GutenbergBlocks/core/Heading'));
  const List = dynamic(() => import('../GutenbergBlocks/core/List'));
  const Quote = dynamic(() => import('../GutenbergBlocks/core/Quote'));
  const FreeForm = dynamic(() => import('../GutenbergBlocks/core/FreeForm'));
  const Code = dynamic(() => import('../GutenbergBlocks/core/Code'));
  const Preformatted = dynamic(() => import('../GutenbergBlocks/core/Preformatted'));
  const PullQuote = dynamic(() => import('../GutenbergBlocks/core/PullQuote'));
  const Table = dynamic(() => import('../GutenbergBlocks/core/Table'));
  const Verse = dynamic(() => import('../GutenbergBlocks/core/Verse'));
  const attributes: any = {};
  if (props.attributesJSON.length > 0) {
    attributes.main = JSON.parse(props.attributesJSON);
  }
  if (props.innerBlocks.length > 0) {
    attributes.innerBlocks = props.innerBlocks;
  }
  switch (name) {
    case 'CoreParagraphBlock':
      return <Paragraph attributes={attributes} />;
    case 'CoreHeadingBlock':
      return <Heading attributes={attributes} />;
    case 'CoreListBlock':
      return <List attributes={attributes} />;
    case 'CoreQuoteBlock':
      return <Quote attributes={attributes} />;
    case 'CoreFreeformBlock':
      return <FreeForm attributes={attributes} />;
    case 'CoreCodeBlock':
      return <Code attributes={attributes} />;
    case 'CorePreformattedBlock':
      return <Preformatted attributes={attributes} />;
    case 'CorePullquoteBlock':
      return <PullQuote attributes={attributes} />;
    case 'CoreTableBlock':
      return <Table attributes={attributes} />;
    case 'CoreVerseBlock':
      return <Verse attributes={attributes} />;
    //custom acf blocks
    case 'AcfButtonBlock':
      return <div>buton</div>;
    default:
      return <div>{name}</div>;
  }
};

export default Block;
