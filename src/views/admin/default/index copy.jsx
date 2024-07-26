import { useEffect, useState } from "react";
import AxiosImageCall from "utils/axiosImageCall";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../Firebase/FirebaseConfig";
import swal from "sweetalert";
import { useDropzone } from "react-dropzone";
import Loader from "react-js-loader";

// import images here
import plus from "../../../assets/img/icons/plus.png";
import NftCard from "components/card/NftCard";
import Minus from "assets/img/icons/minus.png";

const Dashboard = () => {
  const User_Id = localStorage.getItem("User_Id");
  const [selectedImages, setSelectedImages] = useState([]);
  // console.log("selectedImages", selectedImages);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [getImageResponse, setGetImageResponse] = useState();
  const [getData, setGetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageName, setImageName] = useState([]); // New state for image name
  // console.log("getData", getData);
  // console.log("imageName", imageName);

  const fetchPost = async () => {
    setLoading(true);
    try {
      // Create a query to get the last 4 documents ordered by timestamp
      const imagesQuery = query(
        collection(db, "user_uploaded_image"),
        orderBy("timestamp", "desc"),
        limit(4)
      );

      const querySnapshot = await getDocs(imagesQuery);

      // Map and filter the documents to get the data for the current user
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

  // function for remove prefix from selected image
  const removePrefix = (str) => str.replace(/^data:image\/\w+;base64,/, "");

  const handleImageChange = (files) => {
    console.log("File", files);
    const previews = [];
    const images = [];
    const imagesNameList = [];

    files.forEach((file) => {
      const reader = new FileReader();
      console.log("selectedImages 12", file);

      reader.onloadend = () => {
        const imageUrl = reader.result;
        console.log("imageUrl", imageUrl);

        previews.push(imageUrl);

        const img = new Image();
        img.src = imageUrl;

        console.log("img", img);

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width; // Set canvas width to image width
          canvas.height = img.height; // Set canvas height to image height

          ctx.drawImage(img, 0, 0, img.width, img.height);

          const resizedImageUrl = canvas.toDataURL("image/jpeg"); // You can change the format as needed

          images.push(resizedImageUrl);
          imagesNameList.push(file.path);

          if (previews.length === files.length) {
            setImagePreviews(previews);
            setSelectedImages(images);
            setImageName(imagesNameList);
          }
        };
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSend = async (imageName) => {
    if (selectedImages.length > 0) {
      // Collect all base64 strings from selected images and format them
      const imagesData = selectedImages.map((image) => ({
        image: removePrefix(image),
      }));

      console.log("HI send response -->", imagesData);
      console.log("imageName 1", imageName);
      // Get the current date and timestamp
      const currentDate = new Date();
      const timestamp = currentDate.toISOString();

      const sendData = {
        method: "post",
        data: { images: imagesData },
      };

      try {
        // Sending images to your API
        const sendDataDetails = await AxiosImageCall(sendData);
        console.log("sendDataDetails", sendDataDetails);

        // Assuming your API returns an array of annotated images
        const annotatedImages = sendDataDetails.annotated_images;

        // // Prepare array to hold promises for Firestore document additions
        const docPromises = [];
        console.log("imageName 2", imageName);
        // Upload each image to Firebase Cloud Storage and store metadata in Firestore
        for (let index = 0; index < selectedImages.length; index++) {
          const image = selectedImages[index];
          const imageNameList = imageName[index];

          const storageRef = ref(
            storage,
            `images/${User_Id}/${Date.now()}_${imageNameList}`
          );
          console.log("Check storageRef", storageRef);

          // Upload image to Firebase Storage
          await uploadString(storageRef, image, "data_url");
          const downloadURL = await getDownloadURL(storageRef);

          console.log("downloadURL", downloadURL);
          // Store image metadata in Firestore
          const docRef = await addDoc(collection(db, "user_uploaded_image"), {
            image_url: downloadURL,
            module_output_image: annotatedImages[index],
            user_id: User_Id,
            image_name: imageName[index],
            timestamp,
          });

          docPromises.push(docRef);
        }

        // Wait for all Firestore operations to complete
        await Promise.all(docPromises);

        // Clear state after successful upload
        setGetImageResponse(annotatedImages);
        setSelectedImages([]);
        setImagePreviews([]);

        // Show success message to the user
        swal({
          title: "Image Sent Successfully",
          text: "Please go to the collection page to view your output.",
          icon: "success",
          dangerMode: true, // Check if dangerMode should be true here
        });
      } catch (error) {
        console.error("Error sending images: ", error);

        // Show error message to the user
        swal({
          title: "Error",
          text: "There was an error sending the images. Please try again.",
          icon: "error",
          dangerMode: true, // Check if dangerMode should be true here
        });
      }
    }
  };

  // const handleSend = async () => {
  //   if (selectedImages.length > 0) {
  //     // Collect all base64 strings from selected images and format them
  //     const imagesData = selectedImages.map((image) => ({
  //       image: removePrefix(image),
  //     }));

  //     console.log("HI send response -->", imagesData);

  //     // Get the current date and timestamp
  //     const currentDate = new Date();
  //     const timestamp = currentDate.toISOString();

  //     const sendData = {
  //       method: "post",
  //       data: { images: imagesData },
  //     };

  //     try {
  //       // Sending images to your API
  //       const sendDataDetails = await AxiosImageCall(sendData);
  //       console.log("sendDataDetails", sendDataDetails);

  //       setSelectedImages([]);
  //       setImagePreviews([]);

  //       // Assuming your API returns an array of annotated images
  //       const annotatedImages = sendDataDetails.annotated_images;

  //       // Adding each image to Firestore with the annotated image
  //       const docPromises = selectedImages.map((image, index) =>
  //         addDoc(collection(db, "user_uploaded_image"), {
  //           image_url: image,
  //           module_output_image: annotatedImages[index],
  //           user_id: User_Id,
  //           image_name: imageName[index], // Add image name to Firestore
  //           timestamp,
  //         })
  //       );

  //       await Promise.all(docPromises);

  //       setGetImageResponse(annotatedImages);
  //       swal({
  //         title: "Image Send Successfully",
  //         text: "Please go to the collection page to show your out-put",
  //         icon: "success",
  //         dangerMode: true,
  //       });
  //     } catch (error) {
  //       console.error("Error sending images: ", error);
  //       // Show failure alert if there is an error
  //       swal({
  //         title: "Error",
  //         text: "There was an error sending the images. Please try again.",
  //         icon: "error",
  //         dangerMode: true,
  //       });
  //     }
  //   }
  // };

  const onDrop = (acceptedFiles) => {
    handleImageChange(acceptedFiles);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedImages);
    const updatedSelectedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedSelectedImages);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <>
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
        <>
          <div className="dark:bg-black mt-6 flex items-center justify-center rounded-2xl bg-gray-100 p-4 dark:bg-[#384d9b4d] sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl sm:px-6 lg:px-8">
              <h2 className="mb-2 text-center text-4xl font-bold capitalize hover:text-navy-700 dark:text-white dark:hover:text-white">
                Free Crack Detection Tool Online
              </h2>
              <p className="mb-6 text-center text-lg font-semibold text-gray-500 sm:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="image_upload_style dark:bg-black mx-auto max-w-full">
                <div
                  className="border_style input_background flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-500 sm:h-80 lg:h-96"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} multiple />

                  {imagePreviews.length > 0 ? (
                    <div
                      className="image_preview_style custom-scrollbar overflow-y-auto"
                      style={{ maxHeight: "300px" }}
                    >
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative m-2 inline-block">
                          <img
                            src={preview}
                            alt={`Selected ${index}`}
                            className="max-h-full max-w-full"
                            style={{ width: "200px", height: "150px" }}
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 m-1 p-1 text-white"
                            style={{ width: "30px", height: "30px" }}
                          >
                            <img src={Minus} alt="" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <label
                        htmlFor="imageInput"
                        className="flex cursor-pointer items-center"
                      >
                        <img
                          style={{ width: "30px", height: "30px" }}
                          src={plus}
                          alt="Plus Icon"
                          className="mr-2"
                        />
                        <span className="text-xl font-bold text-gray-500 dark:text-white">
                          Drag and drop or upload your image here
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-center">
                  <button
                    className={
                      selectedImages.length <= 0
                        ? "cursor-not-allowed rounded bg-blue-500 py-2 px-4 font-bold text-white opacity-50"
                        : "mt-1 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                    }
                    onClick={handleSend}
                    disabled={selectedImages.length <= 0}
                  >
                    Detect Cracks
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="dark:bg-black mt-6 flex items-center justify-center rounded-2xl bg-gray-100 p-4 dark:bg-[#384d9b4d] sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl sm:px-6 lg:px-8">
              <h2 className="mb-2 text-center text-4xl font-bold capitalize hover:text-navy-700 dark:text-white dark:hover:text-white">
                Free Crack Detection Tool Online
              </h2>
              <p className="mb-6 text-center text-lg font-semibold text-gray-500 sm:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="image_upload_style dark:bg-black mx-auto max-w-full">
                <div
                  className="border_style input_background flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-500 sm:h-80 lg:h-96"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} multiple />

                  {imagePreviews.length > 0 ? (
                    <div key={index} className="relative m-2 inline-block">
                      <img
                        src={preview}
                        alt={`Selected ${index}`}
                        className="max-h-full max-w-full"
                        style={{ width: "200px", height: "150px" }}
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 m-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-700"
                        style={{ width: "24px", height: "24px" }}
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    // <div
                    //   className="image_preview_style custom-scrollbar overflow-y-auto"
                    //   style={{ maxHeight: "300px" }}
                    // >
                    //   {imagePreviews.map((preview, index) => (
                    //     <img
                    //       key={index}
                    //       src={preview}
                    //       alt={`Selected ${index}`}
                    //       className="m-2 max-h-full max-w-full"
                    //       style={{ width: "200px", height: "150px" }}
                    //     />
                    //   ))}
                    // </div>
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <label
                        htmlFor="imageInput"
                        className="flex cursor-pointer items-center"
                      >
                        <img
                          style={{ width: "30px", height: "30px" }}
                          src={plus}
                          alt="Plus Icon"
                          className="mr-2"
                        />
                        <span className="text-xl font-bold text-gray-500 dark:text-white">
                          Drag and drop or upload your image here
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-center">
                  <button
                    className={
                      selectedImages.length <= 0
                        ? "cursor-not-allowed rounded bg-blue-500 py-2 px-4 font-bold text-white opacity-50"
                        : "mt-1 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                    }
                    onClick={handleSend}
                    disabled={selectedImages.length <= 0}
                  >
                    Detect Cracks
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          <div className="step_container mb-10 mt-5 rounded-2xl bg-gray-100 p-4 dark:bg-[#384d9b4d] sm:p-6 sm:p-6 lg:p-10 lg:p-8">
            <h3 className="mb-6 text-center text-2xl font-bold dark:text-white sm:text-3xl lg:text-4xl">
              Recently Added Images
            </h3>
            <div className="flex flex-col justify-center gap-8 lg:flex-row">
              {getData.map((value, index) => {
                // console.log("value", value);
                return (
                  <div key={index} className="w-80">
                    <NftCard
                      imageName={value.image_name}
                      checkBox={false}
                      image={value.image_url}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="step_container mb-10 mt-5 rounded-2xl bg-gray-100 p-4 dark:bg-[#384d9b4d] sm:p-6 sm:p-6 lg:p-10 lg:p-8">
            <h3 className="mb-6 text-center text-2xl font-bold dark:text-white sm:text-3xl lg:text-4xl">
              Steps to Detect Crack Online
            </h3>
            <div className="flex flex-col justify-center gap-8 lg:flex-row">
              <div className="mx-4 flex flex-col items-center">
                <img
                  className="w-full max-w-xs"
                  src="https://www.gemoo-resource.com/tools/img/image_step1.png"
                  alt="Step 1"
                />
                <h4 className="mt-4 mb-2 text-center text-xl font-bold dark:text-white sm:text-2xl">
                  STEP 1
                </h4>
                <p className="w-full max-w-xs text-center dark:text-white">
                  Upload, drag and drop, or copy and paste an image from your
                  computer.
                </p>
              </div>
              <div className="mx-4 mt-8 flex flex-col items-center lg:mt-20">
                <img
                  className="w-20 sm:w-24"
                  src="https://www.gemoo-resource.com/tools/img/step-arrow.svg"
                  alt="Arrow"
                />
              </div>
              <div className="mx-4 flex flex-col items-center">
                <img
                  className="w-full max-w-xs"
                  src="https://www.gemoo-resource.com/tools/img/image_step2.png"
                  alt="Step 2"
                />
                <h4 className="mt-4 mb-2 text-center text-xl font-bold dark:text-white sm:text-2xl">
                  STEP 2
                </h4>
                <p className="w-full max-w-xs text-center dark:text-white">
                  Analyze the uploaded image for cracks.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
