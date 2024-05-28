import React from 'react'
import { useNavigate } from 'react-router-dom'

const GoogleMap = () => {
  const navigate = useNavigate();

  return (
    <div>      
      <h1>Map</h1>
      <button onClick={() => navigate(-1)}>戻る</button>
      </div>
    
  )
}

export default GoogleMap
