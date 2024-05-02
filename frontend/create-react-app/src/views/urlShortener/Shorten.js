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

  return (
    <div>
      <TextField label="Enter URL" variant="outlined" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth />
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Shorten URL
      </Button>
    </div>
  );
};

export default URLShorten;
