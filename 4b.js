const express = require('express');
const app = express();

// Home Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Home</title></head>
    <body>
      <h1>Welcome to Online Training Portal</h1>
      <nav>
        <a href="/">Home</a> |
        <a href="/register">Register</a> |
        <a href="/announce">Announcements</a> |
        <a href="/contact">Contact</a>
      </nav>
      <p>This platform offers high-quality training on web technologies, programming, and software tools. Enroll now!</p>
    </body>
    </html>
  `);
});

// Register Page
app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Register</title></head>
    <body>
      <h1>Registration Page</h1>
      <nav>
        <a href="/">Home</a> |
        <a href="/register">Register</a> |
        <a href="/announce">Announcements</a> |
        <a href="/contact">Contact</a>
      </nav>
      <form method="post" action="#">
        <label>Name: <input type="text" required></label><br><br>
        <label>Email: <input type="email" required></label><br><br>
        <label>Course: 
          <select>
            <option>Web Development</option>
            <option>Python Programming</option>
            <option>DevOps</option>
          </select>
        </label><br><br>
        <button type="submit">Submit</button>
      </form>
    </body>
    </html>
  `);
});

// Announcements Page
app.get('/announce', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Announcements</title></head>
    <body>
      <h1>Latest Announcements</h1>
      <nav>
        <a href="/">Home</a> |
        <a href="/register">Register</a> |
        <a href="/announce">Announcements</a> |
        <a href="/contact">Contact</a>
      </nav>
      <ul>
        <li>New batch for Web Development starts from 10th June</li>
        <li>Python Programming exam scheduled for 15th June</li>
        <li>DevOps workshop on 18th June at 11 AM</li>
      </ul>
    </body>
    </html>
  `);
});

// Contact Page
app.get('/contact', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Contact</title></head>
    <body>
      <h1>Contact Us</h1>
      <nav>
        <a href="/">Home</a> |
        <a href="/register">Register</a> |
        <a href="/announce">Announcements</a> |
        <a href="/contact">Contact</a>
      </nav>
      <p>Email: support@onlinetraining.com</p>
      <p>Phone: +91-9876543210</p>
      <p>Address: #101, EduTech Park, Bangalore, India</p>
    </body>
    </html>
  `);
});

// Start server
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
