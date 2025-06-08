const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb://localhost:27017';
const dbName = 'students';
let studentsCollection;

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    studentsCollection = db.collection('students');
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Serve HTML Form
app.get('/', (req, res) => {
  res.send(`
    <h2>Enter Student Details</h2>
    <form method="POST" action="/add">
      <input name="usn" placeholder="USN" required /><br/>
      <input name="name" placeholder="Name" required /><br/>
      <input name="subject_code" placeholder="Subject Code" required /><br/>
      <input name="cie" placeholder="CIE Marks" type="number" required /><br/>
      <button type="submit">Submit</button>
    </form>
    <br/>
    <a href="/lowcie">View Students with CIE &lt; 20</a>
  `);
});

// Handle form submission
app.post('/add', async (req, res) => {
  try {
    const student = {
      usn: req.body.usn,
      name: req.body.name,
      subject_code: req.body.subject_code,
      cie: parseInt(req.body.cie)
    };
    const result = await studentsCollection.insertOne(student);
    console.log("✅ Student Added with ID:", result.insertedId);
    res.send(`
      ✅ Student added successfully!<br/>
      <a href="/">Go back</a>
    `);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Failed to add student.");
  }
});

// Display students with CIE < 20
app.get('/lowcie', async (req, res) => {
  try {
    const students = await studentsCollection.find({ cie: { $lt: 20 } }).toArray();
    let html = `<h2>Students with CIE < 20</h2><ul>`;
    students.forEach(s => {
      html += `<li>${s.usn} - ${s.name} - ${s.subject_code} - CIE: ${s.cie}</li>`;
    });
    html += `</ul><a href="/">Go back</a>`;
    res.send(html);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).send("Failed to fetch students.");
  }
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
