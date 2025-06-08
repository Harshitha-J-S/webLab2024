const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/students', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const Student = mongoose.model('Student', new mongoose.Schema({
  usn: String,
  name: String,
  subject_code: String,
  cie: Number
}));

// Serve HTML Form at "/"
app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/add">
      <input name="usn" placeholder="USN" required />
      <input name="name" placeholder="Name" required />
      <input name="subject_code" placeholder="Subject" required />
      <input name="cie" placeholder="CIE" type="number" required />
      <button type="submit">Submit</button>
    </form>
  `);
});

// Handle form submission
app.post('/add', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    console.log("✅ Student Added:", student);
    res.send("✅ Student added! You can close this tab.");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Failed to add student.");
  }
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
