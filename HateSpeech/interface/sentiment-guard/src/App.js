import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tweet, setTweet] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTweetMode, setIsTweetMode] = useState(true); // Track whether user is in tweet or file upload mode
  const [file, setFile] = useState(null); // For handling file uploads
  const [filePrediction, setFilePrediction] = useState(null);
  const [fileData, setFileData] = useState(null); // Store the file data
  const [selectedColumn, setSelectedColumn] = useState(""); // Track selected column for tweets

  // Handle tweet input change
  const handleChange = (e) => {
    setTweet(e.target.value);
  };

  // Send tweet for prediction
  const handleTweetSubmit = async (e) => {
    e.preventDefault();

    if (!tweet.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        tweets: [tweet] // Send the tweet as an array
      });

      setPrediction(response.data[0]);
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload for predictions
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a file.");
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFileData(response.data.preview); // Set the file preview data
      setSelectedColumn(response.data.columns[0]); // Default to the first column
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle column selection for tweets
  const handleColumnSelect = (e) => {
    setSelectedColumn(e.target.value);
  };

  const handleProcessFile = async () => {
    if (!selectedColumn) {
      setError("Please select the column containing the tweets.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/process_file", {
        fileData: fileData,
        column: selectedColumn
      });

      setFilePrediction(response.data); // Assuming the response is a list of predictions for each row in the file
    } catch (err) {
      setError("Error processing the file. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get color-coded class
  const getClassColor = (className) => {
    if (className === "Hate Speech") return "hate-speech";
    if (className === "Neither") return "neither";
    if (className === "Offensive Language") return "offensive-language";
    return "";
  };

  return (
    <div className="App">
      <h1>🤬 Hate Speech Detection</h1>
      <p className="description">
        Analyze tweets to determine if they contain hate speech, offensive language, or are neutral. 
        Choose an option below to either test it out with your own tweet or upload your data.
      </p>

      {/* Select mode */}
      <div className="mode-selection">
        <button onClick={() => setIsTweetMode(true)}>Test a Tweet</button>
        <button onClick={() => setIsTweetMode(false)}>Upload Data</button>
      </div>

      {/* Show tweet input form if in tweet mode */}
      {isTweetMode ? (
        <form onSubmit={handleTweetSubmit}>
          <textarea
            value={tweet}
            onChange={handleChange}
            placeholder="Enter a tweet here..."
            rows="4"
            cols="50"
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Tweet"}
          </button>
        </form>
      ) : (
        /* Show file upload form if in file upload mode */
        <form onSubmit={handleFileSubmit}>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".csv" 
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload and Analyze"}
          </button>
        </form>
      )}

      {/* Display file data preview and column selection after file upload */}
      {fileData && !isTweetMode && (
        <div className="file-preview">
          <h3>File Data Preview:</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(fileData[0]).map((key, index) => (
                  <th key={index}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileData.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <label>Select the column containing the tweets:</label>
            <select onChange={handleColumnSelect}>
              {Object.keys(fileData[0]).map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </select>
          </div>

          <button onClick={handleProcessFile} disabled={loading}>
            {loading ? "Processing..." : "Process and Analyze"}
          </button>
        </div>
      )}

      {/* Display prediction for tweet */}
      {prediction && isTweetMode && (
        <div className="result">
          <div className="tweet"><strong>Tweet:</strong> {prediction.tweet}</div>
          <div className="prediction">
            <strong>Prediction:</strong>{" "}
            <span className={getClassColor(prediction.prediction)}>
              {prediction.prediction}
            </span>
          </div>
          <div className="probabilities">
            <p><strong>Probabilities:</strong></p>
            <ul>
              {Object.entries(prediction.probabilities).map(([className, prob]) => (
                <li key={className} className={getClassColor(className)}>
                  {className}: {(prob * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Display predictions for uploaded data */}
      {filePrediction && !isTweetMode && (
        <div className="result">
          <h3>Predictions for Uploaded Data:</h3>
          <ul>
            {filePrediction.map((item, index) => (
              <li key={index}>
                <div><strong>{item.tweet}</strong></div>
                <div>{item.prediction}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display error message */}
      {error && (
        <div className="error">{error}</div>
      )}
    </div>
  );
}

export default App;
