import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import BluetoothComponent from './components/BluetoothComponent';
import Top from './react/Top';
import GoogleMap from './react/GoogleMap';
import NotFound from './react/NotFound';
import useFetchPosts from './react/useFetchPosts';

const App: React.FC = () => {
  const posts = useFetchPosts();

  return (
    <div className='App'>
      <BrowserRouter>
        {posts.map((post, index) => (
        <div key={index}>
          <h1>{post.id}</h1>
          
        </div>
        ))}
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/map" element={<GoogleMap />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        
      </BrowserRouter>
      <BluetoothComponent />
    </div>
  );
};

export default App;
