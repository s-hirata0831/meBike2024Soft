// src/react/CustomButton.tsx
import React from 'react';
import { Button, ButtonProps, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface CustomButtonProps extends ButtonProps {
  icon: React.ReactElement;
  text: string;
  to?: string; // 追加: to プロパティ
}

const CustomButton: React.FC<CustomButtonProps> = ({ icon, text, to, ...props }) => {
  return (
    <Button
      {...props}
      component={to ? Link : 'button'}
      to={to}
      style={{ 
        flexDirection: 'column', 
        padding: '16px', 
        width: '100%', 
        maxWidth: '150px' 
      }}
    >
      {React.cloneElement(icon, { fontSize: 'large', style: { fontSize: 48 } })}
      <Typography variant="h6" style={{ marginTop: 8 }}>
        {text}
      </Typography>
    </Button>
  );
};

export default CustomButton;
