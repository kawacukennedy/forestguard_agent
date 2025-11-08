import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('location', location);
    formData.append('description', description);

    const token = localStorage.getItem('token');
    try {
      setStatus('Uploading...');
      await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });
      setStatus('Processing pipeline...');
      // Simulate pipeline progress
      setTimeout(() => setProgress(25), 1000);
      setTimeout(() => setProgress(50), 2000);
      setTimeout(() => setProgress(75), 3000);
      setTimeout(() => {
        setProgress(100);
        setStatus('Complete');
        alert('Upload and processing successful');
        window.location.href = '/dashboard';
      }, 4000);
    } catch (error) {
      setStatus('Failed');
      alert('Upload failed');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Images</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Images</label>
          <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="mt-1 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" rows="3"></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>
      {progress > 0 && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm mt-2">{status}</p>
        </div>
      )}
    </div>
  );
};

export default Upload;