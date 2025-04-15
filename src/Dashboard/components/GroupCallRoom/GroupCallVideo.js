import React, { useRef, useEffect } from 'react';
import { useSelector} from 'react-redux';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

const GroupCallVideo = ({ stream }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const segmentation = useRef(null);
  const userType = localStorage.getItem('usertype');

  const showCanva = useSelector((state) => state.btn.showCanva);
  const canvaBg = useSelector((state) => state.btn.canvaBg);


  console.log("checking store value!",showCanva);
  console.log("checking store value!",typeof(showCanva));
  

  useEffect(() => {
    const remoteGroupCallVideo = videoRef.current;
    if (remoteGroupCallVideo) {
      remoteGroupCallVideo.srcObject = stream;
      remoteGroupCallVideo.onloadedmetadata = () => {
        remoteGroupCallVideo.play();
        if (canvasRef.current) {
          initializeSegmentation(remoteGroupCallVideo);
        }
      };
    }

    return () => {
      if (segmentation.current) {
        segmentation.current.close();
      }
    };
  }, [stream]);

  useEffect(() => {
    console.log('showCanva state has changed:', showCanva);
  }, [showCanva]);  // This will log when showCanva changes
  

  const initializeSegmentation = async (videoElement) => {
    segmentation.current = new SelfieSegmentation({
      locateFile: (file) => `/mediapipe/selfie_segmentation/${file}`,
    });

    segmentation.current.setOptions({
      modelSelection: 1,
    });

    segmentation.current.onResults(onSegmentationResults);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      async function processFrame() {
        await segmentation.current.send({ image: videoElement });
        requestAnimationFrame(processFrame);
      }

      processFrame();
    }
  };

  const onSegmentationResults = (results) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.segmentationMask) {
        ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-over';

        const background = new Image();
        background.src = canvaBg;
        background.onload = () => {
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  };

  return (
  <div
    style={{
      background: 'white',
      zIndex: '99',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0px',
      left: '0px',
    }}
  >
     {console.log('showCanva inside JSX:', showCanva)} {/* Log showCanva value */}
     {console.log('usertype:', userType)} {/* Log showCanva value */}
    {userType === 'OPERATOR' ? (
      <video className="Group_call_video_fit" ref={videoRef} autoPlay />
    ) : (
      <>
     
        {showCanva ? (
          <>
            {/* Video is hidden but still attached to the stream */}
            <video ref={videoRef} autoPlay style={{ display: 'none' }} />
            <canvas
              ref={canvasRef}
              style={{
                zIndex: '99',
                width: 'auto',
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${canvaBg})`,
                position: 'absolute',
                left: '0px',
              }}
              className="Group_call_video_fit"
            />
          </>
        ) : (
          // If showCanva is false, just show the video without the canvas
          <video className="Group_call_video_fit" ref={videoRef} autoPlay />
        )}
      </>
    )}
  </div>
);

};

export default GroupCallVideo;
