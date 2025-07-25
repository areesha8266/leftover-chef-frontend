import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // keep this if your styles are in App.css

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="back-btn-fixed" onClick={() => navigate(-1)}>
      ← Back
    </button>
  );
};

export default BackButton;
