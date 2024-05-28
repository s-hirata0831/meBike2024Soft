// App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import BluetoothComponent from './components/BluetoothComponent';
import Top from './react/Top';
import GoogleMap from './react/GoogleMap';
import NotFound from './react/NotFound';


const App: React.FC = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Top />}/>
          <Route path="/map" element={<GoogleMap />}/>
          <Route path="/*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
      <BluetoothComponent />
    </div>
  );
}

export default App;