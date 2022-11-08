import React from 'react';
interface ListProps extends React.HTMLAttributes<HTMLOListElement | HTMLUListElement> {
  listType: React.ElementType;
  // eslint-disable-next-line no-undef
  listElements: any;
}
const TsList: React.FC<ListProps> = ({ listType, className, listElements }) => {
  const ListType = listType;
  let items = [];
  if (!listElements) {
    return;
  }
  for (let i = 0; i < listElements.length; i++) {
    if (listElements[i].innerBlocks && listElements[i].innerBlocks.length < 1) {
      items.push(<li key={i}>{JSON.parse(listElements[i].attributesJSON).content}</li>);
    } else {
      let attributes = { main: null, innerBlocks: null };
      if (listElements[i].innerBlocks) {
        attributes.main = JSON.parse(listElements[i].innerBlocks[0].attributesJSON);
        attributes.innerBlocks = listElements[i].innerBlocks[0].innerBlocks;
      }

      items.push(
        <li key={i}>
          {JSON.parse(listElements[i].attributesJSON).content}

          <List attributes={attributes} />
        </li>
      );
    }
  }

  return <ListType className={className}>{items}</ListType>;
};

// eslint-disable-next-line no-undef
const List: React.FC<{ children?: JSX.Element; attributes: { main: any; innerBlocks: any } }> = (props) => {
  const attributes = props.attributes;
  return (
    <TsList
      listType={attributes.main && attributes.main.ordered ? 'ol' : 'ul'}
      listElements={attributes.innerBlocks && attributes.innerBlocks}
    ></TsList>
  );
};

export default List;
