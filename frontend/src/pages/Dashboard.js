import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/incidents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(response.data);
    };
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    mapboxgl.accessToken = 'your-mapbox-access-token'; // Replace with real token
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // starting position
      zoom: 9
    });

    // Add markers for incidents
    incidents.forEach(incident => {
      new mapboxgl.Marker()
        .setLngLat([0, 0]) // Placeholder coordinates
        .addTo(map.current);
    });
  }, [incidents]);

  return (
    <div className="h-screen flex">
      <div className="w-1/4 bg-gray-200 p-4">
        <h3>Filters</h3>
        <button onClick={() => window.location.href = '/upload'} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Upload Image</button>
        {/* Filters */}
      </div>
      <div className="w-3/4" ref={mapContainer} style={{ height: '100%' }} />
    </div>
  );
};

export default Dashboard;