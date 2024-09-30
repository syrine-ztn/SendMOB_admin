// pages/creer_client.js
import React from 'react';
import MenuClients from '../components/menu_clients.js';
import ModifierClientInterface from '../components/modifierClient_interface.js';

const ModifierClient = () => {
  return (
    <div>
      <MenuClients />
      <ModifierClientInterface />
    </div>
  );
};

export default ModifierClient;
