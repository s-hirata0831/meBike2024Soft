import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import db from '../firebase'; // firebase.tsからFirestoreインスタンスをインポート

const UpdateFirestoreDocument: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [error, setError] = useState('');

  // ドキュメントIDと表示名のマッピングリスト
  const documentOptions = [
    { id: 'higashiMaizuruSta', name: '東舞鶴駅' },
    { id: 'nitMaizuruCollege', name: '舞鶴高専' },
  ];

  const handleUpdate = async () => {
    const numericValue = parseFloat(inputText);
    if (isNaN(numericValue) || !Number.isInteger(numericValue)) {
      setError('入力された値は整数ではありません。');
      return;
    }
    setError('');
    try {
      const docRef = doc(db, 'token', selectedDocumentId); // 選択されたドキュメントIDを使用
      await updateDoc(docRef, {
        inputToken: numericValue, // 入力値を数値に変換して保存
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
    <div>
      <select value={selectedDocumentId} onChange={(e) => setSelectedDocumentId(e.target.value)}>
        <option value="">Select a document</option>
        {documentOptions.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
      <br />
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="ワンタイムコードを入力"
      />
      <button onClick={handleUpdate} disabled={!selectedDocumentId || !inputText}>Update Document</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UpdateFirestoreDocument;
