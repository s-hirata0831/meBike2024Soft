//巡回セールスマン問題の実装
//観光名所にピン表示、かつクリックしたらその場所の説明表示

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './Map.css';

const currentIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/map-pin.png',
  iconSize: [40, 40], // サイズを適宜変更
  iconAnchor: [12, 41], // アイコンのアンカー位置
  popupAnchor: [1, -34], // ポップアップのアンカー位置
  shadowSize: [41, 41], // シャドウのサイズ
});

const searchIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/nolan/64/map-pin.png',
  iconSize: [40, 40], // サイズを適宜変更
  iconAnchor: [12, 41], // アイコンのアンカー位置
  popupAnchor: [1, -34], // ポップアップのアンカー位置
  shadowSize: [41, 41], // シャドウのサイズ
});

const tourIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/officel/16/marker.png',
  iconSize: [40, 40], // サイズを適宜変更
  iconAnchor: [12, 41], // アイコンのアンカー位置
  popupAnchor: [1, -34], // ポップアップのアンカー位置
  shadowSize: [41, 41], // シャドウのサイズ
})

const MarkerPosition = [
  {name: '舞鶴赤レンガパーク', position: new L.LatLng(35.4757, 135.3830),
    description: '舞鶴の歴史を感じることができる赤れんが倉庫群が立ち並ぶエリア。文化イベントや展示会が開催され、多くの観光客で賑わいます。',
    photos: ['slider-5-scaled.jpg', '20211024_173706-scaled-e1636538796965.jpg'],
  },
  {name: '五老スカイタワー', position: new L.LatLng(35.464892077102, 135.34366891233),
    description: '舞鶴湾を一望できる絶景スポットで、高さ約50メートルの展望タワー。360度のパノラマビューが魅力です。',
    photos: ['/goroskytower.jpg', 'unnamed.jpg'],
  },
  {name: '舞鶴港とれとれセンター', position: new L.LatLng(35.450318486205, 135.3145082609),
    description: '新鮮な海産物や地元特産品が揃う市場。舞鶴港で水揚げされた魚介類を楽しむことができます。',
    photos: ['/外観改修２０２２-1024x768.jpg', 'IMG1_20200518140533.jpg'],
  },
  {name: '舞鶴引揚記念館', position: new L.LatLng(35.5095085, 135.3966057),
    description: '戦後の引揚者の歴史を伝える資料館。貴重な展示物や資料を通じて、戦争の悲惨さと平和の大切さを学べます。',
    photos: ['/20220425_095226_ea81898b_w1920.jpg', '780_3919.JPG'],
  },
];

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
      {MarkerPosition.map((spot, index) => (
        <Marker key={index} position={spot.position} icon={tourIcon}>
          <Popup>
            <div className='popup-content'>
              <h3>{spot.name}</h3>
              <p>{spot.description}</p>
              {spot.photos.map((photo, idx) => (
                <img key={idx} src={photo} alt={`${spot.name} photo ${idx + 1}`} />
              ))}
            </div>
          </Popup>
        </Marker>
      ))}
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
  const [mapCenter, setMapCenter] = useState<L.LatLng | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) =>{
      const {latitude, longitude} = position.coords;
      setMapCenter(new L.LatLng(latitude, longitude));
    });
  }, []);

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
      {mapCenter && (
      <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapWithNominatimSearch searchPosition={searchPosition} route={route} />
      </MapContainer>
      )}  
    </div>
  );
};

export default MapComponent;