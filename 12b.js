const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'ExamDB';
let studentCollection;

MongoClient.connect(uri)
  .then(client => {
    console.log('✅ Connected to MongoDB');
    const db = client.db(dbName);
    studentCollection = db.collection('students');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send(`
    <form method="post">
      <input name="Name" placeholder="Name" required />
      <input name="USN" placeholder="USN" required />
      <input name="Marks" placeholder="Marks" type="number" required />
      <button>Submit</button>
    </form>
    <a href="/noteligible">Show Not Eligible Students (Marks < 20)</a>
  `);
});

app.post('/', async (req, res) => {
  try {
    const student = {
      Name: req.body.Name,
      USN: req.body.USN,
      Marks: Number(req.body.Marks),
    };
    await studentCollection.insertOne(student);
    res.redirect('/');
  } catch (err) {
    console.error('❌ Error inserting student:', err);
    res.status(500).send('Error adding student');
  }
});

app.get('/noteligible', async (req, res) => {
  try {
    const notEligibleStudents = await studentCollection.find({ Marks: { $lt: 20 } }).toArray();
    const html = notEligibleStudents
      .map(s => `${s.Name} (${s.USN}) - Marks: ${s.Marks}<br>`)
      .join('') + '<br><a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).send('Error fetching students');
  }
});

app.listen(3002, () => console.log('✅ Server running at http://localhost:3002'));
