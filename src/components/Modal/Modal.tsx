import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  // create ref for the StyledModalWrapper component
  const modalWrapperRef = React.useRef<HTMLDivElement>(null);

  // check if the user has clickedinside or outside the modal
  const backDropHandler = (e) => {
    if (e.target.contains(modalWrapperRef.current) && modalWrapperRef?.current !== null) {
      onClose();
    }
  };

  useEffect(() => {
    setIsBrowser(true);

    // attach event listener to the whole windor with our handler
    window.addEventListener('click', backDropHandler);

    // remove the event listener when the modal is closed
    return () => window.removeEventListener('click', backDropHandler);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };
  const modalContent = (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center bg-[rgba(0,0,0,0.5)] ">
      <div className="w-[70%] h-[90vh]" ref={modalWrapperRef}>
        <div className="bg-white h-full w-full border-r-[15px]  relative top-[5rem]">
          <div className="flex justify-end text-3xl">
            <a href="#" onClick={handleCloseClick}>
              x
            </a>
          </div>
          {title && <div>{title}</div>}
          <div className="py-[1rem] h-full">{children}</div>
        </div>
      </div>
    </div>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
  } else {
    return null;
  }
};

export default Modal;
