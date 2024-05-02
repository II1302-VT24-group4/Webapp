import React from 'react';
import mainIcon from '../styles/mainicon.png';

export default function HeaderView(props) {
  return (
    <header className="header custom-header" style={{ height: '5px' }}>
      <h1>
        <span className="part-one-header">Meeting </span>
        <span className="part-two-header">Planner</span>
      </h1>
      <img src={mainIcon} alt="Official Icon" className="header-icon-icon" />
    </header>
  );
}
