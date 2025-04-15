import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
// import bg from '../../../resources/DSC_0412.jpg';
import './localVideo.css';

const styles = {
  videoContainer: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    position: 'absolute',
    top: '10%',
    right: '25%',
  },
};

const LocalVideoView = ({ localStream }) => {
  const localVideoRef = useRef();
  const canvasRef = useRef();
  const segmentation = useRef(null);
  const userType = localStorage.getItem('usertype');

  const showCanva = useSelector((state) => state.btn.showCanva);
  const canvaBg = useSelector((state) => state.btn.canvaBg);


  useEffect(() => {
    const localVideo = localVideoRef.current;

    if (localStream && localVideo) {
      localVideo.srcObject = localStream;
      localVideo.onloadedmetadata = () => {
        localVideo.play();
        if (canvasRef.current) {
          initializeSegmentation(localVideo);
        }
      };
    }

    return () => {
      if (segmentation.current) {
        segmentation.current.close();
      }
    };
  }, [localStream]);

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
        ctx.drawImage(localVideoRef.current, 0, 0, canvas.width, canvas.height);
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
    <div style={styles.videoContainer} className="background_secondary_color">
      {userType === 'OPERATOR'  ? (
         <>
         {showCanva? (
          <>
          <video className="videoElement" ref={localVideoRef} autoPlay muted style={{ display: 'none' }} />
          <canvas ref={canvasRef} className="videoElement" style={{
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                  backgroundImage: `url(${canvaBg})`
                }}/>
                </>
         ):(
          <video className='videoElement' ref={localVideoRef} autoPlay muted />
         )}
               </>
      ) : (
        
            <video className='videoElement' ref={localVideoRef} autoPlay muted />
      )
    }
    </div>
  );
};

export default LocalVideoView;
