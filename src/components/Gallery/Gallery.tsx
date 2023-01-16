import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';
import Modal from 'components/Modal';
import styles from './Gallery.module.scss';
const Gallery = (props) => {
  const ids = [
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
  ];

  //   const slider3 = useRef();

  //   const [showModal, setShowModal] = useState(false);
  //   const [slideIndex, setSlideIndex] = useState(-1);
  //   const showModalHandler = (e) => {
  //     setShowModal(true);
  //     setSlideIndex(slider1.current?.splide?.index || 0);
  //     slider3.current && slider3.current.go(1);
  //   };
  //   const onMove = useCallback((_, index) => {
  //     slider1.current && slider1.current.go(index);
  //   }, []);
  //   const Videos = ({ ids, big, modal }) => (
  //     <>
  //       {ids.map((id, key) => (
  //         <li className="splide__slide" key={key}>
  //           <img src={id} alt="video thumbnail" className="h-full object-cover" />
  //         </li>
  //       ))}
  //     </>
  //   );

  //   const slider1 = useRef();
  //   const slider2 = useRef();
  //   useEffect(() => {
  //     slider1.current.sync(slider2.current.splide);
  //   }, [slider1, slider2]);

  //   return (
  //     <div className={`flex flex-row-reverse gap-[2rem] ${props.className}`}>
  //       <Splide ref={(slider) => (slider1.current = slider)} options={SPLIDE_OPTIONS_show} onClick={showModalHandler}>
  //         <Videos ids={ids} big={true} modal={false} />
  //       </Splide>
  //       <Splide ref={(slider) => (slider2.current = slider)} options={SPLIDE_OPTIONS_thumb}>
  //         <Videos ids={ids} big={false} modal={false} />
  //       </Splide>
  //       {showModal && (
  //         <Modal onClose={() => setShowModal(false)} title={'undefined'}>
  //           <Splide options={{ slideIndex }} onMove={onMove} ref={slider3}>
  //             <Videos ids={ids} big={false} modal={false} />
  //           </Splide>
  //         </Modal>
  //       )}
  //     </div>
  //   );
  // };
  const mainRef = useRef();
  const thumbRef = useRef();
  const [start, setStart] = useState(-1); // The start index for the fullscreen carousel

  const onMove = useCallback((_, index) => {
    mainRef.current && mainRef.current.go(index);
    thumbRef.current && thumbRef.current.go(index);
  }, []);

  const SPLIDE_OPTIONS_show = {
    arrows: false,
    pagination: false,
    height: '70rem',
  };

  const SPLIDE_OPTIONS_thumb = {
    rewind: true,
    isNavigation: true,
    gap: 10,
    focus: 'top',
    pagination: false,
    cover: false,
    direction: 'ttb',
    arrows: false,
    fixedWidth: '14rem',
    height: '70rem',
    perPage: 5.5,
  };
  return (
    <div className={` flex flex-row-reverse gap-[2rem] ${props.className} `}>
      <Splide
        options={SPLIDE_OPTIONS_show}
        onClick={() => setStart(mainRef.current?.splide?.index || 0)}
        ref={mainRef}
        onMove={onMove}
        className="hover:cursor-zoom-in"
      >
        {renderSlides()}
      </Splide>
      <Splide options={SPLIDE_OPTIONS_thumb} onMove={onMove} ref={thumbRef}>
        {renderSlides()}
      </Splide>
      {start > -1 && (
        <Modal onClose={() => setStart(-1)}>
          <Splide options={{ start, width: '100vw' }} onMove={onMove} className={styles.splide} hasTrack={false}>
            <SplideTrack className="h-full">{renderSlides()}</SplideTrack>
          </Splide>
        </Modal>
      )}
    </div>
  );
};

function renderSlides() {
  const ids = [
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
  ];
  return ids.map((id, index) => (
    <SplideSlide key={index}>
      <img src={id} alt="" className="h-full w-full object-cover" />
    </SplideSlide>
  ));
}
export default Gallery;
