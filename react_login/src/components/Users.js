import { useState, useEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from "react-router-dom"


const Users = () => {
  const [users, setUsers] = useState()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    // to cancel the request if the component is unmounted e.g. if we leave the page before the request is completed
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          // controller.signal allows us to cancel the request if we need to
          signal: controller.signal
        });

        const userNames = response.data.map(user => user.username)
        console.log(response.data);
        isMounted && setUsers(userNames);
      } catch (error) {
        console.error(error);
        // if we get a 401 error, it means that our refresh token has expired, so we will redirect to login page
        navigate("/login", { state: { from: location }, replace: true })
        console.log("Your refresh token has expired, redirecting to login page")
      }
    }

    getUsers()

    // cleanup function when component is unmounted
    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])


  return (
    <article>
      <h2>Users List</h2>
      {
        users?.length ? (
          <ul>
            {
              users.map((user, i) => <li key={i}>{user}</li>)
            }
          </ul>
        ) : (<p>No users to display</p>)
      }
    </article>
  )
}

export default Users