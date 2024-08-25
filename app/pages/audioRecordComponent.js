import { useState, useEffect, useRef } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firestore";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const AudioRecordComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
          };
          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunksRef.current, {
              type: "audio/ogg; codecs=opus",
            });
            chunksRef.current = [];
            const url = URL.createObjectURL(blob);
            setAudioURL(url);
          };
        })
        .catch((error) => {
          console.log("Following error has occurred: ", error);
        });
    }
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  const storeInCloud = () => {
    if (audioURL) {
      fetch(audioURL)
        .then((response) => response.blob())
        .then((blob) => {
          const fileName = `audio_${Date.now()}.ogg`;
          const fileRef = ref(storage, fileName);
          uploadBytes(fileRef, blob).then(() => {
            alert("Audio uploaded");
          });
        });
    }
  };

  return (
    <Card sx={{ maxWidth: 300, m: 2 }}>
      <CardContent>
        <Box
          sx={{
            minHeight: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {isRecording ? (
            <Typography color="error">Recording...</Typography>
          ) : audioURL ? (
            <audio controls src={audioURL} />
          ) : (
            <Typography color="text.secondary">
              Click to start recording
            </Typography>
          )}
          <Button
            variant="contained"
            color={isRecording ? "secondary" : "primary"}
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop" : "Start"} Recording
          </Button>
          {audioURL && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CloudUploadIcon />}
              onClick={storeInCloud}
            >
              Store In Cloud
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
