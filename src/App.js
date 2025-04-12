import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Sending query:', inputText); // Debug log
    
    try {
      // const response = await fetch('http://localhost:5000/api/sql-converter', {
      const response = await fetch('https://text-to-sql-app-flax.vercel.app/api/sql-converter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query: inputText })
      });
  
      console.log('Response status:', response.status); // Debug log
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData); // Debug log
        throw new Error(`Failed to generate SQL query: ${errorData}`);
      }
  
      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      if (data.result) {
        setSqlQuery(data.result);
      } else {
        throw new Error('No result in response');
      }
    } catch (err) {
      console.error('Error details:', err); // Debug log
      setError(`Error generating SQL query: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: Add a temporary success message
      alert('SQL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="App">
      <div className="container">
        <h1>Text to SQL</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe your query in plain English..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Converting...' : 'Convert to SQL'}
          </button>
        </form>

        {error && <div className="error">{error}</div>} {/* Show error message if any */}

        {sqlQuery && (
        <div className="result">
          <div className="result-header">
            <h2>Generated SQL Query</h2>
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(sqlQuery)}
              title="Copy to clipboard"
            >
              Copy SQL
            </button>
          </div>
          <pre>{sqlQuery}</pre>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
