import React from 'react'
import { useRef, useEffect, useState, useContext } from 'react'
import AuthContext from '../context/authContext'
import axios from '../api/axios'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import useInput from '../hooks/useInput'
import useToggle from '../hooks/useToggle'
import { Input, Button } from 'antd';
import AgencySelection from './subcomponents/AgencySelection'

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

  // setting local storage with key 'user' and value of user input
  const [user, reset, attributeObject] = useInput('user', '')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [agency, setAgency] = useState('Please select agency')

  // setting local storage of key 'persist' and value of true or false based on the checkbox
  const [check, toggleCheck] = useToggle('persist', false)

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const finalUser = user + agency

    console.log(finalUser, pwd)

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ finalUser, pwd }),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        }
      )
      const accessToken = response?.data?.accessToken
      const roles = response?.data?.roles
      setAuth({user, roles, accessToken})
      reset()
      setPwd('')

      // navigate to where the user is coming from or go to home page
      navigate(from, {replace: true})
      
    } catch (err) {
      console.log(err)
      if (!err?.response) {
        setErrMsg('No server response')
      } else if (err?.response.status === 400) {
        setErrMsg('Missing username / password / agency')
      } else if (err?.response.status === 401) {
        setErrMsg('Invalid User Name or Password')
      } else {
        setErrMsg('Server error. Login failed.')
      }
      errorRef.current.focus()  
    }
  }



  return (
    <div className='loginContainer'>
    <section className='login'>
      <p ref={errorRef} className={errMsg ? 'errMsg' : 'offscreen'}>
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form>
        <label htmlFor='agency'>
          Agency:
        </label>
        <AgencySelection
          id='agency'
          agency={agency}
          setAgency={setAgency}
          reference={userRef}
        />
        <label htmlFor='username'>Username:</label>
        <Input 
          type='text' 
          id='username' 
          autoComplete='off'
          {...attributeObject}
          addonAfter={agency}
          required
          />

        <label htmlFor='password'>Password:</label>
        <Input 
          type='password' 
          id='password' 
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          />

          <Button size='large' onClick={handleSubmit} disabled={!pwd || !user}>Sign In</Button>
          <div className='persistCheck'>
            <input 
              type='checkbox' 
              id='persist' 
              checked={check} 
              onChange={toggleCheck}
            />
            <label htmlFor='persist'>Keep me signed in</label>
          </div>
      </form>
      <p>
        Don't have an Account? <br/>
        <span className='line'>
          <Link to='/register'>Sign Up</Link>
        </span>
      </p>
    </section>
    <div className='image'>
      <h1>HTX X PixelGuard</h1>
      <br />
      <p>Security Like Never Before</p>
    </div>
    </div>
  )
}

export default Login
