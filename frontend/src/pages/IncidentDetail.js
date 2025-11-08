import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

const IncidentDetail = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const fetchIncident = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/incidents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncident(response.data);
    };
    fetchIncident();
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Incident {id}</h1>
      <p>Status: {incident.incident.status}</p>
      <p>Carbon Estimate: {incident.incident.carbon_estimate} kg CO2</p>
      <p>Confidence: {incident.incident.confidence_score}</p>
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
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Download Report</button>
    </div>
  );
};

export default IncidentDetail;