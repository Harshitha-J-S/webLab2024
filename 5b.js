const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'students';
let studentCollection;

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    studentCollection = db.collection('student');
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Add Student Form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Add Student</title></head>
    <body>
      <h2>Add Student</h2>
      <form method="POST" action="/">
        <input name="name" placeholder="Name" required><br>
        <input name="usn" placeholder="USN" required><br>
        <input name="dept" placeholder="Department" required><br>
        <input name="grade" placeholder="Grade" required><br>
        <button type="submit">Add</button>
      </form>
      <a href="/all">View All</a>
      <a href="/update">update</a>
    </body>
    </html>
  `);
});

// Add Student to DB
app.post('/', async (req, res) => {
  try {
    await studentCollection.insertOne(req.body);
    res.redirect('/all');
  } catch (err) {
    console.error("❌ Insert Error:", err);
    res.status(500).send("Error adding student.");
  }
});

// View All Students (Printed to terminal)
app.get('/all', async (req, res) => {
  try {
    const data = await studentCollection.find().toArray();
    console.log("\n📋 All Students:");
    data.forEach(stu => {
      console.log(`${stu.name} | ${stu.usn} | ${stu.dept} | ${stu.grade}`);
    });
    res.send("✅ Student list printed to terminal.<br/><a href='/'>Back</a>");
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).send("Error fetching students.");
  }
});

// Update Grade Form
app.get('/update', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Update Grade</title></head>
    <body>
      <h2>Update Student Grade</h2>
      <form method="POST" action="/update">
        <input name="name" placeholder="Name to Update" required><br>
        <input name="grade" placeholder="New Grade" required><br>
        <button type="submit">Update</button>
      </form>
      <a href="/all">View All</a>
   
    </body>
    </html>
  `);
});

// Update grade in DB (Confirmation printed to terminal)
app.post('/update', async (req, res) => {
  try {
    const result = await studentCollection.updateOne(
      { name: req.body.name },
      { $set: { grade: req.body.grade } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Updated grade for ${req.body.name} to ${req.body.grade}`);
    } else {
      console.log(`⚠️ No matching student found with name "${req.body.name}"`);
    }
    res.send("✅ Update processed. Check terminal for result.<br/><a href='/'>Back</a>");
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).send("Error updating student.");
  }
});

app.listen(3001, () => console.log('✅ Server running at http://localhost:3001'));
