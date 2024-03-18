import { useState } from "react";
import axios from "axios";
import useAuthContext from "./useAuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    try {
      const response = await axios.post("https://backend-url/api/user/signup", {
        email,
        password,
      });
      dispatch({ type: "LOGIN", payload: response.data });
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return { loading, error, signup };
};

export default useSignup;
