// pages/clients.js
import React from 'react';
import MenuClients from '../components/menu_clients.js';
import ClientsInterface from '../components/clients_interface.js';

const Clients = () => {
  return (
    <div>
      <MenuClients />
      <ClientsInterface />
    </div>
  );
};

export default Clients;
