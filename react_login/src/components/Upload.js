import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";


const Upload = () => {
    const axiosPrivate = useAxiosPrivate();

    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", file);


        try {
            const response = await axiosPrivate.post("/image/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            setUploadStatus(response.data.message);


            // Fetch the signed URL immediately after upload
            const imageName = file.name;
            const imageUrlResponse = await axiosPrivate.get(`/image/${imageName}`);
            setImgUrl(imageUrlResponse.data.url);

        } catch (error) {

            console.error(error);

            // If token expired and refresh happened, retry the upload
            // This issue happens because when /refresh happens, formData gets reset. Hence we have to rerun the handleSubmit function
            if (error?.response?.status === 400) {
                console.log("Token expired, retrying upload");
                // Retry the upload with the pendingFormData
                await handleSubmit(e);
            }
        }
    };



    return (
        <section>
            <div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input type="file" name="file" accept="image/png, image/jpeg" onChange={handleFileChange} required />
                    <button type="submit">Upload</button>
                </form>
                <div>{uploadStatus}</div>
            </div>

            {imgUrl && <img src={imgUrl} alt="S3 image" />}

            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    );
}

export default Upload;
