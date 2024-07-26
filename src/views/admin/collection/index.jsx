import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase/FirebaseConfig";
import { useEffect, useState, useContext } from "react";
import swal from "sweetalert";
import Loader from "react-js-loader";

// import files here
import NftCard from "components/card/NftCard";
import { AuthContext } from "../../../Provider/AuthProvider";

const Collection = () => {
  const { deleteImages } = useContext(AuthContext);
  // get data from local storage
  const User_Id = localStorage.getItem("User_Id");

  const [selectedImages, setSelectedImages] = useState([]);
  const [getData, setGetData] = useState([]);
  console.log("getData", getData);
  const [sortedData, setSortedData] = useState({
    today: [],
    yesterday: [],
    this_Week: [],
    this_Month: [],
    other: [],
  });
  const [isSorted, setIsSorted] = useState(false);
  console.log("sortedData", sortedData);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, "user_uploaded_image")
      );

      const newData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((doc) => doc.user_id === User_Id);
      setGetData(newData);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    if (getData.length > 0) {
      sortImagesByDate();
    }
  }, [getData]);

  const handleCheckboxChange = (e, value) => {
    console.log("handleCheckboxChange", value);
    e.stopPropagation();
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(value.id)) {
        return prevSelectedImages.filter((id) => id !== value.id);
      } else {
        return [...prevSelectedImages, value.id];
      }
    });
  };

  const handleDeleteSelected = async () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover these images!",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: null,
          visible: true,
          className: "swal-button-center",
          closeModal: true,
        },
        confirm: {
          text: "Delete",
          value: true,
          visible: true,
          className: "swal-button-center",
          closeModal: false,
        },
      },
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const deletePromises = selectedImages.map((imageId) =>
            deleteImages(imageId)
          );
          await Promise.all(deletePromises);
          fetchPost();
          setSelectedImages([]);
          swal("Images have been deleted!", {
            icon: "success",
          });
        } catch (error) {
          console.log(error.message);
          swal("Error", "There was an error deleting the images.", "error");
        }
      }
    });
  };

  const handleDeleteAllImages = async () => {
    const confirmDelete = await swal({
      title: "Are you want to delete All the images?",
      text: "Once deleted, you will not be able to recover these images!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmDelete) {
      const allImageIds = getData.map((image) => image.id);
      setSelectedImages(allImageIds);
      try {
        const deletePromises = allImageIds.map((imageId) =>
          deleteImages(imageId)
        );
        await Promise.all(deletePromises);
        fetchPost();
        setSelectedImages([]);
        swal("All images have been deleted!", {
          icon: "success",
        });
      } catch (error) {
        console.log(error.message);
        swal("Error", "There was an error deleting the images.", "error");
      }
    }
  };

  const sortImagesByDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);
    const thisMonth = new Date(today);
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    const sorted = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      other: [],
    };

    console.log("Janki", sorted);

    getData.forEach((image) => {
      console.log("image");
      const imageDate = new Date(image.timestamp);
      if (imageDate.toDateString() === today.toDateString()) {
        sorted.today.push(image);
      } else if (imageDate.toDateString() === yesterday.toDateString()) {
        sorted.yesterday.push(image);
      } else if (imageDate > thisWeek) {
        sorted.thisWeek.push(image);
      } else if (imageDate > thisMonth) {
        sorted.thisMonth.push(image);
      } else {
        sorted.other.push(image);
      }
    });

    setSortedData(sorted);
    setIsSorted(!isSorted);
  };

  // Helper function to format the category string
  const formatCategory = (category) => {
    return category
      .split("_") // Split the string by underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join the words with spaces
  };

  return (
    <div className="mt-3 h-full xl:grid-cols-2 2xl:grid-cols-3">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        <div className="mb-2 flex justify-end space-x-2">
          <button
            onClick={handleDeleteSelected}
            type="button"
            className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete
          </button>
          <button
            onClick={handleDeleteAllImages}
            type="button"
            className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete All
          </button>
        </div>
        {/* NFTs trending card */}
        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <Loader
              type="bubble-scale"
              bgColor={"#B91C1C"}
              color={"#B91C1C"}
              title={"Loading..."}
              size={70}
            />
          </div>
        ) : (
          <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-1">
            {Object.entries(sortedData).map(
              ([category, images]) =>
                images.length > 0 && (
                  <div key={category} className="mb-8 w-full">
                    <div className="mb-2 text-center">
                      <div className="side_line_container flex items-center">
                        <span className="side_line flex-grow border-t border-gray-300"></span>
                        <h2 className="mx-4 text-2xl font-semibold dark:text-white">
                          {formatCategory(category)}
                          {/* {category.charAt(0).toUpperCase() + category.slice(1)} */}
                        </h2>
                        <span className="side_line flex-grow border-t border-gray-300"></span>
                      </div>
                    </div>
                    <div className="flex flex-row flex-wrap justify-center gap-3 md:justify-start">
                      {images.map((value, index) => {
                        const moduleOutputImage =
                          value.module_output_image.includes(
                            "data:image/jpeg;base64,"
                          )
                            ? value.module_output_image
                            : `data:image/jpeg;base64,${value.module_output_image}`;

                        return (
                          <div key={index} className="w-80">
                            <NftCard
                              getData={getData}
                              index={index}
                              imageName={value.image_name}
                              checkBox={true}
                              image={moduleOutputImage}
                              handleCheckboxChange={(e) =>
                                handleCheckboxChange(e, value)
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
