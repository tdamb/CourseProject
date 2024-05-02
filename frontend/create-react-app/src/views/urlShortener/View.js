import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const URLView = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const fetchURLs = async () => {
      const response = await fetch('/api/urls');
      const data = await response.json();
      setUrls(
        data.map((item, index) => ({
          id: index, // important to include a unique id for each row
          originalUrl: item.originalUrl,
          shortUrl: item.shortUrl,
          clicks: item.clicks
        }))
      );
    };

    fetchURLs();
  }, []);

  const columns = [
    { field: 'originalUrl', headerName: 'Original URL', width: 300, flex: 1 },
    { field: 'shortUrl', headerName: 'Short URL', width: 200, flex: 1 },
    { field: 'clicks', headerName: 'Clicks', type: 'number', width: 100 }
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={urls} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} checkboxSelection disableSelectionOnClick />
    </div>
  );
};

export default URLView;
