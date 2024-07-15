import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const URLShorten = () => {
  const [url, setUrl] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: url })
    });
    const data = await response.json();
    alert(`Short URL: ${data.shortUrl}`); // Display the short URL to the user
  };

  const handleTestApi = () => {
    fetch('/api/test')
      .then((response) => response.json())
      .then((data) => alert(`API Test Response: ${data.message}`))
      .catch((error) => alert(`API Test Error: ${error.message}`));
  };

  return (
    <div>
      <TextField label="Enter URL" variant="outlined" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth />
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Shorten URL
      </Button>
      <Button onClick={handleTestApi} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
        Test API
      </Button>
    </div>
  );
};

export default URLShorten;
