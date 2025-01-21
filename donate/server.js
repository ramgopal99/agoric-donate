import express, { json } from 'express';
const app = express();
const port = 3000; // You can choose any available port

// Middleware to parse JSON bodies
app.use(json());

// Example endpoint to get donation data
app.get('/api/donations', (req, res) => {
  // Replace with actual logic to retrieve donation data
  const donations = [
    { id: 1, amount: 100, donor: 'Alice' },
    { id: 2, amount: 50, donor: 'Bob' },
  ];
  res.json(donations);
});

app.listen(port, () => {
  console.log(`Donate API listening at http://localhost:${port}`);
});
