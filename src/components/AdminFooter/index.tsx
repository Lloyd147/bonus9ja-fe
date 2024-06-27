import React, { useState } from 'react';
import ToggleSwitch from '../ToggleSwitch';

const AdminFooter = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="wrapper">
      <div className="button-row">
        <h1>Footers</h1>
      </div>
      <div className="footer-options">
        <div className="options__header footer-row">
          <div className="header__option footer-cell">On/Off</div>
          <div className="header__option footer-cell">Page</div>
          <div className="header__option footer-cell">Actions</div>
        </div>
        <div className="options__body footer-row">
          <div className="body__option footer-cell">
            <ToggleSwitch />
          </div>
          <div className="body__option footer-cell">All footers</div>
          <div className="body__option footer-cell">
            <img className="edit-icon" src="/images/edit.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFooter;
