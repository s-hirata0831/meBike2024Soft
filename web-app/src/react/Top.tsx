import React from 'react';
import { Link } from 'react-router-dom';

const Top = () => {
  return <div>
    <ul>
      <Link to="/">
        <li>トップ</li>
      </Link>
      <Link to="/map">
        <li>マップ</li>
      </Link>
    </ul>
  </div>
}

export default Top;
