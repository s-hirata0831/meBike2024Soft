import React from 'react';
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
  return (
    <Box className="container">
      <img src={logo} alt="ME-Bike Logo" className="logo" />

      <Card className="card">
        <CardContent className="card-content">
          <BluetoothComponent />
        </CardContent>
      </Card>

      <Card className="card">
        <CardContent className="card-content">
          <UpdateFirestoreDocument />
        </CardContent>
      </Card>

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

      <Box className="button-container">
        <Card className="button-card">
          <CardContent className="button-content">
            <CustomButton
              variant="contained"
              color="primary"
              icon={<LockIcon />}
              text="施錠"
              to="/map"
            />
          </CardContent>
        </Card>
        <Card className="button-card">
          <CardContent className="button-content">
            <CustomButton
              variant="contained"
              color="primary"
              icon={<LockOpenIcon />}
              text="開錠"
              to="/map"
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Top;
