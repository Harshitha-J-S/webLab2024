const express = require('express'), mongoose = require('mongoose'), bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://127.0.0.1:27017/AttendanceDB');
const Student = mongoose.model('Student', {Name:String, USN:String, Attendance:Number});

app.get('/', (req,res) => res.send(`
<form method="post">
<input name="Name" placeholder="Name"/>
<input name="USN" placeholder="USN"/>
<input name="Attendance" placeholder="Attendance %" type="number" step="0.01"/>
<button>Submit</button></form>
<a href="/lowattendance">Show Attendance < 75%</a>
`));

app.post('/', (req,res) => {
  new Student({Name:req.body.Name, USN:req.body.USN, Attendance:+req.body.Attendance}).save().then(() => res.redirect('/'));
});

app.get('/lowattendance', async (req,res) => {
  const low = await Student.find({Attendance: {$lt: 75}});
  res.send(low.map(s => `${s.Name} (${s.USN}) - ${s.Attendance}%<br>`).join('') + '<br><a href="/">Back</a>');
});

app.listen(3005, () => console.log('✅ Server running at http://localhost:3005'));
