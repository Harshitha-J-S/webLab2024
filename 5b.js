const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/students');
const Student = mongoose.model('Student', {
  name: String,
  usn: String,
  dept: String,
  grade: String
});

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
    </body>
    </html>
  `);
});

// Add student to DB
app.post('/', async (req, res) => {
  await new Student(req.body).save();
  res.redirect('/all');
});

// View All Students
app.get('/all', async (req, res) => {
  const data = await Student.find();
  let html = `
    <!DOCTYPE html>
    <html>
    <head><title>All Students</title></head>
    <body>
      <h2>All Students</h2><ul>
  `;
  data.forEach(stu => {
    html += `<li>${stu.name} | ${stu.usn} | ${stu.dept} | ${stu.grade}</li>`;
  });
  html += `
      </ul>
      <a href="/">Add</a> | <a href="/update">Update</a>
    </body>
    </html>
  `;
  res.send(html);
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

// Update grade in DB
app.post('/update', async (req, res) => {
  await Student.updateOne({ name: req.body.name }, { grade: req.body.grade });
  res.redirect('/all');
});

// Start Server
app.listen(3001, () => console.log('✅ Server running at http://localhost:3001'));
