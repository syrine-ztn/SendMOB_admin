// pages/ajouter_adresse.js
import React from 'react';
import MenuClients from '../components/menu_clients.js';
import AjouterAdresseInterface from '../components/ajouter_adresse_interface.js';

const AjouterAdresse = () => {
  return (
    <div>
      <MenuClients />
      <AjouterAdresseInterface />
    </div>
  );
};

export default AjouterAdresse;
