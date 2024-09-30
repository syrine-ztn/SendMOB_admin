// pages/index.js

import React from 'react';
import Component1 from '../components/landing_component1.js';
import SignIn from '../components/SignIn.js';

const LandingPage = () => {
  return (
    <div>
      <Component1 />
      <SignIn />
    </div>
    
  );
};

export default LandingPage;
