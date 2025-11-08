import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const IncidentDetail = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);

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

  if (!incident) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Incident {id}</h1>
      <p>Carbon Estimate: {incident.incident.carbon_estimate}</p>
      <p>Confidence: {incident.incident.confidence_score}</p>
      <div>
        <h3>Images</h3>
        {incident.images.map(img => <img key={img.id} src={`http://localhost:8000/${img.url}`} alt="Incident" className="w-32 h-32" />)}
      </div>
      <div>
        <h3>Agent Transcripts</h3>
        {incident.transcripts.map(trans => <p key={trans.id}>{trans.agent_name}: {trans.transcript_text}</p>)}
      </div>
    </div>
  );
};

export default IncidentDetail;