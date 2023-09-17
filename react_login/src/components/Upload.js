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
            console.log("image upload")
            const response = await axiosPrivate.post("/image/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            setUploadStatus(response.data.message);

            console.log("image url")

            // Fetch the signed URL immediately after upload
            const imageName = file.name;
            const imageUrlResponse = await axiosPrivate.get(`/image/${imageName}`);
            setImgUrl(imageUrlResponse.data.url);

        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error("Error", error.message);
            }
            console.error(error.config);
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
