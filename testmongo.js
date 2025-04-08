const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://testuser:testpass123@cluster0.a8uvj6k.mongodb.net/MyDBexample?authSource=admin&retryWrites=true&w=majority";

// --- Express setup
const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route
app.get('/', function(req, res) {
  res.send('Starting... ');
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
});

// Route to access MongoDB
app.get('/api/mongo/:item', function(req, res) {
  const client = new MongoClient(uri);
  const searchKey = "{ partID: '" + req.params.item + "' }";
  console.log("Looking for: " + searchKey);

  async function run() {
    try {
      await client.connect();
      const database = client.db('MyDBexample');
      const parts = database.collection('Mystuff');

      const query = { partID: req.params.item };
      const part = await parts.findOne(query);

      console.log(part);
      res.send('Found this: ' + JSON.stringify(part));
    } catch (err) {
      console.error("❌ MongoDB Error:", err);
      res.status(500).send("Database error: " + err.message);
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});
