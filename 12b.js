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
    <a href="/noteligible">🖨️ Print Not Eligible Students (Marks < 20)</a>
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
    res.send('✅ Student added successfully. <a href="/">Back</a>');
  } catch (err) {
    console.error('❌ Error inserting student:', err);
    res.status(500).send('Error adding student');
  }
});

app.get('/noteligible', async (req, res) => {
  try {
    const notEligibleStudents = await studentCollection.find({ Marks: { $lt: 20 } }).toArray();
    console.log('\n🚫 Students Not Eligible (Marks < 20):');
    notEligibleStudents.forEach(s => {
      console.log(`${s.Name} (${s.USN}) - Marks: ${s.Marks}`);
    });
    res.send("✅ List of not eligible students printed in terminal.<br><a href='/'>Back</a>");
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).send('Error fetching students');
  }
});

app.listen(3002, () => console.log('🚀 Server running at http://localhost:3002'));
