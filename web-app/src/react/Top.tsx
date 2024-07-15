import React from 'react';
import { Link } from 'react-router-dom';
import BluetoothComponent from './BluetoothComponent';
import UpdateFirestoreDocument from './UpdateFirestoreDocument';

const Top: React.FC = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">トップ</Link>
        </li>
        <li>
          <Link to="/map">マップ</Link>
        </li>
      </ul>
      <BluetoothComponent />
      <UpdateFirestoreDocument />
    </div>
  );
}

export default Top;
