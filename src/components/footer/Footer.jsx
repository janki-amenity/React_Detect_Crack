import Heart from "../../assets/img/GIF/heartbeat-12659.gif";

const Footer = () => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
        <h5 className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
          <p className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
            ©{1900 + new Date().getYear()} DefecTech. All Rights Reserved.
          </p>
        </h5>
      </div>

      {/* made by amenity technologies */}
      <div>
        <h1 className="flex justify-center text-gray-600">
          <span>Made with</span>
          <img
            style={{
              height: "20px",
              width: "25px",
              marginRight: "2px",
              marginTop: "2px",
            }}
            src={Heart}
            alt="Loading..."
          />
          <span>
            by{" "}
            <a href="https://amenitytech.ai/" target="_blank">
              Amenity Technologies
            </a>
          </span>
        </h1>
      </div>
    </>
  );
};

export default Footer;
