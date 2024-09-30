// pages/creer_moderateur.js
import React from 'react';
import MenuClients from '../components/menu_clients.js';
import CreerClientInterface from '../components/creerClient_interface.js';

const CreerClient = () => {
  return (
    <div>
      <MenuClients />
      <CreerClientInterface />
    </div>
  );
};

export default CreerClient;
