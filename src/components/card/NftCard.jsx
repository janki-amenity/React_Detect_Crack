import { useState } from "react";

// import files here
import Card from "components/card";
import Modal from "./Modal";

const NftCard = ({
  image,
  index,
  getData,
  extra,
  checkBox,
  imageName,
  handleCheckboxChange,
}) => {
  console.log("props", getData);
  const [heart, setHeart] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const handleOpenImageModal = (index) => {
    console.log("Image index", index);
    setInitialSlide(index);
    setIsModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
      >
        <div className="h-full w-full">
          <button onClick={() => handleOpenImageModal(index)}>
            <div className="relative h-64 w-full">
              <img
                src={image}
                className="mb-3 h-full w-full rounded-xl object-cover 3xl:h-full 3xl:w-full"
                alt="Loading..."
              />
            </div>
          </button>
          {checkBox == true && (
            <button
              onClick={() => setHeart(!heart)}
              className="absolute top-6 right-6 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer"
            >
              <div className="flex h-full w-full items-center justify-center rounded-full text-xl hover:bg-gray-50 dark:text-navy-900">
                <input type="checkbox" onChange={handleCheckboxChange} />
              </div>
            </button>
          )}
          <div className="mb-3 flex items-center justify-between px-1 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start">
            <div className="mb-2 w-full">
              <p className="break-words text-lg font-bold text-navy-700 dark:text-white">
                {imageName}
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Modal
        getData={getData}
        isOpen={isModalOpen}
        onClose={handleCloseImageModal}
        initialSlide={initialSlide}
      />

      {/* <Modal
        getData={getData}
        isOpen={isModalOpen}
        onClose={handleCloseImageModal}
      >
        <img
          src={image}
          alt={imageName}
          className="h-full w-full object-cover"
        />
      </Modal> */}
    </>
  );
};

export default NftCard;
