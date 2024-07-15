import React from 'react';
import { useNavigate } from 'react-router-dom';

const Map: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>      
      <h1>Map</h1>
      <button onClick={() => navigate('/')}>トップページに戻る</button>
    </div>
  );
};

export default Map;

