// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import './App.css';
import db from "./firebase"

import BluetoothComponent from './components/BluetoothComponent';
import Top from './react/Top';
import GoogleMap from './react/GoogleMap';
import NotFound from './react/NotFound';

interface Post {
  [key: string]: any;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // データベースからデータを取得
    const postData = collection(db, "posts");
    
    getDocs(postData).then((snapShot) => {
      //console.log(snapShot.docs.map((doc) => ({ ...doc.data() })));
      setPosts(snapShot.docs.map((doc) => ({ ...doc.data() })));
    });

    }, []);

  return (
    <div className='App'>
      {posts.map((post) => (
        <div>
          <div key={post.id}>
          <h1>{post.id}</h1>
          </div>
        </div>
        
      ))}
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