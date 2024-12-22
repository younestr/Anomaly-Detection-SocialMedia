import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tweet, setTweet] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle tweet input change
  const handleChange = (e) => {
    setTweet(e.target.value);
  };

  // Send tweet for prediction
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure there is input
    if (!tweet.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        tweets: [tweet] // Send the tweet as an array
      });
      
      setPrediction(response.data[0]); // Assuming only one tweet is sent, so we get the first item
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
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
        Simply enter a tweet below and click "Analyze Tweet" to see the result.
      </p>
      <form onSubmit={handleSubmit}>
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

      {prediction && (
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

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
