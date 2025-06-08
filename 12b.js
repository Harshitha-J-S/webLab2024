const express = require('express'), mongoose = require('mongoose'), bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://127.0.0.1:27017/ExamDB');
const Student = mongoose.model('Student', {Name:String, USN:String, Marks:Number});

app.get('/', (req,res) => res.send(`
<form method="post">
<input name="Name" placeholder="Name"/>
<input name="USN" placeholder="USN"/>
<input name="Marks" placeholder="Marks" type="number"/>
<button>Submit</button></form>
<a href="/noteligible">Show Not Eligible Students (Marks<20)</a>
`));

app.post('/', (req,res) => {
  new Student({Name:req.body.Name, USN:req.body.USN, Marks:+req.body.Marks}).save().then(() => res.redirect('/'));
});

app.get('/noteligible', async (req,res) => {
  const ne = await Student.find({Marks: {$lt: 20}});
  res.send(ne.map(s => `${s.Name} (${s.USN}) - Marks: ${s.Marks}<br>`).join('') + '<br><a href="/">Back</a>');
});

app.listen(3002, () => console.log('✅ Server running at http://localhost:3002'));
