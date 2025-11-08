import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('location', location);
    formData.append('description', description);

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert('Upload successful');
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Upload Images</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="mt-4" />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="mt-4 w-full px-3 py-2 border rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="mt-4 w-full px-3 py-2 border rounded"></textarea>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>
    </div>
  );
};

export default Upload;