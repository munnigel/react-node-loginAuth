import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate()

    const goBack = () => {
        // navigate(-1) is the same as clicking the browser's back button
        navigate(-1)
    }
    
    return (
        <section>
            <h1>Unauthorized</h1>
            <br />
            <p>You are not authorized to view this requested page.</p>
            <div className="flexgrow">
                <button onClick={goBack}>Go goBack</button>
            </div>
        </section>
    )
}

export default Unauthorized