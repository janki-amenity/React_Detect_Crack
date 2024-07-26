import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function SignIn() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    console.log("Sign in");
    e.preventDefault();
    console.log("Event", e);
    console.log("Value", e.target.email.value, e.target.password.value);
    const email = e.target.email.value;
    const password = e.target.password.value;

    loginUser(email, password)
      .then((result) => {
        console.log("Hi i am result", result);
        const uid = result.user.uid;
        const DisplayName = result.user.displayName;
        localStorage.setItem("User_Id", uid);
        localStorage.setItem("DisplayName", DisplayName);
        navigate("/admin/default");
      })
      .catch((error) => console.log("login page error", error, error.message));

    e.target.reset();
  };
  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        <form class="space-y-6" onSubmit={handleFormSubmit}>
          <InputField
            name="email"
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="text"
          />

          <InputField
            name="password"
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="password"
            id="password"
            type="password"
          />
          <div className="mb-4 flex items-center justify-end px-2">
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href="/auth/forgot-password"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Sign In
          </button>
        </form>
        {/* Email */}
        {/* <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
        /> */}

        {/* Password */}
        {/* <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="password"
          id="password"
          type="password"
        /> */}

        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href="/auth/sign-up"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
