const express = require('express'), mongoose = require('mongoose');
const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/exam');

const Student = mongoose.model('Student', { name: String, usn: String, grade: String });

app.get('/', (r, s) => s.send(`
  <form method="POST">
    <input name="name" placeholder="Name"/>
    <input name="usn" placeholder="USN"/>
    <input name="grade" placeholder="Grade"/>
    <button>Submit</button>
  </form>
`));

app.post('/', async (r, s) => {
  const { name, usn, grade } = r.body;
   await new Student({ name, usn, grade }).save();
  s.redirect('/sgrade');
});

app.get('/sgrade', async (r, s) => {
  const data = await Student.find({ grade: 'S' });
  let html = `<h2>Students with 'S' Grade</h2><ul>`;
  data.forEach(d => html += `<li>${d.name} | ${d.usn} | ${d.grade}</li>`);
  html += '</ul><a href="/">Back</a>';
  s.send(html);
});

app.listen(3003, () => console.log('Server running on http://localhost:3003'));
