import React, { useState } from 'react';
import BluetoothComponent from './BluetoothComponent';
import UpdateFirestoreDocument from './UpdateFirestoreDocument';
import CustomButton from './CustomButton';
import { Box, Card, CardContent } from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import logo from '../images/logo.png';
import './Top.css';

const Top: React.FC = () => {
  const [locked, setLocked] = useState(true); // 初期値をtrueに設定して施錠中とします

  const toggleLock = () => {
    setLocked(!locked);
  };

  return (
    <Box className="container">
      <img src={logo} alt="ME-Bike Logo" className="logo" />

      <Box className="split-container">
        <Card className="card">
          <CardContent className="card-content">
            <BluetoothComponent />
          </CardContent>
        </Card>
      </Box>
      <Box className="split-container">
        <Card className="card">
          <CardContent className="card-content">
          <CustomButton
            variant="contained"
            color="primary"
            icon={<NavigationIcon />}
            text="ナビゲーション"
            to="/map"
          />
        </CardContent>
        </Card>
      </Box>
      
      <Box className="split-container">
        <Card className="card half-width">
          <CardContent className="card-content">
            <UpdateFirestoreDocument /> {/* ワンタイムコードの代わりとして配置 */}
          </CardContent>
        </Card>

        <Card className="card half-width">
          <CardContent className="card-content">
            <CustomButton
              variant="contained"
              color={locked ? "error" : "info"} // 施錠中の場合はerror色（赤に近い色）、解錠中の場合はinfo色（青に近い色）
              icon={locked ? <LockIcon /> : <LockOpenIcon />} // 状態に応じてアイコンを変更
              text={locked ? "施錠中" : "解錠中"} // 状態に応じてテキストを変更
              onClick={toggleLock}
              fullWidth
            />
          </CardContent>
        </Card>
        
      </Box>

      

      
    </Box>
  );
};

export default Top;
