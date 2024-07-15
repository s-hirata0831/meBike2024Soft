import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Top from './react/Top';
import GoogleMap from './react/Map';
import NotFound from './react/NotFound';

const App: React.FC = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/map" element={<GoogleMap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
