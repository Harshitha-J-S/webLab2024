const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/exam_fees', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Schema + Model
const Student = mongoose.model('Student', new mongoose.Schema({
  name: String,
  usn: String,
  sem: Number,
  paid: Boolean
}));

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
    // Convert string 'true'/'false' to Boolean
    req.body.paid = req.body.paid === 'true';
    const s = await Student.create(req.body);
    console.log("✅ Added:", s);
    res.send("✅ Student added!");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Failed to add student.");
  }
});

// Delete unpaid students
app.get('/delete-unpaid', async (req, res) => {
  try {
    const result = await Student.deleteMany({ paid: false });
    console.log(`🗑️ Deleted ${result.deletedCount} unpaid students`);
    res.send(`🗑️ ${result.deletedCount} unpaid student(s) deleted.`);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Failed to delete unpaid.");
  }
});

// View all students
app.get('/all', async (req, res) => {
  try {
    const data = await Student.find();
    let html = `<h2>All Students</h2><ul>`;
    data.forEach(s => {
      html += `<li>${s.name} (${s.usn}) - Sem: ${s.sem}, Paid: ${s.paid}</li>`;
    });
    html += `</ul><a href="/">⬅ Back</a>`;
    res.send(html);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Failed to fetch data.");
  }
});

app.listen(3001, () => console.log("🚀 Running at http://localhost:3001"));
