import { Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import AuthContext from "../context/authContext";
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useContext(AuthContext);
  const [persist] = useLocalStorage('persist', false);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try{
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (auth?.accessToken) {
      setIsLoading(false);
    } else {
      console.log('Refresh token still exists. Refreshing access token from refresh page')
      verifyRefreshToken();
    }
  }, []);

  useEffect(() => {
    console.log("isLoading: ", isLoading)
  }, [isLoading]);


  // if persist is false, then we will not allow loading of /refresh api and render the login page as though we logged out
  // if persist is true, then we will render the outlet if isLoading is false, otherwise we will render a loading message
  return (
    <>
      {!persist ?
        <Outlet /> :
      isLoading ? (<p>Loading ...</p>) : (<Outlet />)}
    </>
  )

}

export default PersistLogin
