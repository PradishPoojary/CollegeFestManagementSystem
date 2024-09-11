// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend, PointElement, LineElement);

const Dashboard = () => {
  const [barData, setBarData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  const [lineData, setLineData] = useState(null);

  useEffect(() => {
    // This simulates fetching data, you can replace it with actual data fetch
    const fetchData = () => {
      setBarData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Registrations',
            data: [30, 50, 40, 60, 70, 90],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });

      setDoughnutData({
        labels: ['Active', 'Inactive', 'Pending'],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
          },
        ],
      });

      setLineData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'User Growth',
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      });
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only on mount

  if (!barData || !doughnutData || !lineData) {
    return <div>Loading...</div>; // Optional: Loading state while data is being set
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-700">Total Users</h2>
        <p className="text-2xl font-semibold text-blue-600">100</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-700">Active Users</h2>
        <p className="text-2xl font-semibold text-green-600">45</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-700">Registrations Today</h2>
        <p className="text-2xl font-semibold text-yellow-600">20</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-700">Pending Approvals</h2>
        <p className="text-2xl font-semibold text-red-600">24</p>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-bold text-gray-700 mb-2">User Registrations Over Time</h2>
          <div className="h-40">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-bold text-gray-700 mb-2">User Status Distribution</h2>
          <div className="h-40">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-bold text-gray-700 mb-2">User Growth</h2>
          <div className="h-40">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
