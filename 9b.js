const express = require('express');

const { MongoClient } = require('mongodb');

const app = express();
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'StudentsDB';
let studentCollection;

// Connect to MongoDB
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
      <input name="Branch" placeholder="Branch" required />
      <input name="Semester" placeholder="Semester" type="number" required />
      <button>Submit</button>
    </form>
    <a href="/list">Show CSE 6th Semester Students</a>
  `);
});

app.post('/', async (req, res) => {
  try {
    const student = {
      Name: req.body.Name,
      Branch: req.body.Branch,
      Semester: Number(req.body.Semester),
    };
    await studentCollection.insertOne(student);
    res.redirect('/');
  } catch (err) {
    console.error('❌ Error inserting student:', err);
    res.status(500).send('Error adding student');
  }
});

app.get('/list', async (req, res) => {
  try {
    const students = await studentCollection.find({ Branch: 'CSE', Semester: 6 }).toArray();
    const html = students
      .map(s => `${s.Name} - ${s.Branch} - ${s.Semester}<br>`)
      .join('') + '<br><a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).send('Error fetching students');
  }
});

app.listen(3002, () => console.log('✅ Server running at http://localhost:3002'));
