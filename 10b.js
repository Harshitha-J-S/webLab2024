const express = require('express'), mongoose = require('mongoose'), bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://127.0.0.1:27017/FacultyDB');
const Faculty = mongoose.model('Faculty', {ID:String, Title:String, Name:String, branch:String});

app.get('/', (req,res) => res.send(`
<form method="post">
<input name="ID" placeholder="ID"/>
<input name="Title" placeholder="Title"/>
<input name="Name" placeholder="Name"/>
<input name="branch" placeholder="Branch"/>
<button>Submit</button></form>
<a href="/cseprofessors">Show CSE Professors</a>
`));

app.post('/', (req,res) => {
  new Faculty(req.body).save().then(() => res.redirect('/'));
});

app.get('/cseprofessors', async (req,res) => {
  const profs = await Faculty.find({branch:'CSE', Title:'PROFESSOR'});
  res.send(profs.map(f => `${f.ID} - ${f.Name} - ${f.Title} - ${f.branch}<br>`).join('') + '<br><a href="/">Back</a>');
});

app.listen(3004, () => console.log('✅ Server running at http://localhost:3004'));
