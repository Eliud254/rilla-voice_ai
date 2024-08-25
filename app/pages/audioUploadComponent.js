import React, { useState, useEffect } from "react";
import { Box, Button, Input } from "@mui/material";
import { storage } from "../../firestore";
import { ref, uploadBytes, listAll } from "firebase/storage";

export function AudioUploadComponent() {
  const [file, setFile] = useState([]); // stores audio file to be uploaded
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Fetch the list of files from Firebase Storage
    // listAll(fileListRef).then((res) => {
    // console.log(res);
    // });
  }, []);

  const fileListRef = ref(storage);

  // checks if the file is an audio file
  const isAudioFile = (file) => {
    const acceptedAudioTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp3",
      "video/mpeg",
      "video/wav",
      "video/ogg",
      "video/mp3",
    ];
    return file && acceptedAudioTypes.includes(file.type);
  };

  // uploads the audio file to Firebase Storage
  const UploadFile = (files) => {
    if (file == null) {
      alert("Error: Please select a file");
      return;
    }
    if (!isAudioFile(file)) {
      alert("Error: Please upload an audio file");
      return;
    }
    const fileRef = ref(storage, `/${file.name}`);
    uploadBytes(fileRef, file).then(() => {
      alert("Audio uploaded");
    });
  };

  return (
    <Box height={"200px"} width={"200px"}>
      <Input
        variant="outlined"
        type="file"
        onChange={(event) => {
          setFile(event.target.files[0]);
        }}
      ></Input>
      <Button variant={"outlined"} onClick={UploadFile}>
        Upload File
      </Button>
    </Box>
  );
}
