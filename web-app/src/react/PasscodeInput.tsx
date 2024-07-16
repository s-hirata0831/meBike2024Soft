// src/PasscodeInput.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import './PasscodeInput.css';

const PasscodeInput: React.FC = () => {
  const [passcode, setPasscode] = useState('');

  const handleButtonClick = (num: string) => {
    if (passcode.length < 6) {
      setPasscode(passcode + num);
    }
  };

  const handleClear = () => {
    setPasscode('');
  };

  const handleDelete = () => {
    setPasscode(passcode.slice(0, -1));
  };

  return (
    <Box className="passcode-container">
      <Typography variant="h4" className="passcode-display">
        {passcode.replace(/./g, '●')}
      </Typography>
      <Box className="button-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((item, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => {
              if (item === 'C') {
                handleClear();
              } else if (item === '←') {
                handleDelete();
              } else {
                handleButtonClick(item.toString());
              }
            }}
            className="passcode-button"
          >
            {item}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default PasscodeInput;
