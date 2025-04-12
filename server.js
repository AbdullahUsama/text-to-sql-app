const express = require('express');
const { convertTextToSQL } = require('./api/sql-converter');

const app = express();

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  next();
});

app.use(express.json()); // Middleware to parse JSON body

// API route for SQL conversion
app.post('/api/sql-converter', async (req, res) => {
    try {
      const { query } = req.body; // Get the query from the request body
      
      // Call the convertTextToSQL function from sql-converter.js
      const result = await convertTextToSQL(query);
  
      // Send back the generated SQL query as the response
      res.status(200).json({ result });
    } catch (error) {
      console.error('Error during SQL conversion:', error.message);  // Log the error message
      console.error(error.stack);  // Log the stack trace for more detailed information
      res.status(500).json({ error: error.message || 'An error occurred while processing the request.' });
    }
  });
  

// Start the Express server
const port = 5000; // Port for local server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
