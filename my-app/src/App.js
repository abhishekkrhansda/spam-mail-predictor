import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_ENDPOINT = 'http://localhost:5000/predict'; // Replace with your API URL

function App() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const detectSpam = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await axios.post(API_ENDPOINT, {
        message: message.trim()
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const prediction = response.data;
      setResult(prediction);
    } catch (err) {
      setError('API call failed. Please check your API endpoint.');
      console.error('API Error:', err);
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
            <div className="input-group">
              <label className="input-label">📝 Message to analyze</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste your message here... (SMS, email, social media, etc.)"
                rows="5"
                className="modern-textarea"
              />
            </div>
            
            <button 
              onClick={detectSpam} 
              disabled={loading || !message.trim()}
              className={`detect-btn ${loading ? 'loading' : ''}`}
            >
              <span className="btn-content">
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    🔍 <span>Detect Spam</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {error && (
            <div className="error-card glass-card">
              <div className="error-icon">⚠️</div>
              <div>{error}</div>
            </div>
          )}

          {result && (
            <div className="result-card glass-card">
              <div className="result-header">
                <h3>📊 Analysis Complete</h3>
              </div>
              <div className={`prediction-badge ${result.spam ? 'spam' : 'ham'}`}>
                <div className="badge-icon">
                  {result.spam ? '🛑 SPAM' : '✅ SAFE'}
                </div>
                <div className="confidence-bar">
                  <div 
                    className={`confidence-fill ${result.spam ? 'spam' : 'ham'}`}
                    style={{ width: `${(result.confidence * 100)}%` }}
                  ></div>
                </div>
                <div className="confidence-text">
                  Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                </div>
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
