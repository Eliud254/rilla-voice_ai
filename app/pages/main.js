"use client";
import React, { useState } from "react";
import styles from "./main.module.css";

export default function Main() {
  const [transcript, setTranscript] = useState("Insert Text to use.");
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [newComment, setNewComment] = useState("");
  const [file, setFile] = useState(null);

  const handleSelection = () => {
    const selection = window.getSelection();
    setSelectedText(selection.toString());
  };

  const addComment = () => {
    if (selectedText && newComment) {
      setComments([
        ...comments,
        { text: selectedText, comment: newComment, file },
      ]);
      setNewComment("");
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

  return (
    <main className={styles.main}>
      <h1>Rimol Voice AI</h1>

      <div className={styles.transcriptContainer} onMouseUp={handleSelection}>
        {transcript}
      </div>

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
            <p>
              <strong>Selected text:</strong> {comment.text}
            </p>
            <p>
              <strong>Comment:</strong> {comment.comment}
            </p>
            {comment.file && (
              <p>
                <strong>Attached file:</strong> {comment.file.name}
              </p>
            )}
            <button onClick={() => deleteComment(index)}>Delete</button>
          </div>
        ))}
      </div>
    </main>
  );
}
