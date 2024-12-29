import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useSecureAxios = () => {
  const token = useSelector((state) => state.auth?.token); // Safe access in case state.auth is undefined

  // Create a new Axios instance each time the hook is called
  const secureAxios = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 10000,
  });

  useEffect(() => {
    if (token) {
      secureAxios.defaults.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete secureAxios.defaults.headers['Authorization'];
    }
  }, [token, secureAxios]);

  return secureAxios;
};

export default useSecureAxios;
