const express = require('express');
const app = express();

app.get('/', (req, res) => res.send(`
  <h1>🏠 Welcome to Online Training Portal</h1>
  <p>Explore quality learning resources and register for upcoming training sessions.</p>
  <nav>
    <a href="/register">Register</a> |
    <a href="/announcements">Announcements</a> |
    <a href="/contact">Contact</a>
  </nav>
`));

app.get('/register', (req, res) => res.send(`
  <h1>📝 Registration Page</h1>
  <p>Fill in your details to register for upcoming training programs.</p>
  <form>
    <input placeholder="Name" required /><br>
    <input placeholder="Email" type="email" required /><br>
    <button>Submit</button>
  </form>
  <br><a href="/">⬅ Back to Home</a>
`));

app.get('/announcements', (req, res) => res.send(`
  <h1>📢 Announcements</h1>
  <ul>
    <li>Next session on Web Technologies starts June 15.</li>
    <li>Registrations for Python Bootcamp open till June 10.</li>
    <li>Certificates will be mailed after final assessments.</li>
  </ul>
  <br><a href="/">⬅ Back to Home</a>
`));

app.get('/contact', (req, res) => res.send(`
  <h1>📬 Contact Us</h1>
  <p>Have questions? Reach out:</p>
  <ul>
    <li>Email: training@onlinetraining.com</li>
    <li>Phone: +91-9876543210</li>
    <li>Location: Bangalore, India</li>
  </ul>
  <br><a href="/">⬅ Back to Home</a>
`));

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
