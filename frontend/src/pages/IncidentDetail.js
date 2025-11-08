import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

const IncidentDetail = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [allIncidents, setAllIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const [incidentRes, allRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/incidents/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/incidents', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setIncident(incidentRes.data);
      setAllIncidents(allRes.data);
      // Mock users, in real app fetch from API
      setUsers([{ id: 1, name: 'Ranger User' }, { id: 2, name: 'NGO User' }]);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (incident && !map.current) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [0, 0],
        zoom: 10
      });

      if (incident.incident.polygon_geojson) {
        const coords = JSON.parse(incident.incident.polygon_geojson);
        if (coords.length > 0) {
          const polyCoords = coords[0].coordinates[0];
          map.current.on('load', () => {
            map.current.addSource('polygon', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [polyCoords]
                }
              }
            });
            map.current.addLayer({
              id: 'polygon',
              type: 'fill',
              source: 'polygon',
              paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 0.5
              }
            });
            // Fit to polygon
            const bounds = new mapboxgl.LngLatBounds();
            polyCoords.forEach(coord => bounds.extend(coord));
            map.current.fitBounds(bounds, { padding: 20 });
          });
        }
      }
    }
  }, [incident]);

  if (!incident) return <div>Loading...</div>;

  const currentIndex = allIncidents.findIndex(inc => inc.id === id);
  const prevId = currentIndex > 0 ? allIncidents[currentIndex - 1].id : null;
  const nextId = currentIndex < allIncidents.length - 1 ? allIncidents[currentIndex + 1].id : null;

  const assignIncident = async (userId) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:8000/api/incidents/${id}/assign`, { user_id: parseInt(userId) }, { headers: { Authorization: `Bearer ${token}` } });
    // Refresh
    window.location.reload();
  };

  const addComment = async () => {
    const commentText = document.getElementById('commentText').value;
    if (!commentText) return;
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:8000/api/incidents/${id}/comments`, { comment_text: commentText, user_id: 1 }, { headers: { Authorization: `Bearer ${token}` } });
    document.getElementById('commentText').value = '';
    // Refresh
    window.location.reload();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => prevId && window.location.href = `/incident/${prevId}`} disabled={!prevId} className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50">Previous</button>
        <h1 className="text-2xl font-bold">Incident {id}</h1>
        <button onClick={() => nextId && window.location.href = `/incident/${nextId}`} disabled={!nextId} className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50">Next</button>
      </div>
      <p>Status: {incident.incident.status}</p>
      <p>Carbon Estimate: {incident.incident.carbon_estimate} kg CO2</p>
      <p>Confidence: {incident.incident.confidence_score}</p>
      {incident.incident.somnia_tx_hash && <p>Somnia TX Hash: {incident.incident.somnia_tx_hash}</p>}
      {incident.incident.nft_id && <p>NFT ID: {incident.incident.nft_id}</p>}
      <p>Assigned to: {users.find(u => u.id === incident.incident.assigned_to)?.name || 'Unassigned'}</p>
      <select onChange={(e) => assignIncident(e.target.value)}>
        <option value="">Assign to...</option>
        {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
      </select>
      <div className="mb-4" ref={mapContainer} style={{ height: '400px' }} />
      <div>
        <h3>Images</h3>
        {incident.images.map(img => <img key={img.id} src={img.url.startsWith('http') ? img.url : `http://localhost:8000/${img.url}`} alt="Incident" className="w-32 h-32 inline-block mr-2" />)}
      </div>
      <div>
        <h3>Agent Transcripts</h3>
        <div className="max-h-60 overflow-y-scroll">
          {incident.transcripts.map(trans => <p key={trans.id}><strong>{trans.agent_name}:</strong> {trans.transcript_text}</p>)}
        </div>
      </div>
      <div>
        <h3>Comments</h3>
        <div className="max-h-60 overflow-y-scroll">
          {incident.comments.map(comment => <p key={comment.id}><strong>{users.find(u => u.id === comment.user_id)?.name}:</strong> {comment.comment_text}</p>)}
        </div>
        <textarea id="commentText" placeholder="Add a comment..." className="w-full px-3 py-2 border rounded mt-2"></textarea>
        <button onClick={addComment} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Add Comment</button>
      </div>
      <button onClick={() => window.open(`http://localhost:8000/api/incidents/${id}/download`)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Download Report</button>
      {incident.incident.nft_id && (
        <button onClick={() => alert('Reward claimed! (Mock action)')} className="mt-4 ml-4 bg-green-600 text-white px-4 py-2 rounded">Claim Reward</button>
      )}
    </div>
  );
};

export default IncidentDetail;