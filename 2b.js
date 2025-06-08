const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb://localhost:27017';
const dbName = 'exam_fees';
let studentsCollection;

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log("✅ MongoDB connected");
    const db = client.db(dbName);
    studentsCollection = db.collection('students');
  })
  .catch(err => console.error("❌ MongoDB error:", err));

// Serve HTML Form
app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/add">
      <input name="name" placeholder="Name" required />
      <input name="usn" placeholder="USN" required />
      <input name="sem" placeholder="Semester" type="number" required />
      <label>Paid?</label>
      <select name="paid">
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <button type="submit">Add</button>
    </form>
    <br>
    <a href="/delete-unpaid">Delete Unpaid</a><br>
    <a href="/all">View All</a>
  `);
});

// Handle Add Student
app.post('/add', async (req, res) => {
  try {
    const student = {
      name: req.body.name,
      usn: req.body.usn,
      sem: parseInt(req.body.sem),
      paid: req.body.paid === 'true'
    };
    const result = await studentsCollection.insertOne(student);
    console.log("✅ Added:", result.insertedId);
    res.send("✅ Student added!");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Failed to add student.");
  }
});

// Delete unpaid students and log result to terminal
app.get('/delete-unpaid', async (req, res) => {
  try {
    const result = await studentsCollection.deleteMany({ paid: false });
    console.log(`🗑️ Deleted ${result.deletedCount} unpaid students`);
    res.send(`🗑️ Deleted count logged in terminal.<br><a href="/">⬅ Back</a>`);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Failed to delete unpaid.");
  }
});

// Print all students to terminal
app.get('/all', async (req, res) => {
  try {
    const data = await studentsCollection.find().toArray();
    console.log("\n📋 All Students:");
    data.forEach(s => {
      console.log(`${s.name} (${s.usn}) - Sem: ${s.sem}, Paid: ${s.paid}`);
    });
    res.send("📋 Student list printed to terminal.<br><a href='/'>⬅ Back</a>");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Failed to fetch data.");
  }
});

app.listen(3001, () => console.log("🚀 Running at http://localhost:3001"));
