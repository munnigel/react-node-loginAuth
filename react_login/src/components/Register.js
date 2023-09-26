import React from 'react'
import { useRef, useEffect, useState } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Input, Button, Select} from 'antd'
import {Link} from 'react-router-dom'
import AgencySelection from './subcomponents/AgencySelection'

import axios from '../api/axios'

const USER_REGEX = /^[^\s@]+$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register'

const Register = () => {
  const userRef = useRef()
  const errorRef = useRef()

  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false)
  const [userFocus, setUserFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [confirmPwd, setConfirmPwd] = useState('')
  const [validConfirmPwd, setValidConfirmPwd] = useState(false)
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const [agency, setAgency] = useState('Please select agency first')

  // focus on user input on page load
  useEffect(() => {
    userRef.current.focus()
  }, [])

  // check if user input is valid
  useEffect(() => {
    const result = USER_REGEX.test(user)
    setValidName(result)
  }, [user])



  // check if password input is valid and if it matches confirm password input
  useEffect(() => {
    const result = PWD_REGEX.test(pwd)
    setValidPwd(result)
    const match = pwd === confirmPwd
    setValidConfirmPwd(match)
  }, [pwd, confirmPwd])

  // every time a user input for username, password, or confirm password is changed, take away the error message
  useEffect(() => {
    setErrMsg('')
  }, [user, pwd, confirmPwd])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // in case someone uses Javascript to force the button to be activated when the validation fails
    const v1 = USER_REGEX.test(user)
    const v2 = PWD_REGEX.test(pwd)
    if (!v1 || !v2) {
      setErrMsg('Invalid entry')
      return
    }

    const finalUser = user + agency

    try{
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({finalUser, pwd}),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        }
      )
      if (response.status === 201) {
        console.log(JSON.stringify(response.data))
        setSuccess(true)
        setUser('')
        setPwd('')
        setConfirmPwd('')
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setErrMsg('Username taken')
        } else if (err.response.status === 400) {
          setErrMsg('Username and password required')
        } else {
          setErrMsg('Server error. Registration failed.')
        }
      } else {
        setErrMsg('No server response')
      }
      errorRef.current.focus()
    }
  }


  return (
    <div className='loginContainer'>
    <section className='login'>
      <p ref={errorRef} className={errMsg ? "errMsg" : "offscreen"}>
        {errMsg}
      </p>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='agency'>
          Agency:
        </label>
        <AgencySelection
          id='agency'
          agency={agency}
          setAgency={setAgency}
          reference={userRef}
        />
        <label htmlFor='username'>
          Company Email:
          <span className={validName ? 'valid' : 'hide'}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validName || !user ? 'hide' : 'invalid'}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <Input
          type='text'
          id='username'
          autoComplete='off'
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
          onChange={(e) => setUser(e.target.value)}
          addonAfter={agency}
          required
        />
        <p className={userFocus && !validName ? 'instructions' : 'offscreen'}>
          <FontAwesomeIcon icon={faInfoCircle} />
          Only type the first part of your email address (before the @ sign)
        </p>

        <label htmlFor='password'>
          Password:
          <span className={validPwd ? 'valid' : 'hide'}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validPwd || !pwd ? 'hide' : 'invalid'}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <Input
          type='password'
          id='password'
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <p className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
          <FontAwesomeIcon icon={faInfoCircle} />
          8 to 24 characters <br/> Must include uppercase and lowercase letters, a number, and a special character <br/>
          Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span>
        </p>

        <label htmlFor='confirm_password'>
          Confirm Password:
          <span className={validConfirmPwd && confirmPwd ? 'valid' : 'hide'}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validConfirmPwd || !confirmPwd ? 'hide' : 'invalid'}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <Input
          type='password'
          id='confirm_password'
          onFocus={() => setConfirmPwdFocus(true)}
          onBlur={() => setConfirmPwdFocus(false)}
          onChange={(e) => setConfirmPwd(e.target.value)}
          required
        />
        <p className={confirmPwdFocus && !validConfirmPwd ? 'instructions' : 'offscreen'}>
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match the first password input data
        </p>

        <Button disabled={!validName || !validPwd || !validConfirmPwd} onClick={handleSubmit}>Sign Up</Button>
      </form>

      <p>
        Already registered? <br/>
        <span className="line">
          <Link to='/login'>Sign In</Link>
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

export default Register