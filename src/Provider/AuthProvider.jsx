import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signOut,
  deleteUser as firebaseDeleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { auth, db } from "../Firebase/FirebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../Firebase/FirebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        toast.success("User created successfully!");
        setLoading(false);
        return result;
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
        throw error;
      });
  };

  const deleteUser = async () => {
    setLoading(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      return firebaseDeleteUser(currentUser)
        .then(() => {
          toast.success("User account deleted successfully!");
          setLoading(false);
          setUser(null);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
          throw error;
        });
    } else {
      const error = new Error("No user is currently signed in.");
      toast.error(error.message);
      setLoading(false);
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    console.log("Hello Login is here", email, password);
    return signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        toast.success("Login successful!");
        setLoading(false);
        return result;
      })
      .catch((error) => {
        console.error("Error", error.message);
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        toast.error(errorMessage);
        setLoading(false);
        throw error;
      });
  };

  const logOut = async () => {
    setLoading(true);
    return signOut(auth)
      .then(() => {
        toast.success("Logout successful!");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
        throw error;
      });
  };

  const forgotPassword = async (email) => {
    console.log("object", email);
    setLoading(true);
    return firebaseSendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset email sent!");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
        throw error;
      });
  };

  const deleteImages = async (selectedImages) => {
    console.log("selectedImages", selectedImages);
    try {
      const docRef = doc(db, "user_uploaded_image", selectedImages);
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      // console.log("Current value of the current user", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubcribe();
    };
  }, []);

  const authValue = {
    createUser,
    user,
    loginUser,
    logOut,
    forgotPassword,
    loading,
    deleteUser,
    deleteImages,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
