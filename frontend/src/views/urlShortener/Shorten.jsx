import React, { useState } from "react";
import { Button, TextField, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const URLShorten = () => {
  const [url, setUrl] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // URL validation for https:// or www. with TLD requirement
  const isValidUrl = (url) => {
    // Regex allows https://, www., and enforces a valid TLD
    const regex =
      /^(https:\/\/|www\.)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+(\.[a-zA-Z]{2,})$/;
    return regex.test(url);
  };

  const handleSubmit = async () => {
    if (!isValidUrl(url)) {
      setSnackbarMessage(
        "Invalid URL! Please enter a valid URL starting with https:// or www. with a full path."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: url }),
    });

    const data = await response.json();
    if (data.shortUrl) {
      setSnackbarMessage(`Short URL saved: ${data.shortUrl}`);
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage("Something went wrong! Try again.");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  return (
    <div>
      <TextField
        label="Enter URL"
        variant="outlined"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
      />
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Shorten URL
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default URLShorten;
