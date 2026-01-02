import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Use environment variable; fallback to localhost for local testing
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_ENDPOINT = `${API_BASE_URL}/predict`;

function App() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const detectSpam = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(
        API_ENDPOINT,
        { message: message.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setResult(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError('API call failed. Please check your API URL or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="glass-container">
        <header className="hero-section">
          <div className="hero-content">
            <div className="spam-icon">📧</div>
            <h1>Smart Spam Detector</h1>
            <p>Paste any message to instantly detect spam with AI precision</p>
          </div>
        </header>

        <main className="main-content">
          <div className="input-card glass-card">
            <label className="input-label">📝 Message to analyze</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste your message here... (SMS, email, social media, etc.)"
              rows="5"
              className="modern-textarea"
            />

            <button
              onClick={detectSpam}
              disabled={loading || !message.trim()}
              className={`detect-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Analyzing...' : '🔍 Detect Spam'}
            </button>
          </div>

          {error && <div className="error-card glass-card">⚠️ {error}</div>}

          {result && (
            <div className="result-card glass-card">
              <h3>📊 Analysis Complete</h3>
              <div className={`prediction-badge ${result.spam ? 'spam' : 'ham'}`}>
                {result.spam ? '🛑 SPAM' : '✅ SAFE'}
                <div className="confidence-bar">
                  <div
                    className={`confidence-fill ${result.spam ? 'spam' : 'ham'}`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <p>
                  Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                </p>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>Powered by AI • Lightning Fast Detection</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
