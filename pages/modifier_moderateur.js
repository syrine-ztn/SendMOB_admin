// pages/modifier_moderateur.js
import React from 'react';
import MenuModerateurs from '../components/menu_moderateurs.js';
import ModifierModerateurInterface from '../components/modifierModerateur_interface.js';

const ModifierModerateur = () => {
  return (
    <div>
      <MenuModerateurs />
      <ModifierModerateurInterface />
    </div>
  );
};

export default ModifierModerateur;
