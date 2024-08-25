'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import axios from 'axios';
import { Button, CircularProgress, Typography, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [newComment, setNewComment] = useState('');
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [aiResponse, setAiResponse] = useState('');

  const handleSelection = () => {
    const selection = window.getSelection();
    setSelectedText(selection.toString());
  };

  const addComment = () => {
    if (selectedText && newComment) {
      setComments([...comments, { text: selectedText, comment: newComment, file }]);
      setNewComment('');
      setFile(null);
    }
  };

  const deleteComment = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      setRecording(true);
      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 5000); // Record for 5 seconds
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleAudioUpload = async () => {
    if (!audioUrl) return;

    try {
      setRecording(true);
      const response = await axios.post('/api/transcribe', { audioUrl });
      setTranscript(response.data.transcript);
      const aiResponse = await getAiResponse(response.data.transcript);
      setAiResponse(aiResponse);
    } catch (error) {
      console.error('Error processing audio:', error);
      setAiResponse('Error processing audio');
    } finally {
      setRecording(false);
    }
  };

  const getAiResponse = async (text) => {
    try {
      const response = await axios.post('/api/ai', { text });
      return response.data.message;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return 'Error getting AI response';
    }
  };

  return (
    <main className={styles.main}>
      <Typography variant="h4" gutterBottom>Transcript Commenting & Editing System</Typography>
      
      <div className={styles.transcriptContainer} onMouseUp={handleSelection}>
        <TextField
          multiline
          fullWidth
          variant="outlined"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Insert Text to use or transcribe audio"
        />
      </div>

      <div className={styles.audioRecording}>
<<<<<<< HEAD
        <button 
          className={`${styles.button} ${recording ? styles.buttonRecording : ''}`} 
          onClick={startRecording} 
          disabled={recording}
        >
          Start Recording
        </button>
        <button 
          className={styles.button}
          onClick={stopRecording} 
          disabled={!recording}
        >
=======
        <Button onClick={startRecording} disabled={recording}>
          Start Recording
        </Button>
        <Button onClick={stopRecording} disabled={!recording}>
>>>>>>> b25330b94df320272bf96df0c2667d4a27397cdf
          Stop Recording
        </Button>
        {audioUrl && <audio src={audioUrl} controls />}
      </div>

      <Button onClick={handleAudioUpload}>Upload and Transcribe</Button>

      <div className={styles.commentForm}>
<<<<<<< HEAD
        <textarea
          className={styles.commentTextarea}
=======
        <TextField
          multiline
          fullWidth
          variant="outlined"
>>>>>>> b25330b94df320272bf96df0c2667d4a27397cdf
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
<<<<<<< HEAD
        <label className={styles.fileInput}>
          Choose File
          <input type="file" onChange={handleFileChange} />
        </label>
        <button className={styles.addCommentButton} onClick={addComment}>Add Comment</button>
=======
        <input
          accept="image/*,audio/*,video/*,application/pdf"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" startIcon={<AttachFileIcon />}>
            Attach File
          </Button>
        </label>
        {file && <Typography variant="body2">{file.name}</Typography>}
        <Button variant="contained" onClick={addComment} disabled={!selectedText || !newComment}>
          Add Comment
        </Button>
>>>>>>> b25330b94df320272bf96df0c2667d4a27397cdf
      </div>

      <div className={styles.commentsContainer}>
        <Typography variant="h6">Comments:</Typography>
        {comments.map((comment, index) => (
          <div key={index} className={styles.comment}>
            <Typography variant="subtitle1">Selected text: {comment.text}</Typography>
            <Typography variant="body1">Comment: {comment.comment}</Typography>
            {comment.file && <Typography variant="body2">Attached file: {comment.file.name}</Typography>}
            <IconButton onClick={() => deleteComment(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>

      {aiResponse && (
        <div className={styles.aiResponse}>
          <Typography variant="h6">AI Response:</Typography>
          <Typography variant="body1">{aiResponse}</Typography>
        </div>
      )}
    </main>
  );
}