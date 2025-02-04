// Import necessary libraries
import React, { useState } from 'react';
// import './ImageUpload.css';

function ImageUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleNext = () => {
    if (uploadedFiles.length > 0) {
      const formData = new FormData();
      uploadedFiles.forEach((file, index) => {
        formData.append(`file${index + 1}`, file);
      });

      fetch('https://api.example.com/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Files uploaded successfully:', data);
        })
        .catch((error) => {
          console.error('Error uploading files:', error);
        });
    }
  };

  return (
    <div className="upload-container">
      <div 
        className={`drag-drop-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedFiles.length === 0 ? (
          <>
            <div className="upload-icon">📂</div>
            <p className="drag-drop-text">Drag and drop images here</p>
            <div className="separator">Or</div>
            <label className="file-select-button">
              Select files
              <input type="file" onChange={handleFileChange} accept=".jpg,.png,.svg" multiple />
            </label>
          </>
        ) : (
          <div className="file-list">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="file-info">
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(1)}kb</span>
                </div>
                <button className="remove-file" onClick={() => handleRemoveFile(index)}>❌</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="next-button" disabled={uploadedFiles.length === 0} onClick={handleNext}>Next</button>
    </div>
  );
}

export default ImageUpload;
