const express = require('express'), mongoose = require('mongoose'), bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/StudentsDB');

const Student = mongoose.model('Student', {Name:String, Branch:String, Semester:Number});
app.get('/', (req,res) => res.send(`
<form method="post">
<input name="Name" placeholder="Name"/>
<input name="Branch" placeholder="Branch"/>
<input name="Semester" placeholder="Semester" type="number"/>
<button>Submit</button></form>
<a href="/list">Show CSE 6th Semester Students</a>
`));

app.post('/', (req,res) => {
  new Student({Name:req.body.Name, Branch:req.body.Branch, Semester: +req.body.Semester}).save().then(() => res.redirect('/'));
});

app.get('/list', async (req,res) => {
  const students = await Student.find({Branch:'CSE', Semester:6});
  res.send(students.map(s => `${s.Name} - ${s.Branch} - ${s.Semester}<br>`).join('') + '<br><a href="/">Back</a>');
});

app.listen(3002, () => console.log('✅ Server running at http://localhost:3002'));
