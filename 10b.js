const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'FacultyDB';
let facultyCollection;

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log('✅ Connected to MongoDB');
    const db = client.db(dbName);
    facultyCollection = db.collection('faculty');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send(`
    <form method="post">
      <input name="ID" placeholder="ID" required />
      <input name="Title" placeholder="Title" required />
      <input name="Name" placeholder="Name" required />
      <input name="branch" placeholder="Branch" required />
      <button>Submit</button>
    </form>
    <a href="/cseprofessors">Show CSE Professors</a>
  `);
});

app.post('/', async (req, res) => {
  try {
    const faculty = {
      ID: req.body.ID,
      Title: req.body.Title,
      Name: req.body.Name,
      branch: req.body.branch
    };
    await facultyCollection.insertOne(faculty);
    res.redirect('/');
  } catch (err) {
    console.error('❌ Error inserting faculty:', err);
    res.status(500).send('Error adding faculty');
  }
});

app.get('/cseprofessors', async (req, res) => {
  try {
    const profs = await facultyCollection.find({ branch: 'CSE', Title: 'PROFESSOR' }).toArray();
    const html = profs.map(f => `${f.ID} - ${f.Name} - ${f.Title} - ${f.branch}<br>`).join('') + '<br><a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    console.error('❌ Error fetching professors:', err);
    res.status(500).send('Error fetching professors');
  }
});

app.listen(3004, () => console.log('✅ Server running at http://localhost:3004'));
