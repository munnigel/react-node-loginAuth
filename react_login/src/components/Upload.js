import React, { useState } from 'react';
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Upload as AntUpload, Button, message, Modal, Space, Spin, Steps } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';

const { Dragger } = AntUpload;


const Upload = () => {
    const axiosPrivate = useAxiosPrivate();
    const [imgUrls, setImgUrls] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [current, setCurrent] = useState(0);

    const steps = [
        {
            title: 'Select images',
        },
        {
            title: 'Preview Images',
        },
        {
            title: 'Done',
        },
    ];

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    // delay is used to retry the upload if the token expired and /refresh happened
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // keep track of all the files that are being uploaded
    const handleFileChange = info => {
        let fileList = [...info.fileList];
        setCurrent(1);
        setFileList(fileList);
    };

    // Remove the file from the fileList
    const handleRemove = (fileToRemove) => {
        const updatedFileList = fileList.filter(file => file.uid !== fileToRemove.uid);
        setFileList(updatedFileList);
        if (updatedFileList.length === 0) {
            setCurrent(0);
        }
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

        if (fileList.length === 0) {
            message.error("Please select files before uploading.");
            return;
        }
        setCurrent(2);
        const formData = new FormData();
        fileList.forEach((fileItem, index) => {
            formData.append(`file`, fileItem.originFileObj);
        });

        try {
            await delay(200);
            const response = await axiosPrivate.post("/image/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            const uniqueFileNames = response.data.files.join(',');

            const imageUrlResponse = await axiosPrivate.get(`/image?imageNames=${uniqueFileNames}`);
            // Assuming the backend returns an array of URLs
            setImgUrls(imageUrlResponse.data.urls);

            setFileList([]);
            setUploadProgress(0);
    
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
        <Steps size='small' current={current} items={items} style={{marginBottom: '5%'}}/>
        <div>
            <Dragger
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Prevent automatic upload
                showUploadList={false} // Disable the default upload list
                accept='image/jpg, image/jpeg, image/png'
                multiple={true}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload.</p>
                <p className='ant-upload-text'>Click on the uploaded image thumbnail to preview the image. </p>
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
        </div>

        {uploadProgress > 0 && (
            <Space size='large' style={{margin: "50px 0px", display: 'flex', justifyContent: 'Center', alignItems: 'Center'}}>
                <Spin size='large' >
                    <div className="content" />
                </Spin>
            </Space>
        )}

        {imgUrls.map((url, index) => (
            <img key={index} src={url} alt={`S3 image ${index}`} style={{ marginTop: '20px', marginRight: '10px' }} />
        ))}


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
