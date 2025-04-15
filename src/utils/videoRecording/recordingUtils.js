import store from '../../store/store';
import S3 from "react-aws-s3";
import * as webRTCGroupCallHandler from '../../utils/webRTC/webRTCGroupCallHandler';
import { io } from 'socket.io-client';
const videoSocket = io("http://127.0.0.1:5001");

let mediaRecorderRef = { current: null };
let recordedChunksRef = [];
let isRecording = false;

let mediaRecorder;
let videoFileName;

let userVideoFileName;


let mediaRecorder2;

const vp9Codec = "video/mp4; codecs=h264";
const vp9Options = { mimeType: vp9Codec };
var recordedChunks = [];


const config = {
  bucketName: '',
  region: '',
  accessKeyId: '',
  secretAccessKey: '',
};
const ReactS3Client = new S3(config);

export const startRecording = async (kioskName, roomID) => {
  // Extract ROOMID and KIOSKNAME
  const ROOMID = roomID;
  const KIOSKNAME = kioskName.username;

  console.log('Room ID for recording:', ROOMID);
  console.log('Kiosk Name:', KIOSKNAME);

  // Emit the `start_recording` event with parameters
  videoSocket.emit('start_recording', { ROOMID, KIOSKNAME });
};



// export const startRecording = async (kioskName) => {
//   try {
//     console.log('kioskSessionId ====', kioskName);

//     // Request screen sharing with audio enabled
//     const screenStream = await navigator.mediaDevices.getDisplayMedia({
//       video: {
//         cursor: 'always', // Keep cursor visible
//         displaySurface: 'monitor', // Suggest the whole screen
//       },
//       audio: true, // Enable system audio automatically
//     });

//     // Check if system audio was enabled correctly
//     console.log('Screen stream audio tracks:', screenStream.getAudioTracks());

//     // Request microphone access (if necessary)
//     const microphoneStream = await navigator.mediaDevices.getUserMedia({
//       audio: {
//         echoCancellation: true,
//         noiseSuppression: true,
//         sampleRate: 44100,
//       },
//     });

//     // Combine streams
//     const combinedStream = new MediaStream([
//       ...screenStream.getVideoTracks(),
//       ...screenStream.getAudioTracks(), // System audio
//       ...microphoneStream.getAudioTracks(), // Microphone audio
//     ]);

//     console.log('Combined stream tracks:', combinedStream.getTracks());

//     // Initialize MediaRecorder with the combined stream
//     mediaRecorderRef.current = new MediaRecorder(combinedStream, {
//       mimeType: 'video/webm', // Specify the mime type
//     });

//     recordedChunksRef.current = [];

//     mediaRecorderRef.current.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         recordedChunksRef.current.push(event.data);
//       }
//     };

//     // Handle recording stop event
//     mediaRecorderRef.current.onstop = () => {
//       const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
//       console.log('Recording finished, uploading...');
//       uploadRecording(blob, kioskName); // Call upload function to send the recording
//     };

//     // Start the recording process
//     mediaRecorderRef.current.start();
//     isRecording = true;
//     console.log('Recording started.');
//   } catch (error) {
//     console.error('Error starting screen recording:', error);
//   }
// };


export const stopRecording = async () => {
  // Extract ROOMID and KIOSKNAME
  videoSocket.emit('stop_recording');
};

// export const stopRecording = () => {
//   console.log('Recording stopped.');
//   console.log('mediaRecorderRef', mediaRecorderRef);
//   if (mediaRecorderRef.current) {
//     mediaRecorderRef.current.stop();
//     isRecording = false;
//   }
// };

const uploadRecording = async (blob, kioskName) => {
  try {
    console.log('Uploading recording...');
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Create FormData to send the video blob
    const formData = new FormData();
    formData.append('file', blob, `${kioskName.username}-${kioskName.kioskSessionId}-${day}-${month}-${year}.webm`);

    const response = await fetch(`${process.env.REACT_APP_SERVER}/upload-video`, {
      method: 'POST',
      body: formData, // Directly send the formData here
    });

    const data = await response.json();
    if (response.ok) {
      console.log('File uploaded successfully:', data);
    } else {
      console.error('Error uploading file:', data);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// export const startRecording1 = (videoName) => {
//   console.log('method called');

//   userVideoFileName = videoName;
//   console.log('userrecording name',userVideoFileName);
//   const remoteStream = store.getState().call.localStream;

//   console.log('local stream user', remoteStream);

//   if (MediaRecorder.isTypeSupported(vp9Codec)) {
//     mediaRecorder2 = new MediaRecorder(remoteStream, vp9Options);
//   } else {
//     mediaRecorder2 = new MediaRecorder(remoteStream);
//   }

//   mediaRecorder2.ondataavailable = handleDataAvailable1;
//   console.log("Start Recording user");

//   mediaRecorder2.start();
//   console.log('method end');
// };




// export const stopRecording1 = () => {
//   if(mediaRecorder2.state == 'recording'){
//     mediaRecorder2.stop();
//   }
// };


const downloadRecordedVideo = () => {
  const blob = new Blob(recordedChunks, {
    type: "video/mp4",
  });

  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // document.body.appendChild(a);
  // a.style = "display: none;";
  // a.href = url;
  // a.download = "recording.webm";
  // a.click();
  // window.URL.revokeObjectURL(url);

  //   ReactS3Client.uploadFile(blob, videoFileName).then(
  //     (data) => {
  //     console.log(data);
  //     if (data.status === 204) {
  //       console.log("success");
  //     } else {
  //       console.log("fail");
  //     }
  //   },
  //   (err)=>{
  //     console.log("errrrrrrr");
  //     console.log(err);
  //   });
  var myBlob = blob;
  console.log(myBlob);
  var fileName = videoFileName + '.mp4';
  console.log('operatorfile', fileName);
  var fd = new FormData();
  fd.append('my_file', myBlob, fileName);
  fetch(process.env.REACT_APP_SERVER + '/upload', {
    method: 'post',
    body: fd
  });

  recordedChunks = [];
};

const downloadRecordedVideo1 = () => {
  const blob = new Blob(recordedChunks, {
    type: "video/mp4",
  });

  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // document.body.appendChild(a);
  // a.style = "display: none;";
  // a.href = url;
  // a.download = "recordinguser.webm";
  // a.click();
  // window.URL.revokeObjectURL(url);

  var myBlob = blob;
  console.log(myBlob);
  var fileName = userVideoFileName + '.mp4';
  console.log('userfile', fileName);
  var fd = new FormData();
  fd.append('my_file', myBlob, fileName);
  fetch(process.env.REACT_APP_SERVER + '/userupload', {
    method: 'post',
    body: fd

  });

  recordedChunks = [];
};

const handleDataAvailable = (event) => {
  console.log("download ??????");
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    downloadRecordedVideo();
  }
};

const handleDataAvailable1 = (event) => {
  console.log("download user");
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    downloadRecordedVideo1();
  }
};
