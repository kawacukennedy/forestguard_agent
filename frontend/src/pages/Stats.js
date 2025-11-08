import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/incidents/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    };
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/incidents/leaderboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboard(response.data);
    };
    fetchStats();
    fetchLeaderboard();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Statistics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-100 dark:bg-green-800 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Incidents</h3>
          <p className="text-2xl">{stats.total_incidents}</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Carbon Impact (kg CO2)</h3>
          <p className="text-2xl">{stats.total_carbon_impact.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded">
          <h3 className="text-lg font-semibold">Incidents by Status</h3>
          <ul>
            {Object.entries(stats.incidents_by_status).map(([status, count]) => (
              <li key={status}>{status}: {count}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-100 dark:bg-red-800 p-4 rounded">
          <h3 className="text-lg font-semibold">Incidents Over Time</h3>
          <ul className="max-h-32 overflow-y-scroll">
            {stats.incidents_over_time.map((item, index) => (
              <li key={index}>{item.date}: {item.count}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <ul>
            {leaderboard.map((user, index) => (
              <li key={index} className="flex justify-between py-2">
                <span>{index + 1}. {user.name} ({user.role})</span>
                <span>{user.reward_points} points</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Stats;