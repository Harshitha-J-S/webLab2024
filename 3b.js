const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hr', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Mongoose Schema & Model
const Employee = mongoose.model('Employee', new mongoose.Schema({
  emp_name: String,
  email: String,
  phone: String,
  hire_date: String,
  job_title: String,
  salary: Number,
}));

// Serve HTML Form
app.get('/', (req, res) => {
  res.send(`
    <h2>Add New Employee</h2>
    <form method="POST" action="/add">
      <input name="emp_name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone" required />
      <input name="hire_date" placeholder="Hire Date" required />
      <input name="job_title" placeholder="Job Title" required />
      <input name="salary" placeholder="Salary" type="number" required />
      <button type="submit">Add Employee</button>
    </form>
    <br/>
    <a href="/highsalary">View High Salary Employees (₹ > 50K)</a>
  `);
});

// Add Employee
app.post('/add', async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    console.log('✅ Added employee:', emp);
    res.send('✅ Employee added! <a href="/">Back</a>');
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('❌ Error adding employee.');
  }
});

// Display high-salary employees
app.get('/highsalary', async (req, res) => {
  try {
    const emps = await Employee.find({ salary: { $gt: 50000 } });
    let html = `<h2>💰 Employees with Salary > ₹50,000</h2><ul>`;
    emps.forEach(e => {
      html += `<li>${e.emp_name} | ₹${e.salary} | ${e.job_title}</li>`;
    });
    html += `</ul><a href="/">⬅ Back</a>`;
    res.send(html);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('❌ Error fetching employees.');
  }
});

app.listen(3002, () => console.log('🚀 HR app running at http://localhost:3002'));
