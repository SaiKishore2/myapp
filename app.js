const express = require('express');
const AWS = require('aws-sdk');
const app = express();
app.use(express.json());

// Use IAM role on EKS, no explicit credentials here
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'your-region' });
const TABLE = 'MyAppData';

// Insert Data
app.post('/insert', async (req, res) => {
  const { id, data } = req.body;
  try {
    await dynamo.put({ TableName: TABLE, Item: { id, data } }).promise();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Data
app.get('/fetch/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dynamo.get({ TableName: TABLE, Key: { id } }).promise();
    res.json(result.Item || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('App running on port 3000'));
