const express = require('express');

const { MongoClient } = require('mongodb');

const app = express();
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'AttendanceDB';
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
      <input name="USN" placeholder="USN" required />
      <input name="Attendance" placeholder="Attendance %" type="number" step="0.01" required />
      <button>Submit</button>
    </form>
    <a href="/lowattendance">Show Attendance < 75%</a>
  `);
});

app.post('/', async (req, res) => {
  try {
    const student = {
      Name: req.body.Name,
      USN: req.body.USN,
      Attendance: parseFloat(req.body.Attendance)
    };
    await studentCollection.insertOne(student);
    res.redirect('/');
  } catch (err) {
    console.error('❌ Error inserting student:', err);
    res.status(500).send('Error adding student');
  }
});

app.get('/lowattendance', async (req, res) => {
  try {
    const lowAttendanceStudents = await studentCollection.find({ Attendance: { $lt: 75 } }).toArray();
    const html = lowAttendanceStudents
      .map(s => `${s.Name} (${s.USN}) - ${s.Attendance}%<br>`)
      .join('') + '<br><a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).send('Error fetching students');
  }
});

app.listen(3005, () => console.log('✅ Server running at http://localhost:3005'));
