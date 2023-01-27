import { FieldConfig, FieldProps } from 'formik';
import React from 'react';

const Input = (props: React.InputHTMLAttributes<HTMLInputElement> & FieldProps & FieldConfig) => {
  const { field, className, innerRef, ...rest } = props;

  return (
    <input
      {...field}
      {...rest}
      className={
        className +
        ' py-[1.2rem] rounded-[1rem] focus-within:outline-none focus-within:border-light-green border-solid border-[0.1rem] text-black pl-[1rem]'
      }
      ref={innerRef}
    />
  );
};
export default Input;
