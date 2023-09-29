import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import { Result, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ResetPassword = () => {
    const [success, setSuccess] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [validConfirmPwd, setValidConfirmPwd] = useState(false);
    const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams(); // Assuming your route is something like /reset-password/:token

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post('/forgot/reset', { token, newPassword });
            setMessage('Password reset successfully!');
            setSuccess(true);
            // Optionally, redirect the user to the login page after a successful reset
        } catch (error) {
            setMessage('Error resetting password. Please try again.');
            console.error(error);
        }
    };

    useEffect(() => {
        const result = PWD_REGEX.test(newPassword);
        setValidPwd(result);
        const match = newPassword === confirmPassword;
        setValidConfirmPwd(match);
    }, [newPassword, confirmPassword]);

    console.log(validConfirmPwd, validPwd);

    return (
        <div className='resetPassword'>
        {!success ? (
        <>
            <h2>Reset Password</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{marginTop: '1em'}}>
                    <label>New Password:
                        <span className={validPwd ? 'valid' : 'hide'}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validPwd || !newPassword ? 'hide' : 'invalid'}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        required
                    />
                    <p className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Password must be between 8 to 24 characters long. Must contain at least one uppercase letter, one lowercase letter, one digit and one special character. <br/>
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span>
                    </p>
                </div>
                <div style={{marginTop: '1em'}}>
                    <label>Confirm Password:
                        <span className={validConfirmPwd && confirmPassword ? 'valid' : 'hide'}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validConfirmPwd || !confirmPassword ? 'hide' : 'invalid'}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setConfirmPwdFocus(true)}
                        onBlur={() => setConfirmPwdFocus(false)}
                        required
                    />
                    <p className={!validConfirmPwd && confirmPwdFocus ? 'instructions' : 'offscreen'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input data
                    </p>
                </div>
                <Button type="default" disabled={!validPwd || !validConfirmPwd} onClick={handleSubmit}>Reset Password</Button>
            </form>
        </>) : (
            <Result
            status="success"
            title="Successfully Changed Password!"
            subTitle="Please proceed to Login Page to login with your new password."
            extra={[
            <Link to='/login'>
                <Button type="primary" value='large' key="console">
                    Go to Login Page
                </Button>
            </Link>
            ]}
        />
        )}
        </div>
    );
};

export default ResetPassword;
