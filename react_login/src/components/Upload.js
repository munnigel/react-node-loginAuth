import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Upload as AntUpload, Button, message, Modal } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';

const { Dragger } = AntUpload;


const Upload = () => {
    const axiosPrivate = useAxiosPrivate();
    const [uploadStatus, setUploadStatus] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    // delay is used to retry the upload if the token expired and /refresh happened
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // for now we only allow one file to be uploaded, so we only need to keep track of one file
    const handleFileChange = info => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        setFileList(fileList);
    };

    // Remove the file from the fileList
    const handleRemove = (fileToRemove) => {
        const updatedFileList = fileList.filter(file => file.uid !== fileToRemove.uid);
        setFileList(updatedFileList);
    };


    // Preview the image
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const file = fileList[0]?.originFileObj;
        if (!file) {
            message.error("Please select a file before uploading.");
            return;
        }

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
            setFileList([]);

        } catch (error) {

            console.error(error);

            // If token expired and refresh happened, retry the upload
            // This issue happens because when /refresh happens, formData gets reset. Hence we have to rerun the handleSubmit function
            if (error?.response?.status === 411) {
                console.log("Token expired, retrying upload");
                // Retry the upload with the pendingFormData
                await delay(100);
                await handleSubmit(e);
            }
        }
    };



    return (
        <section>
        <div>
            <Dragger
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Prevent automatic upload
                showUploadList={false} // Disable the default upload list
                accept='image/jpg, image/jpeg, image/png'
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>

            {/* Custom file list */}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {fileList.map(file => (
                        <li key={file.uid} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <img 
                                src={URL.createObjectURL(file.originFileObj)} 
                                alt="thumbnail" 
                                style={{ width: '50px', height: '50px', marginRight: '10px' }} 
                                onClick={() => handlePreview(file)}
                            />
                            <span style={{ flexGrow: 1, fontSize: '15px' }}>{file.name}</span>
                            <DeleteOutlined onClick={() => handleRemove(file)} />
                        </li>
                    ))}
                </ul>

            <Button type="primary" onClick={handleSubmit} disabled={fileList.length === 0} style={{ marginTop: '10px', width: '100%' }}>Upload</Button>
            <div>{uploadStatus}</div>
        </div>

        {imgUrl && <img src={imgUrl} alt="S3 image" style={{ marginTop: '20px' }} />}

        <Modal
            open={previewVisible}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
        >
            <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        <br />
        <div className="flexGrow" style={{ marginTop: '20px' }}>
            <Link to="/">Home</Link>
        </div>
    </section>
);
}

export default Upload;
