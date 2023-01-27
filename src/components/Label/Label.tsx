const Label = (props) => {
  return (
    <label htmlFor={props.htmlFor} className="text-[#6b6b6b] text-xl">
      {props.children}
    </label>
  );
};

export default Label;
