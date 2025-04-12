// const express = require('express');
// const { convertTextToSQL } = require('./api/sql-converter');

// const app = express();

// // Add CORS middleware
// app.use((req, res, next) => {
// //   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Origin', 'https://text-to-sql-app-flax.vercel.app/');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   next();
// });

// app.use(express.json()); // Middleware to parse JSON body

// // API route for SQL conversion
// app.post('/api/sql-converter', async (req, res) => {
//     try {
//       const { query } = req.body; // Get the query from the request body
      
//       // Call the convertTextToSQL function from sql-converter.js
//       const result = await convertTextToSQL(query);
  
//       // Send back the generated SQL query as the response
//       res.status(200).json({ result });
//     } catch (error) {
//       console.error('Error during SQL conversion:', error.message);  // Log the error message
//       console.error(error.stack);  // Log the stack trace for more detailed information
//       res.status(500).json({ error: error.message || 'An error occurred while processing the request.' });
//     }
//   });
  

// // Start the Express server
// const port = 5000; // Port for local server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });



// require('dotenv').config(); // Load environment variables from .env
// const Groq = require('groq-sdk');

// // Initialize Groq with the API key
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// async function convertTextToSQL(query) {
//   try {
//     // Make the call to Groq API to process the query
//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         { role: 'user', content: query },
//         { role: 'assistant', content: "Here is the SQL query that corresponds to the given conditions:\n" }
//       ],
//       model: "meta-llama/llama-4-scout-17b-16e-instruct",
//       temperature: 1,
//       max_completion_tokens: 1024,
//     });

//     // Log the entire response for debugging
//     console.log('Groq API response:', chatCompletion);

//     // Extract the message content (assuming it's in the first choice)
//     const fullResponse = chatCompletion.choices[0]?.message?.content || '';

//     // Use a regular expression to extract the SQL query
//     const sqlQueryMatch = fullResponse.match(/```sql([\s\S]*?)```/);

//     // Check if we found a match and return the SQL query, else default to 'No SQL generated'
//     const result = sqlQueryMatch ? sqlQueryMatch[1].trim().replace(/\n/g, ' ') : 'No SQL generated';

//     return result;
//   } catch (error) {
//     console.error('Error during Groq API call:', error.message);
//     console.error(error.stack);
//     throw new Error('Error generating SQL query: ' + error.message);
//   }
// }

// module.exports = { convertTextToSQL };


require('dotenv').config(); // Load environment variables from .env
const Groq = require('groq-sdk');

// Initialize Groq with the API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function convertTextToSQL(query) {
  try {
    // Construct a more precise prompt for the Groq model
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user', 
          content: `I want a precise SQL query based on the following instructions: ${query}. Please ensure the SQL query is simple, optimized, and covers all the conditions mentioned in the query. If there are any ambiguities, resolve them with sensible assumptions.`
        },
        {
          role: 'assistant',
          content: "Here is the SQL query that corresponds to the given conditions, optimized for clarity and correctness:\n"
        }
      ],
    //   model: "meta-llama/llama-4-scout-17b-16e-instruct", // Ensure you are using the right model
      model: "deepseek-r1-distill-llama-70b", // Ensure you are using the right model
      temperature: 0.5,  // Lower temperature for more deterministic and precise outputs
      max_completion_tokens: 1024, // Adjust as needed based on the expected query length
    });

    // Log the entire response for debugging
    console.log('Groq API response:', chatCompletion);

    // Extract the message content (assuming it's in the first choice)
    const fullResponse = chatCompletion.choices[0]?.message?.content || '';

    // Use a regular expression to extract the SQL query
    const sqlQueryMatch = fullResponse.match(/```sql([\s\S]*?)```/);

    // Check if we found a match and return the SQL query, else default to 'No SQL generated'
    const result = sqlQueryMatch ? sqlQueryMatch[1].trim().replace(/\n/g, ' ') : 'No SQL generated';

    return result;
  } catch (error) {
    console.error('Error during Groq API call:', error.message);
    console.error(error.stack);
    throw new Error('Error generating SQL query: ' + error.message);
  }
}

module.exports = { convertTextToSQL };
