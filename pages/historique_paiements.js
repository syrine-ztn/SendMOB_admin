// pages/historique_paiements.js
import React from 'react';
import MenuClients from '../components/menu_clients.js';
import HistoriquePaiementsInterface from '../components/historique_paiements_interface.js';

const HistoriquePaiements = () => {
  return (
    <div>
      <MenuClients />
      <HistoriquePaiementsInterface />
    </div>
  );
};

export default HistoriquePaiements;
