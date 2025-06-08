const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'FinalYears';
let studentCollection;

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log('✅ Connected to MongoDB');
    const db = client.db(dbName);
    studentCollection = db.collection('students');
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Serve the form
app.get('/', (req, res) => {
  res.send(`
    <form method="post">
      <input name="USN" placeholder="USN" required/>
      <input name="Name" placeholder="Name" required/>
      <select name="Company_name">
        <option>Infosys</option>
        <option>Google</option>
        <option>Microsoft</option>
      </select>
      <button>Submit</button>
    </form>
    <br><a href="/infosys">Show Infosys Selected</a>
  `);
});

// Handle form submission
app.post('/', async (req, res) => {
  try {
    await studentCollection.insertOne(req.body);
    res.redirect('/');
  } catch (err) {
    console.error('❌ Insert Error:', err);
    res.status(500).send('Error saving student.');
  }
});

// Show students who selected Infosys
app.get('/infosys', async (req, res) => {
  try {
    const infosysStudents = await studentCollection.find({ Company_name: 'Infosys' }).toArray();
    const html = infosysStudents
      .map(s => `${s.USN} - ${s.Name} <br>`)
      .join('') + '<br><a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    console.error('❌ Query Error:', err);
    res.status(500).send('Error fetching Infosys students.');
  }
});

app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));
