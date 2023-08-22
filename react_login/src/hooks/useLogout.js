import axios from "../api/axios";
import { useContext } from "react";
import AuthContext from "../context/authContext";

const useLogout = () => {
  const { setAuth } = useContext(AuthContext);
  const logout = async () => {
    setAuth({})
    try {
      const response = await axios.get("/logout", {
        withCredentials: true
      })
    } catch (error) {
      console.error(error);
    }
  }

  return logout
}

export default useLogout