// pages/dashboard.js
import React from 'react';
import MenuDashboard from '../components/menu_dashboard.js';
import DashboardInterface from '../components/dashboard_interface.js';

const Dashboard = () => {
  return (
    <div>
      <MenuDashboard />
      <DashboardInterface />
    </div>
  );
};

export default Dashboard;
