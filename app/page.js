'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import axios from 'axios';
import { Button, CircularProgress, Typography } from '@mui/material';

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

  const startRecording = () => {
    setRecording(true);
    const mediaRecorder = new MediaRecorder(window.stream);
    mediaRecorder.ondataavailable = function(e) {
      const url = URL.createObjectURL(e.data);
      setAudioUrl(url);
    };
    mediaRecorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const handleAudioUpload = async () => {
    try {
      setRecording(true);
      const response = await getAiResponse();
      setAiResponse(response);
    } catch (error) {
      console.error('Error processing audio:', error);
      setAiResponse('Error processing audio');
    } finally {
      setRecording(false);
    }
  
    // Upload audio to your server or a third-party service and transcribe it
    // For example, use an API like OpenAI Whisper for transcription

    const transcriptedText = "Transcribed text here..."; // Replace this with actual transcribed text
    setTranscript(transcriptedText);

    // Get AI response
    const response = await getAiResponse(transcriptedText);
    setAiResponse(response);
  };

  const getAiResponse = async () => {
    // Replace with your AI API call
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
  
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
  
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
  
          try {
            const response = await axios.post('/api/ai', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            resolve(response.data.message);
          } catch (error) {
            console.error('Error sending audio to AI:', error);
            reject('Error processing audio');
          } finally {
            stream.getTracks().forEach(track => track.stop());
          }
        };
  
        mediaRecorder.start();
  
        // Record for 5 seconds (adjust as needed)
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000);
  
      } catch (error) {
        console.error('Error accessing microphone:', error);
        reject('Error accessing microphone');
      }
    });

    /*const response = await axios.post('/api/ai', { text });
    return response.data.message;*/
c  };

  useEffect(() => {
    // Ensure media devices are ready
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      window.stream = stream;
    });
  }, []);

  return (
    <main className={styles.main}>
      <h1>Transcript Commenting & Editing System</h1>
      
      <div className={styles.transcriptContainer} onMouseUp={handleSelection}>
        {transcript || "Insert Text to use."}
      </div>

      <div className={styles.audioRecording}>
        <Button onClick={startRecording} disabled={recording}>
          Start Recording
        </Button>
        <Button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </Button>
        {audioUrl && <audio src={audioUrl} controls />}
      </div>

      <Button onClick={handleAudioUpload}>Upload and Transcribe</Button>

      <div className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={addComment}>Add Comment</button>
      </div>

      <div className={styles.commentsContainer}>
        <h2>Comments:</h2>
        {comments.map((comment, index) => (
          <div key={index} className={styles.comment}>
            <p><strong>Selected text:</strong> {comment.text}</p>
            <p><strong>Comment:</strong> {comment.comment}</p>
            {comment.file && <p><strong>Attached file:</strong> {comment.file.name}</p>}
            <button onClick={() => deleteComment(index)}>Delete</button>
          </div>
        ))}
      </div>

      {aiResponse && (
        <div className={styles.aiResponse}>
          <Typography variant="h6">AI Response:</Typography>
          <p>{aiResponse}</p>
        </div>
      )}
    </main>
  );
}
