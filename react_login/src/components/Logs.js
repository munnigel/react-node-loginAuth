import React from 'react'
import { Link } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/authContext'

const Logs = () => {
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useContext(AuthContext)
    const [logs, setLogs] = useState([])
  

    // run the PORT request to get the logs
    useEffect(() => {
        const getLogs = async () => {
            try {
                const response = await axiosPrivate.post('/image/logs', { username: auth.user })
                setLogs(response.data)
                console.log(response.data)
            
            } catch (error) {
                console.error(error)
            }
        }
        getLogs()
    }, [])

    return (
    <section>
        <div>Logs for {auth.user}</div>
        <ul>
            {logs.map((log, index) => (
                <li key={index}>
                    <img src={log.signedUrl} alt={log.imageName} style={{ width: '100px', height: '100px' }} />
                    <div>{log.imageName}</div>
                </li>
            ))}
        </ul>

        <div className="flexGrow" style={{ marginTop: '20px' }}>
            <Link to="/">Home</Link>
        </div>
    </section>
);
}

export default Logs