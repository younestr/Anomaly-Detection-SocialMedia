import React, { useState } from 'react';
import axios from 'axios';
import './HateSpeechDetection.css';

function App() {
  const [tweet, setTweet] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTweetMode, setIsTweetMode] = useState(true);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [filePrediction, setFilePrediction] = useState(null);

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
        tweets: [tweet],
      });
      setPrediction(response.data[0]);
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  // Preview uploaded file
  const handleFilePreview = async (e) => {
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFileData(response.data.preview);
      setSelectedColumn(response.data.columns[0]);
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle column selection
  const handleColumnSelect = (e) => {
    setSelectedColumn(e.target.value);
  };

  // Process file and analyze
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
        column: selectedColumn,
      });

      setFilePrediction(response.data);
    } catch (err) {
      setError("Error processing the file. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Get color-coded class
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

      <div className="mode-selection">
        <button onClick={() => setIsTweetMode(true)}>Test a Tweet</button>
        <button onClick={() => setIsTweetMode(false)}>Upload Data</button>
      </div>

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
        <>
          <form onSubmit={handleFilePreview}>
            <input type="file" onChange={handleFileChange} accept=".csv" />
            <br />
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Preview Data"}
            </button>
          </form>

          {fileData && (
            <div className="file-preview">
              <h3>File Data Preview:</h3>
              <table className="tweet-table">
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
                <select onChange={handleColumnSelect} value={selectedColumn}>
                  {Object.keys(fileData[0]).map((column, index) => (
                    <option key={index} value={column}>{column}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleProcessFile} disabled={loading}>
                {loading ? "Processing..." : "Analyze Data"}
              </button>
            </div>
          )}
        </>
      )}

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

      {error && (
        <div className="error">{error}</div>
      )}
    </div>
  );
}

export default App;
