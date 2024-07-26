import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import images here
import Close from "../../assets/img/icons/cancel.png";

// import style sheet
import style from "../../assets/css/SliderCustomStyleSheet.css";

const Modal = ({ isOpen, onClose, getData, children, initialSlide }) => {
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  console.log("props in modal", getData);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialSlide,
  };

  if (!isOpen) return null;
  return (
    <div
      className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackgroundClick}
    >
      <div className="relative mx-4 max-h-screen w-full max-w-4xl rounded-lg p-2 sm:mx-10 sm:p-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 sm:top-5 sm:right-5"
        >
          <img
            style={{ width: "20px", height: "20px" }}
            src={Close}
            alt="Close"
          />
        </button>
        <Slider {...settings}>
          {getData.map((value, index) => {
            const moduleOutputImage = value.module_output_image.includes(
              "data:image/jpeg;base64,"
            )
              ? value.module_output_image
              : `data:image/jpeg;base64,${value.module_output_image}`;

            return (
              <div key={index}>
                <img
                  src={moduleOutputImage}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
              </div>
            );
          })}
        </Slider>
        <div className="max-h-full overflow-auto">{children}</div>
      </div>
    </div>
    // <div
    //   className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
    //   onClick={handleBackgroundClick}
    // >
    //   <div className="relative mx-4 max-h-screen w-full max-w-4xl rounded-lg bg-white p-2 sm:mx-10 sm:p-4">
    //     <button
    //       onClick={onClose}
    //       className="absolute top-3 right-3 text-gray-500 sm:top-5 sm:right-5"
    //     >
    //       <img
    //         style={{ width: "20px", height: "20px" }}
    //         src={Close}
    //         alt="Close"
    //       />
    //     </button>
    //     {getData.map((value, index) => {
    //       return (
    //         <>
    //           <img src={value.module_output_image} alt="Loading..." />
    //         </>
    //       );
    //     })}

    //     <div className="max-h-full overflow-auto">{children}</div>
    //   </div>
    // </div>
  );
};

export default Modal;
