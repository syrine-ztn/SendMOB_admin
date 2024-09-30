// pages/modifier_adresse.js
import React from 'react';
import MenuClients from '../components/menu_clients.js';
import ModifierAdresseInterface from '../components/modifier_adresse_interface.js';

const ModifierAdresse = () => {
  return (
    <div>
      <MenuClients />
      <ModifierAdresseInterface />
    </div>
  );
};

export default ModifierAdresse;
