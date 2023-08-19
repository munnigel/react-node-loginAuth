import React from 'react'
import { useRef, useEffect, useState, useContext } from 'react'
import AuthContext from '../context/authContext'
import axios from '../api/axios'
import {Link, useNavigate, useLocation} from 'react-router-dom'

const LOGIN_URL = '/auth'

const Login = () => {
  const {setAuth} = useContext(AuthContext)

  const navigate = useNavigate()
  const location = useLocation()

  // Get where the user is coming from. If there is no history of where the user is coming from, go to home page.
  // For example, if user is not logged in and wants to go to /admin page, the user will be redirected to login page. 
  // After login, the user will be redirected straight to /admin page
  const from = location.state?.from?.pathname || '/';

  const userRef = useRef()
  const errorRef = useRef()

  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        }
      )
      const accessToken = response?.data?.accessToken
      const roles = response?.data?.roles
      setAuth({user, pwd, roles, accessToken})
      setUser('')
      setPwd('')
        console.log(location)
      // navigate to where the user is coming from or go to home page
      navigate(from, {replace: true})
      
    } catch (err) {
      console.log(err)
      if (!err?.response) {
        setErrMsg('No server response')
      } else if (err?.response.status === 400) {
        setErrMsg('Missing username or password')
      } else if (err?.response.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Server error. Login failed.')
      }
      errorRef.current.focus()  
    }

  }


  return (
    <section>
      <p ref={errorRef} className={errMsg ? 'errMsg' : 'offscreen'}>
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username:</label>
        <input 
          type='text' 
          id='username' 
          ref={userRef} 
          autoComplete='off'
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
          />

        <label htmlFor='password'>Password:</label>
        <input 
          type='password' 
          id='password' 
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          />

          <button>Sign In</button>
      </form>
      <p>
        Don't have an Account? <br/>
        <span className='line'>
          <a href='/'>Sign Up</a>
        </span>
      </p>
    </section>
  )
}

export default Login
