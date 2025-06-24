const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const config = {
  geminiApiKey: "Your_Api_key"
};

async function convertNLToMongoQuery(nlQuery) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`;

  const prompt = `
Convert this natural language sentence into a valid MongoDB JSON query with columns (_id,product_id,sale_date,sales_rep,region,sales_amount,quantity_sold,product_category,unit_cost,unit_price,customer_type,discount,payment_method,sales_channel,region_and_sales_rep,_uploaded_at,_processed).
Do not include any explanation. Return only the query as text.

NL Query: ${nlQuery}
`;

  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const generated = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const cleaned = generated.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1').trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    return null;
  }
}

const dbdetails = {
  mongoUri: 'YOUR_MONGO_API',
  dbName: 'CSV_Analyzer',
  collectionName: 'CSV_Analyzer2',
};

let collection;

MongoClient.connect(dbdetails.mongoUri)
  .then(client => {
    const db = client.db(dbdetails.dbName);
    collection = db.collection(dbdetails.collectionName);
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection failed:', err));

app.get('/users', async (req, res) => {
  try {
    const users = await collection.find({}).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/query', async (req, res) => {
  try {
    if (req.body.query) {
      const parsedQuery = JSON.parse(req.body.query);
      const result = await collection.find(parsedQuery).toArray();
      return res.json(result);
    } else if (req.body.nlQuery) {
      const nlQuery = req.body.nlQuery;
      const mongoQuery = await convertNLToMongoQuery(nlQuery);

      if (!mongoQuery) {
        return res.status(500).json({ error: 'Failed to generate MongoDB query from Gemini' });
      }

      const result = await collection.find(mongoQuery).toArray();
      return res.json(result);
    } else {
      res.status(400).json({ error: 'Invalid request body' });
    }
  } catch (err) {
    console.error('Query Error:', err);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

// 🚀 Add Row endpoint
app.post('/add', async (req, res) => {
  try {
    const doc = req.body;
    const result = await collection.insertOne(doc);
    res.json({ insertedId: result.insertedId });
  } catch (err) {
    console.error('Add Error:', err);
    res.status(500).json({ error: 'Failed to add row' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
