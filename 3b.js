const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb://localhost:27017';
const dbName = 'hr';
let employeeCollection;

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log('✅ MongoDB connected');
    const db = client.db(dbName);
    employeeCollection = db.collection('employees');
  })
  .catch(err => console.error('❌ MongoDB error:', err));

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
    const employee = {
      emp_name: req.body.emp_name,
      email: req.body.email,
      phone: req.body.phone,
      hire_date: req.body.hire_date,
      job_title: req.body.job_title,
      salary: parseInt(req.body.salary)
    };
    const result = await employeeCollection.insertOne(employee);
    console.log('✅ Added employee with ID:', result.insertedId);
    res.send('✅ Employee added! <a href="/">Back</a>');
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('❌ Error adding employee.');
  }
});

// Log high-salary employees to terminal only
app.get('/highsalary', async (req, res) => {
  try {
    const emps = await employeeCollection.find({ salary: { $gt: 50000 } }).toArray();
    console.log('\n💰 Employees with Salary > ₹50,000');
    emps.forEach(e => {
      console.log(`${e.emp_name} | ₹${e.salary} | ${e.job_title}`);
    });
    res.send("✅ High salary employees printed to terminal.<br/><a href='/'>⬅ Back</a>");
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('❌ Error fetching employees.');
  }
});

app.listen(3002, () => console.log('🚀 HR app running at http://localhost:3002'));
