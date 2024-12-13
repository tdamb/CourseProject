import React, { useState } from "react";
import { Button, TextField, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const URLShorten = () => {
  const [url, setUrl] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // URL validation for https:// or www. with TLD requirement and path after TLD
  const isValidUrl = (url) => {
    // Updated regex to require a path after the TLD
    const regex =
      /^(https:\/\/|www\.)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+(\.[a-zA-Z]{2,})\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=#]*$/;
    return regex.test(url);
  };

  const handleSubmit = async () => {
    if (!isValidUrl(url)) {
      setSnackbarMessage(
        "Invalid URL! Please enter a valid URL starting with https:// or www. with a TLD, and a path."
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
      setSnackbarMessage(`Short URL: ${data.shortUrl}`);
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
