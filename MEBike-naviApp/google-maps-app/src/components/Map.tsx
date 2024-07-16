import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './Map.css';

const currentIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/map-pin.png',
  iconSize: [25, 25], // サイズを適宜変更
  iconAnchor: [12, 41], // アイコンのアンカー位置
  popupAnchor: [1, -34], // ポップアップのアンカー位置
  shadowSize: [41, 41], // シャドウのサイズ
});

const searchIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/nolan/64/map-pin.png',
  iconSize: [25, 25], // サイズを適宜変更
  iconAnchor: [12, 41], // アイコンのアンカー位置
  popupAnchor: [1, -34], // ポップアップのアンカー位置
  shadowSize: [41, 41], // シャドウのサイズ
});

const MapWithNominatimSearch: React.FC<{ searchPosition: L.LatLng | null, route: L.LatLng[] }> = ({ searchPosition, route }) => {
  const [currentPosition, setCurrentPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition(new L.LatLng(latitude, longitude));
    });
  }, []);

  return (
    <>
      {currentPosition && <Marker position={currentPosition} icon={currentIcon} />}
      {searchPosition && <Marker position={searchPosition} icon={searchIcon} />}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </>
  );
};

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
        placeholder="Enter a location"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

const MapComponent: React.FC = () => {
  const [searchPosition, setSearchPosition] = useState<L.LatLng | null>(null);
  const [route, setRoute] = useState<L.LatLng[]>([]);

  const handleSearch = (position: L.LatLng) => {
    setSearchPosition(position);
    getRoute(position);
  };

  const getRoute = async (destination: L.LatLng) => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const origin = new L.LatLng(latitude, longitude);

      const url = `http://router.project-osrm.org/route/v1/driving/${longitude},${latitude};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
      try {
        const response = await axios.get(url);
        const coordinates = response.data.routes[0].geometry.coordinates;
        const route = coordinates.map((coord: [number, number]) => new L.LatLng(coord[1], coord[0]));
        setRoute(route);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    });
  };

  return (
    <div className="map-container">
      <SearchBox onSearch={handleSearch} />
      <MapContainer center={[0, 0]} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapWithNominatimSearch searchPosition={searchPosition} route={route} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;