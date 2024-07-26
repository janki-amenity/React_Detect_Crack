import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AuthProvider from "./Provider/AuthProvider";
import App from "./App";

// import style sheet here
import style from "./assets/css/CommonStyleSheet.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <AuthProvider>
  //   <RouterProvider router={router} />
  // </AuthProvider>
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
