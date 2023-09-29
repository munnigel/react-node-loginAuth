import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/authContext'

const Logs = () => {
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useContext(AuthContext)
    const [logs, setLogs] = useState([])
    console.log(auth)
  

    // run the PORT request to get the logs
    useEffect(() => {
        const getLogs = async () => {
            try {
                const response = await axiosPrivate.post('/image/logs', { username: auth.finalUser })
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
        <div>Logs for {auth.finalUser}</div>
        <ul>
            {logs.map((log, index) => (
                <li key={index}>
                    <img src={log.signedUrl} alt={log.imageName} style={{ width: '100px', height: '100px' }} />
                    <div>{log.imageName}</div>
                </li>
            ))}
        </ul>
    </section>
);
}

export default Logs