import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const URLView = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchURLs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/urls');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data)) {
          // Ensure each item has a valid URL
          const validData = data.filter((item) => item.originalUrl && item.originalUrl.startsWith('http'));
          setUrls(
            validData.map((item, index) => ({
              id: index,
              originalUrl: item.originalUrl,
              shortUrl: item.shortUrl,
              clicks: item.clicks
            }))
          );
        } else {
          throw new Error('No valid data returned from server');
        }
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchURLs();
  }, []);

  const columns = [
    { field: 'originalUrl', headerName: 'Original URL', width: 300, flex: 1 },
    { field: 'shortUrl', headerName: 'Short URL', width: 200, flex: 1 },
    { field: 'clicks', headerName: 'Clicks', type: 'number', width: 100 }
  ];

  if (error) {
    return <div>Error: {error}</div>; // Display error message if error state is populated
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={urls}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        loading={loading} // Show loading indicator while data is fetching
      />
    </div>
  );
};

export default URLView;
