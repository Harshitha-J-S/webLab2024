const express = require('express'), mongoose = require('mongoose'), bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/FinalYears');

const Student = mongoose.model('Student', {USN:String, Name:String, Company_name:String});

app.get('/', (req,res) => res.send(`
<form method="post"><input name="USN" placeholder="USN"/><input name="Name" placeholder="Name"/>
<select name="Company_name">
  <option>Infosys</option><option>Google</option><option>Microsoft</option>
</select><button>Submit</button></form>
<br><a href="/infosys">Show Infosys Selected</a>`));

app.post('/', (req,res) => {
  new Student(req.body).save().then(() => res.redirect('/'));
});

app.get('/infosys', async (req,res) => {
  const infosysStudents = await Student.find({Company_name:'Infosys'});
  res.send(infosysStudents.map(s => `${s.USN} - ${s.Name} <br>`).join('') + '<br><a href="/">Back</a>');
});

app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));
