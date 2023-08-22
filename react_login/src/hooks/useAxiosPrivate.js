import axios, { axiosPrivate } from "../api/axios";
import { useEffect, useContext } from "react";
import useRefreshToken from "./useRefreshToken";
import AuthContext from "../context/authContext";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useContext(AuthContext);

  // this is to intercept the request and add the access token to the header whenever we make a request
  useEffect(() => {

    // interceptors are used to intercept requests or responses before they are handled by then or catch

    // this function will be called whenever we make a request, and we can modify the request before it is sent
    // in this case, the function will add the access token to the header
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      }, (error) => Promise.reject(error)
    )

    // this function will be called whenever we get a response, and we can modify the response before it is handled by then or catch
    // in this case, the function will check if the access token has expired, and if it has, it will refresh the access token and send the request again
    const responseIntercept = axiosPrivate.interceptors.response.use(
      // if response is good then just get the response
      (response) => response,
      // if our access token has expired, then we will get a 403 error (expired token), or if we don't have a previous request, we will use this error handler.
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          console.log("refreshing token");
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    )
    // remove the interceptor when the component is unmounted. This prevents a buildup of interceptors.
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }
  }, [auth, refresh]);

  return axiosPrivate
}

export default useAxiosPrivate