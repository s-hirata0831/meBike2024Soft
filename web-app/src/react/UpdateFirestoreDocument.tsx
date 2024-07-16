import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import db from '../firebase';
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';

const UpdateFirestoreDocument: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [error, setError] = useState('');

  const documentOptions = [
    { id: 'higashiMaizuruSta', name: '東舞鶴駅' },
    { id: 'nitMaizuruCollege', name: '舞鶴高専' },
  ];

  const handleUpdate = async () => {
    const numericValue = parseFloat(inputText);
    if (isNaN(numericValue) || !Number.isInteger(numericValue)) {
      setError('入力された値は数字ではありません。');
      return;
    }
    setError('');
    try {
      const docRef = doc(db, 'token', selectedDocumentId);
      await updateDoc(docRef, {
        inputToken: numericValue,
        timestamp: serverTimestamp()
      });
      console.log('Document updated successfully');
      setInputText('');
      setSelectedDocumentId('');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Select
        value={selectedDocumentId}
        onChange={(e) => setSelectedDocumentId(e.target.value)}
        displayEmpty
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="">
          <em>場所を選択</em>
        </MenuItem>
        {documentOptions.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>

      <TextField
        type="password"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="ワンタイムコードを入力"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        disabled={!selectedDocumentId || !inputText}
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        送信
      </Button>

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default UpdateFirestoreDocument;
