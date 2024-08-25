import React, { useState, useEffect } from "react";
import { Box, Button, Input } from "@mui/material";
import { storage } from "../../firestore";
import { ref, uploadBytes, listAll } from "firebase/storage";

export function AudioFilePage() {
  const [file, setFile] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Fetch the list of files from Firebase Storage
    // listAll(fileListRef).then((res) => {
    // console.log(res);
    // });
  }, []);

  const fileListRef = ref(storage);

  const UploadFile = (files) => {
    if (file == null) {
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
