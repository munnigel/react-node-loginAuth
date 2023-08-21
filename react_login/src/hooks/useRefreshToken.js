import axios from "../api/axios"
import { useContext } from "react"
import AuthContext from "../context/authContext"

const useRefreshToken = () => {
  const { setAuth } = useContext(AuthContext)
  const refresh = async () => {
    const response = await axios.get("/refresh", {
      // this allows us to send the cookie to the server
      withCredentials: true
    })
    setAuth(prev => {
      console.log("prev", prev)
      console.log(response.data.accessToken)
      return {...prev, accessToken: response.data.accessToken}
    })
    return response.data.accessToken
  }

  return refresh
}

export default useRefreshToken