import React, { useState, useRef } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [ws, setWs] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmUpload = async () => {
    setShowConfirm(false);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('location', location);
    formData.append('description', description);

    const token = localStorage.getItem('token');
    try {
      setStatus('Uploading...');
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });
      const incidentId = response.data.incident_id;

      setStatus('Processing pipeline...');

      // Connect to WebSocket for progress
      const websocket = new WebSocket('ws://localhost:8000/ws');
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'progress' && data.incident_id === incidentId) {
          if (data.step === 'Vision') setProgress(25);
          else if (data.step === 'Verifier') setProgress(40);
          else if (data.step === 'Geolocation') setProgress(60);
          else if (data.step === 'Packager') setProgress(80);
          else if (data.step === 'Decentralization') setProgress(90);
          setStatus(`${data.step} completed`);
        } else if (data.type === 'incident_update' && data.incident_id === incidentId) {
          setProgress(100);
          setStatus('Complete');
          const txMessage = data.zeta_tx_hashes ? `NFT minted on: ${Object.keys(data.zeta_tx_hashes).join(', ')}` : '';
          setToast({ message: `Upload and processing successful! Earned ${data.reward_points} reward points. ${txMessage}`, type: 'success' });
          websocket.close();
          setTimeout(() => window.location.href = '/dashboard', 1000);
        }
      };

      setWs(websocket);
    } catch (error) {
      setStatus('Failed');
      setToast({ message: 'Upload failed', type: 'error' });
    }
  };

  const openCamera = async () => {
    setCameraOpen(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      const file = new File([blob], 'camera.jpg', { type: 'image/jpeg' });
      setFiles(prev => [...prev, file]);
    });
    setCameraOpen(false);
    video.srcObject.getTracks().forEach(track => track.stop());
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Images</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Images</label>
          <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="mt-1 w-full" />
          <button type="button" onClick={openCamera} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Open Camera</button>
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
      {cameraOpen && (
        <div className="mt-4">
          <video ref={videoRef} autoPlay className="w-full"></video>
          <button onClick={captureImage} className="mt-2 bg-red-600 text-white px-4 py-2 rounded">Capture</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      {progress > 0 && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm mt-2">{status}</p>
        </div>
      )}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Upload">
        <p>Are you sure you want to upload {files.length} image(s)?</p>
        <button onClick={confirmUpload} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded mr-2">Yes</button>
        <button onClick={() => setShowConfirm(false)} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">No</button>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Upload;