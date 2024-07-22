import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Button } from '@mui/material'; // MUIからButtonをインポート
import './Map.css';
import { Link } from 'react-router-dom'; // react-router-domからLinkをインポート

// アイコンの定義
const currentIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/map-pin.png',
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const searchIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/nolan/64/map-pin.png',
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 検索ボックスのコンポーネント
const SearchBox: React.FC<{ onSearch: (position: L.LatLng) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
    try {
      const response = await axios.get(url);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const position = new L.LatLng(lat, lon);
        onSearch(position);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="場所を入力"
      />
      <Button variant="contained" onClick={handleSearch}>検索</Button>
    </div>
  );
};

// マップコンポーネント
const MapComponent: React.FC = () => {
  const [searchPosition, setSearchPosition] = useState<L.LatLng | null>(null);
  const [route, setRoute] = useState<L.LatLng[]>([]);
  const [currentPosition, setCurrentPosition] = useState<L.LatLng | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true); // ローディング状態の追加

  useEffect(() => {
    // 初回レンダリング時に位置情報を取得
    requestLocation();
  }, []);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition(new L.LatLng(latitude, longitude));
        setShowMap(true); // マップを表示する
        setLoading(false); // ローディング終了
      },
      (error) => {
        console.error('Failed to get current position:', error);
        setLoading(false); // ローディング終了
      }
    );
  };

  const handleSearch = async (position: L.LatLng) => {
    setSearchPosition(position);
    getRoute(position);
  };

  const getRoute = async (destination: L.LatLng) => {
    if (!currentPosition) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${currentPosition.lng},${currentPosition.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    try {
      const response = await axios.get(url);
      const coordinates = response.data.routes[0].geometry.coordinates;
      const route = coordinates.map((coord: [number, number]) => new L.LatLng(coord[1], coord[0]));
      setRoute(route);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  if (loading) {
    return (
      <div className="map-container">
        <p>位置情報を取得しています...</p>
      </div>
    );
  }

  if (!showMap) {
    return (
      <div className="map-container">
        <p>位置情報の使用を許可してください。</p>
        <Button variant="contained" onClick={requestLocation}>位置情報を許可する</Button>
      </div>
    );
  }

  return (
    <>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000 }}
        >
          戻る
        </Button>
      </Link>
      <div className="map-container">
        <SearchBox onSearch={handleSearch} />
        {currentPosition && (
          <MapContainer center={[currentPosition.lat, currentPosition.lng]} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {searchPosition && <Marker position={[searchPosition.lat, searchPosition.lng]} icon={searchIcon} />}
            {route.length > 0 && <Polyline positions={route} color="blue" />}
            <Marker position={[currentPosition.lat, currentPosition.lng]} icon={currentIcon} />
          </MapContainer>
        )}
      </div>
    </>
  );
};

export default MapComponent;
