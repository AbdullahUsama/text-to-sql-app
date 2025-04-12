// import React, { useState } from 'react';
// import './App.css';

// function App() {
//   const [inputText, setInputText] = useState('');
//   const [sqlQuery, setSqlQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     console.log('Sending query:', inputText); // Debug log
    
//     try {
//       // const response = await fetch('http://localhost:5000/api/sql-converter', {
//       const response = await fetch('https://text-to-sql-app-flax.vercel.app/api/sql-converter', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({ query: inputText })
//       });
  
//       console.log('Response status:', response.status); // Debug log
  
//       if (!response.ok) {
//         const errorData = await response.text();
//         console.error('Error response:', errorData); // Debug log
//         throw new Error(`Failed to generate SQL query: ${errorData}`);
//       }
  
//       const data = await response.json();
//       console.log('Received data:', data); // Debug log
      
//       if (data.result) {
//         setSqlQuery(data.result);
//       } else {
//         throw new Error('No result in response');
//       }
//     } catch (err) {
//       console.error('Error details:', err); // Debug log
//       setError(`Error generating SQL query: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       // Optional: Add a temporary success message
//       alert('SQL copied to clipboard!');
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };
  
//   return (
//     <div className="App">
//       <div className="container">
//         <h1>Text to SQL</h1>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             placeholder="Describe your query in plain English..."
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? 'Converting...' : 'Convert to SQL'}
//           </button>
//         </form>

//         {error && <div className="error">{error}</div>} {/* Show error message if any */}

//         {sqlQuery && (
//         <div className="result">
//           <div className="result-header">
//             <h2>Generated SQL Query</h2>
//             <button 
//               className="copy-button"
//               onClick={() => copyToClipboard(sqlQuery)}
//               title="Copy to clipboard"
//             >
//               Copy SQL
//             </button>
//           </div>
//           <pre>{sqlQuery}</pre>
//         </div>
//       )}
//       </div>
//     </div>
//   );
// }

// export default App;


"use client";

import React, { useState } from "react";
import "./App.css"; // Import your CSS file here
import { Copy, Check, Loader2 } from "lucide-react";

export default function TextToSql() {
  const [inputText, setInputText] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('https://text-to-sql-app-flax.vercel.app/api/sql-converter', {
  method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to generate SQL query: ${errorData}`);
      }

      const data = await response.json();

      if (data.result) {
        setSqlQuery(data.result);
      } else {
        throw new Error("No result in response");
      }
    } catch (err) {
      setError(`Error generating SQL query: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlQuery);
      setCopied(true);

      // Reset copy state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="app-container">
      <div className="stars-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      <div className="content-wrapper">
        <h1 className="app-title">Text to SQL</h1>

        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="textarea-container">
              <textarea
                className="query-input"
                placeholder="Describe your query in plain English..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="convert-button" disabled={loading || !inputText.trim()}>
              {loading ? (
                <span className="button-content">
                  <Loader2 className="spinner" size={18} />
                  Converting...
                </span>
              ) : (
                <span className="button-content">Convert to SQL</span>
              )}
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {sqlQuery && (
          <div className="output-section">
            <div className="output-header">
              <h2>Generated SQL Query</h2>
              <button className="copy-button" onClick={copyToClipboard} aria-label="Copy to clipboard">
                {copied ? <Check size={18} className="copy-icon" /> : <Copy size={18} className="copy-icon" />}
              </button>
            </div>
            <div className="sql-container">
              <pre className="sql-output">{sqlQuery}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
