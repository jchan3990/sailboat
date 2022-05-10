import express from 'express';
import data from './data.js';

const app = express();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});

app.get('/api/products', (req, res) => {
  res.send(data.products);
})