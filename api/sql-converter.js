// // sql-converter.js

// require('dotenv').config();
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


const { convertTextToSQL } = require('../server');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method === 'POST') {
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
  } else {
    // Handle method other than POST
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
