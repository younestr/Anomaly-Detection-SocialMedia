// src/BotDetection.js
import React, { useState } from 'react';
import './BotDetection.css';  // Add styling to the BotDetection component

function BotDetection() {
  // State to manage user input and the response from the API
  const [tweetFeatures, setTweetFeatures] = useState({
    verified: '',
    hour_created: '',
    geo_enabled: '',
    default_profile: '',
    default_profile_image: '',
    favourites_count: '',
    followers_count: '',
    friends_count: '',
    statuses_count: '',
    average_tweets_per_day: '',
    network: '',
    tweet_to_followers: '',
    follower_acq_rate: '',
    friends_acq_rate: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTweetFeatures((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate the input based on field type
  const validateInput = (name, value) => {
    if (name === 'network' || name === 'geo_enabled' || name === 'default_profile' || name === 'default_profile_image') {
      // Binary fields must be 0 or 1
      if (value !== '0' && value !== '1') {
        return 'Please enter either 0 or 1';
      }
    }

    if (name === 'follower_acq_rate' || name === 'friends_acq_rate' || name === 'tweet_to_followers') {
      // Rate fields must be between 0 and 1
      if (value < 0 || value > 1) {
        return 'Please enter a value between 0 and 1';
      }
    }

    if (value < 0) {
      // Fields like count must not be negative
      return 'Please enter a positive number';
    }

    return ''; // No error
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    // Validate each field before submitting
    for (const [name, value] of Object.entries(tweetFeatures)) {
      const errorMessage = validateInput(name, value);
      if (errorMessage) {
        setError(errorMessage);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/bot_detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_data: tweetFeatures,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bot detection result');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);  // Set the result from the API response
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bot-detection-container">
      <h1>Bot Detection</h1>
      <form onSubmit={handleSubmit} className="bot-detection-form">
        <div className="form-group">
          <label>Verified:</label>
          <input
            type="number"
            name="verified"
            value={tweetFeatures.verified}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Hour Created:</label>
          <input
            type="number"
            name="hour_created"
            value={tweetFeatures.hour_created}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Geo Enabled:</label>
          <input
            type="number"
            name="geo_enabled"
            value={tweetFeatures.geo_enabled}
            onChange={handleChange}
            required
            min="0"
            max="1"
          />
        </div>
        <div className="form-group">
          <label>Default Profile:</label>
          <input
            type="number"
            name="default_profile"
            value={tweetFeatures.default_profile}
            onChange={handleChange}
            required
            min="0"
            max="1"
          />
        </div>
        <div className="form-group">
          <label>Default Profile Image:</label>
          <input
            type="number"
            name="default_profile_image"
            value={tweetFeatures.default_profile_image}
            onChange={handleChange}
            required
            min="0"
            max="1"
          />
        </div>
        <div className="form-group">
          <label>Favourites Count:</label>
          <input
            type="number"
            name="favourites_count"
            value={tweetFeatures.favourites_count}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Followers Count:</label>
          <input
            type="number"
            name="followers_count"
            value={tweetFeatures.followers_count}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Friends Count:</label>
          <input
            type="number"
            name="friends_count"
            value={tweetFeatures.friends_count}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Statuses Count:</label>
          <input
            type="number"
            name="statuses_count"
            value={tweetFeatures.statuses_count}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Average Tweets Per Day:</label>
          <input
            type="number"
            name="average_tweets_per_day"
            value={tweetFeatures.average_tweets_per_day}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Network:</label>
          <input
            type="number"
            name="network"
            value={tweetFeatures.network}
            onChange={handleChange}
            required
            min="0"
            max="1"
          />
        </div>
        <div className="form-group">
          <label>Tweet to Followers:</label>
          <input
            type="number"
            name="tweet_to_followers"
            value={tweetFeatures.tweet_to_followers}
            onChange={handleChange}
            required
            min="0"
            max="1"
          />
        </div>
        <div className="form-group">
          <label>Follower Acquisition Rate:</label>
          <input
            type="number"
            name="follower_acq_rate"
            value={tweetFeatures.follower_acq_rate}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            max="1"
          />
        </div>
        <div className="form-group">
          <label>Friends Acquisition Rate:</label>
          <input
            type="number"
            name="friends_acq_rate"
            value={tweetFeatures.friends_acq_rate}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            max="1"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Detect Bot'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="result">
          <h3>Prediction: {result.prediction}</h3>
          <h4>Probabilities:</h4>
          <ul>
            {Object.keys(result.probabilities).map((key) => (
              <li key={key}>
                {key}: {result.probabilities[key].toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BotDetection;
