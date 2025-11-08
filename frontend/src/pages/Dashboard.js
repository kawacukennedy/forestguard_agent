import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({ date_from: '', confidence_min: 0, status: '' });
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const fetchIncidents = async () => {
    const token = localStorage.getItem('token');
    const params = {};
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.confidence_min > 0) params.confidence_min = filters.confidence_min;
    if (filters.status) params.status = filters.status;
    const response = await axios.get('http://localhost:8000/api/incidents', {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    setIncidents(response.data);
  };

  useEffect(() => {
    if (map.current) return;
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example'; // Replace with real token
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [0, 0],
      zoom: 2
    });

    map.current.on('load', () => {
      updateMarkers();
    });
  }, []);

  const updateMarkers = () => {
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    incidents.forEach(incident => {
      if (incident.polygon_geojson) {
        const coords = JSON.parse(incident.polygon_geojson);
        if (coords.length > 0) {
          const center = coords[0].coordinates[0]; // Approximate center
          const lng = (center[0][0] + center[1][0] + center[2][0] + center[3][0]) / 4;
          const lat = (center[0][1] + center[1][1] + center[2][1] + center[3][1]) / 4;
          const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Incident ${incident.id}</h3><p>Confidence: ${incident.confidence_score}</p>`))
            .addTo(map.current);
          markers.current.push(marker);
        }
      }
    });
  };

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      updateMarkers();
    }
  }, [incidents]);

  return (
    <div className="h-screen flex">
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Filters</h3>
        <div className="mb-4">
          <label>Date From:</label>
          <input type="date" value={filters.date_from} onChange={(e) => setFilters({...filters, date_from: e.target.value})} className="w-full px-2 py-1 border rounded" />
        </div>
        <div className="mb-4">
          <label>Min Confidence:</label>
          <input type="number" min="0" max="1" step="0.1" value={filters.confidence_min} onChange={(e) => setFilters({...filters, confidence_min: parseFloat(e.target.value)})} className="w-full px-2 py-1 border rounded" />
        </div>
        <div className="mb-4">
          <label>Status:</label>
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-2 py-1 border rounded">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="processed">Processed</option>
          </select>
        </div>
        <button onClick={() => window.location.href = '/upload'} className="w-full bg-blue-600 text-white px-4 py-2 rounded mb-4">Upload Image</button>
        <button onClick={fetchIncidents} className="w-full bg-green-600 text-white px-4 py-2 rounded">Refresh</button>
      </div>
      <div className="w-3/4" ref={mapContainer} style={{ height: '100%' }} />
    </div>
  );
};

export default Dashboard;