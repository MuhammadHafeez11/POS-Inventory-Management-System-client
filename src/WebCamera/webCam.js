import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

function CameraComponent({ onCapture, onCancelPicture }) {
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [showWebcam, setShowWebcam] = useState(false);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(imageSrc)
        setImageSrc(imageSrc);
        onCapture(imageSrc);
        const link = document.createElement('a');
        if (imageSrc) {
            link.href = imageSrc;
            link.download = 'captured_image.jpeg';  // Provide a default filename for the image+
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setImageSrc('')
        }
        setShowWebcam(false); // Optionally hide the webcam after taking the photo
    };

    const cancelPicture =()=>{
        onCancelPicture()
    }
    // const downloadImage = () => {
    
    // };

    return (
        <div>
            {!showWebcam && (
                <div>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="600px"
                        videoConstraints={{
                            width: 1920, height: 1080,
                            facingMode: "user"
                        }}
                    />
                    <button onClick={capture}>Capture Photo</button>
                    <button onClick={cancelPicture}>Cancel Photo</button>
                </div>
            )}
            {/* {!showWebcam && (
                <button onClick={() => setShowWebcam(true)}>Take Picture</button>
            )} */}
            {/* {imageSrc && (
                <div>
                    <img src={imageSrc} alt="Captured" style={{ width: '100%' }} />
                    <button onClick={downloadImage}>Download Image</button>
                </div>
            )} */}
        </div>
    );
}

export default CameraComponent;
