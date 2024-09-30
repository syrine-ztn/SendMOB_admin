// pages/creer_moderateur.js
import React from 'react';
import MenuModerateurs from '../components/menu_moderateurs.js';
import CreerModerateurInterface from '../components/creerModerateur_interface.js';

const CreerModerateur = () => {
  return (
    <div>
      <MenuModerateurs />
      <CreerModerateurInterface />
    </div>
  );
};

export default CreerModerateur;
