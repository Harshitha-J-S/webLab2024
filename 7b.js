const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'exam';
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
    <form method="POST">
      <input name="name" placeholder="Name" required/>
      <input name="usn" placeholder="USN" required/>
      <input name="grade" placeholder="Grade" required/>
      <button type="submit">Submit</button>
    </form>
  `);
});

// Handle form submission
app.post('/', async (req, res) => {
  const { name, usn, grade } = req.body;
  try {
    await studentCollection.insertOne({ name, usn, grade });
    res.redirect('/sgrade');
  } catch (err) {
    console.error("❌ Insert Error:", err);
    res.status(500).send("Error adding student.");
  }
});

// Show students with 'S' grade
app.get('/sgrade', async (req, res) => {
  try {
    const data = await studentCollection.find({ grade: 'S' }).toArray();
    let html = `<h2>Students with 'S' Grade</h2><ul>`;
    data.forEach(d => {
      html += `<li>${d.name} | ${d.usn} | ${d.grade}</li>`;
    });
    html += `</ul><a href="/">Back</a>`;
    res.send(html);
  } catch (err) {
    console.error("❌ Query Error:", err);
    res.status(500).send("Error fetching data.");
  }
});

app.listen(3003, () => console.log('🚀 Server running on http://localhost:3003'));
