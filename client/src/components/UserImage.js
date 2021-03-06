import React, { useContext, useState } from "react";
import Button from 'react-bootstrap/Button';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately from filepond
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import axios from 'axios';
import { AuthContext } from "../providers/AuthProvider";
import { Alert } from "react-bootstrap";
import { VocalButton } from "./Styles";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageCrop,   FilePondPluginImageResize,
    FilePondPluginImageTransform,);

const UserImage = (props) => {
    const {toggleUpload} = props
    const auth = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleUpdate = (files) => {
        setFiles(files);
    };
    
    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        let data = new FormData();
        if (files[0] && files[0].file) {
            data.append("file", files[0].file);
        };
        try {
            let res = await axios.post("/api/users/image", data);
            setSuccess(true);
            auth.setUser(res.data);
            setLoading(false);
            toggleUpload()
        } catch (err) {
            console.log(err);
            setFailure(true);
            setLoading(false);
        };
    };

    const handleAlert = () => {
        setTimeout(()=>{setSuccess(false)}, 3500);
    };
    const handleFailAlert = () => {
        setTimeout(()=>{setFailure(false)}, 3500);
    };


    return (
        <div style={{padding:"2rem", marginTop:"2rem", borderRadius:".5rem", width: "60vw", boxShadow:"rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"}} >
            <h3 style={{textAlign: "center", color:"white"}} >Select an Image for your Avatar</h3>
            {success && 
            <div>
                <Alert variant="success" >Successfully uploaded your image!</Alert>
                {handleAlert()} 
            </div>}
            {failure && 
            <div>
            <Alert variant="danger" >Failed to upload image!</Alert>
            {handleFailAlert()} 
            </div>}
            <FilePond 
                files={files}
                onupdatefiles={handleUpdate}
                allowMultiple={false}
                name="files"
                labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
                imagePreviewHeight = '170'
                imageCropAspectRatio = '1:1'
                imageResizeTargetWidth = '200'
                imageResizeTargetHeight = '200'
                stylePanelLayout = 'compact circle'
                styleLoadIndicatorPosition = 'center bottom'
                styleButtonRemoveItemPosition = 'center bottom'
                allowImageCrop={true}
                allowImageTransform={true}
                imageCropAspectRatio='1:1'
            />
            <div style={{display: "flex", justifyContent: "flex-end"}} >
                <VocalButton disabled={loading} variant="primary" onClick={handleUpload} >{loading ? "Uploading.." : "Upload"}</VocalButton>
            </div>
              <VocalButton onClick = {toggleUpload}>Cancel</VocalButton>
        </div>
    );
};

export default UserImage;