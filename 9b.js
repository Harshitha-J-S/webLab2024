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

// Show form
app.get('/', (req, res) => {
  res.send(`
    <form method="post">
      <input name="Name" placeholder="Name" required />
      <input name="Branch" placeholder="Branch" required />
      <input name="Semester" placeholder="Semester" type="number" required />
      <button>Submit</button>
    </form>
    <a href="/list">🖨️ Print CSE 6th Sem Students (Terminal)</a>
  `);
});

// Handle submission
app.post('/', async (req, res) => {
  try {
    const student = {
      Name: req.body.Name,
      Branch: req.body.Branch,
      Semester: Number(req.body.Semester),
    };
    await studentCollection.insertOne(student);
    res.send('✅ Student added! <a href="/">Back</a>');
  } catch (err) {
    console.error('❌ Error inserting student:', err);
    res.status(500).send('Error adding student');
  }
});

// Print CSE 6th sem students in terminal only
app.get('/list', async (req, res) => {
  try {
    const students = await studentCollection.find({ Branch: 'CSE', Semester: 6 }).toArray();
    console.log('\n🎓 CSE 6th Semester Students:');
    students.forEach(s => {
      console.log(`${s.Name} - ${s.Branch} - Semester ${s.Semester}`);
    });
    res.send("✅ Printed CSE 6th Sem students to terminal.<br><a href='/'>Back</a>");
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).send('Error fetching students');
  }
});

app.listen(3002, () => console.log('🚀 Server running at http://localhost:3002'));
